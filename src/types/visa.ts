// Core visa types covering ALL visa categories from Section A

export type VisaCategory =
  | 'skilled_independent'
  | 'skilled_nominated'
  | 'skilled_regional'
  | 'employer_sponsored'
  | 'temporary_graduate'
  | 'student'
  | 'partner_onshore'
  | 'partner_offshore'
  | 'prospective_marriage'
  | 'parent_non_contributory'
  | 'parent_contributory'
  | 'parent_temporary'
  | 'business_investor'
  | 'global_talent'
  | 'distinguished_talent'
  | 'nz_citizen'
  | 'visitor'
  | 'bridging'
  | 'protection'
  | 'child'
  | 'remaining_relative'
  | 'carer';

export interface VisaSubclass {
  code: string;
  name: string;
  category: VisaCategory;
  description: string;
  targetUser: string;
  isTemporary: boolean;
  leadsToPR: boolean;
  prPathway?: string;
  estimatedProcessingTime: ProcessingTimeRange;
  estimatedCost: CostEstimate;
  keyRequirements: string[];
  conditions?: VisaCondition[];
}

export interface ProcessingTimeRange {
  minMonths: number;
  maxMonths: number;
  source: string;
  lastUpdated: string;
}

export interface CostEstimate {
  primaryApplicant: number;
  partnerDependant?: number;
  childDependant?: number;
  secondVAC?: number;
  currency: 'AUD';
  asOf: string;
}

export interface VisaCondition {
  code: string;
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  platformAction: string;
}

// Partner visa specific types
export type RelationshipType = 'married' | 'de_facto' | 'same_sex' | 'engaged';

export interface PartnerVisaIntake {
  relationshipType: RelationshipType;
  relationshipDurationMonths: number;
  marriageDate?: string;
  livingTogether: boolean;
  childrenTogether: boolean;
  childrenDetails?: DependantChild[];
  sponsorStatus: SponsorStatus;
  sponsorAge: number;
  sponsorSponsoredBefore: boolean;
  sponsorPreviousSponsorships?: number;
  applicantCurrentVisa?: string;
  applicantInAustralia: boolean;
  previousVisaRefusals: boolean;
  refusalDetails?: string;
  condition8503: boolean;
}

export type SponsorStatus = 'au_citizen' | 'permanent_resident' | 'nz_citizen_eligible';

export interface DependantChild {
  name: string;
  dateOfBirth: string;
  citizenship: string;
}

// Parent visa specific types
export interface ParentVisaIntake {
  parentAge: number;
  sponsorChildStatus: SponsorStatus;
  sponsorResidentTwoYears: boolean;
  totalChildren: number;
  childrenInAustralia: number;
  childrenLocations: ChildLocation[];
  parentInAustralia: boolean;
  parentCurrentVisa?: string;
  budgetRange: 'low' | 'medium' | 'high';
  urgency: 'immediate' | '1_5_years' | 'no_rush';
}

export interface ChildLocation {
  country: string;
  count: number;
  isAuCitizenOrPR: boolean;
}

export interface BalanceOfFamilyResult {
  passed: boolean;
  totalChildren: number;
  childrenInAustralia: number;
  explanation: string;
  exemptVisa?: string;
}

// Student visa specific types
export interface StudentVisaIntake {
  currentlyInAustralia: boolean;
  currentVisa?: string;
  courseLevel: AQFLevel;
  courseField: string;
  courseProvider: string;
  courseDurationMonths: number;
  hasCoE: boolean;
  englishLevel: EnglishLevel;
  financialCapacity: number;
  hasOSHC: boolean;
  prGoal: boolean;
}

export type AQFLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface CourseChangeScenario {
  scenario: string;
  rule: string;
  newVisaNeeded: boolean | 'possibly';
}

// English test types
export type EnglishTestType = 'ielts' | 'pte' | 'toefl' | 'cae' | 'oet';
export type EnglishLevel = 'competent' | 'proficient' | 'superior';

export interface EnglishTestScores {
  testType: EnglishTestType;
  level: EnglishLevel;
  points: number;
  scores: Record<string, number | string>;
}

// Points calculation types
export interface PointsBreakdown {
  age: number;
  englishLanguage: number;
  overseasExperience: number;
  australianExperience: number;
  education: number;
  australianStudy: number;
  specialistEducation: number;
  credentialledCommunityLanguage: number;
  professionalYear: number;
  stateNomination: number;
  regionalNomination: number;
  partnerSkills: number;
  singleApplicant: number;
  total: number;
}

// Life event types
export type LifeEventType =
  | 'separation_before_lodging'
  | 'separation_after_lodging'
  | 'divorce_after_temp_grant'
  | 'separation_after_permanent'
  | 'divorce_skilled_visa'
  | 'divorce_regional_visa'
  | 'partner_separated_skilled'
  | 'separation_with_children'
  | 'death_of_sponsor'
  | 'death_of_primary_applicant'
  | 'death_of_parent_sponsor'
  | 'new_baby'
  | 'marriage_during_processing'
  | 'new_partner_after_grant'
  | 'job_loss_employer_sponsored'
  | 'criminal_charge'
  | 'health_condition'
  | 'employer_bankrupt'
  | 'change_of_address'
  | 'domestic_violence';

export interface LifeEventGuidance {
  eventType: LifeEventType;
  title: string;
  visaImpact: string;
  guidance: string;
  severity: 'info' | 'warning' | 'critical';
  recommendConsultAgent: boolean;
  supportLinks?: string[];
}

// Document checklist types
export interface DocumentChecklistItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'universal' | 'pathway_specific';
  helpLink?: string;
  completed: boolean;
}

// Cost calculator types
export interface CostBreakdownItem {
  item: string;
  amount: number;
  perPerson: boolean;
  notes: string;
  applicable: boolean;
}

export interface TotalCostEstimate {
  items: CostBreakdownItem[];
  totalEstimated: number;
  currency: 'AUD';
  numberOfApplicants: {
    primary: number;
    partners: number;
    children: number;
  };
}

// Timeline types
export interface TimelineStage {
  name: string;
  description: string;
  durationMin: string;
  durationMax: string;
  status: 'completed' | 'current' | 'upcoming';
  source: string;
}

// TR pathway types
export interface TRPathway {
  currentVisa: string;
  subclass: string;
  availablePRPathways: string;
  notes: string;
}

// EOI types
export interface EOIStrategy {
  occupation: string;
  anzscoCode: string;
  currentPoints: number;
  maxAchievablePoints: number;
  improvementAreas: EOIImprovement[];
  timingAdvice: string;
}

export interface EOIImprovement {
  area: string;
  currentPoints: number;
  potentialPoints: number;
  action: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  timeRequired: string;
}

// Intake form types
export type UserSituation =
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
  | 'other';

export interface IntakeFormData {
  situation: UserSituation;
  currentlyInAustralia: boolean;
  currentVisa?: string;
  age: number;
  nationality: string;
  englishLevel: EnglishLevel;
  hasSkillsAssessment: boolean;
  occupation?: string;
  yearsExperience?: number;
  educationLevel?: AQFLevel;
  hasPartner: boolean;
  hasDependants: boolean;
  numberOfDependants?: number;
}
