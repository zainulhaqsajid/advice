'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface TimelineStage {
  name: string;
  description: string;
  durationLabel: string;
  minWeeks: number;
  maxWeeks: number;
  source: string;
}

interface Pathway {
  id: string;
  label: string;
  stages: TimelineStage[];
}

const pathways: Pathway[] = [
  {
    id: 'sc189',
    label: 'Skilled Independent (SC 189)',
    stages: [
      {
        name: 'Skills Assessment',
        description:
          'Obtain a positive skills assessment from the relevant assessing authority for your nominated occupation.',
        durationLabel: '8 -- 16 weeks',
        minWeeks: 8,
        maxWeeks: 16,
        source: 'Assessing authority processing times',
      },
      {
        name: 'English Test',
        description:
          'Sit an approved English test (PTE Academic, IELTS, TOEFL iBT, CAE, or OET) and achieve at least Competent level.',
        durationLabel: '2 -- 12 weeks',
        minWeeks: 2,
        maxWeeks: 12,
        source: 'Test booking availability & preparation time',
      },
      {
        name: 'EOI Submission',
        description:
          'Submit your Expression of Interest through the SkillSelect platform with your points claim.',
        durationLabel: 'Immediate',
        minWeeks: 0,
        maxWeeks: 0,
        source: 'SkillSelect system',
      },
      {
        name: 'EOI Wait for Invitation',
        description:
          'Wait for an invitation to apply. Invitations are issued in rounds based on points score and occupation ceilings.',
        durationLabel: '1 -- 18 months',
        minWeeks: 4,
        maxWeeks: 78,
        source: 'DHA SkillSelect invitation rounds data',
      },
      {
        name: 'Lodgement Preparation',
        description:
          'Prepare and gather all supporting documents including health examinations, police clearances, and certified copies.',
        durationLabel: '2 -- 4 weeks',
        minWeeks: 2,
        maxWeeks: 4,
        source: 'General preparation estimate',
      },
      {
        name: 'Visa Processing',
        description:
          'DHA processes your visa application. Includes verification, health & character checks, and final decision.',
        durationLabel: '6 -- 12 months',
        minWeeks: 26,
        maxWeeks: 52,
        source: 'DHA published processing times',
      },
    ],
  },
  {
    id: 'sc190',
    label: 'Skilled Nominated (SC 190)',
    stages: [
      {
        name: 'Skills Assessment',
        description:
          'Obtain a positive skills assessment from the relevant assessing authority for your nominated occupation.',
        durationLabel: '8 -- 16 weeks',
        minWeeks: 8,
        maxWeeks: 16,
        source: 'Assessing authority processing times',
      },
      {
        name: 'English Test',
        description:
          'Sit an approved English test and achieve at least the level required by your state/territory nomination.',
        durationLabel: '2 -- 12 weeks',
        minWeeks: 2,
        maxWeeks: 12,
        source: 'Test booking availability & preparation time',
      },
      {
        name: 'State Nomination Application',
        description:
          'Apply for nomination from a state or territory government. Requirements vary by state and occupation.',
        durationLabel: '4 -- 16 weeks',
        minWeeks: 4,
        maxWeeks: 16,
        source: 'State/territory government processing times',
      },
      {
        name: 'EOI Submission',
        description:
          'Submit your Expression of Interest through SkillSelect with state nomination points included.',
        durationLabel: 'Immediate',
        minWeeks: 0,
        maxWeeks: 0,
        source: 'SkillSelect system',
      },
      {
        name: 'EOI Wait for Invitation',
        description:
          'Wait for an invitation to apply. State-nominated applicants generally receive invitations faster than SC 189.',
        durationLabel: '1 -- 12 months',
        minWeeks: 4,
        maxWeeks: 52,
        source: 'DHA SkillSelect invitation rounds data',
      },
      {
        name: 'Lodgement Preparation',
        description:
          'Prepare and gather all supporting documents including health examinations, police clearances, and certified copies.',
        durationLabel: '2 -- 4 weeks',
        minWeeks: 2,
        maxWeeks: 4,
        source: 'General preparation estimate',
      },
      {
        name: 'Visa Processing',
        description:
          'DHA processes your visa application. Includes verification, health & character checks, and final decision.',
        durationLabel: '6 -- 18 months',
        minWeeks: 26,
        maxWeeks: 78,
        source: 'DHA published processing times',
      },
    ],
  },
  {
    id: 'sc491',
    label: 'Skilled Regional (SC 491 → 191)',
    stages: [
      {
        name: 'Skills Assessment',
        description:
          'Obtain a positive skills assessment from the relevant assessing authority for your nominated occupation.',
        durationLabel: '8 -- 16 weeks',
        minWeeks: 8,
        maxWeeks: 16,
        source: 'Assessing authority processing times',
      },
      {
        name: 'English Test',
        description:
          'Sit an approved English test and achieve at least the level required by your state/territory or family sponsor.',
        durationLabel: '2 -- 12 weeks',
        minWeeks: 2,
        maxWeeks: 12,
        source: 'Test booking availability & preparation time',
      },
      {
        name: 'State Nomination Application',
        description:
          'Apply for nomination from a state/territory government or sponsorship from an eligible family member in a regional area.',
        durationLabel: '4 -- 16 weeks',
        minWeeks: 4,
        maxWeeks: 16,
        source: 'State/territory government processing times',
      },
      {
        name: 'EOI Submission',
        description:
          'Submit your Expression of Interest through SkillSelect with regional nomination/sponsorship points.',
        durationLabel: 'Immediate',
        minWeeks: 0,
        maxWeeks: 0,
        source: 'SkillSelect system',
      },
      {
        name: 'EOI Wait for Invitation',
        description:
          'Wait for an invitation to apply for the SC 491 provisional visa.',
        durationLabel: '1 -- 12 months',
        minWeeks: 4,
        maxWeeks: 52,
        source: 'DHA SkillSelect invitation rounds data',
      },
      {
        name: 'Lodgement Preparation',
        description:
          'Prepare and gather all supporting documents including health examinations, police clearances, and certified copies.',
        durationLabel: '2 -- 4 weeks',
        minWeeks: 2,
        maxWeeks: 4,
        source: 'General preparation estimate',
      },
      {
        name: 'SC 491 Visa Processing',
        description:
          'DHA processes your SC 491 provisional visa application.',
        durationLabel: '6 -- 18 months',
        minWeeks: 26,
        maxWeeks: 78,
        source: 'DHA published processing times',
      },
      {
        name: 'Regional Residence Requirement',
        description:
          'Live and work in a designated regional area for at least 3 years while holding the SC 491 visa.',
        durationLabel: '3 years',
        minWeeks: 156,
        maxWeeks: 156,
        source: 'DHA SC 491 visa condition 8579',
      },
      {
        name: 'SC 191 Application & Processing',
        description:
          'Apply for the permanent SC 191 visa after meeting the regional residence and income requirements.',
        durationLabel: '6 -- 12 months',
        minWeeks: 26,
        maxWeeks: 52,
        source: 'DHA published processing times',
      },
    ],
  },
  {
    id: 'partner-onshore',
    label: 'Partner Visa (Onshore)',
    stages: [
      {
        name: 'Evidence Gathering',
        description:
          'Collect evidence of your genuine and continuing relationship: joint finances, shared residence, social recognition, and commitment.',
        durationLabel: '2 -- 8 weeks',
        minWeeks: 2,
        maxWeeks: 8,
        source: 'General preparation estimate',
      },
      {
        name: 'Form 888 Statutory Declarations',
        description:
          'Obtain completed Form 888 statutory declarations from Australian citizens or permanent residents who know your relationship.',
        durationLabel: '1 -- 4 weeks',
        minWeeks: 1,
        maxWeeks: 4,
        source: 'General preparation estimate',
      },
      {
        name: 'Health & Police Checks',
        description:
          'Complete medical examinations at a Bupa-approved panel clinic and obtain police clearances from all countries lived in 12+ months.',
        durationLabel: '2 -- 8 weeks',
        minWeeks: 2,
        maxWeeks: 8,
        source: 'Bupa Medical Visa Services / AFP',
      },
      {
        name: 'Application Lodgement',
        description:
          'Lodge the combined SC 820/801 application through ImmiAccount with all supporting documentation and fees.',
        durationLabel: '1 day -- 1 week',
        minWeeks: 0,
        maxWeeks: 1,
        source: 'DHA ImmiAccount',
      },
      {
        name: 'SC 820 Processing (Temporary)',
        description:
          'DHA processes the temporary partner visa (SC 820). You can live, work, and study in Australia while waiting.',
        durationLabel: '21 -- 34 months',
        minWeeks: 91,
        maxWeeks: 148,
        source: 'DHA published processing times',
      },
      {
        name: 'Eligibility Wait Period',
        description:
          'Wait for the 2-year eligibility period from lodgement date before being assessed for the permanent visa.',
        durationLabel: '24 months',
        minWeeks: 104,
        maxWeeks: 104,
        source: 'DHA SC 801 eligibility requirement',
      },
      {
        name: 'SC 801 Processing (Permanent)',
        description:
          'DHA processes the permanent partner visa (SC 801). You must provide updated relationship evidence.',
        durationLabel: '12 -- 20 months',
        minWeeks: 52,
        maxWeeks: 87,
        source: 'DHA published processing times',
      },
    ],
  },
  {
    id: 'partner-offshore',
    label: 'Partner Visa (Offshore)',
    stages: [
      {
        name: 'Evidence Gathering',
        description:
          'Collect evidence of your genuine and continuing relationship: joint finances, shared residence, social recognition, and commitment.',
        durationLabel: '2 -- 8 weeks',
        minWeeks: 2,
        maxWeeks: 8,
        source: 'General preparation estimate',
      },
      {
        name: 'Form 888 Statutory Declarations',
        description:
          'Obtain completed Form 888 statutory declarations from Australian citizens or permanent residents who know your relationship.',
        durationLabel: '1 -- 4 weeks',
        minWeeks: 1,
        maxWeeks: 4,
        source: 'General preparation estimate',
      },
      {
        name: 'Health & Police Checks',
        description:
          'Complete medical examinations at an approved panel clinic and obtain police clearances from all countries lived in 12+ months.',
        durationLabel: '2 -- 8 weeks',
        minWeeks: 2,
        maxWeeks: 8,
        source: 'Bupa Medical Visa Services / local police authority',
      },
      {
        name: 'Application Lodgement',
        description:
          'Lodge the combined SC 309/100 application through ImmiAccount with all supporting documentation and fees.',
        durationLabel: '1 day -- 1 week',
        minWeeks: 0,
        maxWeeks: 1,
        source: 'DHA ImmiAccount',
      },
      {
        name: 'SC 309 Processing (Temporary)',
        description:
          'DHA processes the temporary partner visa (SC 309). You must be outside Australia when the visa is granted.',
        durationLabel: '21 -- 34 months',
        minWeeks: 91,
        maxWeeks: 148,
        source: 'DHA published processing times',
      },
      {
        name: 'Eligibility Wait Period',
        description:
          'Wait for the 2-year eligibility period from lodgement date before being assessed for the permanent visa.',
        durationLabel: '24 months',
        minWeeks: 104,
        maxWeeks: 104,
        source: 'DHA SC 100 eligibility requirement',
      },
      {
        name: 'SC 100 Processing (Permanent)',
        description:
          'DHA processes the permanent partner visa (SC 100). You must provide updated relationship evidence.',
        durationLabel: '12 -- 20 months',
        minWeeks: 52,
        maxWeeks: 87,
        source: 'DHA published processing times',
      },
    ],
  },
  {
    id: 'parent-143',
    label: 'Contributory Parent (SC 143/864)',
    stages: [
      {
        name: 'Balance of Family Test',
        description:
          'Demonstrate that at least half of your children live in Australia, or more children live in Australia than any other country.',
        durationLabel: '1 -- 4 weeks',
        minWeeks: 1,
        maxWeeks: 4,
        source: 'DHA Balance of Family test requirements',
      },
      {
        name: 'Assurance of Support (AoS) Application',
        description:
          'Apply for an Assurance of Support through Services Australia (Centrelink). This guarantees the government will not bear welfare costs.',
        durationLabel: '4 -- 12 weeks',
        minWeeks: 4,
        maxWeeks: 12,
        source: 'Services Australia processing times',
      },
      {
        name: 'Bank Guarantee Lodgement',
        description:
          'Lodge the required bank guarantee (approximately AUD $10,000 -- $14,000) with an approved financial institution.',
        durationLabel: '1 -- 4 weeks',
        minWeeks: 1,
        maxWeeks: 4,
        source: 'Services Australia AoS bond requirements',
      },
      {
        name: 'Visa Application Lodgement',
        description:
          'Lodge the SC 143 (onshore/offshore) or SC 864 (aged parent) visa application with all supporting documents and the substantial visa fee.',
        durationLabel: '1 -- 4 weeks',
        minWeeks: 1,
        maxWeeks: 4,
        source: 'DHA ImmiAccount',
      },
      {
        name: 'Queue / Processing',
        description:
          'Enter the processing queue. Contributory parent visas have a capped annual allocation. Processing times are very long.',
        durationLabel: '5 -- 6 years',
        minWeeks: 260,
        maxWeeks: 312,
        source: 'DHA published processing times (capped visa)',
      },
    ],
  },
  {
    id: 'student-pr',
    label: 'Student → PR Pathway',
    stages: [
      {
        name: 'Student Visa (SC 500)',
        description:
          'Complete your studies at a CRICOS-registered institution in Australia. Course duration depends on your qualification level.',
        durationLabel: '2 -- 4 years',
        minWeeks: 104,
        maxWeeks: 208,
        source: 'Course duration (CRICOS)',
      },
      {
        name: 'Graduate Visa (SC 485)',
        description:
          'Apply for the Temporary Graduate visa after completing your studies. Use this time to gain work experience.',
        durationLabel: '2 -- 4 years',
        minWeeks: 104,
        maxWeeks: 208,
        source: 'DHA SC 485 visa duration by qualification',
      },
      {
        name: 'Skills Assessment',
        description:
          'Obtain a positive skills assessment from the relevant assessing authority for your nominated occupation.',
        durationLabel: '8 -- 16 weeks',
        minWeeks: 8,
        maxWeeks: 16,
        source: 'Assessing authority processing times',
      },
      {
        name: 'English Test',
        description:
          'Sit an approved English test and aim for Proficient or Superior for maximum points.',
        durationLabel: '2 -- 12 weeks',
        minWeeks: 2,
        maxWeeks: 12,
        source: 'Test booking availability & preparation time',
      },
      {
        name: 'EOI & State Nomination',
        description:
          'Submit EOI through SkillSelect and apply for state nomination if targeting SC 190 or SC 491.',
        durationLabel: 'Immediate + 4 -- 16 weeks (if state nom)',
        minWeeks: 0,
        maxWeeks: 16,
        source: 'SkillSelect / State government processing',
      },
      {
        name: 'Wait for Invitation',
        description:
          'Wait for an invitation to apply for the skilled visa (SC 189, 190, or 491).',
        durationLabel: '1 -- 18 months',
        minWeeks: 4,
        maxWeeks: 78,
        source: 'DHA SkillSelect invitation rounds data',
      },
      {
        name: 'Lodgement Preparation',
        description:
          'Prepare and lodge your visa application with all supporting documents within 60 days of invitation.',
        durationLabel: '2 -- 4 weeks',
        minWeeks: 2,
        maxWeeks: 4,
        source: 'General preparation estimate',
      },
      {
        name: 'Visa Grant',
        description:
          'DHA processes your visa application and grants your permanent residency.',
        durationLabel: '6 -- 18 months',
        minWeeks: 26,
        maxWeeks: 78,
        source: 'DHA published processing times',
      },
    ],
  },
];

interface ProcessingTimeRow {
  visa: string;
  subclass: string;
  time: string;
  notes: string;
}

const processingTimes: ProcessingTimeRow[] = [
  {
    visa: 'Skilled Independent',
    subclass: 'SC 189',
    time: '6 -- 12 months',
    notes: 'Points-tested; no nomination required',
  },
  {
    visa: 'Skilled Nominated',
    subclass: 'SC 190',
    time: '6 -- 18 months',
    notes: 'Requires state/territory nomination',
  },
  {
    visa: 'Skilled Regional (Provisional)',
    subclass: 'SC 491',
    time: '6 -- 18 months',
    notes: 'Provisional visa; must live regionally 3 years',
  },
  {
    visa: 'Employer Nomination Scheme',
    subclass: 'SC 186',
    time: '6 -- 12 months',
    notes: 'Direct entry and transition streams',
  },
  {
    visa: 'Partner (Temporary - Onshore)',
    subclass: 'SC 820',
    time: '21 -- 34 months',
    notes: 'Temporary stage; bridging visa granted',
  },
  {
    visa: 'Contributory Parent',
    subclass: 'SC 143',
    time: '5 -- 6 years',
    notes: 'Capped annual allocation; substantial fee',
  },
  {
    visa: 'Non-Contributory Parent',
    subclass: 'SC 103',
    time: '20 -- 30+ years',
    notes: 'Extremely limited places; very long queue',
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: Calculate total duration                                    */
/* ------------------------------------------------------------------ */

function formatWeeks(weeks: number): string {
  if (weeks < 4) {
    return weeks <= 0 ? 'Immediate' : `${weeks} week${weeks > 1 ? 's' : ''}`;
  }
  const months = Math.round(weeks / 4.33);
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  const years = (weeks / 52).toFixed(1);
  return `~${years} years`;
}

function getTotalDuration(stages: TimelineStage[]): {
  minWeeks: number;
  maxWeeks: number;
  minLabel: string;
  maxLabel: string;
} {
  const minWeeks = stages.reduce((sum, s) => sum + s.minWeeks, 0);
  const maxWeeks = stages.reduce((sum, s) => sum + s.maxWeeks, 0);
  return {
    minWeeks,
    maxWeeks,
    minLabel: formatWeeks(minWeeks),
    maxLabel: formatWeeks(maxWeeks),
  };
}

/* ------------------------------------------------------------------ */
/*  Helper: Determine the max bar width                                */
/* ------------------------------------------------------------------ */

function getBarWidthPercent(
  minWeeks: number,
  maxWeeks: number,
  globalMax: number,
): number {
  if (globalMax === 0) return 0;
  const avg = (minWeeks + maxWeeks) / 2;
  return Math.max(4, (avg / globalMax) * 100);
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function TimelinePage() {
  const [selectedPathway, setSelectedPathway] = useState<string>('');

  const activePathway = pathways.find((p) => p.id === selectedPathway);

  const globalMaxWeeks = activePathway
    ? Math.max(...activePathway.stages.map((s) => (s.minWeeks + s.maxWeeks) / 2))
    : 0;

  const totals = activePathway
    ? getTotalDuration(activePathway.stages)
    : null;

  return (
    <div className="space-y-10">
      {/* ---- Header ---- */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl text-white px-6 py-10 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Timeline &amp; Processing Time Estimator
        </h1>
        <p className="text-blue-100 max-w-3xl text-lg leading-relaxed">
          Understand the end-to-end timeline for your chosen immigration
          pathway. Select a pathway below to see every stage, from initial
          preparation through to visa grant, with estimated durations based on
          current processing times.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/intake"
            className="inline-block bg-white text-blue-900 font-semibold px-6 py-2.5 rounded-lg shadow hover:bg-blue-50 transition-colors text-sm"
          >
            Find Your Pathway
          </Link>
          <Link
            href="/cost-calculator"
            className="inline-block border border-blue-300 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Estimate Costs
          </Link>
        </div>
      </section>

      {/* ---- Pathway Selector ---- */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Select Your Pathway
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose a visa pathway to see the full visual timeline with stage-by-stage estimates.
        </p>
        <select
          value={selectedPathway}
          onChange={(e) => setSelectedPathway(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">-- Select a pathway --</option>
          {pathways.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </section>

      {/* ---- Visual Timeline ---- */}
      {activePathway && (
        <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
            <h2 className="text-xl font-bold text-blue-900">
              {activePathway.label} &mdash; Timeline
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Each stage is shown with its estimated duration. The coloured bar indicates relative duration compared to other stages.
            </p>
          </div>

          <div className="px-6 py-8">
            <div className="relative">
              {activePathway.stages.map((stage, idx) => {
                const isLast = idx === activePathway.stages.length - 1;
                const barWidth = getBarWidthPercent(
                  stage.minWeeks,
                  stage.maxWeeks,
                  globalMaxWeeks,
                );

                return (
                  <div key={idx} className="flex gap-5 relative">
                    {/* Left: dot + connecting line */}
                    <div className="flex flex-col items-center">
                      <div className="relative z-10 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-200 flex-shrink-0 mt-1" />
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-blue-200 min-h-[2rem]" />
                      )}
                    </div>

                    {/* Right: content */}
                    <div className="flex-1 pb-8">
                      <h3 className="font-bold text-gray-900 text-base">
                        {stage.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Duration bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 max-w-md bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-blue-700 whitespace-nowrap">
                          {stage.durationLabel}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-1.5">
                        Source: {stage.source}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---- Total Estimated Duration ---- */}
      {totals && activePathway && (
        <section className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            Total Estimated Duration &mdash; {activePathway.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Minimum
              </p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {totals.minLabel}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ({totals.minWeeks} weeks)
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Maximum
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {totals.maxLabel}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ({totals.maxWeeks} weeks)
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Stages
              </p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {activePathway.stages.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">steps in pathway</p>
            </div>
          </div>
        </section>
      )}

      {/* ---- Processing Times Reference Table ---- */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-900">
            Visa Processing Times &mdash; Reference Table
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Current estimated processing times for common PR-related visas. Times are approximate and sourced from the Department of Home Affairs.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-6 py-3 font-semibold">Visa</th>
                <th className="text-left px-6 py-3 font-semibold">Subclass</th>
                <th className="text-left px-6 py-3 font-semibold">
                  Processing Time
                </th>
                <th className="text-left px-6 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {processingTimes.map((row, idx) => (
                <tr
                  key={row.subclass}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.visa}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                      {row.subclass}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {row.time}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- Disclaimer ---- */}
      <section className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> Processing times are estimates based on
            DHA published data and may change. Individual circumstances, policy
            changes, and application volumes can significantly affect your
            timeline. Always consult a MARA-registered migration agent for
            personalised advice and verify current processing times on the{' '}
            <a
              href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-amber-900"
            >
              DHA website
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
