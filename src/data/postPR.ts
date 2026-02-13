export interface PostPRTopic {
  id: string;
  title: string;
  description: string;
  details: string[];
  important?: boolean;
}

export const postPRTopics: PostPRTopic[] = [
  {
    id: 'medicare',
    title: 'Medicare Enrolment',
    description: 'Enrol immediately after PR grant for free public healthcare.',
    details: [
      'Enrol at a Medicare Service Centre with your passport and visa grant letter.',
      'You will receive a Medicare card within 2-3 weeks.',
      'Covers GP visits, specialist referrals, public hospital treatment.',
      'Consider private health insurance for extras (dental, optical, private hospital).',
    ],
  },
  {
    id: 'travel',
    title: 'Travel Facility',
    description: 'PR visa typically allows 5 years of travel from grant date.',
    details: [
      'Your PR visa comes with a 5-year travel facility from the date of grant.',
      'You can leave and re-enter Australia unlimited times during this period.',
      'After 5 years, you need a Resident Return Visa (RRV) to re-enter as a PR.',
      'If you are outside Australia when the travel facility expires, you cannot re-enter without an RRV.',
    ],
  },
  {
    id: 'rrv',
    title: 'Resident Return Visa (SC 155/157)',
    description: 'Required to re-enter Australia as PR after initial travel facility expires.',
    details: [
      'SC 155: 5-year RRV if you have lived in Australia for 2+ years in the last 5 years.',
      'SC 157: 1-year RRV if you have substantial ties to Australia but less time in country.',
      'Must demonstrate ties to Australia (business, employment, family, assets).',
      'Cost: approximately AUD $415.',
      'Apply before your current travel facility expires.',
    ],
    important: true,
  },
  {
    id: 'citizenship',
    title: 'Australian Citizenship',
    description: 'Eligible after 4 years of residence, including 1 year as PR.',
    details: [
      'Must have been a PR for at least 12 months at time of application.',
      'Must have been in Australia for at least 4 years (as a lawful resident), with no more than 12 months total absence.',
      'In the 12 months before applying, must not have been absent for more than 90 days.',
      'Must pass the citizenship test (unless under 18 or over 60).',
      'Must be of good character.',
      'Processing time: typically 4-12 months.',
    ],
  },
  {
    id: 'citizenship_test',
    title: 'Citizenship Test',
    description: '20 multiple-choice questions. Must score 75%+.',
    details: [
      '20 multiple-choice questions from the "Australian Citizenship: Our Common Bond" resource.',
      'Must score at least 75% (15 out of 20 correct).',
      'Covers Australian values, democratic beliefs, rights, and responsibilities.',
      'Also covers Australian history, symbols, and the flag.',
      'Free to sit. Can retake if failed.',
      'Available in English only — interpreters available if needed.',
    ],
  },
  {
    id: 'dual_citizenship',
    title: 'Dual Citizenship',
    description: 'Australia allows dual citizenship. Check if your home country does too.',
    details: [
      'Australia has allowed dual citizenship since 2002.',
      'You do NOT need to renounce your original citizenship to become Australian.',
      'However, some countries do NOT allow dual citizenship — check with your home country\'s embassy.',
      'If your home country does not allow dual citizenship, you may lose your original citizenship upon becoming Australian.',
    ],
  },
  {
    id: 'sponsoring_family',
    title: 'Sponsoring Family Members',
    description: 'As PR/citizen, you can sponsor partner, parents, or other family members.',
    details: [
      'Partner visa: Can sponsor your partner (subject to sponsorship limits — max 2 lifetime, 5-year gap).',
      'Parent visa: Can sponsor your parents (must be resident in Australia for 2+ years).',
      'Child visa: Can sponsor dependent children.',
      'Other family: Limited options for siblings, carers, and remaining relatives.',
    ],
  },
  {
    id: 'voting',
    title: 'Voting',
    description: 'Must register to vote once you become a citizen (compulsory).',
    details: [
      'Voting is COMPULSORY in Australia for all citizens over 18.',
      'Register with the Australian Electoral Commission (AEC) after becoming a citizen.',
      'Failure to vote results in a fine.',
      'Covers federal, state, and local government elections.',
    ],
  },
  {
    id: 'tax',
    title: 'Tax Obligations',
    description: 'Become tax resident. Must lodge annual tax return.',
    details: [
      'As a PR, you are generally considered an Australian tax resident.',
      'Must obtain a Tax File Number (TFN) from the Australian Taxation Office (ATO).',
      'Must lodge an annual tax return by 31 October (or later if using a tax agent).',
      'Australian tax residents are taxed on worldwide income.',
      'Tax-free threshold: first $18,200 of income is tax-free.',
    ],
  },
  {
    id: 'super',
    title: 'Superannuation',
    description: 'Employer contributions are mandatory. Access at retirement age.',
    details: [
      'Employers must contribute 11.5% of your salary to a super fund (as of 2025-26).',
      'Choose your own super fund or use your employer\'s default.',
      'Cannot access super until preservation age (currently 60).',
      'If you leave Australia permanently, may be able to claim super early under certain conditions.',
    ],
  },
  {
    id: 'centrelink',
    title: 'Centrelink / Welfare',
    description: 'Most payments have a waiting period (2-4 years for new PR holders).',
    details: [
      'Newly Arrived Resident\'s Waiting Period (NARWP) applies to most payments.',
      'Generally 4 years for most income support payments (JobSeeker, Youth Allowance).',
      '1 year for Family Tax Benefit and Parental Leave Pay.',
      'Some payments are exempt from waiting period (e.g., Special Benefit in hardship).',
      'Medicare is available immediately — no waiting period.',
    ],
  },
  {
    id: 'regional_491',
    title: 'Regional Requirements (SC 491)',
    description: 'Must live/work in regional area for 3 years and earn minimum income to apply for SC 191 PR.',
    details: [
      'Must live, work, and study in a designated regional area for at least 3 years.',
      'Must earn a minimum taxable income of $53,900 per year (as of 2024-25).',
      'Can then apply for SC 191 (permanent) visa.',
      'Regional areas include everywhere except Sydney, Melbourne, and Brisbane.',
      'Gold Coast, Perth, and other cities ARE considered regional.',
    ],
    important: true,
  },
];
