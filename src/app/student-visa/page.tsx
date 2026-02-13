'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Data definitions                                                   */
/* ------------------------------------------------------------------ */

interface KeyInfoRow {
  label: string;
  value: string;
}

const keyInformation: KeyInfoRow[] = [
  {
    label: 'Visa Fee',
    value: 'AUD $2,000 (increased from $1,600)',
  },
  {
    label: 'Financial Proof',
    value:
      'AUD $29,710 living costs + tuition fees + $10,394 per partner + $4,449 per child',
  },
  {
    label: 'English Requirement',
    value: 'IELTS 6.0 overall (minimum 5.5 in each band)',
  },
  {
    label: 'Work Rights',
    value:
      '48 hours per fortnight during study. Unlimited during scheduled course holidays.',
  },
  {
    label: 'Work Rights (Masters/PhD)',
    value: 'Partner gets unlimited work rights',
  },
  {
    label: 'Genuine Student (GS)',
    value:
      'Replaced Genuine Temporary Entrant (GTE). Must demonstrate genuine intent to study.',
  },
  {
    label: 'CoE Requirement',
    value: 'Must have a valid Confirmation of Enrolment from a registered provider',
  },
  {
    label: 'OSHC',
    value: 'Overseas Student Health Cover is mandatory for the entire visa duration',
  },
  {
    label: 'Onshore Restrictions',
    value:
      'Cannot apply from SC 600 (visitor) or SC 485 (graduate) visas since July 2024',
  },
];

interface PathwayStep {
  step: number;
  title: string;
  description: string;
  duration: string;
}

const pathwaySteps: PathwayStep[] = [
  {
    step: 1,
    title: 'Student Visa (SC 500)',
    description:
      'Enrol in an eligible CRICOS-registered course and complete your studies in Australia.',
    duration: '2 -- 4 years (depending on course)',
  },
  {
    step: 2,
    title: 'Apply for Graduate Visa (SC 485)',
    description:
      'After completing your course, apply for the Temporary Graduate visa to gain work experience.',
    duration: '2 -- 5 years post-study',
  },
  {
    step: 3,
    title: 'Get Skills Assessment',
    description:
      'Obtain a positive skills assessment from the relevant assessing authority for your occupation.',
    duration: '1 -- 3 months',
  },
  {
    step: 4,
    title: 'Take English Test (aim Proficient/Superior)',
    description:
      'Sit an approved English test (PTE, IELTS, etc.) and target Proficient (20 pts) or Superior (20 pts) for maximum points.',
    duration: '1 -- 2 months preparation',
  },
  {
    step: 5,
    title: 'Submit EOI through SkillSelect',
    description:
      'Lodge an Expression of Interest on the SkillSelect platform and wait for an invitation.',
    duration: 'Varies (weeks to months)',
  },
  {
    step: 6,
    title: 'Apply for State Nomination (if applicable)',
    description:
      'If targeting SC 190 or SC 491, apply for state or territory nomination to gain extra points.',
    duration: '4 -- 12 weeks',
  },
  {
    step: 7,
    title: 'Receive Invitation -- Lodge Visa Application',
    description:
      'Once invited, lodge your visa application (SC 189 / 190 / 491) with all supporting documents within 60 days.',
    duration: '60 days to lodge',
  },
  {
    step: 8,
    title: 'Visa Grant -- Permanent Residency',
    description:
      'After processing (health, character, verification), receive your PR visa grant.',
    duration: '6 -- 18 months processing',
  },
];

type CourseChangeNewVisa = 'No' | 'Yes' | 'Possibly';

interface CourseChangeRow {
  scenario: string;
  rule: string;
  newVisa: CourseChangeNewVisa;
}

const courseChangeRules: CourseChangeRow[] = [
  {
    scenario: 'Same provider, same or higher AQF level',
    rule: 'Allowed',
    newVisa: 'No',
  },
  {
    scenario: 'Same provider, LOWER AQF level',
    rule: 'Must apply for a new SC 500 visa',
    newVisa: 'Yes',
  },
  {
    scenario: 'Different provider, same or higher AQF level',
    rule: 'Allowed (first 6 months may need provider release)',
    newVisa: 'No',
  },
  {
    scenario: 'Different provider, lower AQF level',
    rule: 'Must apply for a new SC 500 visa',
    newVisa: 'Yes',
  },
  {
    scenario: 'PhD to Masters',
    rule: 'Exception allowed',
    newVisa: 'No',
  },
  {
    scenario: 'Changing major or thesis topic',
    rule: "May need Minister's approval",
    newVisa: 'Possibly',
  },
  {
    scenario: 'Adding course package',
    rule: 'Allowed if course is a natural progression',
    newVisa: 'No',
  },
  {
    scenario: 'VET to higher education',
    rule: 'Allowed',
    newVisa: 'No',
  },
  {
    scenario: 'Higher education to VET',
    rule: 'New visa needed',
    newVisa: 'Yes',
  },
];

interface AqfRow {
  level: number;
  name: string;
  points: string;
  prRelevance: string;
}

const aqfLevels: AqfRow[] = [
  {
    level: 1,
    name: 'Certificate I',
    points: '0',
    prRelevance: 'Not eligible for skilled migration points',
  },
  {
    level: 2,
    name: 'Certificate II',
    points: '0',
    prRelevance: 'Not eligible for skilled migration points',
  },
  {
    level: 3,
    name: 'Certificate III',
    points: '10',
    prRelevance: 'Trade qualification; relevant for trades occupations',
  },
  {
    level: 4,
    name: 'Certificate IV',
    points: '10',
    prRelevance: 'Trade qualification; relevant for some nominated occupations',
  },
  {
    level: 5,
    name: 'Diploma',
    points: '10',
    prRelevance: 'Recognised for some occupations on skilled lists',
  },
  {
    level: 6,
    name: 'Advanced Diploma / Associate Degree',
    points: '10',
    prRelevance: 'Recognised for some occupations on skilled lists',
  },
  {
    level: 7,
    name: 'Bachelor Degree',
    points: '15',
    prRelevance: 'Strong pathway; eligible for most skilled visas',
  },
  {
    level: 8,
    name: 'Bachelor Honours / Graduate Diploma',
    points: '15',
    prRelevance: 'Strong pathway; eligible for most skilled visas',
  },
  {
    level: 9,
    name: 'Masters Degree',
    points: '15',
    prRelevance:
      'Excellent pathway; qualifies for 485 Post-Study Work stream (2--3 yrs)',
  },
  {
    level: 10,
    name: 'Doctoral Degree (PhD)',
    points: '20',
    prRelevance:
      'Highest points; qualifies for 485 Post-Study Work stream (4 yrs)',
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: colour badge for new-visa column                           */
/* ------------------------------------------------------------------ */

function NewVisaBadge({ value }: { value: CourseChangeNewVisa }) {
  const colours: Record<CourseChangeNewVisa, string> = {
    No: 'bg-green-100 text-green-800 border-green-300',
    Yes: 'bg-red-100 text-red-800 border-red-300',
    Possibly: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colours[value]}`}
    >
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function StudentVisaPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-10">
      {/* ---- 1. Header ---- */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl text-white px-6 py-10 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Student Visa (SC 500) Module
        </h1>
        <p className="text-blue-100 max-w-3xl text-lg leading-relaxed">
          Everything you need to know about the Australian Student Visa subclass
          500 and how it connects to a permanent residency pathway. This module
          covers current rules, financial requirements, work rights, course
          change scenarios, and a step-by-step pathway from student to PR.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/intake"
            className="inline-block bg-white text-blue-900 font-semibold px-6 py-2.5 rounded-lg shadow hover:bg-blue-50 transition-colors text-sm"
          >
            Check Your Eligibility
          </Link>
          <Link
            href="/cost-calculator"
            className="inline-block border border-blue-300 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Estimate Costs
          </Link>
        </div>
      </section>

      {/* ---- 2. Key Information Table ---- */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-900">
            Key Information &mdash; Current Rules (2025-26)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Updated to reflect the latest Department of Home Affairs changes.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-6 py-3 font-semibold w-1/4">
                  Requirement
                </th>
                <th className="text-left px-6 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {keyInformation.map((row, idx) => (
                <tr
                  key={row.label}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 align-top whitespace-nowrap">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- 3. Important Alert Banner ---- */}
      <section className="bg-red-50 border-2 border-red-400 rounded-xl px-6 py-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg mb-1">
              IMPORTANT &mdash; Onshore Application Restriction
            </h3>
            <p className="text-red-700 leading-relaxed">
              Since July 2024, students on{' '}
              <span className="font-semibold">SC 600 (visitor)</span> or{' '}
              <span className="font-semibold">SC 485 (graduate)</span> can no
              longer apply for SC 500 onshore. They must leave Australia and
              apply offshore.
            </p>
          </div>
        </div>
      </section>

      {/* ---- 4. Student to PR Pathway Visual Timeline ---- */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-900">
            Student to PR Pathway &mdash; Visual Timeline
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on any step to expand details. This is the most common skilled
            migration pathway for international students.
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="relative">
            {pathwaySteps.map((ps, idx) => {
              const isActive = activeStep === ps.step;
              const isLast = idx === pathwaySteps.length - 1;

              return (
                <div key={ps.step} className="flex gap-4 relative">
                  {/* Left column: number circle + connecting line */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() =>
                        setActiveStep(isActive ? null : ps.step)
                      }
                      className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-blue-700 border-blue-700 text-white scale-110 shadow-lg'
                          : 'bg-white border-blue-400 text-blue-700 hover:bg-blue-100'
                      }`}
                      aria-expanded={isActive}
                      aria-label={`Step ${ps.step}: ${ps.title}`}
                    >
                      {ps.step}
                    </button>
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-blue-200 min-h-[2rem]" />
                    )}
                  </div>

                  {/* Right column: content card */}
                  <div className="flex-1 pb-8">
                    <button
                      onClick={() =>
                        setActiveStep(isActive ? null : ps.step)
                      }
                      className="text-left w-full"
                    >
                      <h3
                        className={`font-semibold text-base transition-colors ${
                          isActive ? 'text-blue-800' : 'text-gray-900'
                        }`}
                      >
                        {ps.title}
                      </h3>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isActive
                          ? 'max-h-40 opacity-100 mt-2'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {ps.description}
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-2">
                          Estimated duration: {ps.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- 5. Course Change Rules Table ---- */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-900">
            Course Change Rules
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Understand when you can change courses and whether a new student
            visa is required. Green means no new visa is needed; red means a new
            visa is required; yellow means it depends on the circumstances.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-6 py-3 font-semibold">#</th>
                <th className="text-left px-6 py-3 font-semibold">Scenario</th>
                <th className="text-left px-6 py-3 font-semibold">Rule</th>
                <th className="text-left px-6 py-3 font-semibold">
                  New Visa Needed?
                </th>
              </tr>
            </thead>
            <tbody>
              {courseChangeRules.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {row.scenario}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{row.rule}</td>
                  <td className="px-6 py-4">
                    <NewVisaBadge value={row.newVisa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- 6. AQF Level Guide Table ---- */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-900">
            Australian Qualifications Framework (AQF) Level Guide
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            The AQF level of your qualification affects your points score and
            eligibility for PR pathways.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-6 py-3 font-semibold">
                  AQF Level
                </th>
                <th className="text-left px-6 py-3 font-semibold">
                  Qualification
                </th>
                <th className="text-left px-6 py-3 font-semibold text-center">
                  Points
                </th>
                <th className="text-left px-6 py-3 font-semibold">
                  PR Relevance
                </th>
              </tr>
            </thead>
            <tbody>
              {aqfLevels.map((row, idx) => (
                <tr
                  key={row.level}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 font-bold text-blue-700 text-center">
                    {row.level}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        parseInt(row.points) >= 20
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : parseInt(row.points) >= 15
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : parseInt(row.points) >= 10
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {row.points} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{row.prRelevance}</td>
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
            <strong>Disclaimer:</strong> This module provides general
            information only and does not constitute migration advice. Visa
            rules change frequently. Always verify with the{' '}
            <a
              href="https://immi.homeaffairs.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-amber-900"
            >
              Department of Home Affairs
            </a>{' '}
            website and consult a MARA-registered migration agent for
            personalised advice.
          </p>
        </div>
      </section>
    </div>
  );
}
