import { EnglishTestType, EnglishLevel } from '@/types/visa';

export interface EnglishTestRequirement {
  testType: EnglishTestType;
  testName: string;
  level: EnglishLevel;
  points: number;
  scores: Record<string, string>;
  cost: string;
  validity: string;
}

export const englishTestMatrix: EnglishTestRequirement[] = [
  // IELTS
  { testType: 'ielts', testName: 'IELTS', level: 'competent', points: 0, scores: { listening: '6', reading: '6', writing: '6', speaking: '6' }, cost: 'AUD $395', validity: '3 years' },
  { testType: 'ielts', testName: 'IELTS', level: 'proficient', points: 10, scores: { listening: '7', reading: '7', writing: '7', speaking: '7' }, cost: 'AUD $395', validity: '3 years' },
  { testType: 'ielts', testName: 'IELTS', level: 'superior', points: 20, scores: { listening: '8', reading: '8', writing: '8', speaking: '8' }, cost: 'AUD $395', validity: '3 years' },
  // PTE Academic
  { testType: 'pte', testName: 'PTE Academic', level: 'competent', points: 0, scores: { listening: '50', reading: '50', writing: '50', speaking: '50' }, cost: 'AUD $410', validity: '3 years' },
  { testType: 'pte', testName: 'PTE Academic', level: 'proficient', points: 10, scores: { listening: '65', reading: '65', writing: '65', speaking: '65' }, cost: 'AUD $410', validity: '3 years' },
  { testType: 'pte', testName: 'PTE Academic', level: 'superior', points: 20, scores: { listening: '79', reading: '79', writing: '79', speaking: '79' }, cost: 'AUD $410', validity: '3 years' },
  // TOEFL iBT
  { testType: 'toefl', testName: 'TOEFL iBT', level: 'competent', points: 0, scores: { listening: '12', reading: '13', writing: '21', speaking: '18' }, cost: 'AUD $340', validity: '3 years' },
  { testType: 'toefl', testName: 'TOEFL iBT', level: 'proficient', points: 10, scores: { listening: '24', reading: '24', writing: '27', speaking: '23' }, cost: 'AUD $340', validity: '3 years' },
  { testType: 'toefl', testName: 'TOEFL iBT', level: 'superior', points: 20, scores: { listening: '28', reading: '29', writing: '30', speaking: '26' }, cost: 'AUD $340', validity: '3 years' },
  // CAE
  { testType: 'cae', testName: 'Cambridge CAE', level: 'competent', points: 0, scores: { overall: '169 each' }, cost: 'AUD $380', validity: 'No expiry' },
  { testType: 'cae', testName: 'Cambridge CAE', level: 'proficient', points: 10, scores: { overall: '185 each' }, cost: 'AUD $380', validity: 'No expiry' },
  { testType: 'cae', testName: 'Cambridge CAE', level: 'superior', points: 20, scores: { overall: '200 each' }, cost: 'AUD $380', validity: 'No expiry' },
  // OET
  { testType: 'oet', testName: 'OET', level: 'competent', points: 0, scores: { overall: 'B each' }, cost: 'AUD $587', validity: '2 years' },
  { testType: 'oet', testName: 'OET', level: 'proficient', points: 10, scores: { overall: 'B each' }, cost: 'AUD $587', validity: '2 years' },
  { testType: 'oet', testName: 'OET', level: 'superior', points: 20, scores: { overall: 'A each' }, cost: 'AUD $587', validity: '2 years' },
];

export const testRecommendations = [
  {
    scenario: 'General skilled migration',
    recommendation: 'PTE Academic',
    reason: 'Computer-based, faster results (typically 2-5 days), and many find the Speaking section more achievable than IELTS.',
  },
  {
    scenario: 'Healthcare professionals',
    recommendation: 'OET',
    reason: 'Specifically designed for healthcare professionals. Accepted by AHPRA and most health assessing bodies.',
  },
  {
    scenario: 'Already have IELTS score',
    recommendation: 'Check if current score meets requirements before retaking. Consider PTE if need to improve Speaking.',
    reason: 'Different tests suit different strengths. Some find PTE Speaking easier than IELTS face-to-face interview.',
  },
  {
    scenario: 'Need maximum points (20)',
    recommendation: 'PTE Academic or IELTS',
    reason: 'Most preparation resources available. PTE Academic scores of 79+ each are considered achievable with dedicated preparation.',
  },
  {
    scenario: 'Long-term validity needed',
    recommendation: 'Cambridge CAE',
    reason: 'No expiry date, unlike other tests which expire after 2-3 years. Good option if you\'re not ready to apply yet.',
  },
];

export function getPointsForLevel(level: EnglishLevel): number {
  switch (level) {
    case 'competent': return 0;
    case 'proficient': return 10;
    case 'superior': return 20;
  }
}

export function getScoresForTest(testType: EnglishTestType, level: EnglishLevel): EnglishTestRequirement | undefined {
  return englishTestMatrix.find(t => t.testType === testType && t.level === level);
}
