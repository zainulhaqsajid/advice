'use client';

import { useState } from 'react';

const assessingBodies = [
  {
    id: 'acs',
    name: 'Australian Computer Society (ACS)',
    occupations: 'ICT professionals, Software Engineers, Web Developers, Database Administrators, Systems Analysts',
    cost: 'AUD $550',
    processing: '6-8 weeks',
    website: 'acs.org.au',
    requirements: [
      'ICT-related qualification (Bachelor or higher preferred)',
      'Reference letters with detailed duties on company letterhead',
      'Academic transcripts and certificates',
      'CV/resume detailing all employment',
    ],
  },
  {
    id: 'ea',
    name: 'Engineers Australia (EA)',
    occupations: 'Civil Engineers, Mechanical Engineers, Electrical Engineers, Chemical Engineers, Mining Engineers',
    cost: 'AUD $1,200',
    processing: '12-16 weeks',
    website: 'engineersaustralia.org.au',
    requirements: [
      'Engineering qualification (Washington Accord preferred)',
      'Competency Demonstration Report (CDR) with 3 career episodes',
      'Summary Statement mapping competencies',
      'CPD (Continuing Professional Development) list',
    ],
  },
  {
    id: 'cpa',
    name: 'CPA Australia / CAANZ / IPA',
    occupations: 'Accountants, Auditors, Finance Managers, Taxation Accountants',
    cost: 'AUD $600-$1,100',
    processing: '8-12 weeks',
    website: 'cpaaustralia.com.au',
    requirements: [
      'Accounting degree covering core knowledge areas',
      'Academic transcripts showing completion of required subjects',
      'Must cover 9 core knowledge areas for CPA assessment',
      'Professional membership evidence (if applicable)',
    ],
  },
  {
    id: 'vetassess',
    name: 'VETASSESS',
    occupations: 'General professional occupations: Marketing, HR, Management, Science, Social Work, and 300+ others',
    cost: 'AUD $1,200-$1,500',
    processing: '10-14 weeks',
    website: 'vetassess.com.au',
    requirements: [
      'Relevant qualification at the required AQF level',
      'Employment evidence (min 1-3 years depending on occupation)',
      'Reference letters detailing duties and responsibilities',
      'Academic transcripts certified copies',
    ],
  },
  {
    id: 'trades',
    name: 'TRA (Trades Recognition Australia)',
    occupations: 'Electricians, Plumbers, Carpenters, Welders, Motor Mechanics, Chefs, Bakers',
    cost: 'AUD $300-$600 (plus assessment fees)',
    processing: '6-12 months (includes practical assessment)',
    website: 'tradesrecognitionaustralia.gov.au',
    requirements: [
      'Trade qualification from home country',
      'Minimum 3 years of post-qualification work experience',
      'Technical interview and practical assessment in Australia (for some occupations)',
      'Job Ready Program (JRP) for offshore applicants',
    ],
  },
  {
    id: 'ahpra',
    name: 'AHPRA (Australian Health Practitioner Regulation Agency)',
    occupations: 'Doctors, Nurses, Pharmacists, Physiotherapists, Dentists, Psychologists',
    cost: 'Varies by profession ($500-$5,000+)',
    processing: 'Varies (months to years for medical practitioners)',
    website: 'ahpra.gov.au',
    requirements: [
      'Qualification recognised by relevant board',
      'English language requirements (usually OET B or IELTS 7.0 each)',
      'Registration or eligibility for registration',
      'Professional references and practice history',
    ],
  },
  {
    id: 'aitsl',
    name: 'AITSL (Australian Institute for Teaching and School Leadership)',
    occupations: 'Primary School Teachers, Secondary School Teachers, Special Education Teachers',
    cost: 'AUD $1,170',
    processing: '10-16 weeks',
    website: 'aitsl.edu.au',
    requirements: [
      'Teaching qualification (minimum 4 years of tertiary study)',
      'At least 1 year of teacher preparation/training',
      'At least 45 days of supervised teaching practice',
      'Evidence of teaching in at least 2 relevant subject areas (secondary)',
    ],
  },
];

const assessmentTips = [
  'Start your skills assessment early — it can take 2-6 months to complete.',
  'Ensure all reference letters are on official company letterhead with contact details.',
  'Get documents translated by a NAATI-accredited translator before submission.',
  'Keep certified copies of everything you submit.',
  'If your qualification is not directly related, check if the assessing body offers a pathway assessment.',
  'Some assessing bodies offer priority processing for an additional fee.',
  'Skills assessments typically remain valid for 3 years from the date of the outcome letter.',
];

export default function SkillsAssessmentPage() {
  const [expandedBodies, setExpandedBodies] = useState<Set<string>>(new Set());

  const toggleBody = (id: string) => {
    setExpandedBodies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Skills Assessment Guide</h1>
        <p className="text-teal-100 text-lg leading-relaxed max-w-4xl">
          A positive skills assessment is required for most skilled migration visas (SC 189, 190, 491).
          This guide covers the major assessing bodies, their requirements, costs, and processing times
          to help you prepare for your assessment.
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How Skills Assessment Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="text-2xl mb-2">1️⃣</div>
            <h3 className="font-semibold text-teal-900 text-sm">Find Your Occupation</h3>
            <p className="text-xs text-teal-700 mt-1">Look up your occupation on the Skilled Occupation List (SOL/MLTSSL/STSOL)</p>
          </div>
          <div className="text-center p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="text-2xl mb-2">2️⃣</div>
            <h3 className="font-semibold text-teal-900 text-sm">Identify Assessing Body</h3>
            <p className="text-xs text-teal-700 mt-1">Each occupation is assigned a specific assessing authority</p>
          </div>
          <div className="text-center p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="text-2xl mb-2">3️⃣</div>
            <h3 className="font-semibold text-teal-900 text-sm">Prepare &amp; Apply</h3>
            <p className="text-xs text-teal-700 mt-1">Gather required documents and submit your application</p>
          </div>
          <div className="text-center p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="text-2xl mb-2">4️⃣</div>
            <h3 className="font-semibold text-teal-900 text-sm">Receive Outcome</h3>
            <p className="text-xs text-teal-700 mt-1">A positive outcome letter is valid for 3 years</p>
          </div>
        </div>
      </div>

      {/* Assessing Bodies */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Major Assessing Bodies</h2>
        {assessingBodies.map((body) => (
          <div key={body.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-teal-500">
            <button
              onClick={() => toggleBody(body.id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{body.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{body.occupations}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-teal-700">
                  <span className="bg-teal-50 px-2 py-0.5 rounded-full">{body.cost}</span>
                  <span className="bg-teal-50 px-2 py-0.5 rounded-full">{body.processing}</span>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                  expandedBodies.has(body.id) ? 'rotate-180' : ''
                }`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedBodies.has(body.id) && (
              <div className="px-6 pb-5 border-t border-gray-100">
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Requirements</h4>
                  <ul className="space-y-2">
                    {body.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Estimated Cost</p>
                    <p className="font-semibold text-gray-900 text-sm">{body.cost}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Processing Time</p>
                    <p className="font-semibold text-gray-900 text-sm">{body.processing}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="font-semibold text-teal-700 text-sm">{body.website}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preparation Tips</h2>
        <div className="space-y-3">
          {assessmentTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-200 text-teal-800 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-teal-900">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> Assessing body requirements, costs, and processing times may change.
            Always check the relevant assessing body&apos;s website for the most current information.
          </p>
        </div>
      </div>
    </div>
  );
}
