'use client';

import { useState } from 'react';
import Link from 'next/link';

type Situation =
  | 'skilled_worker'
  | 'employer_sponsored'
  | 'student'
  | 'partner_spouse'
  | 'parent'
  | 'business_investor'
  | 'global_talent'
  | 'nz_citizen'
  | 'temporary_resident'
  | 'other'
  | null;

type EnglishLevel = 'competent' | 'proficient' | 'superior' | '';
type RelationshipType = 'married' | 'de_facto' | 'same_sex' | 'engaged' | '';
type SponsorStatus = 'au_citizen' | 'permanent_resident' | 'nz_citizen_eligible' | '';
type CourseLevel = 'certificate' | 'diploma' | 'bachelors' | 'masters' | 'phd' | '';

interface SkilledWorkerData {
  age: string;
  englishLevel: EnglishLevel;
  occupationField: string;
  yearsExperience: string;
  educationLevel: string;
  inAustralia: string;
}

interface PartnerSpouseData {
  relationshipType: RelationshipType;
  inAustralia: string;
  sponsorStatus: SponsorStatus;
}

interface StudentData {
  courseLevel: CourseLevel;
  hasCoE: string;
  prGoal: string;
}

interface ParentData {
  parentAge: string;
  childrenInAustralia: string;
  totalChildren: string;
}

interface Recommendation {
  title: string;
  description: string;
  route: string;
  subclasses: string;
  nextSteps: string[];
}

const situationOptions: { value: NonNullable<Situation>; label: string }[] = [
  { value: 'skilled_worker', label: 'I\'m a skilled worker looking for PR' },
  { value: 'employer_sponsored', label: 'I have an employer sponsor in Australia' },
  { value: 'student', label: 'I\'m an international student' },
  { value: 'partner_spouse', label: 'I\'m in a relationship with an AU citizen/PR' },
  { value: 'parent', label: 'My child is an AU citizen/PR' },
  { value: 'business_investor', label: 'I\'m a business owner/investor' },
  { value: 'global_talent', label: 'I have exceptional talent/achievements' },
  { value: 'nz_citizen', label: 'I\'m a NZ citizen living in Australia' },
  { value: 'temporary_resident', label: 'I\'m already in Australia on a temporary visa' },
  { value: 'other', label: 'Other / not sure' },
];

const occupationFields = [
  'ICT / Technology',
  'Engineering',
  'Healthcare / Medical',
  'Accounting / Finance',
  'Education / Teaching',
  'Trades / Construction',
  'Sciences',
  'Architecture / Design',
  'Legal',
  'Marketing / Communications',
  'Agriculture',
  'Hospitality / Tourism',
  'Other',
];

const educationLevels = [
  { value: '1', label: 'AQF 1 - Certificate I' },
  { value: '2', label: 'AQF 2 - Certificate II' },
  { value: '3', label: 'AQF 3 - Certificate III' },
  { value: '4', label: 'AQF 4 - Certificate IV' },
  { value: '5', label: 'AQF 5 - Diploma' },
  { value: '6', label: 'AQF 6 - Advanced Diploma / Associate Degree' },
  { value: '7', label: 'AQF 7 - Bachelor Degree' },
  { value: '8', label: 'AQF 8 - Bachelor Honours / Graduate Certificate / Graduate Diploma' },
  { value: '9', label: 'AQF 9 - Masters Degree' },
  { value: '10', label: 'AQF 10 - Doctoral Degree (PhD)' },
];

function getRecommendation(
  situation: NonNullable<Situation>,
  skilledData: SkilledWorkerData,
  partnerData: PartnerSpouseData,
  studentData: StudentData,
  parentData: ParentData
): Recommendation {
  switch (situation) {
    case 'skilled_worker': {
      const age = parseInt(skilledData.age) || 0;
      if (age >= 18 && age <= 44 && (skilledData.englishLevel === 'proficient' || skilledData.englishLevel === 'superior')) {
        return {
          title: 'Skilled Independent (Subclass 189)',
          description:
            'Based on your profile, the Skilled Independent visa could be a strong option. You may also be eligible for State Nomination (190) or Skilled Regional (491) which have lower points thresholds.',
          route: '/dashboard',
          subclasses: '189, 190, 491',
          nextSteps: [
            'Check if your occupation is on the relevant skilled occupation list',
            'Get a skills assessment from the relevant assessing authority',
            'Use the Points Calculator to estimate your score',
            'Submit an EOI through SkillSelect',
          ],
        };
      }
      return {
        title: 'Skilled Migration Pathways',
        description:
          'You may be eligible for skilled migration. State nomination (190) and regional pathways (491) can offer alternative routes with lower requirements.',
        route: '/dashboard',
        subclasses: '189, 190, 491 -> 191',
        nextSteps: [
          'Check your occupation on the skilled occupation lists',
          'Obtain a skills assessment',
          'Consider improving English to Proficient level for more points',
          'Explore state nomination options for your occupation',
        ],
      };
    }

    case 'employer_sponsored':
      return {
        title: 'Employer Sponsored Pathways',
        description:
          'With an employer sponsor, you have access to direct PR pathways (186) or temporary-to-permanent routes (482 -> 186, 494 -> 191).',
        route: '/dashboard',
        subclasses: '186, 482, 494',
        nextSteps: [
          'Confirm your employer is an approved sponsor (or willing to become one)',
          'Check your occupation is on the employer-sponsored occupation list',
          'Obtain a skills assessment if required',
          'Determine which stream suits you: Direct Entry or Temporary Residence Transition',
        ],
      };

    case 'student': {
      if (studentData.prGoal === 'yes') {
        return {
          title: 'Student to PR Pathway',
          description:
            'Many students transition to PR through the Temporary Graduate visa (485) and then skilled migration. Your course level and field of study significantly affect your options.',
          route: '/student-visa',
          subclasses: '500, 485 -> 189/190/491',
          nextSteps: [
            'Ensure your course qualifies for a post-study work visa (485)',
            'Check if your occupation is on the skilled occupation list',
            'Plan your skills assessment during or after study',
            'Consider regional study for bonus points',
          ],
        };
      }
      return {
        title: 'Student Visa Information',
        description:
          'The student visa (500) allows you to study in Australia. If your goals change, there are multiple pathways to explore from a student visa.',
        route: '/student-visa',
        subclasses: '500, 485',
        nextSteps: [
          'Ensure you have a valid Confirmation of Enrolment (CoE)',
          'Arrange Overseas Student Health Cover (OSHC)',
          'Understand your visa conditions (work limits, attendance requirements)',
          'Explore post-study work options with the 485 visa',
        ],
      };
    }

    case 'partner_spouse': {
      if (partnerData.inAustralia === 'yes') {
        return {
          title: 'Onshore Partner Visa (820 -> 801)',
          description:
            'As you are in Australia with your partner, the onshore partner visa pathway is likely most suitable. This is a two-stage visa: temporary (820) then permanent (801).',
          route: '/partner-visa',
          subclasses: '820 -> 801',
          nextSteps: [
            'Gather evidence of your genuine and continuing relationship',
            'Ensure your sponsor meets eligibility requirements',
            'Prepare statutory declarations from friends and family',
            'Budget for the application fee (currently $9,095 AUD)',
          ],
        };
      }
      if (partnerData.relationshipType === 'engaged') {
        return {
          title: 'Prospective Marriage Visa (300)',
          description:
            'As an engaged couple, the Prospective Marriage visa allows you to enter Australia to marry your partner, then apply for the onshore partner visa.',
          route: '/partner-visa',
          subclasses: '300 -> 820 -> 801',
          nextSteps: [
            'Ensure you intend to marry within 9 months of visa grant',
            'Gather evidence of your genuine relationship',
            'Prepare a Notice of Intended Marriage (NOIM)',
            'Plan to lodge the partner visa (820) after marrying in Australia',
          ],
        };
      }
      return {
        title: 'Offshore Partner Visa (309 -> 100)',
        description:
          'Applying from outside Australia, the offshore partner visa pathway provides a temporary visa (309) followed by permanent residency (100).',
        route: '/partner-visa',
        subclasses: '309 -> 100',
        nextSteps: [
          'Gather comprehensive relationship evidence',
          'Ensure your Australian sponsor meets eligibility criteria',
          'Prepare for a possible interview at your nearest Australian embassy',
          'Budget for the application fee (currently $9,095 AUD)',
        ],
      };
    }

    case 'parent': {
      const totalChildren = parseInt(parentData.totalChildren) || 0;
      const childrenInAu = parseInt(parentData.childrenInAustralia) || 0;
      const passesBalanceOfFamily = totalChildren > 0 && childrenInAu >= Math.ceil(totalChildren / 2);

      if (!passesBalanceOfFamily && totalChildren > 0) {
        return {
          title: 'Parent Visa - Balance of Family Concern',
          description:
            'The Balance of Family test requires at least half of your children to live in Australia (or more children in Australia than any other single country). You may not currently meet this requirement. The temporary Sponsored Parent visa (870) does not require the Balance of Family test.',
          route: '/parent-visa',
          subclasses: '870, 103, 143',
          nextSteps: [
            'Review the Balance of Family test requirements in detail',
            'Consider the Sponsored Parent (Temporary) visa (870) as an alternative',
            'Consult a migration agent about your specific circumstances',
            'Explore whether any exemptions may apply',
          ],
        };
      }

      const parentAge = parseInt(parentData.parentAge) || 0;
      if (parentAge >= 67) {
        return {
          title: 'Aged Parent Visa Options',
          description:
            'As an aged parent (67+), you can apply onshore. The contributory pathway (864) has faster processing (~5-6 years) but higher cost (~$48,495). The non-contributory pathway (804) is cheaper (~$4,990) but has a 20-30+ year wait.',
          route: '/parent-visa',
          subclasses: '804, 864, 884 -> 864, 870',
          nextSteps: [
            'Decide between contributory (faster, higher cost) and non-contributory (slower, lower cost)',
            'Ensure your sponsoring child meets the Assurance of Support requirements',
            'Consider the 870 temporary visa for immediate access while waiting',
            'Compare costs using the Cost Calculator tool',
          ],
        };
      }

      return {
        title: 'Parent Visa Pathways',
        description:
          'Multiple parent visa options are available. Contributory visas (143) process faster (~5-6 years) at a higher cost (~$48,495). Non-contributory visas (103) cost less (~$4,990) but have 20-30+ year queues.',
        route: '/parent-visa',
        subclasses: '103, 143, 173 -> 143, 870',
        nextSteps: [
          'Review the Balance of Family test (you appear to pass)',
          'Choose between contributory and non-contributory pathways',
          'Consider the 870 temporary visa while waiting for a permanent visa',
          'Ensure your sponsoring child can meet Assurance of Support requirements',
        ],
      };
    }

    case 'business_investor':
      return {
        title: 'Business Innovation & Investment Pathway',
        description:
          'The Business Innovation and Investment visa (188 -> 888) offers pathways for business owners, investors, and entrepreneurs to gain PR through business activity in Australia.',
        route: '/dashboard',
        subclasses: '188 -> 888',
        nextSteps: [
          'Determine which stream suits you: Business Innovation, Investor, Significant Investor, or Entrepreneur',
          'Check state/territory nomination requirements',
          'Prepare evidence of your business or investment track record',
          'Engage a migration agent experienced in business visas',
        ],
      };

    case 'global_talent':
      return {
        title: 'Global Talent / Distinguished Talent',
        description:
          'The Global Talent visa (858) is for highly skilled individuals in target sectors including technology, health, financial services, and more. It offers fast-tracked PR without points testing.',
        route: '/dashboard',
        subclasses: '858',
        nextSteps: [
          'Confirm your field is in one of the 10 target sectors',
          'Secure a nominator who is prominent in your field',
          'Demonstrate your salary or earning potential meets the threshold',
          'Prepare evidence of internationally recognised achievements',
        ],
      };

    case 'nz_citizen':
      return {
        title: 'New Zealand Citizen Pathway',
        description:
          'NZ citizens have a special pathway to Australian PR through the 189 (NZ stream). If you have been living in Australia and meet income requirements, this is a straightforward route.',
        route: '/dashboard',
        subclasses: '189 (NZ stream)',
        nextSteps: [
          'Check if you meet the income threshold requirement',
          'Verify your period of residence in Australia',
          'Ensure you hold a Special Category Visa (subclass 444)',
          'Review character and health requirements',
        ],
      };

    case 'temporary_resident':
      return {
        title: 'Temporary to Permanent Pathways',
        description:
          'Already in Australia on a temporary visa? Multiple pathways exist depending on your current visa. Explore transition options from student, work, or bridging visas to permanent residency.',
        route: '/tr-pathway',
        subclasses: 'Various',
        nextSteps: [
          'Identify your current visa subclass and conditions',
          'Check if condition 8503 (No Further Stay) applies to you',
          'Review which PR pathways are available from your current visa',
          'Consider timing - some transitions require minimum periods',
        ],
      };

    case 'other':
    default:
      return {
        title: 'Explore All Visa Options',
        description:
          'Australia offers over 20 visa categories covering skilled migration, family, business, humanitarian, and other pathways. Browse all categories on the home page or use the tools below to learn more.',
        route: '/',
        subclasses: 'All categories',
        nextSteps: [
          'Browse all 22 visa categories on the home page',
          'Use the Cost Calculator to compare pathway costs',
          'Review the Timeline Estimator for processing expectations',
          'Consider consulting a MARA-registered migration agent',
        ],
      };
  }
}

export default function IntakePage() {
  const [step, setStep] = useState<'situation' | 'details' | 'result'>('situation');
  const [situation, setSituation] = useState<Situation>(null);

  const [skilledData, setSkilledData] = useState<SkilledWorkerData>({
    age: '',
    englishLevel: '',
    occupationField: '',
    yearsExperience: '',
    educationLevel: '',
    inAustralia: '',
  });

  const [partnerData, setPartnerData] = useState<PartnerSpouseData>({
    relationshipType: '',
    inAustralia: '',
    sponsorStatus: '',
  });

  const [studentData, setStudentData] = useState<StudentData>({
    courseLevel: '',
    hasCoE: '',
    prGoal: '',
  });

  const [parentData, setParentData] = useState<ParentData>({
    parentAge: '',
    childrenInAustralia: '',
    totalChildren: '',
  });

  const handleSituationSelect = (value: NonNullable<Situation>) => {
    setSituation(value);
    // Some situations skip the details step
    const skipDetails = ['employer_sponsored', 'business_investor', 'global_talent', 'nz_citizen', 'temporary_resident', 'other'];
    if (skipDetails.includes(value)) {
      setStep('result');
    } else {
      setStep('details');
    }
  };

  const handleDetailsComplete = () => {
    setStep('result');
  };

  const handleBack = () => {
    if (step === 'result') {
      const skipDetails = ['employer_sponsored', 'business_investor', 'global_talent', 'nz_citizen', 'temporary_resident', 'other'];
      if (situation && skipDetails.includes(situation)) {
        setStep('situation');
      } else {
        setStep('details');
      }
    } else if (step === 'details') {
      setStep('situation');
    }
  };

  const handleStartOver = () => {
    setStep('situation');
    setSituation(null);
    setSkilledData({ age: '', englishLevel: '', occupationField: '', yearsExperience: '', educationLevel: '', inAustralia: '' });
    setPartnerData({ relationshipType: '', inAustralia: '', sponsorStatus: '' });
    setStudentData({ courseLevel: '', hasCoE: '', prGoal: '' });
    setParentData({ parentAge: '', childrenInAustralia: '', totalChildren: '' });
  };

  const recommendation = situation ? getRecommendation(situation, skilledData, partnerData, studentData, parentData) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Your Visa Pathway</h1>
        <p className="text-gray-600 mt-2">
          Answer a few questions and we will recommend the most relevant visa pathways for your situation.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {['situation', 'details', 'result'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === s
                  ? 'bg-blue-700 text-white'
                  : ['situation', 'details', 'result'].indexOf(step) > i
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className={`w-12 sm:w-20 h-1 rounded ${
                  ['situation', 'details', 'result'].indexOf(step) > i ? 'bg-blue-300' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
        <div className="ml-4 text-sm text-gray-500">
          {step === 'situation' && 'Your Situation'}
          {step === 'details' && 'Details'}
          {step === 'result' && 'Recommendation'}
        </div>
      </div>

      {/* Step 1: Situation Selection */}
      {step === 'situation' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">What best describes your situation?</h2>
          <p className="text-sm text-gray-500 mb-6">Select the option that most closely matches your circumstances.</p>
          <div className="space-y-3">
            {situationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSituationSelect(option.value)}
                className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-150 ${
                  situation === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Follow-up Questions */}
      {step === 'details' && situation === 'skilled_worker' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Skilled Worker Details</h2>
          <p className="text-sm text-gray-500 mb-6">Help us narrow down the best skilled visa pathway for you.</p>
          <div className="space-y-5">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your age</label>
              <input
                type="number"
                min="0"
                max="99"
                placeholder="e.g. 30"
                value={skilledData.age}
                onChange={(e) => setSkilledData({ ...skilledData, age: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* English Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">English language level</label>
              <select
                value={skilledData.englishLevel}
                onChange={(e) => setSkilledData({ ...skilledData, englishLevel: e.target.value as EnglishLevel })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
              >
                <option value="">Select your level</option>
                <option value="competent">Competent (e.g. IELTS 6.0 each)</option>
                <option value="proficient">Proficient (e.g. IELTS 7.0 each)</option>
                <option value="superior">Superior (e.g. IELTS 8.0 each)</option>
              </select>
            </div>

            {/* Occupation Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation field</label>
              <select
                value={skilledData.occupationField}
                onChange={(e) => setSkilledData({ ...skilledData, occupationField: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
              >
                <option value="">Select your field</option>
                {occupationFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            {/* Years Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of relevant work experience</label>
              <input
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 5"
                value={skilledData.yearsExperience}
                onChange={(e) => setSkilledData({ ...skilledData, yearsExperience: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highest education level</label>
              <select
                value={skilledData.educationLevel}
                onChange={(e) => setSkilledData({ ...skilledData, educationLevel: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
              >
                <option value="">Select education level</option>
                {educationLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Currently in Australia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Are you currently in Australia?</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSkilledData({ ...skilledData, inAustralia: 'yes' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    skilledData.inAustralia === 'yes'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setSkilledData({ ...skilledData, inAustralia: 'no' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    skilledData.inAustralia === 'no'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleDetailsComplete}
                className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors"
              >
                See Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'details' && situation === 'partner_spouse' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Partner / Spouse Details</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us about your relationship and circumstances.</p>
          <div className="space-y-5">
            {/* Relationship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship type</label>
              <select
                value={partnerData.relationshipType}
                onChange={(e) => setPartnerData({ ...partnerData, relationshipType: e.target.value as RelationshipType })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
              >
                <option value="">Select relationship type</option>
                <option value="married">Married</option>
                <option value="de_facto">De facto</option>
                <option value="same_sex">Same-sex relationship</option>
                <option value="engaged">Engaged (not yet married)</option>
              </select>
            </div>

            {/* In Australia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Are you currently in Australia?</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPartnerData({ ...partnerData, inAustralia: 'yes' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    partnerData.inAustralia === 'yes'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setPartnerData({ ...partnerData, inAustralia: 'no' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    partnerData.inAustralia === 'no'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Sponsor Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your partner/sponsor&apos;s status</label>
              <select
                value={partnerData.sponsorStatus}
                onChange={(e) => setPartnerData({ ...partnerData, sponsorStatus: e.target.value as SponsorStatus })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
              >
                <option value="">Select sponsor status</option>
                <option value="au_citizen">Australian citizen</option>
                <option value="permanent_resident">Permanent resident</option>
                <option value="nz_citizen_eligible">Eligible NZ citizen</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleDetailsComplete}
                className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors"
              >
                See Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'details' && situation === 'student' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Student Details</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us about your study plans and goals.</p>
          <div className="space-y-5">
            {/* Course Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course level</label>
              <select
                value={studentData.courseLevel}
                onChange={(e) => setStudentData({ ...studentData, courseLevel: e.target.value as CourseLevel })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
              >
                <option value="">Select course level</option>
                <option value="certificate">Certificate (III / IV)</option>
                <option value="diploma">Diploma / Advanced Diploma</option>
                <option value="bachelors">Bachelor Degree</option>
                <option value="masters">Masters Degree</option>
                <option value="phd">Doctoral Degree (PhD)</option>
              </select>
            </div>

            {/* Has CoE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Do you have a Confirmation of Enrolment (CoE)?</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setStudentData({ ...studentData, hasCoE: 'yes' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    studentData.hasCoE === 'yes'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setStudentData({ ...studentData, hasCoE: 'no' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    studentData.hasCoE === 'no'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* PR Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Is permanent residency a goal?</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setStudentData({ ...studentData, prGoal: 'yes' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    studentData.prGoal === 'yes'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setStudentData({ ...studentData, prGoal: 'no' })}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    studentData.prGoal === 'no'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleDetailsComplete}
                className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors"
              >
                See Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'details' && situation === 'parent' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Parent Visa Details</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us about your family situation to find the right parent visa.</p>
          <div className="space-y-5">
            {/* Parent Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your age (the parent)</label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="e.g. 62"
                value={parentData.parentAge}
                onChange={(e) => setParentData({ ...parentData, parentAge: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Total Children */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total number of children (worldwide)</label>
              <input
                type="number"
                min="1"
                max="20"
                placeholder="e.g. 3"
                value={parentData.totalChildren}
                onChange={(e) => setParentData({ ...parentData, totalChildren: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Children in Australia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of children in Australia (citizens or PR)</label>
              <input
                type="number"
                min="0"
                max="20"
                placeholder="e.g. 2"
                value={parentData.childrenInAustralia}
                onChange={(e) => setParentData({ ...parentData, childrenInAustralia: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleDetailsComplete}
                className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors"
              >
                See Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Recommendation */}
      {step === 'result' && recommendation && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-md p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-blue-100 text-blue-700 rounded-full p-2 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{recommendation.title}</h2>
                <p className="text-sm text-blue-600 font-medium mt-0.5">
                  Subclass: {recommendation.subclasses}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{recommendation.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Recommended Next Steps</h3>
              <ol className="space-y-2">
                {recommendation.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-blue-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={recommendation.route}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition-colors"
              >
                Explore This Pathway
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/cost-calculator"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Estimate Costs
              </Link>
              <Link
                href="/timeline"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Timeline
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStartOver}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
            <p>
              <strong>Important:</strong> This recommendation is based on general information and your
              responses. Individual circumstances vary. Always consult a MARA-registered migration agent
              for personalised advice before making any visa decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
