import { CostBreakdownItem } from '@/types/visa';

export interface CostCategory {
  id: string;
  name: string;
  items: CostItem[];
}

export interface CostItem {
  id: string;
  name: string;
  minCost: number;
  maxCost: number;
  perPerson: boolean;
  notes: string;
  applicableTo: string[];
}

export const costCategories: CostCategory[] = [
  {
    id: 'visa_fees',
    name: 'Visa Application Fees',
    items: [
      {
        id: 'visa_fee_189',
        name: 'SC 189 Visa Fee (Primary)',
        minCost: 4640,
        maxCost: 4640,
        perPerson: false,
        notes: 'Updated annually July 1',
        applicableTo: ['skilled_independent'],
      },
      {
        id: 'visa_fee_190',
        name: 'SC 190 Visa Fee (Primary)',
        minCost: 4640,
        maxCost: 4640,
        perPerson: false,
        notes: 'Updated annually July 1',
        applicableTo: ['skilled_nominated'],
      },
      {
        id: 'visa_fee_491',
        name: 'SC 491 Visa Fee (Primary)',
        minCost: 4640,
        maxCost: 4640,
        perPerson: false,
        notes: 'Updated annually July 1',
        applicableTo: ['skilled_regional'],
      },
      {
        id: 'visa_fee_186',
        name: 'SC 186 Visa Fee (Primary)',
        minCost: 4640,
        maxCost: 4640,
        perPerson: false,
        notes: 'Updated annually July 1',
        applicableTo: ['employer_sponsored'],
      },
      {
        id: 'visa_fee_482',
        name: 'SC 482 Visa Fee (Primary)',
        minCost: 1895,
        maxCost: 3035,
        perPerson: false,
        notes: 'Depends on stream',
        applicableTo: ['employer_sponsored'],
      },
      {
        id: 'visa_fee_partner',
        name: 'Partner Visa Fee (SC 820/309/300)',
        minCost: 9095,
        maxCost: 9095,
        perPerson: false,
        notes: 'Includes both temporary and permanent stages',
        applicableTo: ['partner_onshore', 'partner_offshore', 'prospective_marriage'],
      },
      {
        id: 'visa_fee_parent_103',
        name: 'Parent Visa Fee (SC 103/804)',
        minCost: 4990,
        maxCost: 4990,
        perPerson: true,
        notes: 'Non-contributory. 20-30+ year queue.',
        applicableTo: ['parent_non_contributory'],
      },
      {
        id: 'visa_fee_parent_143',
        name: 'Contributory Parent Visa Fee (SC 143/864)',
        minCost: 4990,
        maxCost: 4990,
        perPerson: true,
        notes: 'First instalment. Second VAC of $43,600 also required.',
        applicableTo: ['parent_contributory'],
      },
      {
        id: 'visa_fee_parent_143_vac2',
        name: 'Second VAC (SC 143/864)',
        minCost: 43600,
        maxCost: 43600,
        perPerson: true,
        notes: 'Contributory parent visa second instalment',
        applicableTo: ['parent_contributory'],
      },
      {
        id: 'visa_fee_870',
        name: 'Sponsored Parent (Temp) Fee (SC 870)',
        minCost: 5735,
        maxCost: 11470,
        perPerson: true,
        notes: '3-year ($5,735) or 5-year ($11,470)',
        applicableTo: ['parent_temporary'],
      },
      {
        id: 'visa_fee_student',
        name: 'Student Visa Fee (SC 500)',
        minCost: 2000,
        maxCost: 2000,
        perPerson: false,
        notes: 'Increased from $1,600 in 2024',
        applicableTo: ['student'],
      },
      {
        id: 'visa_fee_485',
        name: 'Graduate Visa Fee (SC 485)',
        minCost: 1895,
        maxCost: 1895,
        perPerson: false,
        notes: 'Temporary Graduate visa',
        applicableTo: ['temporary_graduate'],
      },
      {
        id: 'visa_fee_dependant',
        name: 'Dependant (Partner) Fee',
        minCost: 1000,
        maxCost: 4500,
        perPerson: true,
        notes: 'Per additional adult applicant',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored'],
      },
      {
        id: 'visa_fee_child',
        name: 'Dependant (Child) Fee',
        minCost: 500,
        maxCost: 2500,
        perPerson: true,
        notes: 'Per child dependant',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'partner_onshore', 'partner_offshore'],
      },
    ],
  },
  {
    id: 'assessment',
    name: 'Skills Assessment & Testing',
    items: [
      {
        id: 'skills_assessment',
        name: 'Skills Assessment Fee',
        minCost: 300,
        maxCost: 1500,
        perPerson: false,
        notes: 'Varies by assessing body (ACS $550, EA $1,200, CPA $600, VETASSESS $1,200)',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional'],
      },
      {
        id: 'english_test',
        name: 'English Language Test',
        minCost: 300,
        maxCost: 450,
        perPerson: true,
        notes: 'IELTS $395, PTE $410, TOEFL $340. May need multiple attempts.',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'student', 'temporary_graduate'],
      },
    ],
  },
  {
    id: 'medical_police',
    name: 'Health & Character',
    items: [
      {
        id: 'health_exam',
        name: 'Health Examination',
        minCost: 300,
        maxCost: 800,
        perPerson: true,
        notes: 'Panel physician. Required for all visa types.',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'partner_onshore', 'partner_offshore', 'parent_contributory', 'parent_non_contributory', 'student'],
      },
      {
        id: 'police_clearance',
        name: 'Police Clearance (per country)',
        minCost: 0,
        maxCost: 200,
        perPerson: true,
        notes: 'From every country lived in 12+ months since age 16. Some countries free.',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'partner_onshore', 'partner_offshore', 'parent_contributory', 'parent_non_contributory'],
      },
    ],
  },
  {
    id: 'documents',
    name: 'Documentation',
    items: [
      {
        id: 'translation',
        name: 'Document Translation (NAATI)',
        minCost: 50,
        maxCost: 200,
        perPerson: false,
        notes: 'Per document. For non-English documents.',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'partner_onshore', 'partner_offshore', 'parent_contributory', 'parent_non_contributory', 'student'],
      },
      {
        id: 'biometrics',
        name: 'Biometrics',
        minCost: 0,
        maxCost: 100,
        perPerson: true,
        notes: 'If required based on nationality',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'partner_onshore', 'partner_offshore', 'student'],
      },
    ],
  },
  {
    id: 'optional',
    name: 'Optional / Additional Costs',
    items: [
      {
        id: 'professional_year',
        name: 'Professional Year Program',
        minCost: 10000,
        maxCost: 15000,
        perPerson: false,
        notes: 'IT, Accounting, Engineering only. Adds 5 points.',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional'],
      },
      {
        id: 'naati',
        name: 'NAATI Credentialling',
        minCost: 800,
        maxCost: 2500,
        perPerson: false,
        notes: 'For community language points (5 points)',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional'],
      },
      {
        id: 'migration_agent',
        name: 'Migration Agent Fees',
        minCost: 2000,
        maxCost: 10000,
        perPerson: false,
        notes: 'Optional but common. Varies significantly by complexity.',
        applicableTo: ['skilled_independent', 'skilled_nominated', 'skilled_regional', 'employer_sponsored', 'partner_onshore', 'partner_offshore', 'parent_contributory', 'parent_non_contributory', 'student'],
      },
      {
        id: 'oshc',
        name: 'OSHC (per year)',
        minCost: 500,
        maxCost: 3000,
        perPerson: true,
        notes: 'Mandatory for student visa. Duration of visa.',
        applicableTo: ['student'],
      },
      {
        id: 'aos_bond',
        name: 'Assurance of Support Bond',
        minCost: 10000,
        maxCost: 14000,
        perPerson: true,
        notes: 'Refundable after 10 years. For parent visas.',
        applicableTo: ['parent_contributory', 'parent_non_contributory'],
      },
    ],
  },
];

export function calculateCosts(
  visaCategory: string,
  primaryApplicants: number = 1,
  partners: number = 0,
  children: number = 0,
  includeOptional: boolean = false
): { items: CostBreakdownItem[]; total: number } {
  const items: CostBreakdownItem[] = [];
  let total = 0;

  for (const category of costCategories) {
    if (category.id === 'optional' && !includeOptional) continue;

    for (const item of category.items) {
      if (!item.applicableTo.includes(visaCategory)) continue;

      const applicable = true;
      let amount = item.minCost;
      let multiplier = 1;

      if (item.perPerson) {
        multiplier = primaryApplicants + partners + children;
      }

      const totalForItem = amount * multiplier;
      items.push({
        item: item.name,
        amount: totalForItem,
        perPerson: item.perPerson,
        notes: item.notes,
        applicable,
      });
      total += totalForItem;
    }
  }

  return { items, total };
}
