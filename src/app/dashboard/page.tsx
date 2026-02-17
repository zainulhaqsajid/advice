'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClientCase {
  id: string;
  user_id: string;
  case_number: string;
  visa_subclass: string;
  visa_name: string;
  status: string;
  priority: string;
  assigned_agent: string | null;
  agent_email: string | null;
  lodgement_date: string | null;
  decision_date: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface ClientDocument {
  id: string;
  user_id: string;
  case_id: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  category: string;
  description: string | null;
  uploaded_by: string;
  status: string;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageType {
  id: string;
  case_id: string | null;
  user_id: string;
  sender_type: string;
  subject: string | null;
  content: string;
  attachments: unknown[];
  is_read: boolean;
  created_at: string;
}

interface CaseStatusHistoryItem {
  id: string;
  case_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VISA_PATHWAY_LABELS: Record<string, string> = {
  sc189: 'Skilled Independent (SC 189)',
  sc190: 'Skilled Nominated (SC 190)',
  sc491: 'Skilled Regional (SC 491)',
  sc820801: 'Partner Visa Onshore (SC 820/801)',
  sc309100: 'Partner Visa Offshore (SC 309/100)',
  sc103804: 'Parent Visa (SC 103/804)',
  sc143864: 'Contributory Parent (SC 143/864)',
  sc500: 'Student Visa (SC 500)',
  sc186482: 'Employer Sponsored (SC 186/482)',
  sc485: 'Temporary Graduate (SC 485)',
};

const quickActions = [
  { label: 'Document Checklist', href: '/document-checklist', icon: '📋', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
  { label: 'Cost Calculator', href: '/cost-calculator', icon: '💰', color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
  { label: 'Timeline', href: '/timeline', icon: '📅', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { label: 'Life Events', href: '/life-events', icon: '🔄', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
  { label: 'English Test', href: '/english-test', icon: '🗣️', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
  { label: 'Get Started', href: '/intake', icon: '🚀', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
];

const DOCUMENT_CATEGORIES = [
  { value: 'identity', label: 'Identity' },
  { value: 'financial', label: 'Financial' },
  { value: 'employment', label: 'Employment' },
  { value: 'education', label: 'Education' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'health', label: 'Health' },
  { value: 'character', label: 'Character' },
  { value: 'english_test', label: 'English Test' },
  { value: 'skills_assessment', label: 'Skills Assessment' },
  { value: 'other', label: 'Other' },
];

const CASE_STATUS_FLOW = [
  'initial_consultation',
  'documents_collection',
  'skills_assessment',
  'application_preparation',
  'application_lodged',
  'additional_info_requested',
  'health_checks',
  'character_checks',
  'decision_pending',
  'approved',
  'refused',
];

const CASE_STATUS_LABELS: Record<string, string> = {
  initial_consultation: 'Initial Consultation',
  documents_collection: 'Documents Collection',
  skills_assessment: 'Skills Assessment',
  application_preparation: 'Application Preparation',
  application_lodged: 'Application Lodged',
  additional_info_requested: 'Additional Info Requested',
  health_checks: 'Health Checks',
  character_checks: 'Character Checks',
  decision_pending: 'Decision Pending',
  approved: 'Approved',
  refused: 'Refused',
  withdrawn: 'Withdrawn',
  on_hold: 'On Hold',
};

const CASE_STATUS_COLORS: Record<string, string> = {
  initial_consultation: 'bg-gray-100 text-gray-700',
  documents_collection: 'bg-blue-100 text-blue-700',
  skills_assessment: 'bg-indigo-100 text-indigo-700',
  application_preparation: 'bg-purple-100 text-purple-700',
  application_lodged: 'bg-cyan-100 text-cyan-700',
  additional_info_requested: 'bg-yellow-100 text-yellow-700',
  health_checks: 'bg-orange-100 text-orange-700',
  character_checks: 'bg-orange-100 text-orange-700',
  decision_pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  refused: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-600',
  on_hold: 'bg-gray-100 text-gray-600',
};

const DOC_STATUS_COLORS: Record<string, string> = {
  uploaded: 'bg-gray-100 text-gray-700',
  reviewed: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  requires_update: 'bg-yellow-100 text-yellow-700',
};

type TabId = 'overview' | 'documents' | 'cases' | 'messages';

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return <div className={`animate-spin rounded-full ${s} border-b-2 border-blue-700`} />;
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab icon SVGs
// ---------------------------------------------------------------------------

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout, savedReports, deleteReport } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Tab state
  const [today, setToday] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Overview state
  const [printingReportId, setPrintingReportId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('identity');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCaseId, setUploadCaseId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Cases state
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [caseHistory, setCaseHistory] = useState<CaseStatusHistoryItem[]>([]);
  const [caseHistoryLoading, setCaseHistoryLoading] = useState(false);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [newCaseVisa, setNewCaseVisa] = useState('');
  const [newCaseVisaName, setNewCaseVisaName] = useState('');
  const [newCaseNotes, setNewCaseNotes] = useState('');
  const [creatingCase, setCreatingCase] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [composeCaseId, setComposeCaseId] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    setDocumentsLoading(true);
    try {
      const { data } = await supabase
        .from('client_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setDocuments(data);
    } catch {
      setToast({ message: 'Failed to load documents.', type: 'error' });
    } finally {
      setDocumentsLoading(false);
    }
  }, [user, supabase]);

  const fetchCases = useCallback(async () => {
    if (!user) return;
    setCasesLoading(true);
    try {
      const { data } = await supabase
        .from('client_cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setCases(data);
    } catch {
      setToast({ message: 'Failed to load cases.', type: 'error' });
    } finally {
      setCasesLoading(false);
    }
  }, [user, supabase]);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setMessagesLoading(true);
    try {
      const { data } = await supabase
        .from('client_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setMessages(data);
    } catch {
      setToast({ message: 'Failed to load messages.', type: 'error' });
    } finally {
      setMessagesLoading(false);
    }
  }, [user, supabase]);

  const fetchCaseHistory = useCallback(async (caseId: string) => {
    setCaseHistoryLoading(true);
    try {
      const { data } = await supabase
        .from('case_status_history')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });
      if (data) setCaseHistory(data);
    } catch {
      setCaseHistory([]);
    } finally {
      setCaseHistoryLoading(false);
    }
  }, [supabase]);

  // Fetch data when tab changes
  useEffect(() => {
    if (!user) return;
    if (activeTab === 'documents') fetchDocuments();
    if (activeTab === 'cases') fetchCases();
    if (activeTab === 'messages') fetchMessages();
  }, [activeTab, user, fetchDocuments, fetchCases, fetchMessages]);

  // Fetch all counts for overview on mount
  useEffect(() => {
    if (!user) return;
    fetchDocuments();
    fetchCases();
    fetchMessages();
  }, [user, fetchDocuments, fetchCases, fetchMessages]);

  // Set today's date on mount (avoid hydration mismatch)
  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-AU'));
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  // -- Overview handlers --

  const handlePrintReport = (reportId: string) => {
    setPrintingReportId(reportId);
    setTimeout(() => {
      window.print();
      setPrintingReportId(null);
    }, 100);
  };

  const handleDeleteReport = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteReport(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // -- Document handlers --

  const handleUploadDocument = async () => {
    if (!uploadFile || !user) return;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const storagePath = `${user.id}/${timestamp}_${uploadFile.name}`;

      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .upload(storagePath, uploadFile);

      if (storageError) {
        setToast({ message: `Upload failed: ${storageError.message}`, type: 'error' });
        return;
      }

      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          user_id: user.id,
          case_id: uploadCaseId || null,
          file_name: uploadFile.name,
          file_type: uploadFile.type,
          file_size: uploadFile.size,
          storage_path: storagePath,
          category: uploadCategory,
          description: uploadDescription || null,
          uploaded_by: user.id,
          status: 'uploaded',
        });

      if (dbError) {
        setToast({ message: `Failed to save document record: ${dbError.message}`, type: 'error' });
        return;
      }

      setToast({ message: 'Document uploaded successfully!', type: 'success' });
      setUploadFile(null);
      setUploadCategory('identity');
      setUploadDescription('');
      setUploadCaseId('');
      setShowUploadForm(false);
      await fetchDocuments();
    } catch {
      setToast({ message: 'An unexpected error occurred during upload.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: ClientDocument) => {
    const { data } = await supabase.storage
      .from('client-documents')
      .download(doc.storage_path);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      setToast({ message: 'Failed to download document.', type: 'error' });
    }
  };

  const handleDeleteDocument = async (doc: ClientDocument) => {
    try {
      await supabase.storage.from('client-documents').remove([doc.storage_path]);
      await supabase.from('client_documents').delete().eq('id', doc.id);
      setToast({ message: 'Document deleted.', type: 'success' });
      await fetchDocuments();
    } catch {
      setToast({ message: 'Failed to delete document.', type: 'error' });
    }
  };

  // -- Case handlers --

  const handleCreateCase = async () => {
    if (!user || !newCaseVisa) return;
    setCreatingCase(true);
    try {
      const { error } = await supabase.from('client_cases').insert({
        user_id: user.id,
        visa_subclass: newCaseVisa,
        visa_name: newCaseVisaName || VISA_PATHWAY_LABELS[newCaseVisa] || newCaseVisa,
        status: 'initial_consultation',
        priority: 'normal',
        notes: newCaseNotes || null,
        metadata: {},
      });
      if (error) {
        setToast({ message: `Failed to create case: ${error.message}`, type: 'error' });
      } else {
        setToast({ message: 'New case request submitted!', type: 'success' });
        setNewCaseVisa('');
        setNewCaseVisaName('');
        setNewCaseNotes('');
        setShowNewCaseForm(false);
        await fetchCases();
      }
    } catch {
      setToast({ message: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setCreatingCase(false);
    }
  };

  const handleExpandCase = async (caseId: string) => {
    if (expandedCaseId === caseId) {
      setExpandedCaseId(null);
      return;
    }
    setExpandedCaseId(caseId);
    await fetchCaseHistory(caseId);
  };

  // -- Message handlers --

  const handleSendMessage = async () => {
    if (!user || !composeContent.trim()) return;
    setSendingMessage(true);
    try {
      const { error } = await supabase.from('client_messages').insert({
        case_id: composeCaseId || null,
        user_id: user.id,
        sender_type: 'client',
        subject: composeSubject || null,
        content: composeContent,
        attachments: [],
        is_read: true,
      });
      if (error) {
        setToast({ message: `Failed to send message: ${error.message}`, type: 'error' });
      } else {
        setToast({ message: 'Message sent!', type: 'success' });
        setComposeCaseId('');
        setComposeSubject('');
        setComposeContent('');
        setShowComposeForm(false);
        await fetchMessages();
      }
    } catch {
      setToast({ message: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleMarkAsRead = async (msg: MessageType) => {
    if (msg.is_read) return;
    await supabase.from('client_messages').update({ is_read: true }).eq('id', msg.id);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'checklist': return '📋';
      case 'cost': return '💰';
      case 'timeline': return '📅';
      case 'intake': return '🚀';
      case 'points': return '🎯';
      default: return '📄';
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;
  const activeCasesCount = cases.filter(c => !['approved', 'refused', 'withdrawn'].includes(c.status)).length;

  const latestAssessmentDate = savedReports.length > 0
    ? savedReports.reduce((latest, r) => (r.date > latest ? r.date : latest), savedReports[0].date)
    : null;

  // ---------------------------------------------------------------------------
  // Auth guard
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const printReport = savedReports.find(r => r.id === printingReportId);

  // ---------------------------------------------------------------------------
  // Tab definitions
  // ---------------------------------------------------------------------------

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: OverviewIcon },
    { id: 'documents', label: 'Documents', icon: DocumentIcon, badge: documents.length || undefined },
    { id: 'cases', label: 'My Cases', icon: CaseIcon, badge: activeCasesCount || undefined },
    { id: 'messages', label: 'Messages', icon: MessageIcon, badge: unreadCount || undefined },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-0">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Print-only section */}
      {printReport && (
        <div className="hidden print:block print-report">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              .print-report, .print-report * { visibility: visible; }
              .print-report { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; }
              nav, footer, .no-print { display: none !important; }
            }
          `}</style>
          <div className="border-b-2 border-blue-900 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-blue-900">AU PR Pathway - Report</h1>
            <p className="text-gray-600 mt-1">Prepared for: <strong>{user.name}</strong></p>
            <p className="text-gray-500 text-sm">Date: {formatDate(printReport.date)}</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{printReport.title}</h2>
          <p className="text-gray-600 mb-4">Pathway: {VISA_PATHWAY_LABELS[printReport.pathway] || printReport.pathway}</p>

          {printReport.type === 'checklist' && Array.isArray(printReport.data.items) && (() => {
            const items = printReport.data.items as Array<{ name: string; checked: boolean }>;
            return (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Document Checklist</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-2 text-sm">Status</th>
                      <th className="text-left py-2 px-2 text-sm">Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-2 px-2 text-sm">{item.checked ? '[x]' : '[ ]'}</td>
                        <td className="py-2 px-2 text-sm">{item.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}

          {printReport.type === 'cost' && Array.isArray(printReport.data.items) && (() => {
            const items = printReport.data.items as Array<{ item: string; amount: number }>;
            const total = printReport.data.total as number | undefined;
            return (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-2 text-sm">Item</th>
                      <th className="text-right py-2 px-2 text-sm">Amount (AUD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-2 px-2 text-sm">{item.item}</td>
                        <td className="py-2 px-2 text-sm text-right">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {total != null && (
                  <div className="mt-4 pt-2 border-t-2 border-gray-900 flex justify-between font-bold">
                    <span>Total Estimated Cost</span>
                    <span>AUD ${total.toLocaleString()}</span>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
            <p>This report provides general information only and does not constitute migration advice.</p>
            <p>Always consult a MARA-registered migration agent for personalised guidance.</p>
            <p className="mt-2">Generated by AU PR Pathway Tool | {today}</p>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="no-print space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
              <p className="text-blue-100">
                Signed in via {user.authProvider === 'google' ? 'Google' : user.authProvider === 'phone' ? `Phone (${user.phone})` : user.email}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Your data is synced securely to the cloud
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-900/50 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-0 min-w-max" aria-label="Dashboard tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.badge != null && tab.badge > 0 && (
                    <span className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================================================================= */}
        {/* OVERVIEW TAB                                                       */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 font-medium">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeCasesCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                <p className="text-sm text-gray-500 font-medium">Documents Uploaded</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{documents.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
                <p className="text-sm text-gray-500 font-medium">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{unreadCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
                <p className="text-sm text-gray-500 font-medium">Latest Assessment</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {latestAssessmentDate ? formatDateShort(latestAssessmentDate) : 'None yet'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${action.color} transition-all shadow-sm hover:shadow-md`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm font-semibold text-gray-800 text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Saved Reports */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Saved Reports</h2>
                  <p className="text-blue-200 text-sm mt-1">Your saved checklists, cost reports, and assessments</p>
                </div>
                <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {savedReports.length}
                </span>
              </div>
              <div className="p-6">
                {savedReports.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved reports yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Use the Document Checklist or Cost Calculator tools to generate and save reports.
                      Reports are now saved to the cloud and sync across your devices.
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <Link
                        href="/document-checklist"
                        className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Go to Document Checklist
                      </Link>
                      <Link
                        href="/cost-calculator"
                        className="bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                      >
                        Go to Cost Calculator
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-2xl flex-shrink-0">{getReportIcon(report.type)}</span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{report.title}</h4>
                            <p className="text-sm text-gray-500 truncate">
                              {VISA_PATHWAY_LABELS[report.pathway] || report.pathway} &middot; {formatDate(report.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <button
                            onClick={() => handlePrintReport(report.id)}
                            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            title="Print as PDF"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span className="hidden sm:inline">Print PDF</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            disabled={deletingId === report.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete report"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DOCUMENTS TAB                                                      */}
        {/* ================================================================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Header + Upload button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-bold text-gray-900">My Documents</h2>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Document
              </button>
            </div>

            {/* Upload form */}
            {showUploadForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Document</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {DOCUMENT_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <input
                      type="text"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Brief description of the document"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Linked Case (optional)</label>
                    <select
                      value={uploadCaseId}
                      onChange={(e) => setUploadCaseId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No linked case</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>{c.case_number} - {c.visa_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={handleUploadDocument}
                    disabled={!uploadFile || uploading}
                    className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading && <Spinner size="sm" />}
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={() => { setShowUploadForm(false); setUploadFile(null); }}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Documents list */}
            {documentsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No documents uploaded yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  Upload your identity, financial, employment, and other supporting documents to keep them organized and accessible.
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Upload Your First Document
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Desktop table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">File Name</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Size</div>
                  <div className="col-span-2">Uploaded</div>
                  <div className="col-span-1">Actions</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {documents.map(doc => (
                    <div key={doc.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Desktop layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 flex items-center gap-3 min-w-0">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                            {doc.description && <p className="text-xs text-gray-500 truncate">{doc.description}</p>}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                            {doc.category.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${DOC_STATUS_COLORS[doc.status] || 'bg-gray-100 text-gray-700'}`}>
                            {doc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="col-span-1 text-sm text-gray-500">{formatFileSize(doc.file_size)}</div>
                        <div className="col-span-2 text-sm text-gray-500">{formatDateShort(doc.created_at)}</div>
                        <div className="col-span-1 flex items-center gap-1">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {/* Mobile layout */}
                      <div className="md:hidden space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => handleDownload(doc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteDocument(doc)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                            {doc.category.replace(/_/g, ' ')}
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${DOC_STATUS_COLORS[doc.status] || 'bg-gray-100 text-gray-700'}`}>
                            {doc.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</span>
                          <span className="text-xs text-gray-500">{formatDateShort(doc.created_at)}</span>
                        </div>
                        {doc.description && <p className="text-xs text-gray-500">{doc.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* CASES TAB                                                          */}
        {/* ================================================================= */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            {/* Header + New Case button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-bold text-gray-900">My Cases</h2>
              <button
                onClick={() => setShowNewCaseForm(!showNewCaseForm)}
                className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Case Request
              </button>
            </div>

            {/* New case form */}
            {showNewCaseForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Case Request</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visa Subclass *</label>
                    <select
                      value={newCaseVisa}
                      onChange={(e) => {
                        setNewCaseVisa(e.target.value);
                        setNewCaseVisaName(VISA_PATHWAY_LABELS[e.target.value] || '');
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a visa pathway</option>
                      {Object.entries(VISA_PATHWAY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visa Name</label>
                    <input
                      type="text"
                      value={newCaseVisaName}
                      onChange={(e) => setNewCaseVisaName(e.target.value)}
                      placeholder="Auto-filled from selection"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea
                      value={newCaseNotes}
                      onChange={(e) => setNewCaseNotes(e.target.value)}
                      rows={3}
                      placeholder="Any additional details about your case..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={handleCreateCase}
                    disabled={!newCaseVisa || creatingCase}
                    className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creatingCase && <Spinner size="sm" />}
                    {creatingCase ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    onClick={() => setShowNewCaseForm(false)}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Cases list */}
            {casesLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : cases.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No cases yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  Submit a new case request to start tracking your visa application progress with your migration agent.
                </p>
                <button
                  onClick={() => setShowNewCaseForm(true)}
                  className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Submit Your First Case Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map(c => {
                  const isExpanded = expandedCaseId === c.id;
                  const currentStatusIndex = CASE_STATUS_FLOW.indexOf(c.status);
                  const caseDocuments = documents.filter(d => d.case_id === c.id);

                  return (
                    <div key={c.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                      {/* Case summary row */}
                      <button
                        onClick={() => handleExpandCase(c.id)}
                        className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-bold text-gray-900">{c.case_number || 'Pending'}</h3>
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${CASE_STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-700'}`}>
                                  {CASE_STATUS_LABELS[c.status] || c.status.replace(/_/g, ' ')}
                                </span>
                                {c.priority && c.priority !== 'normal' && (
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${c.priority === 'high' ? 'bg-red-100 text-red-700' : c.priority === 'urgent' ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {c.priority}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{c.visa_name}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                {c.assigned_agent && <span>Agent: {c.assigned_agent}</span>}
                                {c.lodgement_date && <span>Lodged: {formatDateShort(c.lodgement_date)}</span>}
                                <span>Created: {formatDateShort(c.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <svg className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded case detail */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 px-6 py-5 space-y-6">
                          {/* Status progress bar */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Application Progress</h4>
                            <div className="relative">
                              {/* Background line */}
                              <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200" />
                              {/* Progress line */}
                              {currentStatusIndex >= 0 && (
                                <div
                                  className="absolute top-3 left-3 h-0.5 bg-blue-600 transition-all"
                                  style={{
                                    width: `${Math.min(100, (currentStatusIndex / (CASE_STATUS_FLOW.length - 1)) * 100)}%`,
                                    maxWidth: 'calc(100% - 24px)',
                                  }}
                                />
                              )}
                              {/* Status dots */}
                              <div className="relative flex justify-between">
                                {CASE_STATUS_FLOW.map((status, idx) => {
                                  const isCurrent = c.status === status;
                                  const isPast = currentStatusIndex >= 0 && idx < currentStatusIndex;
                                  const isTerminal = status === 'approved' || status === 'refused';
                                  return (
                                    <div key={status} className="flex flex-col items-center" style={{ width: `${100 / CASE_STATUS_FLOW.length}%` }}>
                                      <div
                                        className={`
                                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                          ${isCurrent
                                            ? isTerminal && status === 'approved'
                                              ? 'bg-green-600 border-green-600 text-white'
                                              : isTerminal && status === 'refused'
                                                ? 'bg-red-600 border-red-600 text-white'
                                                : 'bg-blue-600 border-blue-600 text-white'
                                            : isPast
                                              ? 'bg-blue-600 border-blue-600 text-white'
                                              : 'bg-white border-gray-300'
                                          }
                                        `}
                                      >
                                        {(isPast || isCurrent) && (
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </div>
                                      <span className={`text-[10px] mt-1.5 text-center leading-tight ${isCurrent ? 'font-bold text-blue-700' : isPast ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {CASE_STATUS_LABELS[status]?.split(' ').slice(0, 2).join(' ') || status}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Status history */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Status History</h4>
                            {caseHistoryLoading ? (
                              <div className="flex justify-center py-4"><Spinner size="sm" /></div>
                            ) : caseHistory.length === 0 ? (
                              <p className="text-sm text-gray-500">No status history recorded yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {caseHistory.map(h => (
                                  <div key={h.id} className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-medium text-gray-900">
                                        {CASE_STATUS_LABELS[h.new_status] || h.new_status.replace(/_/g, ' ')}
                                      </span>
                                      {h.old_status && (
                                        <span className="text-gray-500"> (from {CASE_STATUS_LABELS[h.old_status] || h.old_status.replace(/_/g, ' ')})</span>
                                      )}
                                      <span className="text-gray-400 ml-2">{formatDate(h.created_at)}</span>
                                      {h.notes && <p className="text-gray-600 mt-0.5">{h.notes}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Linked documents */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Linked Documents ({caseDocuments.length})</h4>
                            {caseDocuments.length === 0 ? (
                              <p className="text-sm text-gray-500">No documents linked to this case.</p>
                            ) : (
                              <div className="space-y-2">
                                {caseDocuments.map(doc => (
                                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-sm text-gray-900 truncate">{doc.file_name}</span>
                                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${DOC_STATUS_COLORS[doc.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {doc.status.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDownload(doc)}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex-shrink-0"
                                    >
                                      Download
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Case notes */}
                          {c.notes && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{c.notes}</p>
                            </div>
                          )}

                          {/* Decision date */}
                          {c.decision_date && (
                            <div className="text-sm">
                              <span className="font-semibold text-gray-700">Decision Date:</span>
                              <span className="ml-2 text-gray-600">{formatDateShort(c.decision_date)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* MESSAGES TAB                                                       */}
        {/* ================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Header + Compose button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <button
                onClick={() => setShowComposeForm(!showComposeForm)}
                className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                New Message
              </button>
            </div>

            {/* Compose form */}
            {showComposeForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related Case (optional)</label>
                      <select
                        value={composeCaseId}
                        onChange={(e) => setComposeCaseId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">General inquiry</option>
                        {cases.map(c => (
                          <option key={c.id} value={c.id}>{c.case_number || 'Pending'} - {c.visa_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder="Message subject"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      value={composeContent}
                      onChange={(e) => setComposeContent(e.target.value)}
                      rows={4}
                      placeholder="Type your message here..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={handleSendMessage}
                    disabled={!composeContent.trim() || sendingMessage}
                    className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sendingMessage && <Spinner size="sm" />}
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                  <button
                    onClick={() => { setShowComposeForm(false); setComposeContent(''); setComposeSubject(''); setComposeCaseId(''); }}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Messages list */}
            {messagesLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  Start a conversation with your migration agent. Messages are organized by case for easy reference.
                </p>
                <button
                  onClick={() => setShowComposeForm(true)}
                  className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Send Your First Message
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Group messages by case */}
                {(() => {
                  const grouped: Record<string, MessageType[]> = {};
                  messages.forEach(msg => {
                    const key = msg.case_id || 'general';
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(msg);
                  });

                  return Object.entries(grouped).map(([caseIdKey, caseMessages]) => {
                    const linkedCase = cases.find(c => c.id === caseIdKey);
                    const groupLabel = linkedCase
                      ? `${linkedCase.case_number || 'Pending'} - ${linkedCase.visa_name}`
                      : 'General';

                    // Sort ascending for chat-like display
                    const sorted = [...caseMessages].sort(
                      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    );

                    return (
                      <div key={caseIdKey} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700">{groupLabel}</h3>
                        </div>
                        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                          {sorted.map(msg => {
                            const isClient = msg.sender_type === 'client';
                            const isSystem = msg.sender_type === 'system';

                            return (
                              <div
                                key={msg.id}
                                onClick={() => handleMarkAsRead(msg)}
                                className={`
                                  flex
                                  ${isClient ? 'justify-end' : isSystem ? 'justify-center' : 'justify-start'}
                                `}
                              >
                                <div
                                  className={`
                                    max-w-[80%] rounded-xl px-4 py-3 relative
                                    ${isClient
                                      ? 'bg-blue-600 text-white'
                                      : isSystem
                                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                        : 'bg-gray-100 text-gray-900'
                                    }
                                    ${!msg.is_read && !isClient ? 'ring-2 ring-blue-300' : ''}
                                  `}
                                >
                                  {/* Sender badge */}
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`
                                      text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                                      ${isClient
                                        ? 'bg-blue-500 text-blue-100'
                                        : isSystem
                                          ? 'bg-yellow-200 text-yellow-800'
                                          : 'bg-gray-200 text-gray-600'
                                      }
                                    `}>
                                      {msg.sender_type}
                                    </span>
                                    {!msg.is_read && !isClient && (
                                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  {msg.subject && (
                                    <p className={`text-sm font-semibold mb-1 ${isClient ? 'text-blue-100' : ''}`}>
                                      {msg.subject}
                                    </p>
                                  )}
                                  <p className={`text-sm whitespace-pre-wrap ${isClient ? 'text-white' : ''}`}>
                                    {msg.content}
                                  </p>
                                  <p className={`text-[10px] mt-2 ${isClient ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {formatDate(msg.created_at)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
