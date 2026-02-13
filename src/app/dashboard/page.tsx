'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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

export default function DashboardPage() {
  const { user, isAuthenticated, logout, savedReports, deleteReport } = useAuth();
  const router = useRouter();
  const [printingReportId, setPrintingReportId] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const handlePrintReport = (reportId: string) => {
    setPrintingReportId(reportId);
    setTimeout(() => {
      window.print();
      setPrintingReportId(null);
    }, 100);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'checklist': return '📋';
      case 'cost': return '💰';
      case 'timeline': return '📅';
      case 'intake': return '🚀';
      default: return '📄';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const printReport = savedReports.find(r => r.id === printingReportId);

  return (
    <div className="space-y-8">
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
            <p className="mt-2">Generated by AU PR Pathway Tool | {new Date().toLocaleDateString('en-AU')}</p>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="no-print space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
              <p className="text-blue-100">
                Signed in via {user.authProvider === 'apple' ? 'Apple ID' : user.authProvider === 'google' ? 'Google' : user.authProvider === 'phone' ? `Phone (${user.phone})` : user.email}
              </p>
            </div>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="bg-blue-900/50 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
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
                <div className="text-4xl mb-3">📁</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved reports yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Use the Document Checklist or Cost Calculator tools to generate and save reports.
                  You can then print them as PDF-style documents with your name.
                </p>
                <div className="flex justify-center gap-3">
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
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getReportIcon(report.type)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-500">
                          {VISA_PATHWAY_LABELS[report.pathway] || report.pathway} &middot; {formatDate(report.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintReport(report.id)}
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        title="Print as PDF"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print PDF
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Dashboard Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-gray-900 mb-2">Save Reports</h3>
            <p className="text-sm text-gray-600">
              Generate document checklists and cost estimates from the tools, then save them to your dashboard.
              Each report is stored locally on your device.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-2">Print as PDF</h3>
            <p className="text-sm text-gray-600">
              Print any saved report as a professional PDF-style document with your name.
              Use your browser&apos;s &quot;Save as PDF&quot; option in the print dialog.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">
              Keep track of your visa application progress across checklists, timelines,
              and cost estimates all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
