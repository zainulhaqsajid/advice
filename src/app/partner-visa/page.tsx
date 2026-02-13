'use client';

import { useState } from 'react';

interface FormData {
  relationshipType: string;
  relationshipDuration: number;
  livingTogether: string;
  childrenTogether: string;
  sponsorStatus: string;
  sponsorAge: number;
  sponsorSponsoredBefore: string;
  sponsorPreviousCount: number;
  applicantInAustralia: string;
  previousVisaRefusals: string;
  condition8503: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

const initialFormData: FormData = {
  relationshipType: '',
  relationshipDuration: 0,
  livingTogether: '',
  childrenTogether: '',
  sponsorStatus: '',
  sponsorAge: 0,
  sponsorSponsoredBefore: '',
  sponsorPreviousCount: 0,
  applicantInAustralia: '',
  previousVisaRefusals: '',
  condition8503: '',
};

const pathways = [
  {
    name: 'Onshore Partner (Temp)',
    subclass: 'SC 820',
    location: 'In Australia',
    processing: '21-34 months',
    cost: 'AUD $9,095',
  },
  {
    name: 'Onshore Partner (Perm)',
    subclass: 'SC 801',
    location: 'Auto after 820',
    processing: '12-20 months after eligibility',
    cost: 'Included in 820',
  },
  {
    name: 'Offshore Partner (Temp)',
    subclass: 'SC 309',
    location: 'Outside Australia',
    processing: '21-31 months',
    cost: 'AUD $9,095',
  },
  {
    name: 'Offshore Partner (Perm)',
    subclass: 'SC 100',
    location: 'Auto after 309',
    processing: '19-29 months after eligibility',
    cost: 'Included in 309',
  },
  {
    name: 'Prospective Marriage',
    subclass: 'SC 300',
    location: 'Outside Australia',
    processing: '18-28 months',
    cost: 'AUD $9,095',
  },
];

const complexScenarios = [
  {
    id: 'separation',
    title: 'Separation Before Visa Decision',
    content:
      'If you separate from your partner before the temporary visa (SC 820 or SC 309) is decided, the application will generally be refused. However, there are limited exceptions: if you have experienced domestic violence from your sponsor, or if you have dependent children affected by the separation. You must notify the Department of Home Affairs of any change in your relationship status. Failure to do so may result in cancellation of any visa granted.',
  },
  {
    id: 'divorce-after-temp',
    title: 'Divorce After Temp Visa Grant, Before Permanent',
    content:
      'If you divorce or separate after the temporary partner visa (SC 820 or SC 309) is granted but before the permanent visa (SC 801 or SC 100) is decided, the permanent visa will generally be refused. Exceptions apply in cases of domestic violence or if there are dependent children of the relationship. You must demonstrate that the relationship was genuine at the time of application and that its breakdown was not foreseeable.',
  },
  {
    id: 'domestic-violence',
    title: 'Domestic Violence Provisions',
    content:
      'If you have experienced domestic or family violence from your sponsor, you may still be eligible for the permanent partner visa even if the relationship has broken down. You will need to provide evidence of the violence, which can include: a court order (injunction, restraining order), a police report, or statutory declarations from two competent persons (such as a doctor, social worker, or psychologist). The domestic violence provisions are designed to ensure that victims are not forced to remain in dangerous relationships to maintain their visa status.',
  },
  {
    id: 'sponsor-limit',
    title: 'Sponsor Has Sponsored 2+ Times Before',
    content:
      'A sponsor can generally only sponsor two partners for a partner visa in their lifetime, and there must be at least 5 years between each sponsorship. If the sponsor has already sponsored two partners, further sponsorship will generally be refused unless there are compelling circumstances. Compelling circumstances may include situations where the refusal would not be in the best interests of a child, or where there are strong compassionate grounds. The limitation applies regardless of whether the previous sponsored person was granted a visa.',
  },
  {
    id: 'defacto-under-12',
    title: 'De Facto Relationship Less Than 12 Months',
    content:
      'De facto relationships generally need to have existed for at least 12 months before lodging a partner visa application. However, there are exemptions: if you have a child together from the de facto relationship, if the de facto relationship is registered with an Australian state or territory, or if there are compelling or compassionate circumstances. Without one of these exemptions, you may need to wait until the 12-month threshold is reached before applying, or consider alternative visa pathways.',
  },
  {
    id: 'same-sex',
    title: 'Same-Sex Relationship',
    content:
      'Same-sex relationships have full eligibility for all partner visa subclasses under Australian immigration law. Since December 2017, same-sex couples can also marry in Australia. For immigration purposes, same-sex de facto relationships and marriages are treated identically to opposite-sex relationships. The same evidence requirements apply, and there are no additional hurdles. If your home country does not recognise your relationship, this does not affect your eligibility under Australian law.',
  },
  {
    id: 'pmv-no-marry',
    title: 'Prospective Marriage - Did Not Marry Within 9 Months',
    content:
      'The Prospective Marriage visa (SC 300) requires the couple to marry within 9 months of the visa holder arriving in Australia. If the marriage does not occur within this period, the visa will expire and the holder must leave Australia. In exceptional circumstances, a single extension may be granted (typically 3-6 months). After marriage, the visa holder must then apply for a Subclass 820 onshore partner visa to continue their stay. Failure to marry and apply for the onshore visa will result in the person becoming unlawful.',
  },
  {
    id: 'skilled-pr',
    title: 'Partner Visa Holder Pursuing Skilled PR',
    content:
      'If you hold a temporary partner visa (SC 820 or SC 309), you may also explore skilled migration pathways for permanent residency. This could be advantageous if your skills assessment and points test score make you eligible for a Subclass 189 or 190 visa, which may have faster processing. However, you should carefully consider the implications: withdrawing your partner visa application means losing the fees paid, and a skilled visa may have different conditions. Many people choose to maintain both applications simultaneously where possible. Consult a migration agent to determine the best strategy.',
  },
  {
    id: 'condition-8503',
    title: 'Condition 8503 - No Further Stay',
    content:
      'Condition 8503 ("No Further Stay") prevents the holder from applying for most substantive visas while in Australia. This is a significant barrier for onshore partner visa applications. If your current visa has Condition 8503, you generally cannot lodge an onshore partner visa (SC 820) unless a waiver is granted. Waivers are only granted in limited circumstances, such as: compelling and compassionate circumstances, or where it would be unreasonable for you to leave Australia to apply offshore. If a waiver is not granted, you must depart Australia and apply for an offshore partner visa (SC 309) instead.',
  },
  {
    id: 'sc485-partner-eligible',
    title: 'SC 485 Holder - Applying for Partner Visa',
    content:
      'If you hold a Subclass 485 (Temporary Graduate) visa and are in a genuine relationship with an Australian citizen, permanent resident, or eligible NZ citizen, you can apply for an onshore partner visa (SC 820) while in Australia. The SC 485 does not have Condition 8503, so there is no "No Further Stay" restriction. Once you lodge the SC 820, you will receive a Bridging Visa A (BVA) that activates when your SC 485 expires. This BVA allows you to remain in Australia with work rights while your partner visa is being processed. Timing tip: You do not need to wait until your SC 485 expires — lodge the SC 820 whenever your relationship meets the criteria.',
  },
  {
    id: 'sc485-expired-partner',
    title: 'SC 485 Expired - Can I Still Apply for Partner Visa?',
    content:
      'If your SC 485 has already expired and you are on a Bridging Visa (for example, BVA from a prior application, or BVE), you may still be eligible to lodge a partner visa onshore, depending on the conditions of your bridging visa. If you are unlawful (no valid visa), you cannot lodge an onshore partner visa. In this case, you would need to either: (1) depart Australia and apply for an offshore partner visa (SC 309), or (2) in exceptional circumstances, apply for a Bridging Visa E to depart voluntarily. It is critical to not overstay — seek advice from a MARA-registered migration agent immediately if your SC 485 is about to expire.',
  },
  {
    id: 'sc485-partner-work-rights',
    title: 'SC 485 to Partner Visa - Work Rights During Processing',
    content:
      'While on a SC 485 visa, you have full work rights (no hours restriction). When you lodge a partner visa (SC 820) application, you are granted a Bridging Visa A (BVA). The BVA does not activate until your SC 485 expires. Once the BVA activates, it typically includes full work rights (Condition 8501 — must maintain health insurance). There is generally no gap in work rights during the transition from SC 485 to BVA. Ensure you maintain valid health insurance cover throughout, as this is a condition on both visa types.',
  },
  {
    id: 'sc485-de-facto-12-months',
    title: 'SC 485 - De Facto Relationship Under 12 Months',
    content:
      'If you are on a SC 485 and in a de facto relationship that has not yet reached the 12-month threshold, you generally cannot lodge a partner visa yet. However, there are exemptions: (1) if you have a child together, (2) if the relationship is registered with an Australian state or territory registry, or (3) if there are compelling and compassionate circumstances. Many SC 485 holders start their de facto relationship after arriving in Australia. In this case, consider registering your relationship with the state government (available in NSW, VIC, QLD, TAS, SA, ACT) as an alternative to waiting 12 months.',
  },
  {
    id: 'sc485-skilled-vs-partner',
    title: 'SC 485 Holder - Skilled Visa vs Partner Visa Strategy',
    content:
      'If you hold a SC 485 and have both a genuine partner relationship and a skilled migration pathway available, you may want to consider your options carefully. The partner visa (SC 820) costs AUD $9,095 with processing times of 21-34 months for the temporary stage. The skilled visa (SC 189/190) costs AUD $4,640 but requires a positive skills assessment, sufficient points (65+), and an EOI invitation. Some applicants choose to pursue both simultaneously: lodge the SC 820 for security while also submitting an EOI for a skilled visa. If the skilled visa is granted first, you can withdraw the partner visa application (note: fees are not refundable). Consult a migration agent to determine the best strategy for your specific circumstances.',
  },
];

export default function PartnerVisaPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showAssessment, setShowAssessment] = useState(false);
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(new Set());
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'financial',
      label: 'Joint Financial Commitments',
      description:
        'Joint bank accounts, shared loans or mortgages, joint credit cards, shared insurance policies, joint property ownership, shared utility bills',
      checked: false,
    },
    {
      id: 'household',
      label: 'Nature of Household',
      description:
        'Joint lease or mortgage, shared household responsibilities, shared ownership of household items, evidence of living at the same address',
      checked: false,
    },
    {
      id: 'social',
      label: 'Social Recognition',
      description:
        'Joint invitations or attendance at events, photos together over time, joint memberships, evidence of being known as a couple by friends and family',
      checked: false,
    },
    {
      id: 'commitment',
      label: 'Commitment Evidence',
      description:
        'Knowledge of each other\'s personal details, shared future plans, wills naming each other, power of attorney for each other, combined superannuation beneficiaries',
      checked: false,
    },
    {
      id: 'communication',
      label: 'Communication History',
      description:
        'Phone call records, messaging history, email correspondence, video call logs, social media interactions showing ongoing communication',
      checked: false,
    },
    {
      id: 'statutory',
      label: 'Statutory Declarations (2+)',
      description:
        'At least two statutory declarations from Australian citizens or permanent residents who know the relationship personally and can attest to its genuineness',
      checked: false,
    },
    {
      id: 'form888',
      label: 'Form 888 - Supporting Statements',
      description:
        'Completed Form 888 from two Australian citizens or permanent residents providing a supporting statement about the genuineness of the relationship',
      checked: false,
    },
  ]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowAssessment(false);
  };

  const toggleScenario = (id: string) => {
    setExpandedScenarios((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const runAssessment = () => {
    setShowAssessment(true);
  };

  const getRecommendedPathway = () => {
    if (formData.applicantInAustralia === 'yes') {
      return {
        temp: 'Subclass 820 (Onshore Partner - Temporary)',
        perm: 'Subclass 801 (Onshore Partner - Permanent)',
        description:
          'Since the applicant is in Australia, the onshore partner visa pathway is recommended. Apply for SC 820 first, then SC 801 is assessed automatically after the eligibility period.',
      };
    }
    if (formData.relationshipType === 'engaged') {
      return {
        temp: 'Subclass 300 (Prospective Marriage)',
        perm: 'Then apply for SC 820 after marriage in Australia',
        description:
          'Since the couple is engaged and the applicant is outside Australia, the Prospective Marriage visa is the appropriate pathway. After arriving in Australia and marrying within 9 months, apply for SC 820.',
      };
    }
    return {
      temp: 'Subclass 309 (Offshore Partner - Temporary)',
      perm: 'Subclass 100 (Offshore Partner - Permanent)',
      description:
        'Since the applicant is outside Australia, the offshore partner visa pathway is recommended. Apply for SC 309 first, then SC 100 is assessed automatically after the eligibility period.',
    };
  };

  const getAlerts = () => {
    const alerts: { type: 'red' | 'warning' | 'info'; message: string }[] = [];

    if (formData.condition8503 === 'yes') {
      alerts.push({
        type: 'red',
        message:
          'RED ALERT: Condition 8503 ("No Further Stay") is present on the current visa. This prevents lodging most onshore visa applications, including SC 820. A waiver must be requested (limited grounds), or the applicant must depart Australia and apply offshore (SC 309). Consult a MARA-registered migration agent immediately.',
      });
    }

    if (formData.relationshipType === 'defacto' && formData.relationshipDuration < 12) {
      alerts.push({
        type: 'warning',
        message:
          'Warning: De facto relationships must generally have existed for at least 12 months before lodging. Exemptions exist if you have a child together, have registered the relationship with an Australian state/territory, or there are compelling and compassionate circumstances.',
      });
    }

    if (
      formData.sponsorSponsoredBefore === 'yes' &&
      formData.sponsorPreviousCount >= 2
    ) {
      alerts.push({
        type: 'warning',
        message:
          'Warning: The sponsor has sponsored 2 or more partners previously. A person can generally only sponsor two partners in their lifetime, with at least 5 years between each sponsorship. Further sponsorship may be refused unless compelling circumstances exist.',
      });
    }

    if (formData.relationshipType === 'samesex') {
      alerts.push({
        type: 'info',
        message:
          'Same-sex relationships have full eligibility for all partner visa subclasses under Australian immigration law. Same-sex marriages and de facto relationships are treated identically to opposite-sex relationships. No additional requirements apply.',
      });
    }

    if (formData.previousVisaRefusals === 'yes') {
      alerts.push({
        type: 'warning',
        message:
          'Warning: Previous visa refusals may affect eligibility or processing. Ensure all prior refusals are disclosed in the application. Failure to disclose may constitute a failure of the Public Interest Criteria (PIC 4020 - provision of false or misleading information).',
      });
    }

    if (formData.sponsorAge > 0 && formData.sponsorAge < 18) {
      alerts.push({
        type: 'red',
        message:
          'RED ALERT: The sponsor must be at least 18 years of age to sponsor a partner visa applicant. The current sponsor age entered does not meet this requirement.',
      });
    }

    return alerts;
  };

  const isFormComplete = () => {
    return (
      formData.relationshipType !== '' &&
      formData.relationshipDuration > 0 &&
      formData.livingTogether !== '' &&
      formData.childrenTogether !== '' &&
      formData.sponsorStatus !== '' &&
      formData.sponsorAge > 0 &&
      formData.sponsorSponsoredBefore !== '' &&
      formData.applicantInAustralia !== '' &&
      formData.previousVisaRefusals !== '' &&
      formData.condition8503 !== ''
    );
  };

  const completedCount = checklist.filter((item) => item.checked).length;

  return (
    <div className="space-y-8">
      {/* Section 1: Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Partner &amp; Spouse Visa Module</h1>
        <p className="text-blue-100 text-lg leading-relaxed max-w-4xl">
          Comprehensive module for handling all partner visa scenarios under Australian immigration
          law. This tool covers onshore and offshore partner visas, prospective marriage visas, de
          facto relationships, same-sex partnerships, and complex situations including domestic
          violence provisions, condition 8503 waivers, and sponsor limitation rules. Use the
          interactive intake form below to receive a tailored eligibility assessment.
        </p>
      </div>

      {/* Section 2: Partner Visa Pathways Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Partner Visa Pathways</h2>
          <p className="text-blue-200 text-sm mt-1">
            All five partner visa subclasses with current processing times and fees
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">
                  Pathway
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">
                  Subclass
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">
                  Location Requirement
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">
                  Processing Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">
                  Application Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pathways.map((pathway, index) => (
                <tr
                  key={pathway.subclass}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {pathway.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700 font-semibold">
                    {pathway.subclass}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pathway.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pathway.processing}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pathway.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Interactive Intake Form */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Interactive Intake Form</h2>
          <p className="text-blue-200 text-sm mt-1">
            Complete all fields to receive a tailored eligibility assessment
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Relationship Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Relationship Type
              </label>
              <select
                value={formData.relationshipType}
                onChange={(e) => handleInputChange('relationshipType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select relationship type</option>
                <option value="married">Married</option>
                <option value="defacto">De Facto</option>
                <option value="samesex">Same-sex</option>
                <option value="engaged">Engaged</option>
              </select>
            </div>

            {/* Relationship Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Relationship Duration (months)
              </label>
              <input
                type="number"
                min="0"
                value={formData.relationshipDuration || ''}
                onChange={(e) =>
                  handleInputChange('relationshipDuration', parseInt(e.target.value) || 0)
                }
                placeholder="Enter months"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Living Together */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Living Together?
              </label>
              <select
                value={formData.livingTogether}
                onChange={(e) => handleInputChange('livingTogether', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Children Together */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Children Together?
              </label>
              <select
                value={formData.childrenTogether}
                onChange={(e) => handleInputChange('childrenTogether', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Sponsor Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sponsor Status
              </label>
              <select
                value={formData.sponsorStatus}
                onChange={(e) => handleInputChange('sponsorStatus', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select sponsor status</option>
                <option value="citizen">Australian Citizen</option>
                <option value="pr">Permanent Resident</option>
                <option value="nz">NZ Citizen (Eligible)</option>
              </select>
            </div>

            {/* Sponsor Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sponsor Age
              </label>
              <input
                type="number"
                min="0"
                value={formData.sponsorAge || ''}
                onChange={(e) => handleInputChange('sponsorAge', parseInt(e.target.value) || 0)}
                placeholder="Must be 18+"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sponsor Sponsored Before */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sponsor Sponsored Before?
              </label>
              <select
                value={formData.sponsorSponsoredBefore}
                onChange={(e) => handleInputChange('sponsorSponsoredBefore', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Previous Sponsor Count - conditional */}
            {formData.sponsorSponsoredBefore === 'yes' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  How Many Times Sponsored?
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sponsorPreviousCount || ''}
                  onChange={(e) =>
                    handleInputChange('sponsorPreviousCount', parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Applicant in Australia */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Applicant Currently in Australia?
              </label>
              <select
                value={formData.applicantInAustralia}
                onChange={(e) => handleInputChange('applicantInAustralia', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Previous Visa Refusals */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Previous Visa Refusals?
              </label>
              <select
                value={formData.previousVisaRefusals}
                onChange={(e) => handleInputChange('previousVisaRefusals', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Condition 8503 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Condition 8503 on Current Visa?
              </label>
              <select
                value={formData.condition8503}
                onChange={(e) => handleInputChange('condition8503', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={runAssessment}
              disabled={!isFormComplete()}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isFormComplete()
                  ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Run Eligibility Assessment
            </button>
            {!isFormComplete() && (
              <span className="text-sm text-gray-500">
                Please complete all fields to run the assessment
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Eligibility Assessment */}
      {showAssessment && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Eligibility Assessment Results</h2>
            <p className="text-blue-200 text-sm mt-1">
              Based on the information provided in the intake form
            </p>
          </div>
          <div className="p-6 space-y-6">
            {/* Recommended Pathway */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Recommended Pathway</h3>
              <div className="space-y-2">
                <p className="text-blue-800">
                  <span className="font-semibold">Temporary Visa:</span>{' '}
                  {getRecommendedPathway().temp}
                </p>
                <p className="text-blue-800">
                  <span className="font-semibold">Permanent Visa:</span>{' '}
                  {getRecommendedPathway().perm}
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  {getRecommendedPathway().description}
                </p>
              </div>
            </div>

            {/* Alerts */}
            {getAlerts().length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Alerts &amp; Notifications</h3>
                {getAlerts().map((alert, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border-l-4 ${
                      alert.type === 'red'
                        ? 'bg-red-50 border-red-600 text-red-800'
                        : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                        : 'bg-blue-50 border-blue-500 text-blue-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5">
                        {alert.type === 'red' && (
                          <svg
                            className="h-5 w-5 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {alert.type === 'warning' && (
                          <svg
                            className="h-5 w-5 text-yellow-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {alert.type === 'info' && (
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary of Inputs */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Assessment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Relationship Type:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.relationshipType === 'defacto'
                      ? 'De Facto'
                      : formData.relationshipType === 'samesex'
                      ? 'Same-sex'
                      : formData.relationshipType}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {formData.relationshipDuration} months
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Living Together:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.livingTogether}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Children Together:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.childrenTogether}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Sponsor Status:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.sponsorStatus === 'citizen'
                      ? 'AU Citizen'
                      : formData.sponsorStatus === 'pr'
                      ? 'Permanent Resident'
                      : formData.sponsorStatus === 'nz'
                      ? 'NZ Citizen (Eligible)'
                      : formData.sponsorStatus}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Sponsor Age:</span>
                  <span className="font-medium text-gray-900">{formData.sponsorAge}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Applicant in Australia:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.applicantInAustralia}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-600">Condition 8503:</span>
                  <span
                    className={`font-medium capitalize ${
                      formData.condition8503 === 'yes' ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {formData.condition8503}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Relationship Evidence Checklist */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Relationship Evidence Checklist</h2>
            <p className="text-blue-200 text-sm mt-1">
              Track your evidence gathering progress across all required categories
            </p>
          </div>
          <div className="bg-blue-600 rounded-lg px-3 py-1">
            <span className="text-white text-sm font-semibold">
              {completedCount} / {checklist.length} Complete
            </span>
          </div>
        </div>
        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / checklist.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  item.checked
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
                      item.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {item.checked && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-semibold ${
                        item.checked ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        item.checked ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6: Complex Scenarios */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Complex Scenarios</h2>
          <p className="text-blue-200 text-sm mt-1">
            Detailed guidance for common complex partner visa situations. Click to expand each
            scenario.
          </p>
        </div>
        <div className="p-6 space-y-3">
          {complexScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleScenario(scenario.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{scenario.title}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                    expandedScenarios.has(scenario.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedScenarios.has(scenario.id) && (
                <div className="px-5 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">{scenario.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-800">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This tool provides general information only and does not constitute migration advice.
              Partner visa applications are complex and individual circumstances vary significantly.
              Always consult a MARA-registered migration agent for personalised advice before making
              any immigration decisions. Processing times and fees are estimates and may change
              without notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
