'use client';

import { useState } from 'react';
import { trToPathways } from '@/data/trPathways';

const visaConditions = [
  {
    code: '8503',
    name: 'No Further Stay',
    description:
      'You cannot apply for any further visa while in Australia (except a Protection visa or a visa where the Minister has waived this condition). You must leave Australia before the visa expires.',
    severity: 'critical' as const,
  },
  {
    code: '8534',
    name: 'No Further Stay (Students)',
    description:
      'You cannot apply for any further visa (other than a SC 485 Temporary Graduate visa in limited circumstances) while in Australia. Generally must leave Australia to apply for a new visa.',
    severity: 'critical' as const,
  },
  {
    code: '8104',
    name: 'Work Restriction',
    description:
      'You must not work, or you must not engage in work that is inconsistent with the purpose of your visa. Breach of this condition may result in visa cancellation.',
    severity: 'warning' as const,
  },
  {
    code: '8105',
    name: 'Student Work Limit',
    description:
      'You must not work more than 48 hours per fortnight when your course is in session. No limit during scheduled course breaks. Breach may result in visa cancellation.',
    severity: 'warning' as const,
  },
  {
    code: '8501',
    name: 'Health Insurance Required',
    description:
      'You must maintain adequate health insurance (OSHC for students, or equivalent) while in Australia. Failure to maintain insurance may affect your visa.',
    severity: 'warning' as const,
  },
  {
    code: '8202',
    name: 'Course Requirement',
    description:
      'You must remain enrolled in a registered course of study. You must maintain satisfactory attendance and course progress as required by your education provider.',
    severity: 'warning' as const,
  },
  {
    code: '8516',
    name: 'Visa Requirements Maintained',
    description:
      'You must continue to meet the requirements for the grant of your visa throughout its validity period. This includes financial capacity, genuine temporary entrant requirement, and other conditions.',
    severity: 'info' as const,
  },
];

const pathwayDetails: Record<
  string,
  { steps: string[]; timeline: string; tips: string[] }
> = {
  '500': {
    steps: [
      'Complete your registered course of study.',
      'Apply for SC 485 Temporary Graduate visa before your SC 500 expires.',
      'During SC 485, gain relevant Australian work experience in your nominated occupation.',
      'Lodge an Expression of Interest (EOI) for SC 189 or SC 190, or seek employer sponsorship (SC 482).',
      'If invited, apply for the permanent visa (SC 189/190) or transition via SC 482 to SC 186.',
    ],
    timeline: '4-7 years total (course + graduate visa + PR processing)',
    tips: [
      'Choose a course linked to an occupation on the Skilled Occupation List.',
      'Maximise your English score (PTE/IELTS) for extra points.',
      'Complete a Professional Year programme if eligible (accounting, IT, engineering).',
      'Gain Australian work experience during and after study for additional points.',
    ],
  },
  '485': {
    steps: [
      'Secure employment in your nominated occupation or a related skilled occupation.',
      'Build at least 1 year of Australian work experience for points.',
      'Achieve the highest possible English score (Superior = 20 points).',
      'Lodge EOI for SC 189 (independent) or SC 190 (state nominated).',
      'Alternatively, find an employer willing to sponsor SC 482, then transition to SC 186 after 2-3 years.',
    ],
    timeline: '2-4 years from SC 485 grant to PR',
    tips: [
      'Cannot apply for another SC 500 student visa onshore since July 2024.',
      'Use your time wisely to gain maximum points.',
      'Consider state nomination (SC 190) for an additional 5 points.',
      'Regional visas (SC 491) offer an additional 15 points with a clear PR pathway.',
    ],
  },
  '482': {
    steps: [
      'Continue working for your sponsoring employer.',
      'After 2-3 years (depending on your stream), employer nominates you for SC 186 TRT stream.',
      'Meet English requirement (Competent English for TRT stream).',
      'Lodge SC 186 application with employer nomination.',
      'Receive permanent residency upon grant.',
    ],
    timeline: '2-3 years from SC 482 grant to PR via TRT stream',
    tips: [
      'Maintain a positive relationship with your employer.',
      'Ensure your employer is aware of the 186 TRT pathway and timeline.',
      'If you lose your job, you have 60 days to find a new sponsor.',
      'Keep all payslips and employment records for your 186 application.',
    ],
  },
  '491': {
    steps: [
      'Live and work in a designated regional area of Australia.',
      'Meet the income threshold ($53,900/year taxable income) for at least 3 years.',
      'After 3 years, apply for SC 191 Permanent Residence (Skilled Regional).',
      'SC 191 has no points test and no nomination requirement.',
    ],
    timeline: '3+ years from SC 491 grant to PR (SC 191)',
    tips: [
      'You must live, work, and study ONLY in designated regional areas.',
      'Track your taxable income carefully across all 3 years.',
      'Lodge your SC 191 application as soon as you are eligible.',
      'Regional areas include all of Australia except Sydney, Melbourne, and Brisbane CBDs.',
    ],
  },
  '820 or 309': {
    steps: [
      'Continue your genuine and ongoing relationship with your sponsor.',
      'After approximately 2 years from lodgement, you become eligible for the permanent stage.',
      'DHA will invite you to provide updated evidence of your relationship.',
      'Submit updated relationship evidence (joint finances, living arrangements, social recognition).',
      'SC 801 (onshore) or SC 100 (offshore) is granted if relationship is ongoing.',
    ],
    timeline: '2+ years from temporary visa application to permanent stage',
    tips: [
      'Keep collecting relationship evidence throughout the waiting period.',
      'Joint bank accounts, joint lease, shared bills are strong evidence.',
      'Statutory declarations from friends and family support your case.',
      'If you separate, seek legal advice immediately about domestic violence provisions.',
    ],
  },
  BVA: {
    steps: [
      'A Bridging Visa A is automatically granted when you lodge a valid visa application onshore.',
      'The BVA activates when your current substantive visa expires.',
      'Your PR pathway depends on the underlying visa application you have lodged.',
      'Wait for a decision on your substantive visa application.',
    ],
    timeline: 'Depends on processing time of your substantive visa application',
    tips: [
      'BVA conditions generally mirror your last substantive visa.',
      'You cannot travel on a BVA. If you need to travel, apply for a BVB first.',
      'If your substantive application is refused, you may get a Bridging Visa E with limited time.',
      'Check your visa conditions in VEVO to understand what you can and cannot do.',
    ],
  },
  BVB: {
    steps: [
      'Apply for BVB before leaving Australia if you hold a BVA.',
      'Travel overseas and return to Australia on the BVB.',
      'Upon return, the BVB replaces your BVA with the same conditions.',
      'Continue waiting for your substantive visa decision.',
    ],
    timeline: 'Same as BVA; depends on underlying application',
    tips: [
      'You must apply for BVB BEFORE leaving Australia.',
      'A BVB has a specified travel period; check the dates carefully.',
      'If your BVB expires while overseas, you cannot return to Australia on it.',
      'Always carry evidence of your BVB grant when travelling.',
    ],
  },
  '600': {
    steps: [
      'Since July 2024, Visitor visa holders cannot apply for most visas onshore.',
      'You must leave Australia to apply for a student visa, skilled visa, or most other visas.',
      'Consider your options carefully before your visitor visa expires.',
      'If eligible, you may apply for a partner visa onshore in limited circumstances.',
    ],
    timeline: 'N/A - no direct PR pathway from visitor visa',
    tips: [
      'Do NOT overstay your visitor visa. This creates a 3-year exclusion period.',
      'Plan your next visa application from offshore.',
      'Some visitor visas have condition 8503 (No Further Stay) which prevents any onshore application.',
      'Seek migration advice before your visa expires to understand your options.',
    ],
  },
  '417/462': {
    steps: [
      'Use your working holiday to gain Australian work experience in a skilled occupation.',
      'Find an employer willing to sponsor you for SC 482.',
      'Transition from SC 482 to SC 186 after 2-3 years with the same employer.',
      'Alternatively, build points for SC 189/190 through experience and qualifications.',
    ],
    timeline: '3-6 years (working holiday + employer sponsorship + TRT stream)',
    tips: [
      'Working holiday experience in a skilled occupation counts for points.',
      'Network actively to find potential sponsors.',
      'Consider regional work for future SC 491 eligibility.',
      'Get your skills assessed during your working holiday if possible.',
    ],
  },
  '188': {
    steps: [
      'Meet the business or investment milestones specified in your SC 188 visa conditions.',
      'After meeting the requirements (usually 3-4 years), apply for SC 888 permanent business visa.',
      'Demonstrate that your business or investment has been successful and meets the thresholds.',
      'Lodge SC 888 application with evidence of compliance.',
    ],
    timeline: '3-4 years from SC 188 grant to SC 888 eligibility',
    tips: [
      'Keep detailed records of all business activities and financial transactions.',
      'Meet the turnover thresholds and employment requirements for your stream.',
      'Some streams have state/territory obligations; check your nomination conditions.',
      'Seek accounting and legal advice to ensure compliance.',
    ],
  },
  '407': {
    steps: [
      'Complete your training programme as specified in your SC 407 visa.',
      'Use the training and experience to qualify for a skilled visa.',
      'Get your skills assessed by the relevant authority for your occupation.',
      'Apply for SC 189/190/491 through the points system or seek employer sponsorship.',
    ],
    timeline: 'Varies significantly based on individual circumstances',
    tips: [
      'SC 407 does not directly lead to PR.',
      'The training experience may count towards skills assessment requirements.',
      'Build your English score during your training period.',
      'Network with potential employers for future sponsorship.',
    ],
  },
  '870': {
    steps: [
      'SC 870 is a temporary visa only (3 or 5 years). It does NOT lead to PR.',
      'If you want permanent residency, you must apply separately for a Parent visa.',
      'Consider SC 143 (Contributory Parent) or SC 864 (Contributory Aged Parent) for PR.',
      'The balance of family test and sponsorship requirements apply to permanent parent visas.',
    ],
    timeline: 'No PR pathway from SC 870. Separate parent visa: 5-30+ years depending on type.',
    tips: [
      'SC 870 costs $5,000 (3 years) or $10,000 (5 years) with no Medicare.',
      'You must maintain private health insurance throughout your SC 870 stay.',
      'Contributory parent visas (SC 143/864) cost approximately $47,000+ but process faster.',
      'Non-contributory parent visas (SC 103/804) cost less but have 30+ year wait times.',
    ],
  },
};

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function getUrgencyDot(urgency: string) {
  switch (urgency) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

function getSeverityStyles(severity: string) {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        badge: 'bg-red-100 text-red-800',
        icon: 'text-red-600',
        label: 'CRITICAL',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        badge: 'bg-yellow-100 text-yellow-800',
        icon: 'text-yellow-600',
        label: 'WARNING',
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        badge: 'bg-blue-100 text-blue-800',
        icon: 'text-blue-600',
        label: 'INFO',
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-300',
        badge: 'bg-gray-100 text-gray-800',
        icon: 'text-gray-600',
        label: 'INFO',
      };
  }
}

export default function TRPathwayPage() {
  const [selectedVisa, setSelectedVisa] = useState<string>('');

  const selectedPathway = trToPathways.find(
    (p) => p.subclass === selectedVisa
  );
  const selectedDetails = selectedVisa ? pathwayDetails[selectedVisa] : null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Temporary Resident to PR Pathway Module
        </h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          Understand your pathway from a temporary visa to Australian permanent
          residency. Select your current visa to see personalised steps,
          timelines, and important conditions.
        </p>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> This tool provides general information
            only. Not migration advice. Always consult a MARA-registered
            migration agent for personalised guidance.
          </p>
        </div>
      </div>

      {/* TR to PR Pathway Matrix Table */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          TR to PR Pathway Matrix
        </h2>
        <p className="text-gray-600 mb-4">
          All 12 current temporary visa types with their available pathways to
          permanent residency. Urgency indicates how time-sensitive the pathway
          planning is.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="text-left px-4 py-3 font-semibold">
                  Current Visa
                </th>
                <th className="text-left px-4 py-3 font-semibold">Subclass</th>
                <th className="text-left px-4 py-3 font-semibold">
                  Available PR Pathways
                </th>
                <th className="text-left px-4 py-3 font-semibold">Notes</th>
                <th className="text-center px-4 py-3 font-semibold">
                  Urgency
                </th>
              </tr>
            </thead>
            <tbody>
              {trToPathways.map((pathway, index) => (
                <tr
                  key={pathway.subclass}
                  className={`border-t border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {pathway.currentVisa}
                  </td>
                  <td className="px-4 py-3 text-blue-700 font-mono font-semibold">
                    {pathway.subclass}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {pathway.urgency === 'high' ? (
                      <span className="text-red-700 font-semibold">
                        {pathway.availablePRPathways}
                      </span>
                    ) : (
                      pathway.availablePRPathways
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    {pathway.notes}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                        pathway.urgency
                      )}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${getUrgencyDot(
                          pathway.urgency
                        )}`}
                      ></span>
                      {pathway.urgency.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
            Low urgency - clear pathway with time
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
            Medium urgency - plan ahead
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            High urgency - limited options, act now
          </span>
        </div>
      </section>

      {/* Interactive Visa Selector */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Visa Pathway Finder
        </h2>
        <p className="text-gray-600 mb-4">
          Select your current visa type below to see personalised pathway
          information, step-by-step guidance, and practical tips.
        </p>
        <div className="max-w-md">
          <label
            htmlFor="visa-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Current Visa
          </label>
          <select
            id="visa-select"
            value={selectedVisa}
            onChange={(e) => setSelectedVisa(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">-- Select your current visa --</option>
            {trToPathways.map((p) => (
              <option key={p.subclass} value={p.subclass}>
                {p.currentVisa} (SC {p.subclass})
              </option>
            ))}
          </select>
        </div>

        {selectedPathway && selectedDetails && (
          <div className="mt-6 space-y-6">
            {/* Pathway Overview */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <h3 className="text-lg font-bold text-blue-900">
                  {selectedPathway.currentVisa} (SC{' '}
                  {selectedPathway.subclass})
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                    selectedPathway.urgency
                  )}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${getUrgencyDot(
                      selectedPathway.urgency
                    )}`}
                  ></span>
                  {selectedPathway.urgency.toUpperCase()} URGENCY
                </span>
              </div>
              <p className="text-blue-800 font-medium mb-1">
                PR Pathway: {selectedPathway.availablePRPathways}
              </p>
              <p className="text-blue-700 text-sm">{selectedPathway.notes}</p>
            </div>

            {/* Step-by-Step Guide */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Step-by-Step Pathway
              </h4>
              <ol className="space-y-3">
                {selectedDetails.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Estimated Timeline */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Estimated Timeline
              </h4>
              <p className="text-gray-700">{selectedDetails.timeline}</p>
            </div>

            {/* Tips */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Important Tips
              </h4>
              <ul className="space-y-2">
                {selectedDetails.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1 flex-shrink-0">
                      &#10148;
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedVisa && !selectedDetails && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600">
            Detailed pathway information is not available for this visa type.
            Please consult a MARA-registered migration agent for personalised
            advice.
          </div>
        )}
      </section>

      {/* Visa Condition Alerts */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Visa Condition Alerts
        </h2>
        <p className="text-gray-600 mb-4">
          Common visa conditions that affect your stay and PR pathway. Check
          your visa grant letter or VEVO for the conditions that apply to you.
        </p>
        <div className="space-y-3">
          {visaConditions.map((condition) => {
            const styles = getSeverityStyles(condition.severity);
            return (
              <div
                key={condition.code}
                className={`${styles.bg} border ${styles.border} rounded-xl p-5`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {condition.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}
                  >
                    {styles.label}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {condition.name}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{condition.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Note:</strong> Immigration law and policy change frequently. The
        information above is based on current rules as of 2024-2025. Always
        verify with the{' '}
        <a
          href="https://immi.homeaffairs.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium hover:text-blue-900"
        >
          Department of Home Affairs
        </a>{' '}
        website or a registered migration agent before making decisions.
      </div>
    </div>
  );
}
