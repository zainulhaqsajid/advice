'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchAdminTab, updateAdminRecord, replyToMessage } from './actions';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TabId = 'assessments' | 'bookings' | 'contacts' | 'cases' | 'messages';

interface Assessment {
  id: string;
  user_id: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  situation: string;
  form_data: Record<string, unknown>;
  recommended_visa: string | null;
  points_score: number | null;
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  visa_category: string | null;
  notes: string | null;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  created_at: string;
}

interface ContactInquiry {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  visa_category: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface ClientCase {
  id: string;
  user_id: string;
  case_number: string;
  visa_subclass: string;
  visa_name: string;
  status: string;
  priority: string;
  assigned_agent: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  case_id: string | null;
  user_id: string;
  sender_type: string;
  subject: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'assessments', label: 'Assessments', icon: '📋' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'contacts', label: 'Contact Inquiries', icon: '✉️' },
  { id: 'cases', label: 'Client Cases', icon: '📁' },
  { id: 'messages', label: 'Messages', icon: '💬' },
];

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-purple-100 text-purple-800',
  contacted: 'bg-indigo-100 text-indigo-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  resolved: 'bg-gray-100 text-gray-800',
  initial_consultation: 'bg-blue-100 text-blue-800',
  documents_collection: 'bg-yellow-100 text-yellow-800',
  skills_assessment: 'bg-indigo-100 text-indigo-800',
  application_preparation: 'bg-purple-100 text-purple-800',
  application_lodged: 'bg-cyan-100 text-cyan-800',
  additional_info_requested: 'bg-orange-100 text-orange-800',
  health_checks: 'bg-teal-100 text-teal-800',
  character_checks: 'bg-slate-100 text-slate-800',
  decision_pending: 'bg-amber-100 text-amber-800',
  refused: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-600',
  on_hold: 'bg-gray-100 text-gray-700',
  paid: 'bg-green-100 text-green-800',
  unpaid: 'bg-red-100 text-red-800',
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AdminDashboard() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>('assessments');
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [counts, setCounts] = useState<Record<TabId, number>>({
    assessments: 0, bookings: 0, contacts: 0, cases: 0, messages: 0,
  });

  /* -- Fetch data ---------------------------------------------------------- */

  const [warning, setWarning] = useState<string | null>(null);

  const fetchTab = useCallback(async (tab: TabId) => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const result = await fetchAdminTab(tab);
      if (result.error) {
        setError(result.error);
        return;
      }
      setData(result.data || []);
      if (result.warning) setWarning(result.warning);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    const tabs: TabId[] = ['assessments', 'bookings', 'contacts', 'cases', 'messages'];
    const results = await Promise.all(
      tabs.map(async (tab) => {
        try {
          const result = await fetchAdminTab(tab);
          return (result.data || []).length;
        } catch {
          return 0;
        }
      })
    );
    setCounts({
      assessments: results[0],
      bookings: results[1],
      contacts: results[2],
      cases: results[3],
      messages: results[4],
    });
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    // Check role — only agent/admin can access
    if (user && user.role !== 'agent' && user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchTab(activeTab).then(() => {
      // Delay counts fetch to avoid concurrent request issues during dev compilation
      fetchCounts();
    });
  }, [authLoading, isAuthenticated, user, activeTab, fetchTab, fetchCounts, router]);

  /* -- Status update ------------------------------------------------------- */

  const updateStatus = async (table: string, id: string, field: string, value: string | boolean) => {
    setUpdatingId(id);
    try {
      const result = await updateAdminRecord(table, id, { [field]: value });
      if (result.error) throw new Error(result.error);
      await fetchTab(activeTab);
    } catch {
      alert('Failed to update. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  /* -- Reply to message ---------------------------------------------------- */

  const handleReplyMessage = async (userId: string, caseId: string | null) => {
    if (!replyContent.trim()) return;
    setSendingReply(true);
    try {
      const result = await replyToMessage(userId, caseId, replySubject || null, replyContent);
      if (result.error) throw new Error(result.error);
      setReplyingTo(null);
      setReplyContent('');
      setReplySubject('');
      await fetchTab('messages');
    } catch {
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  /* -- Logout ------------------------------------------------------------- */

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  /* -- Helpers ------------------------------------------------------------- */

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const color = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const situationLabels: Record<string, string> = {
    skilled_worker: 'Skilled Worker',
    employer_sponsored: 'Employer Sponsored',
    student: 'Student',
    partner_spouse: 'Partner / Spouse',
    parent: 'Parent',
    visitor: 'Visitor',
  };

  /* -- Render -------------------------------------------------------------- */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-gray-400 text-sm">Manage leads, bookings, cases &amp; communications</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role === 'admin' ? 'Admin' : 'MARA Agent'}</p>
                </div>
              )}
              <Link
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl shadow-sm border-2 transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-white border-blue-500 shadow-md'
                  : 'bg-white border-transparent hover:border-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{counts[tab.id]}</div>
              <div className="text-xs text-gray-500 font-medium">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <button
            onClick={() => fetchTab(activeTab)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {warning && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            <strong>Warning:</strong> {warning}
          </div>
        )}

        {loading && !data.length ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500">No {activeTab} found yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* ============================================================ */}
            {/*  ASSESSMENTS TAB                                              */}
            {/* ============================================================ */}
            {activeTab === 'assessments' && (data as Assessment[]).map((row) => (
              <div key={row.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                        {(row.full_name || row.email || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {row.full_name || 'Anonymous'}
                          {row.email && <span className="text-gray-400 font-normal ml-2 text-sm">{row.email}</span>}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{situationLabels[row.situation] || row.situation}</span>
                          {row.recommended_visa && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="text-blue-600 font-medium">{row.recommended_visa}</span>
                            </>
                          )}
                          {row.points_score != null && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="font-medium">{row.points_score} pts</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(row.status)}
                      <span className="text-xs text-gray-400">{formatDate(row.created_at)}</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedRow === row.id && (
                  <div className="border-t p-4 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Phone</span>
                        <span className="font-medium">{row.phone || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">User ID</span>
                        <span className="font-mono text-xs">{row.user_id ? row.user_id.slice(0, 8) + '...' : 'Anonymous'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Points Score</span>
                        <span className="font-medium">{row.points_score ?? '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Visa Recommended</span>
                        <span className="font-medium">{row.recommended_visa || '—'}</span>
                      </div>
                    </div>

                    {row.form_data && Object.keys(row.form_data).length > 0 && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                          View form data
                        </summary>
                        <pre className="mt-2 p-3 bg-white rounded-lg border text-xs overflow-x-auto max-h-60">
                          {JSON.stringify(row.form_data, null, 2)}
                        </pre>
                      </details>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-gray-500 mr-2">Update status:</span>
                      {['new', 'in_review', 'contacted', 'completed'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus('assessments', row.id, 'status', s)}
                          disabled={updatingId === row.id || row.status === s}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            row.status === s
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {s.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ============================================================ */}
            {/*  BOOKINGS TAB                                                 */}
            {/* ============================================================ */}
            {activeTab === 'bookings' && (data as Booking[]).map((row) => (
              <div key={row.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                        {(row.full_name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {row.full_name || '—'}
                          <span className="text-gray-400 font-normal ml-2 text-sm">{row.email || '—'}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="capitalize">{(row.consultation_type || '').replace('_', ' ') || '—'}</span>
                          <span className="text-gray-300">|</span>
                          <span>{row.preferred_date || '—'} at {row.preferred_time || '—'}</span>
                          {row.payment_amount && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="font-medium text-green-600">${row.payment_amount}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(row.status)}
                      {getStatusBadge(row.payment_status)}
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedRow === row.id && (
                  <div className="border-t p-4 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Phone</span>
                        <span className="font-medium">{row.phone || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Visa Category</span>
                        <span className="font-medium">{row.visa_category || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Submitted</span>
                        <span className="font-medium">{formatDate(row.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Notes</span>
                        <span className="font-medium">{row.notes || '—'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs text-gray-500 mr-2">Booking status:</span>
                      {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus('bookings', row.id, 'status', s)}
                          disabled={updatingId === row.id || row.status === s}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            row.status === s
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500 mr-2">Payment:</span>
                      {['unpaid', 'paid'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus('bookings', row.id, 'payment_status', s)}
                          disabled={updatingId === row.id || row.payment_status === s}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            row.payment_status === s
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ============================================================ */}
            {/*  CONTACT INQUIRIES TAB                                        */}
            {/* ============================================================ */}
            {activeTab === 'contacts' && (data as ContactInquiry[]).map((row) => (
              <div key={row.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                        {(row.full_name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {row.full_name || '—'}
                          <span className="text-gray-400 font-normal ml-2 text-sm">{row.email || '—'}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="capitalize">{(row.inquiry_type || '').replace(/_/g, ' ') || '—'}</span>
                          {row.visa_category && (
                            <>
                              <span className="text-gray-300 mx-2">|</span>
                              <span>{row.visa_category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(row.status)}
                      <span className="text-xs text-gray-400">{formatDate(row.created_at)}</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedRow === row.id && (
                  <div className="border-t p-4 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Phone</span>
                        <span className="font-medium">{row.phone || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Submitted</span>
                        <span className="font-medium">{formatDate(row.created_at)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Message</span>
                      <p className="text-sm bg-white p-3 rounded-lg border">{row.message}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-gray-500 mr-2">Status:</span>
                      {['new', 'in_review', 'contacted', 'resolved'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus('contact_inquiries', row.id, 'status', s)}
                          disabled={updatingId === row.id || row.status === s}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            row.status === s
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {s.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ============================================================ */}
            {/*  CASES TAB                                                    */}
            {/* ============================================================ */}
            {activeTab === 'cases' && (data as ClientCase[]).map((row) => (
              <div key={row.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-xs font-mono">
                        {row.case_number.slice(-4)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {row.case_number}
                          <span className="text-gray-400 font-normal ml-2 text-sm">{row.visa_name}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>SC {row.visa_subclass}</span>
                          <span className="text-gray-300">|</span>
                          <span>Priority: <span className="capitalize font-medium">{row.priority}</span></span>
                          {row.assigned_agent && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span>Agent: {row.assigned_agent}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(row.status)}
                      <span className="text-xs text-gray-400">{formatDate(row.created_at)}</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedRow === row.id && (
                  <div className="border-t p-4 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">User ID</span>
                        <span className="font-mono text-xs">{row.user_id.slice(0, 12)}...</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Last Updated</span>
                        <span className="font-medium">{formatDate(row.updated_at)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Notes</span>
                        <span className="font-medium">{row.notes || '—'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs text-gray-500 mr-2">Status:</span>
                      {['initial_consultation', 'documents_collection', 'skills_assessment', 'application_preparation', 'application_lodged', 'additional_info_requested', 'health_checks', 'character_checks', 'decision_pending', 'approved', 'refused', 'on_hold'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus('client_cases', row.id, 'status', s)}
                          disabled={updatingId === row.id || row.status === s}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            row.status === s
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {s.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500 mr-2">Priority:</span>
                      {['normal', 'high', 'urgent'].map((p) => (
                        <button
                          key={p}
                          onClick={() => updateStatus('client_cases', row.id, 'priority', p)}
                          disabled={updatingId === row.id || row.priority === p}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                            row.priority === p
                              ? (p === 'urgent' ? 'bg-red-600' : p === 'high' ? 'bg-orange-500' : 'bg-gray-600') + ' text-white border-transparent'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ============================================================ */}
            {/*  MESSAGES TAB                                                 */}
            {/* ============================================================ */}
            {activeTab === 'messages' && (data as Message[]).map((row) => (
              <div key={row.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!row.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        row.sender_type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {row.sender_type === 'client' ? 'C' : 'A'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {row.subject || '(No subject)'}
                          {!row.is_read && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">{row.content}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.sender_type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {row.sender_type}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(row.created_at)}</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedRow === row.id && (
                  <div className="border-t p-4 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">User ID</span>
                        <span className="font-mono text-xs">{row.user_id.slice(0, 12)}...</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Case ID</span>
                        <span className="font-mono text-xs">{row.case_id ? row.case_id.slice(0, 12) + '...' : '—'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Full Message</span>
                      <p className="text-sm bg-white p-3 rounded-lg border whitespace-pre-wrap">{row.content}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => updateStatus('messages', row.id, 'is_read', !row.is_read)}
                        disabled={updatingId === row.id}
                        className="px-3 py-1 text-xs font-medium rounded-full border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        Mark as {row.is_read ? 'unread' : 'read'}
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(replyingTo === row.id ? null : row.id);
                          setReplySubject(row.subject ? `Re: ${row.subject}` : '');
                          setReplyContent('');
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-full border transition-colors bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      >
                        Reply
                      </button>
                    </div>

                    {replyingTo === row.id && (
                      <div className="mt-3 p-3 bg-white rounded-lg border space-y-2">
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          placeholder="Subject (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        />
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Type your reply..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplyMessage(row.user_id, row.case_id)}
                            disabled={sendingReply || !replyContent.trim()}
                            className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {sendingReply ? 'Sending...' : 'Send Reply'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
