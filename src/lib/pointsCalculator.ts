import { PointsBreakdown, EnglishLevel, AQFLevel } from '@/types/visa';

export function calculateAgePoints(age: number): number {
  if (age >= 18 && age <= 24) return 25;
  if (age >= 25 && age <= 32) return 30;
  if (age >= 33 && age <= 39) return 25;
  if (age >= 40 && age <= 44) return 15;
  if (age >= 45 && age <= 49) return 0;
  return 0;
}

export function calculateEnglishPoints(level: EnglishLevel): number {
  switch (level) {
    case 'competent': return 0;
    case 'proficient': return 10;
    case 'superior': return 20;
  }
}

export function calculateOverseasExperiencePoints(years: number, hasCompetentEnglish: boolean): number {
  if (!hasCompetentEnglish) return 0;
  if (years >= 8) return 15;
  if (years >= 5) return 10;
  if (years >= 3) return 5;
  return 0;
}

export function calculateAustralianExperiencePoints(years: number, hasCompetentEnglish: boolean): number {
  if (!hasCompetentEnglish) return 0;
  if (years >= 8) return 20;
  if (years >= 5) return 15;
  if (years >= 3) return 10;
  if (years >= 1) return 5;
  return 0;
}

export function calculateEducationPoints(aqfLevel: AQFLevel): number {
  if (aqfLevel === 10) return 20; // PhD
  if (aqfLevel >= 7 && aqfLevel <= 9) return 15; // Bachelor's, Master's, Grad Dip/Cert
  if (aqfLevel >= 5 && aqfLevel <= 6) return 10; // Diploma, Advanced Diploma
  if (aqfLevel >= 3 && aqfLevel <= 4) return 10; // Trade qualification (Certificate III/IV)
  return 0;
}

export function calculateAustralianStudyPoints(hasAustralianStudy: boolean): number {
  return hasAustralianStudy ? 5 : 0;
}

export function calculateSpecialistEducationPoints(hasSpecialist: boolean): number {
  return hasSpecialist ? 10 : 0;
}

export function calculateCommunityLanguagePoints(hasNAATI: boolean): number {
  return hasNAATI ? 5 : 0;
}

export function calculateProfessionalYearPoints(hasProfessionalYear: boolean): number {
  return hasProfessionalYear ? 5 : 0;
}

export function calculateStateNominationPoints(visaType: '189' | '190' | '491'): number {
  if (visaType === '190') return 5;
  if (visaType === '491') return 15;
  return 0;
}

export function calculatePartnerPoints(
  hasPartner: boolean,
  partnerHasCompetentEnglish: boolean,
  partnerHasSkillsAssessment: boolean,
  singleOrPartnerIsCitizenPR: boolean
): number {
  if (!hasPartner || singleOrPartnerIsCitizenPR) return 10; // Single or partner is AU citizen/PR
  if (partnerHasCompetentEnglish && partnerHasSkillsAssessment) return 10;
  if (partnerHasCompetentEnglish) return 5;
  return 0;
}

export interface PointsCalculatorInput {
  age: number;
  englishLevel: EnglishLevel;
  overseasExperienceYears: number;
  australianExperienceYears: number;
  educationLevel: AQFLevel;
  hasAustralianStudy: boolean;
  hasSpecialistEducation: boolean;
  hasNAATI: boolean;
  hasProfessionalYear: boolean;
  visaType: '189' | '190' | '491';
  hasPartner: boolean;
  partnerHasCompetentEnglish: boolean;
  partnerHasSkillsAssessment: boolean;
  singleOrPartnerIsCitizenPR: boolean;
}

export function calculateTotalPoints(input: PointsCalculatorInput): PointsBreakdown {
  const hasCompetentEnglish = input.englishLevel !== 'competent' || true; // Competent is minimum for skilled visas

  const age = calculateAgePoints(input.age);
  const englishLanguage = calculateEnglishPoints(input.englishLevel);
  const overseasExperience = calculateOverseasExperiencePoints(input.overseasExperienceYears, hasCompetentEnglish);
  const australianExperience = calculateAustralianExperiencePoints(input.australianExperienceYears, hasCompetentEnglish);
  const education = calculateEducationPoints(input.educationLevel);
  const australianStudy = calculateAustralianStudyPoints(input.hasAustralianStudy);
  const specialistEducation = calculateSpecialistEducationPoints(input.hasSpecialistEducation);
  const credentialledCommunityLanguage = calculateCommunityLanguagePoints(input.hasNAATI);
  const professionalYear = calculateProfessionalYearPoints(input.hasProfessionalYear);
  const stateNomination = input.visaType === '190' ? 5 : 0;
  const regionalNomination = input.visaType === '491' ? 15 : 0;
  const partnerSkills = calculatePartnerPoints(
    input.hasPartner,
    input.partnerHasCompetentEnglish,
    input.partnerHasSkillsAssessment,
    input.singleOrPartnerIsCitizenPR
  );
  const singleApplicant = !input.hasPartner ? 0 : 0; // Counted in partnerSkills

  const total =
    age +
    englishLanguage +
    overseasExperience +
    australianExperience +
    education +
    australianStudy +
    specialistEducation +
    credentialledCommunityLanguage +
    professionalYear +
    stateNomination +
    regionalNomination +
    partnerSkills +
    singleApplicant;

  return {
    age,
    englishLanguage,
    overseasExperience,
    australianExperience,
    education,
    australianStudy,
    specialistEducation,
    credentialledCommunityLanguage,
    professionalYear,
    stateNomination,
    regionalNomination,
    partnerSkills,
    singleApplicant,
    total,
  };
}

export function getPointsImprovementSuggestions(breakdown: PointsBreakdown, input: PointsCalculatorInput): string[] {
  const suggestions: string[] = [];

  if (input.englishLevel === 'competent') {
    suggestions.push('Improve English to Proficient (7 each in IELTS) for +10 points');
  } else if (input.englishLevel === 'proficient') {
    suggestions.push('Improve English to Superior (8 each in IELTS) for +10 more points');
  }

  if (!input.hasProfessionalYear && ['skilled_independent', 'skilled_nominated', 'skilled_regional'].includes(input.visaType)) {
    suggestions.push('Complete a Professional Year Program for +5 points (IT, Accounting, Engineering)');
  }

  if (!input.hasNAATI) {
    suggestions.push('Obtain NAATI credentialling for community language for +5 points');
  }

  if (!input.hasAustralianStudy) {
    suggestions.push('Australian study requirement (2+ years of study in Australia) for +5 points');
  }

  if (input.visaType === '189') {
    suggestions.push('Consider SC 190 (state nomination) for +5 points or SC 491 (regional) for +15 points');
  }

  if (input.hasPartner && !input.partnerHasSkillsAssessment && !input.singleOrPartnerIsCitizenPR) {
    suggestions.push('Partner skills assessment + competent English for +10 points');
  }

  return suggestions;
}
