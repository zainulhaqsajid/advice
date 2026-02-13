export interface TRtoPathway {
  currentVisa: string;
  subclass: string;
  availablePRPathways: string;
  notes: string;
  urgency: 'low' | 'medium' | 'high';
}

export const trToPathways: TRtoPathway[] = [
  {
    currentVisa: 'Student',
    subclass: '500',
    availablePRPathways: '485 → 189/190/491 → PR; or employer sponsor 482 → 186',
    notes: 'Complete course first, then graduate visa, then skilled. Most common student to PR pathway.',
    urgency: 'low',
  },
  {
    currentVisa: 'Temporary Graduate',
    subclass: '485',
    availablePRPathways: '189, 190, 491, 482 → 186',
    notes: '2–4 years to build experience and points. Cannot go back to SC 500 onshore since July 2024.',
    urgency: 'medium',
  },
  {
    currentVisa: 'Skills in Demand (SID)',
    subclass: '482',
    availablePRPathways: '186 (TRT stream after 2–3 years)',
    notes: 'Employer must nominate. Direct PR pathway through Temporary Residence Transition stream.',
    urgency: 'medium',
  },
  {
    currentVisa: 'Skilled Regional',
    subclass: '491',
    availablePRPathways: '191 after 3 years in regional AU',
    notes: 'Must live/work in regional area. Meet income threshold ($53,900/year taxable income).',
    urgency: 'low',
  },
  {
    currentVisa: 'Partner (Temporary)',
    subclass: '820 or 309',
    availablePRPathways: '801 or 100 (permanent stage)',
    notes: 'Automatic pathway after 2 years if relationship is ongoing and genuine.',
    urgency: 'low',
  },
  {
    currentVisa: 'Bridging Visa A',
    subclass: 'BVA',
    availablePRPathways: 'Depends on underlying application',
    notes: 'BVA has same conditions as previous visa. Must wait for decision on substantive visa application.',
    urgency: 'medium',
  },
  {
    currentVisa: 'Bridging Visa B',
    subclass: 'BVB',
    availablePRPathways: 'Allows travel. Same pathway as BVA.',
    notes: 'Must apply for BVB before travelling if currently on BVA. Allows re-entry to Australia.',
    urgency: 'medium',
  },
  {
    currentVisa: 'Visitor',
    subclass: '600',
    availablePRPathways: 'Cannot apply for most visas onshore since 2024',
    notes: 'IMPORTANT: Since July 2024, cannot apply for student visa (SC 500) or most other visas onshore. Must leave Australia to apply.',
    urgency: 'high',
  },
  {
    currentVisa: 'Working Holiday',
    subclass: '417/462',
    availablePRPathways: '482 → 186, or skilled pathway',
    notes: 'Gain relevant Australian experience during working holiday, then transition to employer-sponsored or skilled visa.',
    urgency: 'medium',
  },
  {
    currentVisa: 'Business Innovation',
    subclass: '188',
    availablePRPathways: '888 (permanent business visa)',
    notes: 'Must meet business/investment milestones as specified in visa conditions.',
    urgency: 'low',
  },
  {
    currentVisa: 'Training',
    subclass: '407',
    availablePRPathways: 'No direct PR pathway',
    notes: 'Gain experience, then apply for skilled visa through standard points-tested or employer-sponsored pathways.',
    urgency: 'medium',
  },
  {
    currentVisa: 'Parent (Temporary)',
    subclass: '870',
    availablePRPathways: 'No PR pathway',
    notes: 'SC 870 is temporary only (3–5 years). Must apply separately for SC 143/864 for permanent parent visa.',
    urgency: 'low',
  },
];

export const courseChangeRules = [
  { scenario: 'Same provider, same or higher AQF level', rule: 'Allowed without new visa', newVisaNeeded: false },
  { scenario: 'Same provider, LOWER AQF level', rule: 'Must apply for new SC 500', newVisaNeeded: true },
  { scenario: 'Different provider, same or higher AQF level', rule: 'Allowed (first 6 months may need provider release)', newVisaNeeded: false },
  { scenario: 'Different provider, lower AQF level', rule: 'Must apply for new SC 500', newVisaNeeded: true },
  { scenario: 'PhD (AQF 10) to Masters (AQF 9)', rule: 'Exception: allowed without new visa', newVisaNeeded: false },
  { scenario: 'Changing major/thesis in higher education', rule: 'May need Minister\'s approval (conditions 8204A/8204B)', newVisaNeeded: 'possibly' as const },
  { scenario: 'Adding a course package (progression)', rule: 'Allowed if clear progression', newVisaNeeded: false },
  { scenario: 'Switching from VET to higher education', rule: 'Allowed (higher AQF)', newVisaNeeded: false },
  { scenario: 'Switching from higher education to VET', rule: 'Lower AQF: new visa needed', newVisaNeeded: true },
];

export const aqfLevels = [
  { level: 10, name: 'Doctoral Degree (PhD)', points: 20, prRelevance: 'Highest points. Specialist education bonus possible.' },
  { level: 9, name: "Master's Degree", points: 15, prRelevance: 'Strong for PR. Research masters gets specialist bonus.' },
  { level: 8, name: 'Graduate Diploma / Graduate Certificate', points: 15, prRelevance: 'Same points as Bachelors. Check skills assessment.' },
  { level: 7, name: "Bachelor's Degree", points: 15, prRelevance: 'Most common PR education pathway.' },
  { level: 6, name: 'Advanced Diploma / Associate Degree', points: 10, prRelevance: 'Trades and vocational. Check occupation list.' },
  { level: 5, name: 'Diploma', points: 10, prRelevance: 'Eligible for some trade occupations.' },
  { level: 4, name: 'Certificate IV', points: 10, prRelevance: 'Limited PR options. Trade qualifications may qualify.' },
  { level: 3, name: 'Certificate III', points: 10, prRelevance: 'Limited PR options. Some trade qualifications.' },
  { level: 2, name: 'Certificate II', points: 0, prRelevance: 'Generally not sufficient for PR.' },
  { level: 1, name: 'Certificate I', points: 0, prRelevance: 'Generally not sufficient for PR.' },
];
