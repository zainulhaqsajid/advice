'use client';

import { useState } from 'react';

const VISA_PATHWAYS = [
  { value: 'sc189', label: 'Skilled Independent (SC 189)' },
  { value: 'sc190', label: 'Skilled Nominated (SC 190)' },
  { value: 'sc491', label: 'Skilled Regional (SC 491)' },
  { value: 'sc820801', label: 'Partner Visa Onshore (SC 820/801)' },
  { value: 'sc309100', label: 'Partner Visa Offshore (SC 309/100)' },
  { value: 'sc103804', label: 'Parent Visa (SC 103/804)' },
  { value: 'sc143864', label: 'Contributory Parent (SC 143/864)' },
  { value: 'sc500', label: 'Student Visa (SC 500)' },
  { value: 'sc186482', label: 'Employer Sponsored (SC 186/482)' },
  { value: 'sc485', label: 'Temporary Graduate (SC 485)' },
];

interface ChecklistItem {
  id: string;
  name: string;
  helpText?: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

const UNIVERSAL_DOCUMENTS: ChecklistItem[] = [
  {
    id: 'passport',
    name: 'Valid passport (all pages scanned)',
    helpText:
      'Include biodata page, all stamped pages, and any blank pages. Passport must be valid for at least 6 months.',
  },
  {
    id: 'photos',
    name: 'Passport-size photographs (45mm x 35mm)',
    helpText:
      'Recent photos taken within the last 6 months. White background, neutral expression, no glasses.',
  },
  {
    id: 'birth-cert',
    name: 'Birth certificate (certified translation if not in English)',
    helpText:
      'Must be an official government-issued certificate. Translations must be done by a NAATI-accredited translator.',
  },
  {
    id: 'national-id',
    name: 'National ID card',
  },
  {
    id: 'police-clearance',
    name: 'Police clearance certificates (from every country lived in 12+ months since age 16)',
    helpText:
      'Must be obtained from each country where you have lived for 12 or more months since turning 16. Some countries have lengthy processing times, so apply early.',
  },
  {
    id: 'health-exam',
    name: 'Health examination results (from panel physician)',
    helpText:
      'Must be completed by a Bupa Medical Visa Services panel physician. Book via the ImmiAccount HAP ID. Results are valid for 12 months.',
  },
  {
    id: 'form80',
    name: 'Form 80 (Personal particulars for assessment including character assessment)',
    helpText:
      'Form 80 may be requested by the case officer. It covers your personal history, travel, employment, and education over the past 10 years.',
  },
  {
    id: 'form1221',
    name: 'Form 1221 (Additional personal particulars information)',
    helpText:
      'Form 1221 may be requested as a supplementary form. It includes additional questions about your intended activities in Australia.',
  },
];

const PATHWAY_DOCUMENTS: Record<string, ChecklistSection[]> = {
  sc189: [
    {
      title: 'Skills Assessment',
      items: [
        {
          id: 'skills-assessment',
          name: 'Positive skills assessment from relevant assessing authority',
          helpText:
            'The assessing authority depends on your nominated occupation. For example, Engineers Australia for engineers, ACS for IT professionals, VETASSESS for many general professional occupations.',
        },
        {
          id: 'skills-assessment-letter',
          name: 'Skills assessment outcome letter',
        },
      ],
    },
    {
      title: 'Qualifications',
      items: [
        {
          id: 'degree-certs',
          name: 'Degree certificates and academic transcripts',
          helpText: 'Include all tertiary qualifications. Certified copies required.',
        },
        {
          id: 'qualification-translations',
          name: 'Certified translations of qualifications (if not in English)',
        },
        {
          id: 'aqf-assessment',
          name: 'Australian qualification equivalency assessment (if applicable)',
        },
      ],
    },
    {
      title: 'Employment Evidence',
      items: [
        {
          id: 'employment-refs',
          name: 'Employment reference letters (on company letterhead)',
          helpText:
            'Each letter must state your position title, duties performed, hours worked per week, salary, and period of employment. Must be signed by a direct supervisor or HR manager.',
        },
        {
          id: 'payslips',
          name: 'Payslips or salary statements (recent 12 months minimum)',
        },
        {
          id: 'tax-records',
          name: 'Tax records or income tax returns',
        },
        {
          id: 'contracts',
          name: 'Employment contracts',
        },
      ],
    },
    {
      title: 'English Language',
      items: [
        {
          id: 'english-test',
          name: 'English language test results (IELTS, PTE, TOEFL, CAE, OET)',
          helpText:
            'Test results are generally valid for 3 years from the test date. Competent English minimum required; higher scores earn additional points.',
        },
      ],
    },
    {
      title: 'Points Evidence',
      items: [
        {
          id: 'age-evidence',
          name: 'Evidence of age (passport or birth certificate)',
        },
        {
          id: 'partner-skills',
          name: 'Partner skills assessment and English test (if claiming partner points)',
        },
        {
          id: 'australian-study',
          name: 'Evidence of Australian study requirement (if claiming)',
          helpText: 'Completion letter, transcripts, and CRICOS registration confirmation.',
        },
        {
          id: 'regional-study',
          name: 'Evidence of regional study (if claiming)',
        },
        {
          id: 'community-language',
          name: 'NAATI credential (if claiming community language points)',
        },
        {
          id: 'professional-year',
          name: 'Professional Year completion certificate (if claiming)',
        },
      ],
    },
  ],
  sc190: [
    {
      title: 'State/Territory Nomination',
      items: [
        {
          id: 'nomination-approval',
          name: 'State or territory nomination approval letter',
          helpText:
            'You must receive an invitation from a state or territory government before you can apply. Each state has different occupation lists and requirements.',
        },
        {
          id: 'commitment-statement',
          name: 'Commitment to reside in nominating state/territory',
        },
      ],
    },
    {
      title: 'Skills Assessment',
      items: [
        {
          id: 'skills-assessment',
          name: 'Positive skills assessment from relevant assessing authority',
          helpText:
            'The assessing authority depends on your nominated occupation.',
        },
        {
          id: 'skills-assessment-letter',
          name: 'Skills assessment outcome letter',
        },
      ],
    },
    {
      title: 'Qualifications',
      items: [
        {
          id: 'degree-certs',
          name: 'Degree certificates and academic transcripts',
        },
        {
          id: 'qualification-translations',
          name: 'Certified translations of qualifications (if not in English)',
        },
      ],
    },
    {
      title: 'Employment Evidence',
      items: [
        {
          id: 'employment-refs',
          name: 'Employment reference letters (on company letterhead)',
          helpText:
            'Each letter must state your position title, duties performed, hours worked per week, salary, and period of employment.',
        },
        {
          id: 'payslips',
          name: 'Payslips or salary statements',
        },
        {
          id: 'tax-records',
          name: 'Tax records or income tax returns',
        },
        {
          id: 'contracts',
          name: 'Employment contracts',
        },
      ],
    },
    {
      title: 'English Language',
      items: [
        {
          id: 'english-test',
          name: 'English language test results (IELTS, PTE, TOEFL, CAE, OET)',
          helpText: 'Test results are generally valid for 3 years from the test date.',
        },
      ],
    },
    {
      title: 'Points Evidence',
      items: [
        {
          id: 'age-evidence',
          name: 'Evidence of age (passport or birth certificate)',
        },
        {
          id: 'partner-skills',
          name: 'Partner skills assessment and English test (if claiming partner points)',
        },
        {
          id: 'australian-study',
          name: 'Evidence of Australian study requirement (if claiming)',
        },
        {
          id: 'professional-year',
          name: 'Professional Year completion certificate (if claiming)',
        },
      ],
    },
  ],
  sc491: [
    {
      title: 'State/Territory or Family Nomination',
      items: [
        {
          id: 'nomination-approval',
          name: 'State/territory nomination approval or family sponsorship approval',
          helpText:
            'SC 491 can be sponsored by a state/territory government or an eligible relative living in a designated regional area.',
        },
        {
          id: 'regional-commitment',
          name: 'Commitment to live and work in a designated regional area',
        },
        {
          id: 'family-sponsor-docs',
          name: 'Family sponsor evidence (if family sponsored): proof of relationship, sponsor residence in regional area',
        },
      ],
    },
    {
      title: 'Skills Assessment',
      items: [
        {
          id: 'skills-assessment',
          name: 'Positive skills assessment from relevant assessing authority',
        },
        {
          id: 'skills-assessment-letter',
          name: 'Skills assessment outcome letter',
        },
      ],
    },
    {
      title: 'Qualifications',
      items: [
        {
          id: 'degree-certs',
          name: 'Degree certificates and academic transcripts',
        },
        {
          id: 'qualification-translations',
          name: 'Certified translations of qualifications (if not in English)',
        },
      ],
    },
    {
      title: 'Employment Evidence',
      items: [
        {
          id: 'employment-refs',
          name: 'Employment reference letters (on company letterhead)',
        },
        {
          id: 'payslips',
          name: 'Payslips or salary statements',
        },
        {
          id: 'tax-records',
          name: 'Tax records or income tax returns',
        },
      ],
    },
    {
      title: 'English Language',
      items: [
        {
          id: 'english-test',
          name: 'English language test results (IELTS, PTE, TOEFL, CAE, OET)',
        },
      ],
    },
    {
      title: 'Points Evidence',
      items: [
        {
          id: 'age-evidence',
          name: 'Evidence of age (passport or birth certificate)',
        },
        {
          id: 'partner-skills',
          name: 'Partner skills assessment and English test (if claiming partner points)',
        },
      ],
    },
  ],
  sc820801: [
    {
      title: 'Relationship Evidence',
      items: [
        {
          id: 'relationship-statement',
          name: 'Statutory declaration detailing the history of your relationship',
          helpText:
            'A comprehensive statement covering how you met, development of the relationship, commitment to a shared life, and future plans.',
        },
        {
          id: 'form888',
          name: 'Form 888 - Statutory declarations from two Australian citizens or permanent residents',
          helpText:
            'Two separate Form 888s from people who know your relationship personally. They must be Australian citizens or permanent residents.',
        },
        {
          id: 'financial-evidence',
          name: 'Financial evidence: joint bank accounts, shared expenses, joint loans or leases',
        },
        {
          id: 'household-evidence',
          name: 'Household evidence: joint lease/mortgage, shared bills, mail to same address',
        },
        {
          id: 'social-evidence',
          name: 'Social evidence: joint travel itineraries, photos together at events, social media evidence',
        },
        {
          id: 'commitment-evidence',
          name: 'Commitment evidence: wills naming each other, superannuation beneficiary nominations, joint insurance',
        },
        {
          id: 'communication-evidence',
          name: 'Communication records: call logs, messages, emails (especially for periods apart)',
          helpText: 'Particularly important if you have spent time living in different countries.',
        },
      ],
    },
    {
      title: 'Sponsor Documents',
      items: [
        {
          id: 'sponsor-passport',
          name: 'Sponsor passport or Australian citizenship certificate',
        },
        {
          id: 'sponsor-form40sp',
          name: 'Form 40SP - Sponsorship for a partner to migrate to Australia',
        },
        {
          id: 'sponsor-police',
          name: 'Sponsor police clearance certificates',
        },
        {
          id: 'sponsor-form80',
          name: 'Sponsor Form 80 (if requested)',
        },
      ],
    },
    {
      title: 'Registered Relationship / Marriage',
      items: [
        {
          id: 'marriage-cert',
          name: 'Marriage certificate or registered relationship certificate',
          helpText:
            'If married, provide the official marriage certificate. If de facto, evidence of living together for at least 12 months or registration of the relationship.',
        },
        {
          id: 'divorce-cert',
          name: 'Divorce or death certificate from previous relationships (if applicable)',
        },
      ],
    },
  ],
  sc309100: [
    {
      title: 'Relationship Evidence',
      items: [
        {
          id: 'relationship-statement',
          name: 'Statutory declaration detailing the history of your relationship',
          helpText:
            'A comprehensive statement covering how you met, development of the relationship, commitment to a shared life, and future plans.',
        },
        {
          id: 'form888',
          name: 'Form 888 - Statutory declarations from two Australian citizens or permanent residents',
          helpText:
            'Two separate Form 888s from people who know your relationship personally.',
        },
        {
          id: 'financial-evidence',
          name: 'Financial evidence: joint bank accounts, shared expenses, joint loans or leases',
        },
        {
          id: 'household-evidence',
          name: 'Household evidence: joint lease/mortgage, shared bills, mail to same address',
        },
        {
          id: 'social-evidence',
          name: 'Social evidence: joint travel itineraries, photos together, social media evidence',
        },
        {
          id: 'commitment-evidence',
          name: 'Commitment evidence: wills, superannuation beneficiary, insurance naming each other',
        },
        {
          id: 'communication-evidence',
          name: 'Communication records: call logs, messages, emails (especially for periods apart)',
        },
      ],
    },
    {
      title: 'Sponsor Documents',
      items: [
        {
          id: 'sponsor-passport',
          name: 'Sponsor passport or Australian citizenship certificate',
        },
        {
          id: 'sponsor-form40sp',
          name: 'Form 40SP - Sponsorship for a partner to migrate to Australia',
        },
        {
          id: 'sponsor-police',
          name: 'Sponsor police clearance certificates',
        },
      ],
    },
    {
      title: 'Marriage / De Facto Evidence',
      items: [
        {
          id: 'marriage-cert',
          name: 'Marriage certificate or evidence of 12+ months de facto relationship',
          helpText:
            'Offshore applicants can be married or in a registered de facto relationship. Evidence of living together for 12 months required for de facto.',
        },
        {
          id: 'divorce-cert',
          name: 'Divorce or death certificate from previous relationships (if applicable)',
        },
      ],
    },
    {
      title: 'Prospective Marriage (SC 300)',
      items: [
        {
          id: 'notice-intended-marriage',
          name: 'Notice of Intended Marriage (NOIM) - if applying as prospective spouse',
          helpText:
            'If not yet married, you may apply for a Prospective Marriage visa (SC 300) and marry within 9 months of arrival in Australia.',
        },
        {
          id: 'evidence-met',
          name: 'Evidence that you and your partner have met in person',
        },
      ],
    },
  ],
  sc103804: [
    {
      title: 'Balance of Family Test',
      items: [
        {
          id: 'balance-family',
          name: 'Evidence for Balance of Family test',
          helpText:
            'You must prove that at least half of your children live in Australia, or that more of your children live in Australia than in any other single country.',
        },
        {
          id: 'children-evidence',
          name: 'Birth certificates of all your children (to prove family balance)',
        },
        {
          id: 'children-residency',
          name: 'Evidence of where each child resides (Australian visa or citizenship documents)',
        },
      ],
    },
    {
      title: 'Sponsor Documents',
      items: [
        {
          id: 'sponsor-id',
          name: 'Sponsoring child Australian citizenship or PR evidence',
        },
        {
          id: 'sponsor-settled',
          name: 'Evidence that sponsor is a settled Australian resident (2+ years lawful residence)',
          helpText:
            'The sponsoring child must have been an Australian citizen, permanent resident, or eligible New Zealand citizen for at least 2 years.',
        },
      ],
    },
    {
      title: 'Assurance of Support (AoS)',
      items: [
        {
          id: 'aos-application',
          name: 'Assurance of Support application',
          helpText:
            'An AoS is a commitment by a person (the assurer) to repay certain social security payments made to you during the AoS period.',
        },
        {
          id: 'aos-bond',
          name: 'AoS bond payment evidence (bond held by Centrelink)',
        },
        {
          id: 'assurer-income',
          name: 'Assurer income evidence (tax returns, payslips)',
        },
      ],
    },
    {
      title: 'Relationship Evidence',
      items: [
        {
          id: 'parent-child-rel',
          name: 'Evidence of parent-child relationship (birth certificate, adoption papers)',
        },
      ],
    },
  ],
  sc143864: [
    {
      title: 'Balance of Family Test',
      items: [
        {
          id: 'balance-family',
          name: 'Evidence for Balance of Family test',
          helpText:
            'You must prove that at least half of your children live in Australia, or that more of your children live in Australia than in any other single country.',
        },
        {
          id: 'children-evidence',
          name: 'Birth certificates of all your children (to prove family balance)',
        },
        {
          id: 'children-residency',
          name: 'Evidence of where each child resides',
        },
      ],
    },
    {
      title: 'Sponsor Documents',
      items: [
        {
          id: 'sponsor-id',
          name: 'Sponsoring child Australian citizenship or PR evidence',
        },
        {
          id: 'sponsor-settled',
          name: 'Evidence that sponsor has been settled in Australia for at least 2 years',
        },
      ],
    },
    {
      title: 'Assurance of Support (AoS)',
      items: [
        {
          id: 'aos-application',
          name: 'Assurance of Support application',
          helpText:
            'An AoS is required. The bond amount for Contributory Parent visas is typically higher than standard parent visas.',
        },
        {
          id: 'aos-bond',
          name: 'AoS bond payment evidence',
        },
        {
          id: 'assurer-income',
          name: 'Assurer income evidence (tax returns, payslips)',
        },
      ],
    },
    {
      title: 'Financial Evidence',
      items: [
        {
          id: 'second-vac-capacity',
          name: 'Evidence of capacity to pay second Visa Application Charge (AUD $43,600 per person)',
          helpText:
            'The second instalment of the visa application charge must be paid before the visa can be granted. Plan for this significant cost.',
        },
      ],
    },
    {
      title: 'Relationship Evidence',
      items: [
        {
          id: 'parent-child-rel',
          name: 'Evidence of parent-child relationship (birth certificate, adoption papers)',
        },
      ],
    },
  ],
  sc500: [
    {
      title: 'Enrolment',
      items: [
        {
          id: 'coe',
          name: 'Confirmation of Enrolment (CoE) from CRICOS-registered institution',
          helpText:
            'Your CoE is issued by the education provider after you accept your offer and pay tuition fees. Each course requires a separate CoE.',
        },
        {
          id: 'offer-letter',
          name: 'Letter of offer from education provider',
        },
        {
          id: 'previous-transcripts',
          name: 'Previous academic transcripts and qualifications',
        },
      ],
    },
    {
      title: 'Financial Evidence',
      items: [
        {
          id: 'financial-capacity',
          name: 'Evidence of financial capacity (12 months living costs, tuition, travel)',
          helpText:
            'You must demonstrate access to approximately AUD $24,505 per year for living costs (2024 rate), plus tuition and travel costs. Acceptable evidence includes bank statements, loans, scholarships, or sponsor financial declarations.',
        },
        {
          id: 'bank-statements',
          name: 'Bank statements (3-6 months showing sufficient funds)',
        },
        {
          id: 'scholarship-letter',
          name: 'Scholarship award letter (if applicable)',
        },
        {
          id: 'financial-sponsor',
          name: 'Financial sponsor declaration and supporting evidence (if applicable)',
        },
      ],
    },
    {
      title: 'Genuine Student Statement',
      items: [
        {
          id: 'gs-statement',
          name: 'Genuine Student (GS) statement',
          helpText:
            'A written statement explaining why you chose Australia as your study destination, why you selected this particular course and institution, how the course relates to your career plans, and your intention to return home after study.',
        },
      ],
    },
    {
      title: 'Health Insurance',
      items: [
        {
          id: 'oshc',
          name: 'Overseas Student Health Cover (OSHC) for the duration of your visa',
          helpText:
            'OSHC is mandatory for all student visa holders. It must cover you for the entire duration of your visa. Providers include Medibank, Bupa, Allianz, and nib.',
        },
      ],
    },
    {
      title: 'English Language',
      items: [
        {
          id: 'english-test',
          name: 'English language test results (IELTS, PTE, TOEFL, CAE)',
          helpText:
            'Minimum scores depend on your course level. Generally IELTS 5.5 overall for foundation/pathway, 6.0 for undergraduate, 6.5 for postgraduate.',
        },
      ],
    },
  ],
  sc186482: [
    {
      title: 'Employer Nomination',
      items: [
        {
          id: 'nomination-form',
          name: 'Employer nomination form (submitted by the sponsoring employer)',
          helpText:
            'Your employer must lodge a nomination application before or at the same time as your visa application. The employer must be an approved sponsor.',
        },
        {
          id: 'employment-contract',
          name: 'Employment contract showing position, salary, and conditions',
          helpText:
            'The salary must meet the Temporary Skilled Migration Income Threshold (TSMIT) and the annual market salary rate for the position.',
        },
        {
          id: 'position-description',
          name: 'Detailed position description matching the nominated occupation',
        },
      ],
    },
    {
      title: 'Company Documents',
      items: [
        {
          id: 'company-financials',
          name: 'Sponsoring company financial statements (audited accounts, tax returns)',
          helpText:
            'The company must demonstrate it is a lawfully operating business with the financial capacity to employ you.',
        },
        {
          id: 'company-registration',
          name: 'Company registration documents (ABN, ACN, business registration)',
        },
        {
          id: 'organisational-chart',
          name: 'Organisational chart showing the position',
        },
        {
          id: 'labour-market-testing',
          name: 'Labour Market Testing (LMT) evidence (if applicable)',
          helpText:
            'Employers may need to demonstrate they tested the local labour market before nominating an overseas worker. This applies to certain visa streams.',
        },
      ],
    },
    {
      title: 'Skills Assessment (SC 186 Direct Entry)',
      items: [
        {
          id: 'skills-assessment',
          name: 'Positive skills assessment (for Direct Entry stream)',
          helpText:
            'Required for the Direct Entry stream of SC 186. Not required for the Temporary Residence Transition stream if you have worked for your employer for 3+ years on a SC 482.',
        },
      ],
    },
    {
      title: 'Qualifications & Experience',
      items: [
        {
          id: 'degree-certs',
          name: 'Degree certificates and academic transcripts',
        },
        {
          id: 'employment-refs',
          name: 'Employment reference letters demonstrating relevant experience',
        },
        {
          id: 'licence-registration',
          name: 'Professional licence or registration (if required for the occupation)',
        },
      ],
    },
    {
      title: 'English Language',
      items: [
        {
          id: 'english-test',
          name: 'English language test results (competent level minimum)',
          helpText:
            'SC 186 requires competent English (e.g., IELTS 6.0 in each band). SC 482 requires at least IELTS 5.0 in each band with 5.0 overall (Short-term stream) or IELTS 5.0 each with 5.0 overall (Medium-term).',
        },
      ],
    },
  ],
  sc485: [
    {
      title: 'Australian Study Requirement',
      items: [
        {
          id: 'completion-letter',
          name: 'Course completion letter from education provider',
          helpText:
            'You must have completed a CRICOS-registered course of at least 2 academic years (92 weeks) completed within 16 calendar months.',
        },
        {
          id: 'transcripts',
          name: 'Academic transcripts showing completion of qualification',
        },
        {
          id: 'cricos-confirmation',
          name: 'CRICOS registration confirmation for the completed course',
        },
      ],
    },
    {
      title: 'Skills Assessment (Graduate Work Stream)',
      items: [
        {
          id: 'skills-assessment',
          name: 'Positive skills assessment for nominated occupation (Graduate Work stream only)',
          helpText:
            'Required only for the Graduate Work stream. Post-Study Work stream applicants do not need a skills assessment.',
        },
      ],
    },
    {
      title: 'English Language',
      items: [
        {
          id: 'english-test',
          name: 'English language test results (competent level: IELTS 6.0 each band)',
          helpText:
            'You must demonstrate competent English. IELTS 6.0 in each component, PTE 50 in each component, or equivalent.',
        },
      ],
    },
    {
      title: 'Health Insurance',
      items: [
        {
          id: 'health-insurance',
          name: 'Adequate health insurance for the duration of the visa',
          helpText:
            'You must maintain adequate health insurance for the duration of your SC 485 visa. OSHC or equivalent private health cover is accepted.',
        },
      ],
    },
    {
      title: 'Student Visa Compliance',
      items: [
        {
          id: 'student-visa-compliance',
          name: 'Evidence of holding a student visa within 6 months of application (if applicable)',
        },
        {
          id: 'attendance-records',
          name: 'Evidence of satisfactory course attendance and progress',
        },
      ],
    },
  ],
};

export default function DocumentChecklistPage() {
  const [selectedPathway, setSelectedPathway] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleToggleItem = (sectionPrefix: string, itemId: string) => {
    const key = `${sectionPrefix}-${itemId}`;
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getAllItems = (): { sectionPrefix: string; itemId: string }[] => {
    const items: { sectionPrefix: string; itemId: string }[] = [];
    UNIVERSAL_DOCUMENTS.forEach((item) => {
      items.push({ sectionPrefix: 'universal', itemId: item.id });
    });
    if (selectedPathway && PATHWAY_DOCUMENTS[selectedPathway]) {
      PATHWAY_DOCUMENTS[selectedPathway].forEach((section) => {
        section.items.forEach((item) => {
          items.push({ sectionPrefix: section.title, itemId: item.id });
        });
      });
    }
    return items;
  };

  const allItems = selectedPathway ? getAllItems() : [];
  const totalItems = allItems.length;
  const checkedCount = allItems.filter((item) =>
    checkedItems.has(`${item.sectionPrefix}-${item.itemId}`)
  ).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const handlePathwayChange = (value: string) => {
    setSelectedPathway(value);
    setCheckedItems(new Set());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Document Checklist Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Generate a personalised document checklist tailored to your specific visa pathway.
          Track your progress as you gather each document and ensure nothing is missed before
          lodging your application.
        </p>
      </div>

      {/* Pathway Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <label
          htmlFor="pathway-select"
          className="block text-lg font-semibold text-gray-900 mb-2"
        >
          Select Your Visa Pathway
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Choose the visa you are applying for to see the full list of required documents.
        </p>
        <select
          id="pathway-select"
          value={selectedPathway}
          onChange={(e) => handlePathwayChange(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        >
          <option value="">-- Select a visa pathway --</option>
          {VISA_PATHWAYS.map((pathway) => (
            <option key={pathway.value} value={pathway.value}>
              {pathway.label}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar & Checklist */}
      {selectedPathway && (
        <>
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
              <span className="text-2xl font-bold text-green-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {checkedCount} of {totalItems} documents ready ({progressPercent}%)
            </p>
          </div>

          {/* Universal Documents */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">Universal Documents</h2>
              <p className="text-sm text-gray-500 mt-1">
                Required for all visa applications regardless of pathway.
              </p>
            </div>
            <div className="space-y-3">
              {UNIVERSAL_DOCUMENTS.map((item) => {
                const key = `universal-${item.id}`;
                const isChecked = checkedItems.has(key);
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isChecked
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleItem('universal', item.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-sm font-medium ${
                          isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.helpText && (
                        <p className="text-xs text-gray-500 mt-1">{item.helpText}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Pathway-Specific Documents */}
          {PATHWAY_DOCUMENTS[selectedPathway] && (
            <div className="space-y-6">
              <div className="px-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Pathway-Specific Documents
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Additional documents required for{' '}
                  {VISA_PATHWAYS.find((p) => p.value === selectedPathway)?.label}.
                </p>
              </div>
              {PATHWAY_DOCUMENTS[selectedPathway].map((section) => (
                <div key={section.title} className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item) => {
                      const key = `${section.title}-${item.id}`;
                      const isChecked = checkedItems.has(key);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            isChecked
                              ? 'bg-green-50 border-green-300'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex-shrink-0 pt-0.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleItem(section.title, item.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {isChecked && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <span
                              className={`text-sm font-medium ${
                                isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.helpText && (
                              <p className="text-xs text-gray-500 mt-1">{item.helpText}</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> This checklist is a general guide only. The Department of Home Affairs
            may request additional documents during processing. Always verify requirements on the
            official DHA website or consult a MARA-registered migration agent for personalised advice.
          </p>
        </div>
      </div>
    </div>
  );
}
