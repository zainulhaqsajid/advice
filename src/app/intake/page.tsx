'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { submitAssessment, submitBooking } from './actions';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

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
  | 'visitor'
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

interface VisitorData {
  purpose: string;
  duration: string;
  nationality: string;
}

interface Recommendation {
  title: string;
  description: string;
  route: string;
  subclasses: string;
  nextSteps: string[];
}

interface ContactData {
  email: string;
  full_name: string;
  phone: string;
}

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  consultationType: 'video' | 'phone' | 'in_person';
  preferredDate: string;
  preferredTime: string;
  visaCategory: string;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const situationOptions: { value: NonNullable<Situation>; label: string }[] = [
  { value: 'skilled_worker', label: "I'm a skilled worker looking for PR" },
  { value: 'employer_sponsored', label: 'I have an employer sponsor in Australia' },
  { value: 'student', label: "I'm an international student" },
  { value: 'partner_spouse', label: "I'm in a relationship with an AU citizen/PR" },
  { value: 'parent', label: 'My child is an AU citizen/PR' },
  { value: 'business_investor', label: "I'm a business owner/investor" },
  { value: 'global_talent', label: 'I have exceptional talent/achievements' },
  { value: 'nz_citizen', label: "I'm a NZ citizen living in Australia" },
  { value: 'temporary_resident', label: "I'm already in Australia on a temporary visa" },
  { value: 'visitor', label: 'I want to visit Australia (tourist/business)' },
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

const SKIP_DETAILS: NonNullable<Situation>[] = [
  'employer_sponsored',
  'business_investor',
  'global_talent',
  'nz_citizen',
  'temporary_resident',
  'other',
];

type Step = 'situation' | 'details' | 'contact' | 'result';

const STEPS: { key: Step; label: string }[] = [
  { key: 'situation', label: 'Situation' },
  { key: 'details', label: 'Details' },
  { key: 'contact', label: 'Contact' },
  { key: 'result', label: 'Results' },
];

/* -------------------------------------------------------------------------- */
/*  Recommendation Logic                                                      */
/* -------------------------------------------------------------------------- */

function getRecommendation(
  situation: NonNullable<Situation>,
  skilledData: SkilledWorkerData,
  partnerData: PartnerSpouseData,
  studentData: StudentData,
  parentData: ParentData,
  visitorData: VisitorData,
): Recommendation {
  switch (situation) {
    case 'skilled_worker': {
      const age = parseInt(skilledData.age) || 0;
      if (
        age >= 18 &&
        age <= 44 &&
        (skilledData.englishLevel === 'proficient' || skilledData.englishLevel === 'superior')
      ) {
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
      const passesBalanceOfFamily =
        totalChildren > 0 && childrenInAu >= Math.ceil(totalChildren / 2);

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

    case 'visitor': {
      if (visitorData.duration === 'long' || visitorData.duration === 'extended') {
        return {
          title: 'Visitor Visa (Subclass 600)',
          description:
            'For stays over 3 months, a full Visitor visa (Subclass 600) is required regardless of your nationality. This visa allows stays of up to 12 months and covers tourism, business visits, and visiting family. Processing times are typically 20-30 days.',
          route: '/',
          subclasses: '600',
          nextSteps: [
            'Determine the correct stream: Tourist, Business Visitor, or Sponsored Family',
            'Gather supporting documents (proof of funds, travel itinerary, health insurance)',
            'Apply online through ImmiAccount',
            'Allow adequate processing time before your planned travel date',
          ],
        };
      }
      return {
        title: 'Electronic Travel Authority / eVisitor',
        description:
          'For short stays under 3 months, eligible passport holders can apply for an Electronic Travel Authority (Subclass 601) or eVisitor (Subclass 651). These are free or low-cost and typically processed within minutes. If your passport is not eligible for these, you will need the Visitor visa (Subclass 600).',
        route: '/',
        subclasses: '601, 651, 600',
        nextSteps: [
          'Check if your passport qualifies for ETA (601) or eVisitor (651)',
          'Apply online - ETA through the Australian ETA app, eVisitor through ImmiAccount',
          'If not eligible for 601/651, apply for the Visitor visa (Subclass 600)',
          'Ensure your passport is valid for at least 6 months beyond your intended stay',
        ],
      };
    }

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

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function IntakePage() {
  const { user, isAuthenticated, saveReport } = useAuth();

  /* -- Today's date (avoid hydration mismatch) ----------------------------- */
  const [todayStr, setTodayStr] = useState('');
  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  /* -- Wizard state -------------------------------------------------------- */
  const [step, setStep] = useState<Step>('situation');
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

  const [visitorData, setVisitorData] = useState<VisitorData>({
    purpose: '',
    duration: '',
    nationality: '',
  });

  const [contactData, setContactData] = useState<ContactData>({
    email: user?.email || '',
    full_name: user?.name || '',
    phone: user?.phone || '',
  });

  /* -- Submission / feedback state ----------------------------------------- */
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    fullName: contactData.full_name || user?.name || '',
    email: contactData.email || user?.email || '',
    phone: contactData.phone || user?.phone || '',
    consultationType: 'video',
    preferredDate: '',
    preferredTime: '',
    visaCategory: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  /* -- Derived ------------------------------------------------------------- */
  const recommendation = situation
    ? getRecommendation(situation, skilledData, partnerData, studentData, parentData, visitorData)
    : null;

  const hasDetails = situation !== null && !SKIP_DETAILS.includes(situation);

  /** The ordered list of steps this user actually sees */
  const activeSteps: Step[] = hasDetails
    ? ['situation', 'details', 'contact', 'result']
    : ['situation', 'contact', 'result'];

  const currentStepIndex = activeSteps.indexOf(step);

  /* -- Navigation ---------------------------------------------------------- */
  const handleSituationSelect = (value: NonNullable<Situation>) => {
    setSituation(value);
    const skip = SKIP_DETAILS.includes(value);
    setStep(skip ? 'contact' : 'details');
  };

  const handleDetailsComplete = () => {
    setStep('contact');
  };

  const handleContactSubmit = async () => {
    setAssessmentLoading(true);
    setAssessmentError(null);

    // Build form_data based on the situation type
    const formDataMap: Record<string, unknown> = {};
    if (situation === 'skilled_worker') formDataMap.skilledData = skilledData;
    if (situation === 'partner_spouse') formDataMap.partnerData = partnerData;
    if (situation === 'student') formDataMap.studentData = studentData;
    if (situation === 'parent') formDataMap.parentData = parentData;
    if (situation === 'visitor') formDataMap.visitorData = visitorData;

    const payload = {
      situation: situation || '',
      email: contactData.email || undefined,
      full_name: contactData.full_name || undefined,
      phone: contactData.phone || undefined,
      form_data: formDataMap,
      recommended_visa: recommendation?.subclasses || undefined,
      points_score: undefined as number | undefined,
    };

    try {
      const result = await submitAssessment(payload);
      if (result.assessment) {
        setAssessmentSubmitted(true);
      } else {
        // Log but don't block — user still sees results
        console.warn('Assessment save failed:', result.error);
      }
    } catch {
      // Server action failed — still show results (graceful degradation)
      console.warn('Assessment save unreachable, proceeding to results');
    }

    // Always proceed to results — the assessment is for the user, DB save is for CRM
    setStep('result');
    setAssessmentLoading(false);
  };

  const handleSkipContact = () => {
    setStep('result');
  };

  const handleBack = () => {
    const idx = activeSteps.indexOf(step);
    if (idx > 0) {
      setStep(activeSteps[idx - 1]);
    }
  };

  const handleStartOver = () => {
    setStep('situation');
    setSituation(null);
    setSkilledData({ age: '', englishLevel: '', occupationField: '', yearsExperience: '', educationLevel: '', inAustralia: '' });
    setPartnerData({ relationshipType: '', inAustralia: '', sponsorStatus: '' });
    setStudentData({ courseLevel: '', hasCoE: '', prGoal: '' });
    setParentData({ parentAge: '', childrenInAustralia: '', totalChildren: '' });
    setVisitorData({ purpose: '', duration: '', nationality: '' });
    setContactData({ email: user?.email || '', full_name: user?.name || '', phone: user?.phone || '' });
    setAssessmentSubmitted(false);
    setAssessmentError(null);
    setSaveSuccess(false);
    setSaveError(null);
    setBookingSuccess(false);
    setBookingError(null);
  };

  /* -- Save to dashboard --------------------------------------------------- */
  const handleSaveToDashboard = async () => {
    if (!recommendation) return;
    setSaveLoading(true);
    setSaveError(null);
    try {
      await saveReport({
        type: 'intake',
        title: recommendation.title,
        pathway: recommendation.subclasses,
        data: {
          situation,
          recommendation,
          contactData,
          skilledData: situation === 'skilled_worker' ? skilledData : undefined,
          partnerData: situation === 'partner_spouse' ? partnerData : undefined,
          studentData: situation === 'student' ? studentData : undefined,
          parentData: situation === 'parent' ? parentData : undefined,
          visitorData: situation === 'visitor' ? visitorData : undefined,
        },
      });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save report');
    } finally {
      setSaveLoading(false);
    }
  };

  /* -- PDF / Print --------------------------------------------------------- */
  const handleDownloadPDF = () => {
    window.print();
  };

  /* -- Booking submit ------------------------------------------------------ */
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);

    try {
      const result = await submitBooking({
        full_name: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone || undefined,
        consultation_type: bookingForm.consultationType,
        preferred_date: bookingForm.preferredDate,
        preferred_time: bookingForm.preferredTime,
        visa_category: recommendation?.subclasses || bookingForm.visaCategory || undefined,
        notes: bookingForm.notes || undefined,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBookingLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*  Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-report,
          .print-report * {
            visibility: visible;
          }
          .print-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-8 no-print">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Visa Pathway</h1>
          <p className="text-gray-600 mt-2">
            Answer a few questions and we will recommend the most relevant visa pathways for your
            situation.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            /* Hide the "Details" dot when the situation skips details */
            if (s.key === 'details' && !hasDetails && situation !== null) return null;

            const activeIdx = activeSteps.indexOf(s.key);
            const isCurrent = step === s.key;
            const isCompleted = activeIdx !== -1 && activeIdx < currentStepIndex;

            return (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-blue-700 text-white'
                      : isCompleted
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    activeIdx !== -1 ? activeIdx + 1 : i + 1
                  )}
                </div>
                {/* Connector line - show between items except last */}
                {i < STEPS.length - 1 && !(s.key === 'details' && !hasDetails && situation !== null) && (
                  <div
                    className={`w-8 sm:w-16 h-1 rounded transition-colors ${
                      isCompleted ? 'bg-blue-300' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
          <div className="ml-4 text-sm text-gray-500">
            {step === 'situation' && 'Your Situation'}
            {step === 'details' && 'Details'}
            {step === 'contact' && 'Contact'}
            {step === 'result' && 'Results'}
          </div>
        </div>

        {/* ================================================================== */}
        {/*  STEP 1: SITUATION SELECTION                                        */}
        {/* ================================================================== */}
        {step === 'situation' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              What best describes your situation?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select the option that most closely matches your circumstances.
            </p>
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

        {/* ================================================================== */}
        {/*  STEP 2: DETAILS                                                    */}
        {/* ================================================================== */}

        {/* --- Skilled Worker ------------------------------------------------ */}
        {step === 'details' && situation === 'skilled_worker' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Skilled Worker Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Help us narrow down the best skilled visa pathway for you.
            </p>
            <div className="space-y-5">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English language level
                </label>
                <select
                  value={skilledData.englishLevel}
                  onChange={(e) =>
                    setSkilledData({ ...skilledData, englishLevel: e.target.value as EnglishLevel })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                >
                  <option value="">Select your level</option>
                  <option value="competent">Competent (e.g. IELTS 6.0 each)</option>
                  <option value="proficient">Proficient (e.g. IELTS 7.0 each)</option>
                  <option value="superior">Superior (e.g. IELTS 8.0 each)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation field
                </label>
                <select
                  value={skilledData.occupationField}
                  onChange={(e) =>
                    setSkilledData({ ...skilledData, occupationField: e.target.value })
                  }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of relevant work experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g. 5"
                  value={skilledData.yearsExperience}
                  onChange={(e) =>
                    setSkilledData({ ...skilledData, yearsExperience: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highest education level
                </label>
                <select
                  value={skilledData.educationLevel}
                  onChange={(e) =>
                    setSkilledData({ ...skilledData, educationLevel: e.target.value })
                  }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you currently in Australia?
                </label>
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
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Partner / Spouse ---------------------------------------------- */}
        {step === 'details' && situation === 'partner_spouse' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Partner / Spouse Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Tell us about your relationship and circumstances.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship type
                </label>
                <select
                  value={partnerData.relationshipType}
                  onChange={(e) =>
                    setPartnerData({
                      ...partnerData,
                      relationshipType: e.target.value as RelationshipType,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                >
                  <option value="">Select relationship type</option>
                  <option value="married">Married</option>
                  <option value="de_facto">De facto</option>
                  <option value="same_sex">Same-sex relationship</option>
                  <option value="engaged">Engaged (not yet married)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you currently in Australia?
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your partner/sponsor&apos;s status
                </label>
                <select
                  value={partnerData.sponsorStatus}
                  onChange={(e) =>
                    setPartnerData({
                      ...partnerData,
                      sponsorStatus: e.target.value as SponsorStatus,
                    })
                  }
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
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Student ------------------------------------------------------- */}
        {step === 'details' && situation === 'student' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Student Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Tell us about your study plans and goals.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course level
                </label>
                <select
                  value={studentData.courseLevel}
                  onChange={(e) =>
                    setStudentData({ ...studentData, courseLevel: e.target.value as CourseLevel })
                  }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you have a Confirmation of Enrolment (CoE)?
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is permanent residency a goal?
                </label>
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
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Parent -------------------------------------------------------- */}
        {step === 'details' && situation === 'parent' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Parent Visa Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Tell us about your family situation to find the right parent visa.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your age (the parent)
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total number of children (worldwide)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="e.g. 3"
                  value={parentData.totalChildren}
                  onChange={(e) =>
                    setParentData({ ...parentData, totalChildren: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of children in Australia (citizens or PR)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  placeholder="e.g. 2"
                  value={parentData.childrenInAustralia}
                  onChange={(e) =>
                    setParentData({ ...parentData, childrenInAustralia: e.target.value })
                  }
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
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Visitor ------------------------------------------------------- */}
        {step === 'details' && situation === 'visitor' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Visitor Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Tell us about your planned visit to Australia.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose of visit
                </label>
                <select
                  value={visitorData.purpose}
                  onChange={(e) => setVisitorData({ ...visitorData, purpose: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                >
                  <option value="">Select purpose</option>
                  <option value="tourism">Tourism / Holiday</option>
                  <option value="business">Business visit</option>
                  <option value="medical">Medical treatment</option>
                  <option value="event">Attending an event / conference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intended duration of stay
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'short', label: 'Under 3 months' },
                    { value: 'medium', label: '3 - 6 months' },
                    { value: 'long', label: '6 - 12 months' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setVisitorData({ ...visitorData, duration: opt.value })}
                      className={`w-full text-left px-5 py-3 rounded-lg border-2 transition-all duration-150 ${
                        visitorData.duration === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passport nationality
                </label>
                <select
                  value={visitorData.nationality}
                  onChange={(e) => setVisitorData({ ...visitorData, nationality: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                >
                  <option value="">Select nationality</option>
                  <optgroup label="ETA Eligible (Subclass 601)">
                    <option value="us">United States</option>
                    <option value="canada">Canada</option>
                    <option value="japan">Japan</option>
                    <option value="south_korea">South Korea</option>
                    <option value="singapore">Singapore</option>
                    <option value="malaysia">Malaysia</option>
                    <option value="brunei">Brunei</option>
                    <option value="hong_kong">Hong Kong SAR</option>
                  </optgroup>
                  <optgroup label="eVisitor Eligible (Subclass 651)">
                    <option value="uk">United Kingdom</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="italy">Italy</option>
                    <option value="spain">Spain</option>
                    <option value="netherlands">Netherlands</option>
                    <option value="ireland">Ireland</option>
                    <option value="sweden">Sweden</option>
                    <option value="eu_other">Other EU/EEA country</option>
                  </optgroup>
                  <optgroup label="Visitor Visa Required (Subclass 600)">
                    <option value="india">India</option>
                    <option value="china">China</option>
                    <option value="philippines">Philippines</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="indonesia">Indonesia</option>
                    <option value="brazil">Brazil</option>
                    <option value="other">Other country</option>
                  </optgroup>
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
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  STEP 3: EMAIL / CONTACT CAPTURE                                   */}
        {/* ================================================================== */}
        {step === 'contact' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Get Your Personalized Report</h2>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Enter your details to receive a detailed PDF report with your visa pathway
                recommendation, next steps, and estimated costs.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={contactData.full_name}
                  onChange={(e) => setContactData({ ...contactData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+61 400 000 000"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {assessmentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {assessmentError}
                </div>
              )}

              <button
                onClick={handleContactSubmit}
                disabled={!contactData.email || assessmentLoading}
                className="w-full px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {assessmentLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Get Your Free Assessment'
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleSkipContact}
                  className="text-sm text-gray-500 hover:text-blue-600 underline transition-colors"
                >
                  Skip and view results
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  STEP 4: RESULTS                                                    */}
        {/* ================================================================== */}
        {step === 'result' && recommendation && (
          <div className="space-y-6">
            {/* --- Recommendation Card --------------------------------------- */}
            <div className="bg-white rounded-xl border-2 border-blue-200 shadow-md p-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-100 text-blue-700 rounded-full p-2 flex-shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
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

              {/* Next Steps */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Recommended Next Steps
                </h3>
                <ol className="space-y-2">
                  {recommendation.nextSteps.map((ns, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="bg-blue-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 text-sm">{ns}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={recommendation.route}
                  className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition-colors"
                >
                  Explore This Pathway
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
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

            {/* --- Save to Dashboard ----------------------------------------- */}
            {isAuthenticated && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Save to Dashboard</h3>
                    <p className="text-sm text-gray-500">
                      Keep this assessment in your account for future reference.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveToDashboard}
                    disabled={saveLoading || saveSuccess}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      saveSuccess
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50'
                    }`}
                  >
                    {saveLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Saved
                      </>
                    ) : (
                      'Save Report'
                    )}
                  </button>
                </div>
                {saveError && (
                  <p className="mt-2 text-sm text-red-600">{saveError}</p>
                )}
              </div>
            )}

            {/* --- Navigation ------------------------------------------------ */}
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

            {/* --- Disclaimer ------------------------------------------------ */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
              <p>
                <strong>Important:</strong> This recommendation is based on general information and
                your responses. Individual circumstances vary. Always consult a MARA-registered
                migration agent for personalised advice before making any visa decisions.
              </p>
            </div>

            {/* ============================================================== */}
            {/*  CONSULTATION CTA                                               */}
            {/* ============================================================== */}
            <div id="consultation" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-700 px-8 py-6">
                <h3 className="text-xl font-bold text-white">
                  Talk to a MARA-Registered Migration Agent
                </h3>
                <p className="text-blue-100 mt-1 text-sm">
                  Get expert advice tailored to your specific circumstances. All our agents are
                  registered with the Migration Agents Registration Authority.
                </p>
              </div>

              <div className="p-8">
                {/* Consultation type cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    {
                      type: 'video' as const,
                      label: 'Video Call',
                      price: '$150',
                      desc: '45-min video consultation',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ),
                    },
                    {
                      type: 'phone' as const,
                      label: 'Phone Call',
                      price: '$100',
                      desc: '30-min phone consultation',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                    },
                    {
                      type: 'in_person' as const,
                      label: 'In Person',
                      price: '$200',
                      desc: '60-min office consultation',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                    },
                  ].map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, consultationType: opt.type })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        bookingForm.consultationType === opt.type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className={`mb-2 ${bookingForm.consultationType === opt.type ? 'text-blue-700' : 'text-gray-500'}`}>
                        {opt.icon}
                      </div>
                      <p className="font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-blue-700 font-bold text-lg">{opt.price}</p>
                      <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Booking form */}
                {bookingSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <svg
                      className="w-12 h-12 text-green-500 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h4 className="text-lg font-semibold text-green-800">
                      Booking Request Submitted
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      We will confirm your appointment within 1 business day via email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingForm.fullName}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, fullName: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingForm.email}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, email: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          value={bookingForm.phone}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, phone: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visa category
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={recommendation?.subclasses || ''}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          min={todayStr}
                          value={bookingForm.preferredDate}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, preferredDate: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred time <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={bookingForm.preferredTime}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, preferredTime: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                        >
                          <option value="">Select time</option>
                          <option value="morning">Morning (9am - 12pm)</option>
                          <option value="afternoon">Afternoon (12pm - 5pm)</option>
                          <option value="evening">Evening (5pm - 8pm)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional notes <span className="text-gray-400">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Any specific questions or details about your situation..."
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, notes: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
                      />
                    </div>

                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                        {bookingError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {bookingLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        `Book ${
                          bookingForm.consultationType === 'video'
                            ? 'Video'
                            : bookingForm.consultationType === 'phone'
                            ? 'Phone'
                            : 'In-Person'
                        } Consultation`
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/*  PRINT-ONLY REPORT                                                  */}
      {/* ================================================================== */}
      {recommendation && (
        <div className="print-report hidden">
          <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>
              Visa Pathway Assessment Report
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Generated on {todayStr ? new Date(todayStr).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              {contactData.full_name ? ` for ${contactData.full_name}` : ''}
            </p>

            <hr style={{ borderColor: '#e5e7eb', marginBottom: '24px' }} />

            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
              {recommendation.title}
            </h2>
            <p style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>
              Subclass: {recommendation.subclasses}
            </p>
            <p style={{ lineHeight: 1.6, marginBottom: '24px' }}>
              {recommendation.description}
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              Recommended Next Steps
            </h3>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              {recommendation.nextSteps.map((ns, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {ns}
                </li>
              ))}
            </ol>

            <hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              Your Assessment Details
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 500, width: '40%' }}>
                    Situation
                  </td>
                  <td style={{ padding: '8px 0' }}>
                    {situationOptions.find((o) => o.value === situation)?.label || situation}
                  </td>
                </tr>
                {situation === 'skilled_worker' && (
                  <>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Age</td>
                      <td style={{ padding: '8px 0' }}>{skilledData.age || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>English Level</td>
                      <td style={{ padding: '8px 0' }}>
                        {skilledData.englishLevel || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Occupation</td>
                      <td style={{ padding: '8px 0' }}>
                        {skilledData.occupationField || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Experience</td>
                      <td style={{ padding: '8px 0' }}>
                        {skilledData.yearsExperience
                          ? `${skilledData.yearsExperience} years`
                          : 'Not provided'}
                      </td>
                    </tr>
                  </>
                )}
                {situation === 'partner_spouse' && (
                  <>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Relationship</td>
                      <td style={{ padding: '8px 0' }}>
                        {partnerData.relationshipType || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>In Australia</td>
                      <td style={{ padding: '8px 0' }}>
                        {partnerData.inAustralia || 'Not provided'}
                      </td>
                    </tr>
                  </>
                )}
                {situation === 'student' && (
                  <>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Course Level</td>
                      <td style={{ padding: '8px 0' }}>
                        {studentData.courseLevel || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>PR Goal</td>
                      <td style={{ padding: '8px 0' }}>
                        {studentData.prGoal || 'Not provided'}
                      </td>
                    </tr>
                  </>
                )}
                {situation === 'parent' && (
                  <>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Parent Age</td>
                      <td style={{ padding: '8px 0' }}>
                        {parentData.parentAge || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Children in AU</td>
                      <td style={{ padding: '8px 0' }}>
                        {parentData.childrenInAustralia || 'Not provided'} of{' '}
                        {parentData.totalChildren || 'Not provided'}
                      </td>
                    </tr>
                  </>
                )}
                {situation === 'visitor' && (
                  <>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Purpose</td>
                      <td style={{ padding: '8px 0' }}>
                        {visitorData.purpose || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Duration</td>
                      <td style={{ padding: '8px 0' }}>
                        {visitorData.duration || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Nationality</td>
                      <td style={{ padding: '8px 0' }}>
                        {visitorData.nationality || 'Not provided'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />

            <p style={{ fontSize: '12px', color: '#9ca3af' }}>
              Disclaimer: This assessment is for informational purposes only and does not constitute
              legal advice. Individual circumstances vary. Always consult a MARA-registered migration
              agent for personalised advice before making any visa decisions.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
