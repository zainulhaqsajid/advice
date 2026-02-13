export interface ChecklistItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  helpText?: string;
}

export interface PathwayChecklist {
  pathway: string;
  pathwayName: string;
  universalDocuments: ChecklistItem[];
  specificDocuments: ChecklistItem[];
}

const universalDocuments: ChecklistItem[] = [
  { id: 'passport', name: 'Valid Passport', description: 'All pages scanned, including blank pages', required: true },
  { id: 'photos', name: 'Passport-size Photographs', description: '45mm x 35mm, recent (within 6 months)', required: true },
  { id: 'birth_cert', name: 'Birth Certificate', description: 'Certified translation if not in English', required: true },
  { id: 'national_id', name: 'National ID Card', description: 'Government-issued identification', required: true },
  { id: 'police_clearance', name: 'Police Clearance Certificates', description: 'From every country lived in 12+ months since age 16', required: true, helpText: 'Processing times vary by country. Apply early.' },
  { id: 'health_exam', name: 'Health Examination Results', description: 'From a DHA-approved panel physician', required: true, helpText: 'Book through the eMedical system via your ImmiAccount.' },
  { id: 'form_80', name: 'Form 80 – Personal Particulars', description: 'Personal particulars for character assessment', required: false, helpText: 'May be requested by the case officer. Complete in advance.' },
  { id: 'form_1221', name: 'Form 1221 – Additional Personal Particulars', description: 'Additional personal information', required: false, helpText: 'May be requested by the case officer.' },
];

const skilledDocuments: ChecklistItem[] = [
  { id: 'skills_assessment', name: 'Skills Assessment Outcome Letter', description: 'Positive assessment from the relevant assessing body', required: true, helpText: 'Must be obtained before lodging EOI.' },
  { id: 'english_results', name: 'English Test Results', description: 'IELTS, PTE, TOEFL, CAE, or OET results within validity', required: true },
  { id: 'employment_refs', name: 'Employment References', description: 'For ALL positions claimed for points. Must include duties, dates, hours, and salary.', required: true, helpText: 'Use company letterhead. Include supervisor contact details.' },
  { id: 'qualifications', name: 'Qualification Certificates', description: 'Degree certificates for all claimed qualifications', required: true },
  { id: 'transcripts', name: 'Academic Transcripts', description: 'Full transcripts showing all subjects and grades', required: true },
  { id: 'state_nomination', name: 'State Nomination Approval', description: 'Required for SC 190 and SC 491', required: false, helpText: 'Only required for state-nominated visas.' },
  { id: 'partner_skills', name: 'Partner Skills Assessment & English', description: 'If claiming partner points', required: false },
];

const partnerDocuments: ChecklistItem[] = [
  { id: 'relationship_financial', name: 'Financial Evidence', description: 'Joint bank accounts, shared leases, joint loans, shared insurance policies', required: true },
  { id: 'relationship_household', name: 'Household Evidence', description: 'Shared living arrangements, bills in both names, photos of your home together', required: true },
  { id: 'relationship_social', name: 'Social Recognition Evidence', description: 'Joint invitations, social media posts, declarations from friends/family', required: true },
  { id: 'relationship_commitment', name: 'Commitment Evidence', description: 'Shared future plans, wills naming each other, superannuation beneficiary nominations', required: true },
  { id: 'communication_history', name: 'Communication History', description: 'Call logs, messages, emails, travel records if long-distance', required: true },
  { id: 'form_888', name: 'Form 888 – Statutory Declarations (x2)', description: 'Two statutory declarations from Australian citizens/PR who know your relationship', required: true, helpText: 'Declarants must be over 18 and AU citizens or PR.' },
  { id: 'marriage_cert', name: 'Marriage/De Facto Registration Certificate', description: 'Marriage certificate or de facto relationship registration', required: true },
  { id: 'sponsor_proof', name: "Sponsor's AU Citizenship/PR Proof", description: "Sponsor's Australian citizenship certificate or PR visa grant", required: true },
  { id: 'statutory_dec_relationship', name: 'Statutory Declarations from Friends/Family', description: 'At least 2 people who know your relationship well', required: true },
];

const parentDocuments: ChecklistItem[] = [
  { id: 'bof_evidence', name: 'Balance of Family Test Evidence', description: "Documents showing the location of all parent's children", required: true },
  { id: 'child_citizen_proof', name: "Sponsoring Child's AU Citizenship/PR Proof", description: 'Australian citizenship or PR visa grant of sponsoring child', required: true },
  { id: 'aos_docs', name: 'Assurance of Support Documentation', description: 'AoS approval letter and bank guarantee receipt', required: true, helpText: 'Process through Centrelink and Commonwealth Bank.' },
  { id: 'sponsor_residency', name: "Sponsor's 2-Year Residency Proof", description: 'Evidence sponsor has been an Australian resident for 2+ years', required: true },
  { id: 'bank_guarantee', name: 'Bank Guarantee Receipt', description: 'From Commonwealth Bank of Australia for AoS bond', required: true },
];

const studentDocuments: ChecklistItem[] = [
  { id: 'coe', name: 'Confirmation of Enrolment (CoE)', description: 'From a CRICOS-registered education provider', required: true, helpText: 'Not just an offer letter — must be a CoE.' },
  { id: 'financial_evidence', name: 'Financial Evidence', description: '3-month bank statements showing sufficient funds ($29,710 living + tuition)', required: true },
  { id: 'gs_statement', name: 'Genuine Student (GS) Statement', description: 'Written statement demonstrating genuine intent to study in Australia', required: true, helpText: 'Replaced the old GTE requirement.' },
  { id: 'oshc_cert', name: 'OSHC Certificate', description: 'Overseas Student Health Cover for entire visa duration', required: true },
  { id: 'english_student', name: 'English Test Results', description: 'IELTS 6.0 overall (5.5 each band) or equivalent', required: true },
  { id: 'academic_transcripts', name: 'Academic Transcripts', description: 'From previous studies', required: true },
];

const employerSponsoredDocuments: ChecklistItem[] = [
  { id: 'nomination_form', name: 'Employer Nomination Form', description: 'Completed by the sponsoring employer', required: true },
  { id: 'employment_contract', name: 'Employment Contract', description: 'Signed contract with terms and conditions', required: true },
  { id: 'company_financials', name: 'Company Financial Statements', description: "Sponsoring employer's financial statements", required: true },
  { id: 'lmt_evidence', name: 'Labour Market Testing Evidence', description: 'Proof employer tried to hire locally first (if applicable)', required: false },
  { id: 'position_description', name: 'Position Description', description: 'Detailed description of the nominated position', required: true },
];

const graduateDocuments: ChecklistItem[] = [
  { id: 'completion_letter', name: 'Course Completion Letter', description: 'From your education institution', required: true },
  { id: 'transcript_grad', name: 'Full Academic Transcript', description: 'Complete transcript from Australian institution', required: true },
  { id: 'skills_assessment_grad', name: 'Skills Assessment', description: 'Required for Graduate Work stream', required: false },
  { id: 'english_grad', name: 'English Test Results', description: 'Meeting minimum requirements', required: true },
  { id: 'oshc_grad', name: 'OSHC Certificate', description: 'Must maintain health cover', required: true },
];

export const pathwayChecklists: Record<string, PathwayChecklist> = {
  skilled_independent: {
    pathway: 'skilled_independent',
    pathwayName: 'Skilled Independent (SC 189)',
    universalDocuments,
    specificDocuments: skilledDocuments,
  },
  skilled_nominated: {
    pathway: 'skilled_nominated',
    pathwayName: 'Skilled Nominated (SC 190)',
    universalDocuments,
    specificDocuments: skilledDocuments,
  },
  skilled_regional: {
    pathway: 'skilled_regional',
    pathwayName: 'Skilled Regional (SC 491)',
    universalDocuments,
    specificDocuments: skilledDocuments,
  },
  partner_onshore: {
    pathway: 'partner_onshore',
    pathwayName: 'Partner Visa Onshore (SC 820/801)',
    universalDocuments,
    specificDocuments: partnerDocuments,
  },
  partner_offshore: {
    pathway: 'partner_offshore',
    pathwayName: 'Partner Visa Offshore (SC 309/100)',
    universalDocuments,
    specificDocuments: partnerDocuments,
  },
  parent_non_contributory: {
    pathway: 'parent_non_contributory',
    pathwayName: 'Parent Visa (SC 103/804)',
    universalDocuments,
    specificDocuments: parentDocuments,
  },
  parent_contributory: {
    pathway: 'parent_contributory',
    pathwayName: 'Contributory Parent Visa (SC 143/864)',
    universalDocuments,
    specificDocuments: parentDocuments,
  },
  student: {
    pathway: 'student',
    pathwayName: 'Student Visa (SC 500)',
    universalDocuments,
    specificDocuments: studentDocuments,
  },
  employer_sponsored: {
    pathway: 'employer_sponsored',
    pathwayName: 'Employer Sponsored (SC 186/482)',
    universalDocuments,
    specificDocuments: employerSponsoredDocuments,
  },
  temporary_graduate: {
    pathway: 'temporary_graduate',
    pathwayName: 'Temporary Graduate (SC 485)',
    universalDocuments,
    specificDocuments: graduateDocuments,
  },
};

export function getChecklistForPathway(pathway: string): PathwayChecklist | null {
  return pathwayChecklists[pathway] || null;
}
