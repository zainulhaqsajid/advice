'use client';

import { useState, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParentVisaOption {
  name: string;
  subclass: string;
  type: string;
  location: string;
  processingTime: string;
  cost: string;
}

interface ChildEntry {
  country: string;
  isAuSettled: boolean;
}

interface IntakeFormData {
  parentAge: number | '';
  sponsorStatus: '' | 'citizen' | 'pr' | 'nz';
  sponsorResident2Years: '' | 'yes' | 'no';
  totalChildren: number | '';
  childrenInAustralia: number | '';
  parentInAustralia: '' | 'yes' | 'no';
  budget: '' | 'low' | 'medium' | 'high';
  urgency: '' | 'immediate' | '1-5years' | 'norush';
}

interface Recommendation {
  visaName: string;
  subclass: string;
  estimatedCost: string;
  estimatedTimeline: string;
  reasoning: string[];
  warnings: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const visaOptions: ParentVisaOption[] = [
  {
    name: 'Parent',
    subclass: 'SC 103',
    type: 'Permanent',
    location: 'Offshore',
    processingTime: '20-30+ years',
    cost: 'AUD $4,990',
  },
  {
    name: 'Aged Parent',
    subclass: 'SC 804',
    type: 'Permanent',
    location: 'Onshore (67+ yrs)',
    processingTime: '20-30+ years',
    cost: 'AUD $4,990',
  },
  {
    name: 'Contributory Parent',
    subclass: 'SC 143',
    type: 'Permanent',
    location: 'Offshore',
    processingTime: '5-6 years',
    cost: 'AUD $48,495+',
  },
  {
    name: 'Contributory Parent (Temp)',
    subclass: 'SC 173→143',
    type: 'Temp then Perm',
    location: 'Offshore',
    processingTime: '2-3 yrs temp, then queue',
    cost: 'AUD $32,575 + $19,420',
  },
  {
    name: 'Contributory Aged Parent',
    subclass: 'SC 864',
    type: 'Permanent',
    location: 'Onshore (67+ yrs)',
    processingTime: '5-6 years',
    cost: 'AUD $48,495+',
  },
  {
    name: 'Contributory Aged Parent (Temp)',
    subclass: 'SC 884→864',
    type: 'Temp then Perm',
    location: 'Onshore (67+ yrs)',
    processingTime: '2-3 yrs temp, then queue',
    cost: 'AUD $32,575 + $19,420',
  },
  {
    name: 'Sponsored Parent (Temp)',
    subclass: 'SC 870',
    type: 'Temporary 3-5 yrs',
    location: 'Offshore',
    processingTime: 'Months',
    cost: 'AUD $5,735-$11,470',
  },
];

// ─── Balance of Family Test Calculator ───────────────────────────────────────

function BalanceOfFamilyTest() {
  const [totalChildren, setTotalChildren] = useState<number | ''>('');
  const [children, setChildren] = useState<ChildEntry[]>([]);
  const [result, setResult] = useState<{
    pass: boolean;
    explanation: string;
  } | null>(null);

  const handleTotalChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      setTotalChildren('');
      setChildren([]);
      setResult(null);
      return;
    }
    const clamped = Math.min(num, 20);
    setTotalChildren(clamped);
    setChildren(
      Array.from({ length: clamped }, (_, i) => children[i] ?? { country: '', isAuSettled: false })
    );
    setResult(null);
  };

  const updateChild = (index: number, field: keyof ChildEntry, value: string | boolean) => {
    setChildren((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setResult(null);
  };

  const calculate = () => {
    if (totalChildren === '' || children.length === 0) return;

    const auCount = children.filter((c) => c.isAuSettled).length;
    const total = children.length;

    // Count children per non-AU country
    const countryCounts: Record<string, number> = {};
    children.forEach((c) => {
      if (!c.isAuSettled) {
        const country = c.country.trim().toLowerCase() || 'unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });

    const maxOtherCountry = Object.values(countryCounts).length > 0
      ? Math.max(...Object.values(countryCounts))
      : 0;

    const halfOrMore = auCount >= total / 2;
    const moreInAuThanAnySingleCountry = auCount > maxOtherCountry;
    const pass = halfOrMore || moreInAuThanAnySingleCountry;

    let explanation = `Total children: ${total}. Children settled in Australia: ${auCount}.`;

    if (halfOrMore) {
      explanation += ` At least half (${Math.ceil(total / 2)}) of the children are settled in Australia. The Balance of Family test is PASSED.`;
    } else if (moreInAuThanAnySingleCountry) {
      explanation += ` Although fewer than half reside in Australia, there are more children in Australia (${auCount}) than in any other single country (max ${maxOtherCountry}). The Balance of Family test is PASSED.`;
    } else {
      explanation += ` Fewer than half of the children are settled in Australia, and another single country has ${maxOtherCountry} or more children. The Balance of Family test is FAILED.`;
    }

    setResult({ pass, explanation });
  };

  return (
    <div>
      {/* Total children input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Total number of parent&apos;s children (including stepchildren)
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={totalChildren}
          onChange={(e) => handleTotalChange(e.target.value)}
          placeholder="e.g. 3"
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      {/* Per-child inputs */}
      {children.length > 0 && (
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">
            For each child, provide country of residence and whether they are an AU citizen, PR, or NZ citizen residing in Australia:
          </h4>
          <div className="grid gap-3">
            {children.map((child, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-blue-700 min-w-[80px]">
                  Child {idx + 1}
                </span>
                <input
                  type="text"
                  value={child.country}
                  onChange={(e) => updateChild(idx, 'country', e.target.value)}
                  placeholder="Country of residence"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={child.isAuSettled}
                    onChange={(e) => updateChild(idx, 'isAuSettled', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  AU citizen / PR / NZ citizen in AU
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AU children summary */}
      {children.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-700">
              {children.filter((c) => c.isAuSettled).length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-blue-700">{children.length}</span>{' '}
            children are AU citizens / PR / NZ citizens residing in Australia.
          </p>
        </div>
      )}

      {/* Calculate button */}
      <button
        onClick={calculate}
        disabled={totalChildren === '' || children.length === 0}
        className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Calculate
      </button>

      {/* Result */}
      {result && (
        <div
          className={`mt-6 p-5 rounded-lg border-2 ${
            result.pass
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-red-50 border-red-400 text-red-800'
          }`}
        >
          <p className="text-lg font-bold mb-2">
            {result.pass ? 'PASS' : 'FAIL'}
          </p>
          <p className="text-sm leading-relaxed">{result.explanation}</p>
        </div>
      )}

      {/* Notes */}
      <div className="mt-6 space-y-2">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold">Note:</span> At least half of children must be settled in Australia, OR more children in AU than any other single country.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold">Note:</span> SC 870 visa is EXEMPT from this test.
        </p>
      </div>
    </div>
  );
}

// ─── Recommendation Engine ───────────────────────────────────────────────────

function generateRecommendation(form: IntakeFormData): Recommendation | null {
  const {
    parentAge,
    sponsorStatus,
    sponsorResident2Years,
    totalChildren,
    childrenInAustralia,
    parentInAustralia,
    budget,
    urgency,
  } = form;

  // Require all fields
  if (
    parentAge === '' ||
    sponsorStatus === '' ||
    sponsorResident2Years === '' ||
    totalChildren === '' ||
    childrenInAustralia === '' ||
    parentInAustralia === '' ||
    budget === '' ||
    urgency === ''
  ) {
    return null;
  }

  const isAged = typeof parentAge === 'number' && parentAge >= 67;
  const isOnshore = parentInAustralia === 'yes';
  const reasoning: string[] = [];
  const warnings: string[] = [];

  // Sponsor checks
  if (sponsorStatus === '') {
    warnings.push('Sponsor must be an Australian citizen, permanent resident, or eligible NZ citizen.');
  }
  if (sponsorResident2Years === 'no') {
    warnings.push(
      'The sponsor (child) must have been a settled Australian resident for at least 2 years. This requirement may not currently be met.'
    );
  }

  // Balance of family quick check
  const auCount = typeof childrenInAustralia === 'number' ? childrenInAustralia : 0;
  const total = typeof totalChildren === 'number' ? totalChildren : 1;
  if (auCount < total / 2) {
    warnings.push(
      'The Balance of Family test may not be met. At least half of the children must be settled in Australia (this does not apply to SC 870).'
    );
  }

  // Urgency → SC 870
  if (urgency === 'immediate') {
    reasoning.push('Urgency is immediate, so the Sponsored Parent (Temporary) SC 870 visa is recommended for fast processing.');
    if (isAged) {
      reasoning.push('Parent is 67+ years old. After SC 870, a Contributory Aged Parent visa could be explored for permanent residency.');
    }
    return {
      visaName: 'Sponsored Parent (Temporary)',
      subclass: 'SC 870',
      estimatedCost: 'AUD $5,735 (3 years) or AUD $11,470 (5 years)',
      estimatedTimeline: 'A few months',
      reasoning,
      warnings,
    };
  }

  // High budget → Contributory
  if (budget === 'high' || budget === 'medium') {
    if (isAged && isOnshore) {
      reasoning.push('Parent is aged 67+ and currently onshore in Australia.');
      reasoning.push('Budget supports a contributory visa with faster processing.');
      return {
        visaName: 'Contributory Aged Parent',
        subclass: 'SC 864',
        estimatedCost: 'AUD $48,495+',
        estimatedTimeline: '5-6 years',
        reasoning,
        warnings,
      };
    }
    if (isAged && !isOnshore) {
      reasoning.push('Parent is aged 67+ and currently offshore.');
      reasoning.push('Budget supports a contributory visa with faster processing.');
      return {
        visaName: 'Contributory Parent',
        subclass: 'SC 143',
        estimatedCost: 'AUD $48,495+',
        estimatedTimeline: '5-6 years',
        reasoning,
        warnings,
      };
    }
    if (!isAged && isOnshore) {
      reasoning.push('Parent is under 67 and currently in Australia.');
      reasoning.push('Budget supports a contributory visa. Consider the temporary-then-permanent pathway to split costs.');
      return {
        visaName: 'Contributory Aged Parent (Temp)',
        subclass: 'SC 884→864',
        estimatedCost: 'AUD $32,575 + $19,420',
        estimatedTimeline: '2-3 years (temp), then queue for permanent',
        reasoning: [
          ...reasoning,
          'Note: Parent must turn 67 before the aged parent visa can be granted. If parent is significantly under 67, the standard Contributory Parent SC 143 (offshore) is more appropriate.',
        ],
        warnings,
      };
    }
    // Not aged, offshore, medium/high budget
    reasoning.push('Parent is under 67 and offshore.');
    reasoning.push('Budget supports a contributory visa with faster processing.');
    return {
      visaName: 'Contributory Parent',
      subclass: 'SC 143',
      estimatedCost: 'AUD $48,495+',
      estimatedTimeline: '5-6 years',
      reasoning,
      warnings,
    };
  }

  // Low budget → Non-contributory
  if (budget === 'low') {
    if (isAged && isOnshore) {
      reasoning.push('Parent is aged 67+ and onshore. Low budget favours the non-contributory pathway.');
      reasoning.push('Be aware the queue is extremely long (20-30+ years).');
      return {
        visaName: 'Aged Parent',
        subclass: 'SC 804',
        estimatedCost: 'AUD $4,990',
        estimatedTimeline: '20-30+ years',
        reasoning,
        warnings,
      };
    }
    reasoning.push('Low budget favours the non-contributory Parent visa.');
    reasoning.push('Be aware the queue is extremely long (20-30+ years).');
    return {
      visaName: 'Parent',
      subclass: 'SC 103',
      estimatedCost: 'AUD $4,990',
      estimatedTimeline: '20-30+ years',
      reasoning,
      warnings,
    };
  }

  return null;
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function ParentVisaPage() {
  // Intake form state
  const [form, setForm] = useState<IntakeFormData>({
    parentAge: '',
    sponsorStatus: '',
    sponsorResident2Years: '',
    totalChildren: '',
    childrenInAustralia: '',
    parentInAustralia: '',
    budget: '',
    urgency: '',
  });

  const [showRecommendation, setShowRecommendation] = useState(false);

  const updateField = <K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setShowRecommendation(false);
  };

  const recommendation = useMemo(() => {
    if (!showRecommendation) return null;
    return generateRecommendation(form);
  }, [form, showRecommendation]);

  const isFormComplete =
    form.parentAge !== '' &&
    form.sponsorStatus !== '' &&
    form.sponsorResident2Years !== '' &&
    form.totalChildren !== '' &&
    form.childrenInAustralia !== '' &&
    form.parentInAustralia !== '' &&
    form.budget !== '' &&
    form.urgency !== '';

  return (
    <div className="space-y-10">
      {/* ── Section 1: Header ─────────────────────────────────────────── */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Parent Visa Module</h1>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          Australian parent visas are among the most complex and expensive visa categories. With
          processing queues stretching decades for non-contributory pathways and costs exceeding
          $48,000 for contributory visas, choosing the right pathway requires careful consideration
          of your family&apos;s circumstances, budget, and timeline.
        </p>
      </section>

      {/* ── Section 2: Parent Visa Comparison Table ───────────────────── */}
      <section className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Parent Visa Comparison</h2>
          <p className="text-blue-200 text-sm mt-1">
            All 7 parent visa options at a glance
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-800">
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Visa Name</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Subclass</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Type</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Location</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Processing Time</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Cost</th>
              </tr>
            </thead>
            <tbody>
              {visaOptions.map((visa, idx) => (
                <tr
                  key={visa.subclass}
                  className={`border-t border-gray-100 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {visa.name}
                  </td>
                  <td className="px-4 py-3 text-blue-700 font-mono font-semibold whitespace-nowrap">
                    {visa.subclass}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{visa.type}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{visa.location}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {visa.processingTime}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {visa.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 3: Balance of Family Test Calculator ──────────────── */}
      <section className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Balance of Family Test Calculator</h2>
          <p className="text-blue-200 text-sm mt-1">
            Check whether your family meets the Balance of Family requirement
          </p>
        </div>
        <div className="p-6">
          <BalanceOfFamilyTest />
        </div>
      </section>

      {/* ── Section 4: Parent Visa Intake Form ────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Parent Visa Intake Form</h2>
          <p className="text-blue-200 text-sm mt-1">
            Provide your details to receive a personalised visa recommendation
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent's age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Parent&apos;s Age
              </label>
              <input
                type="number"
                min={18}
                max={120}
                value={form.parentAge}
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  updateField('parentAge', isNaN(v as number) ? '' : v);
                }}
                placeholder="e.g. 65"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              />
              {typeof form.parentAge === 'number' && form.parentAge >= 67 && (
                <p className="mt-1 text-xs text-blue-600 font-medium">
                  Eligible for Aged Parent visa subclasses (SC 804, SC 864, SC 884→864)
                </p>
              )}
            </div>

            {/* Sponsor status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sponsor (Child) Status
              </label>
              <select
                value={form.sponsorStatus}
                onChange={(e) =>
                  updateField('sponsorStatus', e.target.value as IntakeFormData['sponsorStatus'])
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              >
                <option value="">Select status...</option>
                <option value="citizen">Australian Citizen</option>
                <option value="pr">Permanent Resident</option>
                <option value="nz">Eligible NZ Citizen</option>
              </select>
            </div>

            {/* Sponsor resident 2+ years */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sponsor Resident in AU for 2+ Years?
              </label>
              <select
                value={form.sponsorResident2Years}
                onChange={(e) =>
                  updateField(
                    'sponsorResident2Years',
                    e.target.value as IntakeFormData['sponsorResident2Years']
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Total children count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Total Children Count
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.totalChildren}
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  updateField('totalChildren', isNaN(v as number) ? '' : v);
                }}
                placeholder="e.g. 3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              />
            </div>

            {/* Children in Australia */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Children in Australia (AU citizens / PR / NZ in AU)
              </label>
              <input
                type="number"
                min={0}
                max={typeof form.totalChildren === 'number' ? form.totalChildren : 20}
                value={form.childrenInAustralia}
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  updateField('childrenInAustralia', isNaN(v as number) ? '' : v);
                }}
                placeholder="e.g. 2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              />
            </div>

            {/* Parent currently in Australia */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Parent Currently in Australia?
              </label>
              <select
                value={form.parentInAustralia}
                onChange={(e) =>
                  updateField(
                    'parentInAustralia',
                    e.target.value as IntakeFormData['parentInAustralia']
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Budget range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Budget Range
              </label>
              <select
                value={form.budget}
                onChange={(e) =>
                  updateField('budget', e.target.value as IntakeFormData['budget'])
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              >
                <option value="">Select budget...</option>
                <option value="low">Low (under $10,000)</option>
                <option value="medium">Medium ($10,000 - $50,000)</option>
                <option value="high">High ($50,000+)</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Urgency
              </label>
              <select
                value={form.urgency}
                onChange={(e) =>
                  updateField('urgency', e.target.value as IntakeFormData['urgency'])
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              >
                <option value="">Select urgency...</option>
                <option value="immediate">Immediate</option>
                <option value="1-5years">1-5 Years</option>
                <option value="norush">No Rush</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              onClick={() => setShowRecommendation(true)}
              disabled={!isFormComplete}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Get Recommendation
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 5: Recommendation Engine Output ───────────────────── */}
      {showRecommendation && recommendation && (
        <section className="bg-white rounded-2xl shadow-lg border-2 border-blue-400 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Your Personalised Recommendation</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-blue-800">
                {recommendation.visaName}{' '}
                <span className="text-blue-500 font-mono">({recommendation.subclass})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  Estimated Cost
                </p>
                <p className="text-lg font-bold text-blue-900">{recommendation.estimatedCost}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  Estimated Timeline
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {recommendation.estimatedTimeline}
                </p>
              </div>
            </div>

            {/* Reasoning */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Why this visa?</h4>
              <ul className="space-y-1">
                {recommendation.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            {recommendation.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Important Warnings</h4>
                <ul className="space-y-1">
                  {recommendation.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                      <span className="mt-0.5 shrink-0">&#9888;</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {showRecommendation && !recommendation && isFormComplete && (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600">
            Unable to generate a recommendation with the provided inputs. Please review your
            entries and try again.
          </p>
        </section>
      )}

      {/* ── Section 6: Assurance of Support (AoS) Information ─────────── */}
      <section className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Assurance of Support (AoS)</h2>
          <p className="text-blue-200 text-sm mt-1">
            Understanding the financial commitment required for parent visas
          </p>
        </div>
        <div className="p-6 space-y-6">
          {/* Legally binding commitment */}
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">Legally Binding Commitment</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              An Assurance of Support (AoS) is a legally binding commitment made by the assurer
              (usually the sponsoring child) to repay the Australian Government for any recoverable
              social security payments made to the visa holder during the AoS period. This means the
              assurer agrees to financially support the parent so that they do not rely on government
              income support.
            </p>
          </div>

          {/* Bank guarantee requirement */}
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              Bank Guarantee Requirement
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              As part of the AoS, the assurer must lodge a bank guarantee with the Commonwealth Bank
              of Australia. This bond is held for the duration of the AoS period and is only returned
              (with interest) if no recoverable payments are made to the visa holder during that
              time. The bond acts as security for the government against potential social security
              costs.
            </p>
          </div>

          {/* AoS period and bond amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-2">AoS Period</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The Assurance of Support period for contributory parent visas is{' '}
                <span className="font-bold text-blue-700">10 years</span> from the date the visa
                is granted. During this entire period, the assurer remains liable for any
                recoverable government payments made to the visa holder.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Estimated Bond Amounts</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The bank guarantee bond amount is typically in the range of{' '}
                <span className="font-bold text-blue-700">$10,000 - $14,000</span> per person.
                The exact amount is determined by Services Australia and may vary based on
                individual circumstances and current rates. This bond is in addition to the visa
                application fees.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold">Disclaimer:</span> AoS requirements, bond amounts,
              and durations are subject to change. Always verify current requirements with the
              Department of Home Affairs or a MARA-registered migration agent before lodging an
              application.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
