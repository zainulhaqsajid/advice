'use client';

import { useState } from 'react';
import { costCategories, calculateCosts } from '@/data/costData';
import { useAuth } from '@/context/AuthContext';

const VISA_OPTIONS = [
  { value: 'skilled_independent', label: 'Skilled Independent (SC 189)' },
  { value: 'skilled_nominated', label: 'Skilled Nominated (SC 190)' },
  { value: 'skilled_regional', label: 'Skilled Regional (SC 491)' },
  { value: 'employer_sponsored', label: 'Employer Sponsored (SC 186/482)' },
  { value: 'partner_onshore', label: 'Partner Visa Onshore (SC 820/801)' },
  { value: 'partner_offshore', label: 'Partner Visa Offshore (SC 309/100)' },
  { value: 'prospective_marriage', label: 'Prospective Marriage (SC 300)' },
  { value: 'parent_contributory', label: 'Contributory Parent (SC 143/864)' },
  { value: 'parent_non_contributory', label: 'Parent Visa (SC 103/804)' },
  { value: 'parent_temporary', label: 'Sponsored Parent Temp (SC 870)' },
  { value: 'student', label: 'Student Visa (SC 500)' },
  { value: 'temporary_graduate', label: 'Temporary Graduate (SC 485)' },
];

export default function CostCalculatorPage() {
  const { isAuthenticated, saveReport } = useAuth();
  const [selectedVisa, setSelectedVisa] = useState('');
  const [partners, setPartners] = useState(0);
  const [children, setChildren] = useState(0);
  const [includeOptional, setIncludeOptional] = useState(false);
  const [saved, setSaved] = useState(false);

  const result = selectedVisa ? calculateCosts(selectedVisa, 1, partners, children, includeOptional) : null;

  const handleSaveReport = () => {
    if (!result || !selectedVisa) return;
    saveReport({
      type: 'cost',
      title: `Cost Estimate - ${VISA_OPTIONS.find(v => v.value === selectedVisa)?.label}`,
      pathway: selectedVisa,
      data: { items: result.items, total: result.total },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Cost Calculator</h1>
        <p className="text-yellow-100 text-lg leading-relaxed max-w-4xl">
          Estimate the total cost of your Australian visa application, including government fees,
          health checks, police clearances, skills assessments, and optional costs like migration
          agent fees and professional year programs.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configure Your Estimate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Visa Pathway</label>
            <select
              value={selectedVisa}
              onChange={(e) => { setSelectedVisa(e.target.value); setSaved(false); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">-- Select visa --</option>
              {VISA_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Partner/Spouse</label>
            <select
              value={partners}
              onChange={(e) => setPartners(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value={0}>No partner</option>
              <option value={1}>1 partner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dependent Children</label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'child' : 'children'}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeOptional}
                onChange={(e) => setIncludeOptional(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-gray-700">Include optional costs</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && selectedVisa && (
        <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-yellow-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Cost Breakdown</h2>
                <p className="text-yellow-100 text-sm mt-1">
                  {VISA_OPTIONS.find(v => v.value === selectedVisa)?.label} &middot;{' '}
                  1 primary + {partners} partner + {children} children
                </p>
              </div>
              <div className="text-right">
                <p className="text-yellow-100 text-xs">Estimated Total</p>
                <p className="text-3xl font-bold text-white">AUD ${result.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-900">Item</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-900">Per Person</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-yellow-900">Amount (AUD)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-900">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {result.items.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.item}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.perPerson ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                        ${item.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-yellow-50 border-t-2 border-yellow-200">
                    <td className="px-6 py-4 text-sm font-bold text-yellow-900" colSpan={2}>
                      Total Estimated Cost
                    </td>
                    <td className="px-6 py-4 text-lg font-bold text-yellow-900 text-right">
                      AUD ${result.total.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Save Button */}
          {isAuthenticated && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveReport}
                disabled={saved}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {saved ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved to Dashboard
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Report to Dashboard
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Fee Reference Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Full Fee Reference</h2>
          <p className="text-gray-300 text-sm mt-1">All known fees by category. Fees are estimates and may change.</p>
        </div>
        <div className="p-6 space-y-6">
          {costCategories.map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                {category.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium">Min Cost</th>
                      <th className="pb-2 font-medium">Max Cost</th>
                      <th className="pb-2 font-medium">Per Person</th>
                      <th className="pb-2 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {category.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 font-medium text-gray-900">{item.name}</td>
                        <td className="py-2 text-gray-600">${item.minCost.toLocaleString()}</td>
                        <td className="py-2 text-gray-600">${item.maxCost.toLocaleString()}</td>
                        <td className="py-2 text-gray-600">{item.perPerson ? 'Yes' : 'No'}</td>
                        <td className="py-2 text-gray-500">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> All costs are estimates based on publicly available data and
            may change. Government fees are typically updated on 1 July each year. Always verify current
            fees on the Department of Home Affairs website before lodging.
          </p>
        </div>
      </div>
    </div>
  );
}
