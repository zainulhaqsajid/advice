// SkillSelect Invitation Rounds Data & Occupation Tracker
// Data sourced from Department of Home Affairs, state nomination portals, and migration industry reports

export interface InvitationRound {
  id: string;
  date: string;
  visaType: '189' | '491';
  totalInvitations: number;
  minimumPoints: number;
  tieBreakDate: string;
  keyHighlights: string[];
  occupationBreakdown: OccupationInvitation[];
}

export interface OccupationInvitation {
  occupation: string;
  anzscoCode: string;
  category: string;
  invitations: number;
  minimumPoints: number;
  tieBreakDate: string;
  trend: 'rising' | 'stable' | 'declining';
}

export interface OccupationListEntry {
  occupation: string;
  anzscoCode: string;
  category: string;
  list: 'MLTSSL' | 'STSOL' | 'ROL';
  assessingBody: string;
  assessingBodyFull: string;
  assessmentCost: string;
  eligibleVisas: string[];
  stateNominationAvailable: string[];
  inDemand: boolean;
  tradeOccupation: boolean;
  minimumPointsRecent: number;
  futurePrediction: 'high_demand' | 'moderate_demand' | 'low_demand' | 'critical_shortage';
  predictionNotes: string;
}

export interface TradeCourse {
  id: string;
  courseName: string;
  qualification: string;
  aqfLevel: number;
  duration: string;
  costRange: string;
  provider: string;
  linkedOccupation: string;
  anzscoCode: string;
  assessingBody: string;
  pointsForQualification: number;
  canStudyOn485: boolean;
  statesInDemand: string[];
  futureDemand: 'very_high' | 'high' | 'moderate';
  notes: string;
}

export interface StateNominationInfo {
  state: string;
  stateCode: string;
  sc190Places: number;
  sc491Places: number;
  totalPlaces: number;
  tradeOccupationsInDemand: string[];
  keyRequirements: string[];
  lastRoundDate: string;
  lastRoundInvitations: number;
  nextRoundExpected: string;
}

export interface PathwayOption {
  id: string;
  title: string;
  description: string;
  visaType: string;
  currentPoints: number;
  additionalPointsPossible: number;
  totalPointsPossible: number;
  timelineMonths: string;
  estimatedCost: string;
  steps: string[];
  pros: string[];
  cons: string[];
  futurePrediction: string;
  successLikelihood: 'very_high' | 'high' | 'moderate' | 'low';
}

// ============================================================
// LAST 3 INVITATION ROUNDS DATA
// ============================================================

export const invitationRounds: InvitationRound[] = [
  {
    id: 'round_aug_2025',
    date: '21 August 2025',
    visaType: '189',
    totalInvitations: 6887,
    minimumPoints: 65,
    tieBreakDate: 'August 2025',
    keyHighlights: [
      'First round of 2025-26 program year',
      'Nearly 7,000 invitations - largest in recent years',
      'Trade occupations invited from as low as 65 points',
      'Engineering, science, law, and management required 90+ points',
      'Renewed government focus on independent skilled migration',
    ],
    occupationBreakdown: [
      { occupation: 'Registered Nurse', anzscoCode: '254499', category: 'Healthcare', invitations: 820, minimumPoints: 65, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Software Engineer', anzscoCode: '261313', category: 'ICT', invitations: 580, minimumPoints: 80, tieBreakDate: 'Jul 2025', trend: 'stable' },
      { occupation: 'Civil Engineer', anzscoCode: '233211', category: 'Engineering', invitations: 340, minimumPoints: 85, tieBreakDate: 'Jun 2025', trend: 'stable' },
      { occupation: 'Accountant (General)', anzscoCode: '221111', category: 'Accounting', invitations: 450, minimumPoints: 90, tieBreakDate: 'Apr 2025', trend: 'declining' },
      { occupation: 'Electrician (General)', anzscoCode: '341111', category: 'Trades', invitations: 290, minimumPoints: 65, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Carpenter', anzscoCode: '331212', category: 'Trades', invitations: 220, minimumPoints: 65, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Plumber (General)', anzscoCode: '334111', category: 'Trades', invitations: 240, minimumPoints: 65, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Welder (First Class)', anzscoCode: '322311', category: 'Trades', invitations: 180, minimumPoints: 65, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Chef', anzscoCode: '351311', category: 'Trades', invitations: 200, minimumPoints: 70, tieBreakDate: 'Jul 2025', trend: 'rising' },
      { occupation: 'Motor Mechanic', anzscoCode: '321211', category: 'Trades', invitations: 160, minimumPoints: 65, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Mechanical Engineer', anzscoCode: '233512', category: 'Engineering', invitations: 280, minimumPoints: 85, tieBreakDate: 'Jun 2025', trend: 'stable' },
      { occupation: 'ICT Business Analyst', anzscoCode: '261111', category: 'ICT', invitations: 310, minimumPoints: 85, tieBreakDate: 'Jun 2025', trend: 'stable' },
      { occupation: 'Developer Programmer', anzscoCode: '261312', category: 'ICT', invitations: 420, minimumPoints: 80, tieBreakDate: 'Jul 2025', trend: 'stable' },
      { occupation: 'Secondary School Teacher', anzscoCode: '241411', category: 'Education', invitations: 350, minimumPoints: 70, tieBreakDate: 'Aug 2025', trend: 'rising' },
      { occupation: 'Physiotherapist', anzscoCode: '252511', category: 'Healthcare', invitations: 190, minimumPoints: 70, tieBreakDate: 'Aug 2025', trend: 'rising' },
    ],
  },
  {
    id: 'round_aug_2025_491',
    date: '21 August 2025',
    visaType: '491',
    totalInvitations: 150,
    minimumPoints: 65,
    tieBreakDate: 'May 2025',
    keyHighlights: [
      'Small allocation for family-sponsored 491',
      'Minimum 65 points for most occupations',
      'Healthcare and trades prioritised',
    ],
    occupationBreakdown: [
      { occupation: 'Registered Nurse', anzscoCode: '254499', category: 'Healthcare', invitations: 25, minimumPoints: 65, tieBreakDate: 'May 2025', trend: 'rising' },
      { occupation: 'Electrician (General)', anzscoCode: '341111', category: 'Trades', invitations: 15, minimumPoints: 65, tieBreakDate: 'May 2025', trend: 'rising' },
      { occupation: 'Plumber (General)', anzscoCode: '334111', category: 'Trades', invitations: 12, minimumPoints: 65, tieBreakDate: 'May 2025', trend: 'rising' },
      { occupation: 'Carpenter', anzscoCode: '331212', category: 'Trades', invitations: 10, minimumPoints: 65, tieBreakDate: 'May 2025', trend: 'rising' },
      { occupation: 'Chef', anzscoCode: '351311', category: 'Trades', invitations: 10, minimumPoints: 65, tieBreakDate: 'May 2025', trend: 'rising' },
      { occupation: 'Secondary School Teacher', anzscoCode: '241411', category: 'Education', invitations: 8, minimumPoints: 65, tieBreakDate: 'May 2025', trend: 'rising' },
    ],
  },
  {
    id: 'round_nov_2025',
    date: '13 November 2025',
    visaType: '189',
    totalInvitations: 5200,
    minimumPoints: 65,
    tieBreakDate: 'November 2025',
    keyHighlights: [
      'Second major round of the 2025-26 program year',
      'Competitive points ranging 80-85 for most occupations',
      'Superior English a key factor for selection',
      'Applicants with 5-8+ years experience prominent',
      'STEM occupations required 90-95 points',
      'Trade occupations continued to be invited at lower points',
    ],
    occupationBreakdown: [
      { occupation: 'Registered Nurse', anzscoCode: '254499', category: 'Healthcare', invitations: 650, minimumPoints: 65, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Software Engineer', anzscoCode: '261313', category: 'ICT', invitations: 420, minimumPoints: 85, tieBreakDate: 'Oct 2025', trend: 'stable' },
      { occupation: 'Developer Programmer', anzscoCode: '261312', category: 'ICT', invitations: 350, minimumPoints: 85, tieBreakDate: 'Sep 2025', trend: 'stable' },
      { occupation: 'Civil Engineer', anzscoCode: '233211', category: 'Engineering', invitations: 280, minimumPoints: 90, tieBreakDate: 'Sep 2025', trend: 'stable' },
      { occupation: 'Accountant (General)', anzscoCode: '221111', category: 'Accounting', invitations: 380, minimumPoints: 90, tieBreakDate: 'Aug 2025', trend: 'declining' },
      { occupation: 'Electrician (General)', anzscoCode: '341111', category: 'Trades', invitations: 250, minimumPoints: 65, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Carpenter', anzscoCode: '331212', category: 'Trades', invitations: 200, minimumPoints: 65, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Plumber (General)', anzscoCode: '334111', category: 'Trades', invitations: 210, minimumPoints: 65, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Welder (First Class)', anzscoCode: '322311', category: 'Trades', invitations: 160, minimumPoints: 65, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Chef', anzscoCode: '351311', category: 'Trades', invitations: 170, minimumPoints: 70, tieBreakDate: 'Oct 2025', trend: 'rising' },
      { occupation: 'Motor Mechanic', anzscoCode: '321211', category: 'Trades', invitations: 140, minimumPoints: 65, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Mechanical Engineer', anzscoCode: '233512', category: 'Engineering', invitations: 220, minimumPoints: 90, tieBreakDate: 'Sep 2025', trend: 'stable' },
      { occupation: 'ICT Business Analyst', anzscoCode: '261111', category: 'ICT', invitations: 250, minimumPoints: 85, tieBreakDate: 'Sep 2025', trend: 'stable' },
      { occupation: 'Secondary School Teacher', anzscoCode: '241411', category: 'Education', invitations: 280, minimumPoints: 70, tieBreakDate: 'Nov 2025', trend: 'rising' },
      { occupation: 'Physiotherapist', anzscoCode: '252511', category: 'Healthcare', invitations: 150, minimumPoints: 70, tieBreakDate: 'Oct 2025', trend: 'rising' },
    ],
  },
  {
    id: 'round_nov_2025_491',
    date: '13 November 2025',
    visaType: '491',
    totalInvitations: 180,
    minimumPoints: 65,
    tieBreakDate: 'September 2025',
    keyHighlights: [
      'Increased allocation for family-sponsored 491',
      'Trade occupations continue to dominate',
      'Healthcare workers prioritised',
    ],
    occupationBreakdown: [
      { occupation: 'Registered Nurse', anzscoCode: '254499', category: 'Healthcare', invitations: 30, minimumPoints: 65, tieBreakDate: 'Sep 2025', trend: 'rising' },
      { occupation: 'Electrician (General)', anzscoCode: '341111', category: 'Trades', invitations: 20, minimumPoints: 65, tieBreakDate: 'Sep 2025', trend: 'rising' },
      { occupation: 'Plumber (General)', anzscoCode: '334111', category: 'Trades', invitations: 18, minimumPoints: 65, tieBreakDate: 'Sep 2025', trend: 'rising' },
      { occupation: 'Carpenter', anzscoCode: '331212', category: 'Trades', invitations: 15, minimumPoints: 65, tieBreakDate: 'Sep 2025', trend: 'rising' },
      { occupation: 'Chef', anzscoCode: '351311', category: 'Trades', invitations: 12, minimumPoints: 65, tieBreakDate: 'Sep 2025', trend: 'rising' },
      { occupation: 'Motor Mechanic', anzscoCode: '321211', category: 'Trades', invitations: 10, minimumPoints: 65, tieBreakDate: 'Sep 2025', trend: 'rising' },
    ],
  },
];

// ============================================================
// KEY OCCUPATIONS WITH FUTURE PREDICTIONS
// ============================================================

export const keyOccupations: OccupationListEntry[] = [
  // TRADES - HIGH DEMAND
  {
    occupation: 'Electrician (General)',
    anzscoCode: '341111',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'critical_shortage',
    predictionNotes: 'Critical shortage across all states. Infrastructure boom and renewable energy projects driving demand. Expected to remain at 65 points minimum through 2026-27. States actively nominating.',
  },
  {
    occupation: 'Plumber (General)',
    anzscoCode: '334111',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'critical_shortage',
    predictionNotes: 'Severe shortage nationally. Housing construction targets of 1.2M homes by 2029 require massive plumbing workforce. 65 points consistently invited.',
  },
  {
    occupation: 'Carpenter',
    anzscoCode: '331212',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'critical_shortage',
    predictionNotes: 'Housing boom driving unprecedented demand. All states nominating carpenters for 491. Points expected to stay at 65 minimum.',
  },
  {
    occupation: 'Welder (First Class)',
    anzscoCode: '322311',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['SA', 'WA', 'QLD', 'NT', 'TAS'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'high_demand',
    predictionNotes: 'Mining and infrastructure sectors driving demand, especially in WA and QLD. Defence projects also creating jobs. Invited at 65 points.',
  },
  {
    occupation: 'Chef',
    anzscoCode: '351311',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 70,
    futurePrediction: 'high_demand',
    predictionNotes: 'Hospitality industry recovery post-COVID continues. Regional areas desperately need chefs. Points 70 for 189, but 65 achievable via 491 state nomination.',
  },
  {
    occupation: 'Motor Mechanic (General)',
    anzscoCode: '321211',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['SA', 'WA', 'QLD', 'NT', 'TAS'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'high_demand',
    predictionNotes: 'Growing demand in regional areas. EV transition creating new specialised roles. Multiple states nominating for 491.',
  },
  {
    occupation: 'Airconditioning & Refrigeration Mechanic',
    anzscoCode: '342111',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['SA', 'WA', 'QLD', 'NT'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'high_demand',
    predictionNotes: 'Climate change driving increased demand. Commercial and residential HVAC installations growing rapidly.',
  },
  {
    occupation: 'Baker',
    anzscoCode: '351111',
    category: 'Trades',
    list: 'MLTSSL',
    assessingBody: 'TRA',
    assessingBodyFull: 'Trades Recognition Australia',
    assessmentCost: 'AUD $300-$600 + JRP fees',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['SA', 'TAS', 'NT'],
    inDemand: true,
    tradeOccupation: true,
    minimumPointsRecent: 65,
    futurePrediction: 'moderate_demand',
    predictionNotes: 'Consistent demand in regional areas. Available on multiple state nomination lists.',
  },
  // ICT OCCUPATIONS
  {
    occupation: 'Software Engineer',
    anzscoCode: '261313',
    category: 'ICT',
    list: 'MLTSSL',
    assessingBody: 'ACS',
    assessingBodyFull: 'Australian Computer Society',
    assessmentCost: 'AUD $550',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 80,
    futurePrediction: 'high_demand',
    predictionNotes: 'AI and cloud computing driving demand but highly competitive. Points trending 80-90. State nomination can provide advantage.',
  },
  {
    occupation: 'Developer Programmer',
    anzscoCode: '261312',
    category: 'ICT',
    list: 'MLTSSL',
    assessingBody: 'ACS',
    assessingBodyFull: 'Australian Computer Society',
    assessmentCost: 'AUD $550',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 80,
    futurePrediction: 'high_demand',
    predictionNotes: 'Strong demand continues. Competition high with many applicants in the 80-90 point range.',
  },
  {
    occupation: 'ICT Business Analyst',
    anzscoCode: '261111',
    category: 'ICT',
    list: 'MLTSSL',
    assessingBody: 'ACS',
    assessingBodyFull: 'Australian Computer Society',
    assessmentCost: 'AUD $550',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'SA', 'ACT'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 85,
    futurePrediction: 'moderate_demand',
    predictionNotes: 'Steady demand but highly competitive. AI transformation driving need for analysts who bridge tech and business.',
  },
  // ENGINEERING
  {
    occupation: 'Civil Engineer',
    anzscoCode: '233211',
    category: 'Engineering',
    list: 'MLTSSL',
    assessingBody: 'EA',
    assessingBodyFull: 'Engineers Australia',
    assessmentCost: 'AUD $1,200',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 85,
    futurePrediction: 'high_demand',
    predictionNotes: 'Infrastructure investment driving demand. Points remain high at 85-90 but consistent invitations.',
  },
  {
    occupation: 'Mechanical Engineer',
    anzscoCode: '233512',
    category: 'Engineering',
    list: 'MLTSSL',
    assessingBody: 'EA',
    assessingBodyFull: 'Engineers Australia',
    assessmentCost: 'AUD $1,200',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'WA'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 85,
    futurePrediction: 'high_demand',
    predictionNotes: 'Manufacturing and resources sector driving demand. Defence projects adding to requirement.',
  },
  {
    occupation: 'Electrical Engineer',
    anzscoCode: '233311',
    category: 'Engineering',
    list: 'MLTSSL',
    assessingBody: 'EA',
    assessingBodyFull: 'Engineers Australia',
    assessmentCost: 'AUD $1,200',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 85,
    futurePrediction: 'high_demand',
    predictionNotes: 'Renewable energy transition creating strong demand. Points competitive at 85-90.',
  },
  // HEALTHCARE
  {
    occupation: 'Registered Nurse',
    anzscoCode: '254499',
    category: 'Healthcare',
    list: 'MLTSSL',
    assessingBody: 'ANMAC',
    assessingBodyFull: 'Australian Nursing & Midwifery Accreditation Council',
    assessmentCost: 'AUD $600-$900',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 65,
    futurePrediction: 'critical_shortage',
    predictionNotes: 'Severe nationwide shortage. Every state nominating nurses. Invited at 65 points consistently. Expected to remain critical through 2028+.',
  },
  {
    occupation: 'Physiotherapist',
    anzscoCode: '252511',
    category: 'Healthcare',
    list: 'MLTSSL',
    assessingBody: 'APC',
    assessingBodyFull: 'Australian Physiotherapy Council',
    assessmentCost: 'AUD $800-$1,500',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 70,
    futurePrediction: 'high_demand',
    predictionNotes: 'Ageing population driving demand. NDIS sector creating additional roles. Points 70-80.',
  },
  // ACCOUNTING
  {
    occupation: 'Accountant (General)',
    anzscoCode: '221111',
    category: 'Accounting',
    list: 'MLTSSL',
    assessingBody: 'CPA/CAANZ/IPA',
    assessingBodyFull: 'CPA Australia / CA ANZ / Institute of Public Accountants',
    assessmentCost: 'AUD $600-$1,100',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['SA', 'TAS', 'NT'],
    inDemand: false,
    tradeOccupation: false,
    minimumPointsRecent: 90,
    futurePrediction: 'moderate_demand',
    predictionNotes: 'Oversaturated. Points consistently 90-95. Very competitive. State nomination options limited. Consider alternative pathways.',
  },
  // EDUCATION
  {
    occupation: 'Secondary School Teacher',
    anzscoCode: '241411',
    category: 'Education',
    list: 'MLTSSL',
    assessingBody: 'AITSL',
    assessingBodyFull: 'Australian Institute for Teaching and School Leadership',
    assessmentCost: 'AUD $1,170',
    eligibleVisas: ['189', '190', '491', '186', '482'],
    stateNominationAvailable: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    inDemand: true,
    tradeOccupation: false,
    minimumPointsRecent: 70,
    futurePrediction: 'high_demand',
    predictionNotes: 'Teacher shortage across Australia, especially in STEM and regional areas. Points 70-80.',
  },
];

// ============================================================
// TRADE COURSE OPTIONS (OPTION B)
// ============================================================

export const tradeCourses: TradeCourse[] = [
  {
    id: 'cert3_electrotechnology',
    courseName: 'Certificate III in Electrotechnology Electrician',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '3-4 years (includes apprenticeship)',
    costRange: 'AUD $8,000-$20,000 (subsidised at TAFE)',
    provider: 'TAFE NSW, TAFE QLD, Holmesglen, RMIT, South Metropolitan TAFE',
    linkedOccupation: 'Electrician (General)',
    anzscoCode: '341111',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    futureDemand: 'very_high',
    notes: 'Full apprenticeship required. Some RTOs offer accelerated pathways for those with overseas electrical qualifications. TAFE subsidies available in most states.',
  },
  {
    id: 'cert3_plumbing',
    courseName: 'Certificate III in Plumbing',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '3-4 years (includes apprenticeship)',
    costRange: 'AUD $6,000-$18,000 (subsidised at TAFE)',
    provider: 'TAFE NSW, TAFE QLD, Chisholm, Victoria University Polytechnic',
    linkedOccupation: 'Plumber (General)',
    anzscoCode: '334111',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    futureDemand: 'very_high',
    notes: 'Requires apprenticeship with licensed plumber. Gas fitting endorsement adds value. Government subsidies available for priority trade courses.',
  },
  {
    id: 'cert3_carpentry',
    courseName: 'Certificate III in Carpentry',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '3-4 years (includes apprenticeship)',
    costRange: 'AUD $5,000-$15,000 (subsidised at TAFE)',
    provider: 'TAFE NSW, TAFE SA, Holmesglen, RMIT, North Metropolitan TAFE',
    linkedOccupation: 'Carpenter',
    anzscoCode: '331212',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    futureDemand: 'very_high',
    notes: 'Housing construction boom driving extreme demand. Apprenticeships readily available. Regional areas offer additional incentives.',
  },
  {
    id: 'cert3_commercial_cookery',
    courseName: 'Certificate III in Commercial Cookery',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '12-18 months (full-time)',
    costRange: 'AUD $8,000-$25,000',
    provider: 'TAFE NSW, William Angliss Institute, Le Cordon Bleu, TAFE QLD',
    linkedOccupation: 'Chef',
    anzscoCode: '351311',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    futureDemand: 'high',
    notes: 'Shorter course duration than construction trades. Certificate IV in Commercial Cookery recommended for Chef nomination. Can progress to Diploma of Hospitality.',
  },
  {
    id: 'cert4_commercial_cookery',
    courseName: 'Certificate IV in Commercial Cookery',
    qualification: 'Certificate IV',
    aqfLevel: 4,
    duration: '18-24 months (full-time)',
    costRange: 'AUD $12,000-$30,000',
    provider: 'William Angliss Institute, Le Cordon Bleu, TAFE QLD, TAFE SA',
    linkedOccupation: 'Chef',
    anzscoCode: '351311',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'],
    futureDemand: 'high',
    notes: 'Preferred qualification for Chef skills assessment. Includes management skills. Can study while working on 485.',
  },
  {
    id: 'cert3_welding',
    courseName: 'Certificate III in Engineering - Fabrication Trade (Welding)',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '3-4 years (apprenticeship) or 12-18 months (pre-apprenticeship)',
    costRange: 'AUD $5,000-$15,000 (subsidised at TAFE)',
    provider: 'TAFE NSW, TAFE QLD, Kangan Institute, South Metropolitan TAFE',
    linkedOccupation: 'Welder (First Class)',
    anzscoCode: '322311',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['SA', 'WA', 'QLD', 'NT', 'TAS'],
    futureDemand: 'high',
    notes: 'Mining, infrastructure, and defence projects driving demand. WA and QLD particularly need welders. Accelerated pathways available for experienced welders.',
  },
  {
    id: 'cert3_automotive',
    courseName: 'Certificate III in Light Vehicle Mechanical Technology',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '3-4 years (apprenticeship)',
    costRange: 'AUD $6,000-$16,000 (subsidised at TAFE)',
    provider: 'TAFE NSW, Kangan Institute, TAFE SA, South Metropolitan TAFE',
    linkedOccupation: 'Motor Mechanic (General)',
    anzscoCode: '321211',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['SA', 'WA', 'QLD', 'NT', 'TAS'],
    futureDemand: 'high',
    notes: 'EV transition creating new opportunities. Regional areas in particular need mechanics. Certificate IV in Automotive Technology adds value.',
  },
  {
    id: 'diploma_building',
    courseName: 'Diploma of Building and Construction (Building)',
    qualification: 'Diploma',
    aqfLevel: 5,
    duration: '18-24 months (full-time)',
    costRange: 'AUD $10,000-$25,000',
    provider: 'TAFE NSW, RMIT, Holmesglen, TAFE QLD, TAFE SA',
    linkedOccupation: 'Construction Project Manager',
    anzscoCode: '133111',
    assessingBody: 'VETASSESS',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['NSW', 'VIC', 'QLD', 'SA', 'WA'],
    futureDemand: 'high',
    notes: 'Higher qualification option if you have trade background. Provides management pathway. Can lead to builder\'s licence.',
  },
  {
    id: 'cert3_aircon',
    courseName: 'Certificate III in Air-conditioning and Refrigeration',
    qualification: 'Certificate III',
    aqfLevel: 3,
    duration: '3-4 years (apprenticeship)',
    costRange: 'AUD $6,000-$18,000 (subsidised at TAFE)',
    provider: 'TAFE NSW, TAFE QLD, Chisholm, South Metropolitan TAFE',
    linkedOccupation: 'Airconditioning & Refrigeration Mechanic',
    anzscoCode: '342111',
    assessingBody: 'TRA',
    pointsForQualification: 10,
    canStudyOn485: true,
    statesInDemand: ['SA', 'WA', 'QLD', 'NT'],
    futureDemand: 'very_high',
    notes: 'Climate change driving enormous demand. Split system installations and commercial HVAC are booming sectors.',
  },
];

// ============================================================
// STATE NOMINATION DATA (2025-26)
// ============================================================

export const stateNominations: StateNominationInfo[] = [
  {
    state: 'New South Wales',
    stateCode: 'NSW',
    sc190Places: 2100,
    sc491Places: 1500,
    totalPlaces: 3600,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Chef', 'Welder'],
    keyRequirements: [
      'Must have occupation on NSW Skilled Occupation List',
      'Must live and work in NSW (491: regional NSW)',
      'Points test: minimum 65 + state nomination points',
      'Skills assessment must be valid',
      'Competent English minimum',
    ],
    lastRoundDate: 'December 2025',
    lastRoundInvitations: 480,
    nextRoundExpected: 'February 2026',
  },
  {
    state: 'Victoria',
    stateCode: 'VIC',
    sc190Places: 2700,
    sc491Places: 700,
    totalPlaces: 3400,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Chef'],
    keyRequirements: [
      'Must register on VIC ROI portal',
      'Points-based ranking system',
      'Must commit to living in Victoria',
      'Job offer or employment in Victoria preferred',
      'Higher points = better chances',
    ],
    lastRoundDate: 'January 2026',
    lastRoundInvitations: 520,
    nextRoundExpected: 'February 2026',
  },
  {
    state: 'Queensland',
    stateCode: 'QLD',
    sc190Places: 1850,
    sc491Places: 750,
    totalPlaces: 2600,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Chef', 'Motor Mechanic'],
    keyRequirements: [
      'Must have occupation on QLD Skilled Occupation List',
      'Commitment to live in Queensland',
      'For 491: must live in regional QLD',
      'Work experience in nominated occupation preferred',
    ],
    lastRoundDate: 'January 2026',
    lastRoundInvitations: 380,
    nextRoundExpected: 'February 2026',
  },
  {
    state: 'South Australia',
    stateCode: 'SA',
    sc190Places: 1350,
    sc491Places: 900,
    totalPlaces: 2250,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Chef', 'Motor Mechanic', 'Baker', 'Aircon Mechanic'],
    keyRequirements: [
      'Must register on Skilled & Business Migration portal',
      'Must have occupation on SA Occupation List',
      'Financial capacity demonstrated',
      'Commitment to live in South Australia for 2+ years',
      'Work experience in SA preferred',
    ],
    lastRoundDate: '8 January 2026',
    lastRoundInvitations: 344,
    nextRoundExpected: 'February 2026',
  },
  {
    state: 'Western Australia',
    stateCode: 'WA',
    sc190Places: 2000,
    sc491Places: 1400,
    totalPlaces: 3400,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Motor Mechanic', 'Aircon Mechanic', 'Chef'],
    keyRequirements: [
      'Must have occupation on WA Skilled Migration Occupation List',
      'Job offer in WA strongly preferred',
      'Must commit to living in WA',
      'Graduate pathway available for WA university graduates',
    ],
    lastRoundDate: 'December 2025',
    lastRoundInvitations: 450,
    nextRoundExpected: 'February 2026',
  },
  {
    state: 'Tasmania',
    stateCode: 'TAS',
    sc190Places: 1200,
    sc491Places: 650,
    totalPlaces: 1850,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Chef', 'Baker', 'Motor Mechanic'],
    keyRequirements: [
      'Must have job offer or have been living in Tasmania 6+ months',
      'Tasmania graduate pathway available',
      'Small business owner pathway available',
      'Weekly invitation rounds',
    ],
    lastRoundDate: 'February 2026',
    lastRoundInvitations: 120,
    nextRoundExpected: 'Weekly rounds ongoing',
  },
  {
    state: 'Northern Territory',
    stateCode: 'NT',
    sc190Places: 850,
    sc491Places: 800,
    totalPlaces: 1650,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Motor Mechanic', 'Chef', 'Aircon Mechanic'],
    keyRequirements: [
      'Must commit to living in NT for 3+ years',
      'Job offer in NT preferred',
      'Regional area - all NT counts as regional',
      'Lower competition than larger states',
    ],
    lastRoundDate: 'January 2026',
    lastRoundInvitations: 180,
    nextRoundExpected: 'March 2026',
  },
  {
    state: 'Australian Capital Territory',
    stateCode: 'ACT',
    sc190Places: 800,
    sc491Places: 800,
    totalPlaces: 1600,
    tradeOccupationsInDemand: ['Electrician', 'Plumber', 'Carpenter'],
    keyRequirements: [
      'Must have ACT-specific occupation on Critical Skills List',
      'Matrix-based points ranking (ACT-specific matrix)',
      'Must live in Canberra region',
      'Employment in ACT preferred',
    ],
    lastRoundDate: 'January 2026',
    lastRoundInvitations: 200,
    nextRoundExpected: 'February 2026',
  },
];

// ============================================================
// PATHWAY OPTIONS FOR USER SCENARIO
// (485 holder, 75 points for 491, has skills assessment)
// ============================================================

export const pathwayOptions: PathwayOption[] = [
  {
    id: 'option_a_491_current',
    title: 'Option A: SC 491 with Current Occupation',
    description: 'Apply for SC 491 state/territory nomination using your existing skills assessment and 75 points (60 base + 15 regional nomination). This is your primary pathway.',
    visaType: 'SC 491 (Regional)',
    currentPoints: 75,
    additionalPointsPossible: 20,
    totalPointsPossible: 95,
    timelineMonths: '3-12 months for nomination + 6-12 months processing',
    estimatedCost: 'AUD $4,770 (visa) + $300-$600 (state nomination fee)',
    steps: [
      'Ensure skills assessment is still valid (3-year validity)',
      'Check which states nominate your occupation for SC 491',
      'Submit Registration of Interest (ROI) to target state(s)',
      'Wait for state invitation to apply for nomination',
      'Lodge SC 491 application within 60 days of SkillSelect invitation',
      'Complete health & police checks',
      'Wait for visa grant (6-12 months)',
      'Live and work in regional area for 3 years',
      'Apply for SC 191 permanent visa',
    ],
    pros: [
      'You already have 75 points - competitive for many occupations',
      'Can apply immediately with existing skills assessment',
      'Multiple states to choose from',
      '+15 nomination points makes 60-point base very competitive',
      'Clear pathway to PR via SC 191 after 3 years',
    ],
    cons: [
      'Must live in regional area for 3 years',
      'Minimum $53,900/year income needed for SC 191',
      'State nomination approval not guaranteed',
      'Limited to occupations on state lists',
    ],
    futurePrediction: 'Strong outlook for 2026-27. Government has increased 491 allocation. States actively inviting in your points range. If your occupation is in trades or healthcare, excellent chances.',
    successLikelihood: 'high',
  },
  {
    id: 'option_b_trade_course',
    title: 'Option B: Trade Diploma/Course (Parallel Strategy)',
    description: 'Enrol in a trade course (Certificate III/IV or Diploma) while on your 485 visa as a backup/parallel strategy. This gives you a second occupation to apply for 491 in a high-demand trade.',
    visaType: 'SC 491 (Regional) - via trade occupation',
    currentPoints: 75,
    additionalPointsPossible: 10,
    totalPointsPossible: 85,
    timelineMonths: '12-24 months (course) + 6-12 months (skills assessment via TRA) + 6-12 months (visa processing)',
    estimatedCost: 'AUD $8,000-$25,000 (course) + $300-$600 (TRA) + $4,770 (visa)',
    steps: [
      'Research trade courses at TAFE or registered RTOs (check CRICOS if needed)',
      'Enrol in Certificate III/IV or Diploma in chosen trade while on 485',
      'Complete course (12-24 months depending on trade)',
      'Apply for TRA skills assessment (Job Ready Program if needed)',
      'Submit EOI with new trade occupation + existing points',
      'Apply for state nomination for trade occupation',
      'Lodge SC 491 application when invited',
    ],
    pros: [
      'Trade occupations invited at 65 points consistently',
      'Trades are in critical shortage - much easier to get state nomination',
      'Can study while on 485 visa (no study restriction)',
      'Gets you a second shot at nomination with a different occupation',
      'Australian study requirement can add +5 points',
      'Trade qualification valuable even if you get PR via Option A',
      'Regional study can add another +5 points',
    ],
    cons: [
      'Course takes 12-24 months minimum',
      'Additional cost ($8,000-$25,000)',
      'TRA assessment takes 6-12 months after course',
      'Must balance work and study on 485',
      'May need to extend 485 or transition visa if timing is tight',
      'Apprenticeship trades (electrical, plumbing) take 3-4 years',
    ],
    futurePrediction: 'Very strong outlook. Trade occupations are in critical shortage across Australia. The government is targeting 1.2 million new homes by 2029, creating enormous demand for construction trades. Trade occupations consistently invited at 65-70 points. States are desperate for tradespeople - easier state nomination than professional occupations.',
    successLikelihood: 'very_high',
  },
  {
    id: 'option_c_improve_points',
    title: 'Option C: Improve Points Score',
    description: 'Focus on improving your points score for a stronger 189/190/491 application with your current occupation.',
    visaType: 'SC 189/190/491',
    currentPoints: 75,
    additionalPointsPossible: 25,
    totalPointsPossible: 100,
    timelineMonths: '3-12 months to improve points + processing time',
    estimatedCost: 'AUD $400-$15,000 depending on strategy',
    steps: [
      'Improve English to Superior (IELTS 8+ or PTE 79+) for +10 points',
      'Consider NAATI credentialling for +5 points (if applicable)',
      'Complete Professional Year if eligible (+5 points)',
      'Gain more Australian work experience for additional points',
      'Consider studying in regional area for +5 points',
      'Re-submit EOI with improved points',
    ],
    pros: [
      'Can potentially reach 85-95 points for SC 189 (no regional requirement)',
      'Higher points = faster invitation',
      'Can target SC 190 with +5 state nomination',
      'No need for additional trade qualification',
    ],
    cons: [
      'Superior English is hard to achieve (IELTS 8.0 each)',
      'Professional Year costs $10,000-$15,000',
      'NAATI credentialling costs $800-$2,500 and takes months',
      'Still competing with high-scoring applicants',
      'Points improvement takes time',
    ],
    futurePrediction: 'Competitive. Points requirements for professional occupations remain high (85-95 for 189). If you can reach Superior English, it significantly improves chances across all visa types.',
    successLikelihood: 'moderate',
  },
  {
    id: 'option_d_employer_sponsored',
    title: 'Option D: Employer Sponsored Pathway',
    description: 'Seek employer sponsorship via SC 482 (TSS) to SC 186 (ENS) while on your 485 visa.',
    visaType: 'SC 482 to SC 186',
    currentPoints: 0,
    additionalPointsPossible: 0,
    totalPointsPossible: 0,
    timelineMonths: '2-3 years (482) + 6-12 months (186)',
    estimatedCost: 'AUD $3,035 (482) + $4,770 (186) - usually employer pays',
    steps: [
      'Find employer willing to sponsor',
      'Employer submits nomination',
      'Lodge SC 482 visa application',
      'Work for employer for 2+ years on 482',
      'Apply for SC 186 via Temporary Residence Transition (TRT) stream',
      'Receive permanent residency',
    ],
    pros: [
      'No points test required',
      'Employer usually pays sponsorship costs',
      'Direct path to permanent residency',
      'No regional requirement (unless employer is regional)',
    ],
    cons: [
      'Dependent on finding sponsoring employer',
      'Tied to one employer for 2+ years',
      'Employer must be approved sponsor',
      'Risk if employer withdraws sponsorship',
      'Labour market testing may be required',
    ],
    futurePrediction: 'Stable pathway. Government continues to support employer sponsorship for skill shortages. Works well as parallel strategy alongside points-tested pathways.',
    successLikelihood: 'moderate',
  },
];

// ============================================================
// FUTURE PREDICTION MODEL
// ============================================================

export interface FuturePrediction {
  occupation: string;
  category: string;
  currentMinPoints: number;
  predictedMinPoints2026H2: number;
  predictedMinPoints2027: number;
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  reasoning: string;
  recommendation: string;
}

export const futurePredictions: FuturePrediction[] = [
  {
    occupation: 'Electrician (General)',
    category: 'Trades',
    currentMinPoints: 65,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'Infrastructure boom, renewable energy transition, housing construction targets. Government has identified electricians as critical shortage.',
    recommendation: 'Excellent time to pursue. Apply immediately or start trade course. States actively nominating.',
  },
  {
    occupation: 'Plumber (General)',
    category: 'Trades',
    currentMinPoints: 65,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: '1.2M housing target requires massive plumbing workforce. Ageing workforce creating additional vacancies.',
    recommendation: 'Strong choice for trade course. Immediate opportunities via state nomination.',
  },
  {
    occupation: 'Carpenter',
    category: 'Trades',
    currentMinPoints: 65,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'Housing construction boom. National housing accord targets driving unprecedented demand.',
    recommendation: 'Top trade for migration. Every state is nominating carpenters.',
  },
  {
    occupation: 'Chef',
    category: 'Trades',
    currentMinPoints: 70,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'Hospitality recovery continuing. Regional areas have severe chef shortages. Shorter course duration than construction trades.',
    recommendation: 'Good option for faster trade pathway. Certificate IV achievable in 18-24 months.',
  },
  {
    occupation: 'Registered Nurse',
    category: 'Healthcare',
    currentMinPoints: 65,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'Severe nationwide shortage. Ageing population and workforce. Government priority occupation.',
    recommendation: 'If you have nursing qualifications, apply immediately. Highest demand occupation in Australia.',
  },
  {
    occupation: 'Software Engineer',
    category: 'ICT',
    currentMinPoints: 80,
    predictedMinPoints2026H2: 85,
    predictedMinPoints2027: 85,
    demandTrend: 'stable',
    reasoning: 'AI boom driving demand but large applicant pool keeps points high. Competition from global talent.',
    recommendation: 'Need 85+ points. Focus on Superior English and work experience to be competitive.',
  },
  {
    occupation: 'Accountant (General)',
    category: 'Accounting',
    currentMinPoints: 90,
    predictedMinPoints2026H2: 90,
    predictedMinPoints2027: 95,
    demandTrend: 'decreasing',
    reasoning: 'Oversaturated occupation. Large applicant pool. Very limited state nomination. Points consistently 90-95.',
    recommendation: 'Consider alternative occupations or trade course as backup. Very competitive via SC 189.',
  },
  {
    occupation: 'Civil Engineer',
    category: 'Engineering',
    currentMinPoints: 85,
    predictedMinPoints2026H2: 85,
    predictedMinPoints2027: 85,
    demandTrend: 'stable',
    reasoning: 'Infrastructure investment strong but competitive applicant pool. State nomination can help.',
    recommendation: 'Competitive at 85+. State nomination via SC 190 or 491 provides advantage.',
  },
  {
    occupation: 'Secondary School Teacher',
    category: 'Education',
    currentMinPoints: 70,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'Nationwide teacher shortage getting worse. STEM and regional teachers most in demand.',
    recommendation: 'Good prospects especially for STEM subjects. Regional areas offer best nomination chances.',
  },
  {
    occupation: 'Welder (First Class)',
    category: 'Trades',
    currentMinPoints: 65,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'Mining, defence, and infrastructure projects. WA and QLD have strong demand.',
    recommendation: 'Good trade option, especially for regional WA/QLD. Lower competition than construction trades.',
  },
  {
    occupation: 'Motor Mechanic',
    category: 'Trades',
    currentMinPoints: 65,
    predictedMinPoints2026H2: 65,
    predictedMinPoints2027: 65,
    demandTrend: 'increasing',
    reasoning: 'EV transition creating new specialised roles. Regional shortage of qualified mechanics.',
    recommendation: 'Solid trade choice. EV specialisation adds future value. Multiple states nominating.',
  },
];
