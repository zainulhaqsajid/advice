export interface TimelineStageData {
  id: string;
  name: string;
  description: string;
  durationMin: string;
  durationMax: string;
  source: string;
}

export const skilledTimeline: TimelineStageData[] = [
  { id: 'skills_assessment', name: 'Skills Assessment', description: 'Submit and receive skills assessment from relevant assessing body', durationMin: '8 weeks', durationMax: '16 weeks', source: 'Assessing body websites' },
  { id: 'english_test', name: 'English Test Preparation & Sitting', description: 'Prepare for and sit English language test (IELTS/PTE/TOEFL)', durationMin: '2 weeks', durationMax: '12 weeks', source: 'Test provider booking availability' },
  { id: 'eoi_submit', name: 'EOI Submission', description: 'Submit Expression of Interest through SkillSelect', durationMin: 'Immediate', durationMax: 'Immediate', source: 'SkillSelect' },
  { id: 'eoi_wait', name: 'EOI Wait Time (Invitation)', description: 'Wait for invitation to apply based on points and occupation', durationMin: '1 month', durationMax: '18 months', source: 'Depends on points, occupation, and round frequency' },
  { id: 'lodgement_prep', name: 'Visa Lodgement Preparation', description: 'Gather all required documents and prepare application', durationMin: '2 weeks', durationMax: '4 weeks', source: 'Document gathering' },
  { id: 'sc189_processing', name: 'SC 189 Processing', description: 'Department processing of visa application', durationMin: '6 months', durationMax: '12 months', source: 'DHA processing times page' },
];

export const sc190Timeline: TimelineStageData[] = [
  { id: 'skills_assessment', name: 'Skills Assessment', description: 'Submit and receive skills assessment', durationMin: '8 weeks', durationMax: '16 weeks', source: 'Assessing body websites' },
  { id: 'english_test', name: 'English Test', description: 'Prepare for and sit English language test', durationMin: '2 weeks', durationMax: '12 weeks', source: 'Test provider booking availability' },
  { id: 'state_nomination', name: 'State Nomination Application', description: 'Apply for state/territory nomination', durationMin: '4 weeks', durationMax: '16 weeks', source: 'State/territory government websites' },
  { id: 'eoi_submit', name: 'EOI Submission', description: 'Submit Expression of Interest through SkillSelect', durationMin: 'Immediate', durationMax: 'Immediate', source: 'SkillSelect' },
  { id: 'eoi_wait', name: 'EOI Wait Time (Invitation)', description: 'Wait for invitation to apply', durationMin: '1 month', durationMax: '12 months', source: 'Depends on state and occupation' },
  { id: 'lodgement_prep', name: 'Visa Lodgement Preparation', description: 'Gather all required documents', durationMin: '2 weeks', durationMax: '4 weeks', source: 'Document gathering' },
  { id: 'sc190_processing', name: 'SC 190 Processing', description: 'Department processing of visa application', durationMin: '6 months', durationMax: '18 months', source: 'DHA processing times page' },
];

export const sc491Timeline: TimelineStageData[] = [
  { id: 'skills_assessment', name: 'Skills Assessment', description: 'Submit and receive skills assessment', durationMin: '8 weeks', durationMax: '16 weeks', source: 'Assessing body websites' },
  { id: 'english_test', name: 'English Test', description: 'Prepare for and sit English language test', durationMin: '2 weeks', durationMax: '12 weeks', source: 'Test provider booking availability' },
  { id: 'state_nomination', name: 'State/Regional Nomination', description: 'Apply for state/territory or regional nomination', durationMin: '4 weeks', durationMax: '16 weeks', source: 'State/territory government websites' },
  { id: 'eoi_submit', name: 'EOI Submission', description: 'Submit Expression of Interest', durationMin: 'Immediate', durationMax: 'Immediate', source: 'SkillSelect' },
  { id: 'eoi_wait', name: 'EOI Wait Time', description: 'Wait for invitation to apply', durationMin: '1 month', durationMax: '12 months', source: 'Depends on state and occupation' },
  { id: 'lodgement_prep', name: 'Visa Lodgement Preparation', description: 'Gather all required documents', durationMin: '2 weeks', durationMax: '4 weeks', source: 'Document gathering' },
  { id: 'sc491_processing', name: 'SC 491 Processing', description: 'Department processing of visa application', durationMin: '6 months', durationMax: '18 months', source: 'DHA processing times page' },
  { id: 'regional_requirement', name: 'Regional Residence (3 years)', description: 'Live and work in regional Australia for 3 years', durationMin: '3 years', durationMax: '3 years', source: 'SC 491 visa conditions' },
  { id: 'sc191_application', name: 'SC 191 PR Application', description: 'Apply for permanent residence after meeting regional requirements', durationMin: '6 months', durationMax: '12 months', source: 'DHA processing times page' },
];

export const partnerTimeline: TimelineStageData[] = [
  { id: 'evidence_gathering', name: 'Evidence Gathering', description: 'Collect relationship evidence across all four pillars', durationMin: '2 weeks', durationMax: '8 weeks', source: 'Personal preparation' },
  { id: 'form_888', name: 'Form 888 Statutory Declarations', description: 'Obtain statutory declarations from 2+ supporters', durationMin: '1 week', durationMax: '4 weeks', source: 'Personal preparation' },
  { id: 'health_police', name: 'Health & Police Checks', description: 'Complete health examination and obtain police clearances', durationMin: '2 weeks', durationMax: '8 weeks', source: 'Panel physician and police authorities' },
  { id: 'lodgement', name: 'Visa Lodgement', description: 'Submit complete application via ImmiAccount', durationMin: '1 day', durationMax: '1 week', source: 'DHA ImmiAccount' },
  { id: 'sc820_processing', name: 'SC 820/309 Processing', description: 'Department processing of temporary partner visa', durationMin: '21 months', durationMax: '34 months', source: 'DHA processing times page' },
  { id: 'eligibility_wait', name: 'Wait for SC 801/100 Eligibility', description: 'Wait 2 years from lodgement date to become eligible for permanent visa', durationMin: '24 months', durationMax: '24 months', source: 'Migration Regulations' },
  { id: 'sc801_processing', name: 'SC 801/100 Processing', description: 'Department processing of permanent partner visa', durationMin: '12 months', durationMax: '20 months', source: 'DHA processing times page' },
];

export const parentContributoryTimeline: TimelineStageData[] = [
  { id: 'bof_test', name: 'Balance of Family Test', description: 'Verify eligibility through Balance of Family Test', durationMin: '1 week', durationMax: '4 weeks', source: 'Self-assessment / DHA' },
  { id: 'aos_application', name: 'Assurance of Support Application', description: 'Apply for and obtain AoS through Centrelink', durationMin: '4 weeks', durationMax: '12 weeks', source: 'Services Australia' },
  { id: 'bank_guarantee', name: 'Bank Guarantee', description: 'Lodge bank guarantee with Commonwealth Bank', durationMin: '1 week', durationMax: '4 weeks', source: 'Commonwealth Bank' },
  { id: 'lodgement', name: 'Visa Lodgement', description: 'Submit complete application', durationMin: '1 week', durationMax: '4 weeks', source: 'DHA' },
  { id: 'queue', name: 'Queue Wait Time', description: 'Wait in processing queue', durationMin: '5 years', durationMax: '6 years', source: 'DHA parent visa queue page' },
];

export const studentToPRTimeline: TimelineStageData[] = [
  { id: 'student_visa', name: 'Student Visa (SC 500)', description: 'Complete eligible course (Bachelor\'s, Master\'s, or PhD)', durationMin: '2 years', durationMax: '4 years', source: 'Course duration' },
  { id: 'graduate_visa', name: 'Graduate Visa (SC 485)', description: 'Work in Australia to gain skilled experience', durationMin: '2 years', durationMax: '4 years', source: 'SC 485 visa duration' },
  { id: 'skills_assessment', name: 'Skills Assessment', description: 'Get assessed by relevant assessing body', durationMin: '8 weeks', durationMax: '16 weeks', source: 'Assessing body' },
  { id: 'english_test', name: 'English Test', description: 'Aim for Proficient or Superior for more points', durationMin: '2 weeks', durationMax: '12 weeks', source: 'Test provider' },
  { id: 'eoi_submit', name: 'Submit EOI', description: 'Through SkillSelect system', durationMin: 'Immediate', durationMax: 'Immediate', source: 'SkillSelect' },
  { id: 'state_nomination', name: 'State Nomination (if applicable)', description: 'Apply for SC 190/491 nomination', durationMin: '4 weeks', durationMax: '16 weeks', source: 'State government' },
  { id: 'invitation', name: 'Receive Invitation', description: 'Wait for invitation round', durationMin: '1 month', durationMax: '18 months', source: 'SkillSelect rounds' },
  { id: 'visa_lodgement', name: 'Lodge Visa Application', description: 'Submit SC 189, 190, or 491 application', durationMin: '2 weeks', durationMax: '4 weeks', source: 'Document preparation' },
  { id: 'visa_grant', name: 'Visa Grant', description: 'Permanent Residency granted', durationMin: '6 months', durationMax: '18 months', source: 'DHA processing times' },
];

export const timelinesByPathway: Record<string, { name: string; stages: TimelineStageData[] }> = {
  skilled_independent: { name: 'Skilled Independent (SC 189)', stages: skilledTimeline },
  skilled_nominated: { name: 'Skilled Nominated (SC 190)', stages: sc190Timeline },
  skilled_regional: { name: 'Skilled Regional (SC 491 → 191)', stages: sc491Timeline },
  partner_onshore: { name: 'Partner Visa (Onshore)', stages: partnerTimeline },
  partner_offshore: { name: 'Partner Visa (Offshore)', stages: partnerTimeline },
  parent_contributory: { name: 'Contributory Parent (SC 143/864)', stages: parentContributoryTimeline },
  student_to_pr: { name: 'Student → PR Pathway', stages: studentToPRTimeline },
};
