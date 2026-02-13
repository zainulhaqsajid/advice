import { BalanceOfFamilyResult, ChildLocation } from '@/types/visa';

export function calculateBalanceOfFamily(
  totalChildren: number,
  childrenInAustralia: number,
  childLocations: ChildLocation[]
): BalanceOfFamilyResult {
  if (totalChildren === 0) {
    return {
      passed: false,
      totalChildren: 0,
      childrenInAustralia: 0,
      explanation: 'The parent must have at least one child who is an Australian citizen, permanent resident, or eligible New Zealand citizen settled in Australia.',
    };
  }

  // Test 1: At least half of children are settled in Australia
  const halfOrMore = childrenInAustralia >= totalChildren / 2;

  // Test 2: More children in Australia than in any other single country
  const countryCounts: Record<string, number> = {};
  for (const loc of childLocations) {
    if (!loc.isAuCitizenOrPR) {
      countryCounts[loc.country] = (countryCounts[loc.country] || 0) + loc.count;
    }
  }

  let maxOtherCountry = 0;
  let maxOtherCountryName = '';
  for (const [country, count] of Object.entries(countryCounts)) {
    if (count > maxOtherCountry) {
      maxOtherCountry = count;
      maxOtherCountryName = country;
    }
  }

  const moreInAuThanAnyOther = childrenInAustralia > maxOtherCountry;

  const passed = halfOrMore || moreInAuThanAnyOther;

  let explanation = '';
  if (passed) {
    if (halfOrMore) {
      explanation = `PASSED: ${childrenInAustralia} out of ${totalChildren} children (${Math.round((childrenInAustralia / totalChildren) * 100)}%) are settled in Australia, which meets the "at least half" requirement.`;
    } else {
      explanation = `PASSED: While less than half of children are in Australia (${childrenInAustralia} out of ${totalChildren}), there are more children in Australia than in any other single country (${maxOtherCountryName} has ${maxOtherCountry}).`;
    }
  } else {
    explanation = `FAILED: Only ${childrenInAustralia} out of ${totalChildren} children are settled in Australia. The Balance of Family Test requires at least half of the parent's children to be in Australia, OR more children in Australia than any other single country.`;
    if (maxOtherCountryName) {
      explanation += ` ${maxOtherCountryName} has ${maxOtherCountry} children.`;
    }
  }

  return {
    passed,
    totalChildren,
    childrenInAustralia,
    explanation,
  };
}

export function isSC870Exempt(): string {
  return 'Note: The SC 870 (Sponsored Parent Temporary) visa is EXEMPT from the Balance of Family Test. If the parent is seeking a temporary stay, this test does not apply.';
}
