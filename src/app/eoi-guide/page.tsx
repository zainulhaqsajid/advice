'use client';

import { useState } from 'react';

interface PointsState {
  age: number;
  english: number;
  overseasExp: number;
  australianExp: number;
  education: number;
  australianStudy: number;
  specialist: number;
  communityLanguage: number;
  professionalYear: number;
  stateNomination: number;
  partnerSkills: number;
  regionalStudy: number;
}

const initialPoints: PointsState = {
  age: 0,
  english: 0,
  overseasExp: 0,
  australianExp: 0,
  education: 0,
  australianStudy: 0,
  specialist: 0,
  communityLanguage: 0,
  professionalYear: 0,
  stateNomination: 0,
  partnerSkills: 0,
  regionalStudy: 0,
};

const pointsCategories = [
  {
    key: 'age' as keyof PointsState,
    label: 'Age',
    options: [
      { value: 0, label: 'Under 18 or 45+' },
      { value: 30, label: '25-32 years' },
      { value: 25, label: '18-24 years' },
      { value: 25, label: '33-39 years' },
      { value: 15, label: '40-44 years' },
    ],
  },
  {
    key: 'english' as keyof PointsState,
    label: 'English Language Ability',
    options: [
      { value: 0, label: 'Competent English (IELTS 6.0 each)' },
      { value: 10, label: 'Proficient English (IELTS 7.0 each)' },
      { value: 20, label: 'Superior English (IELTS 8.0 each)' },
    ],
  },
  {
    key: 'overseasExp' as keyof PointsState,
    label: 'Overseas Skilled Employment (in last 10 years)',
    options: [
      { value: 0, label: 'Less than 3 years' },
      { value: 5, label: '3-4 years' },
      { value: 10, label: '5-7 years' },
      { value: 15, label: '8+ years' },
    ],
  },
  {
    key: 'australianExp' as keyof PointsState,
    label: 'Australian Skilled Employment (in last 10 years)',
    options: [
      { value: 0, label: 'Less than 1 year' },
      { value: 5, label: '1-2 years' },
      { value: 10, label: '3-4 years' },
      { value: 15, label: '5-7 years' },
      { value: 20, label: '8+ years' },
    ],
  },
  {
    key: 'education' as keyof PointsState,
    label: 'Highest Education Qualification',
    options: [
      { value: 0, label: 'Below recognised qualification' },
      { value: 10, label: 'Recognised trade qualification / Diploma' },
      { value: 15, label: "Bachelor's degree" },
      { value: 20, label: "PhD / Doctorate" },
    ],
  },
  {
    key: 'australianStudy' as keyof PointsState,
    label: 'Australian Study Requirement',
    options: [
      { value: 0, label: 'No Australian study' },
      { value: 5, label: 'At least 2 academic years of study in Australia (CRICOS registered)' },
    ],
  },
  {
    key: 'specialist' as keyof PointsState,
    label: 'Specialist Education (STEM/ICT Masters/PhD)',
    options: [
      { value: 0, label: 'Not applicable' },
      { value: 10, label: 'Masters by research or PhD in STEM from an Australian institution' },
    ],
  },
  {
    key: 'communityLanguage' as keyof PointsState,
    label: 'Credentialled Community Language',
    options: [
      { value: 0, label: 'No NAATI credential' },
      { value: 5, label: 'NAATI accredited translator/interpreter' },
    ],
  },
  {
    key: 'professionalYear' as keyof PointsState,
    label: 'Professional Year in Australia',
    options: [
      { value: 0, label: 'Not completed' },
      { value: 5, label: 'Completed professional year program (IT, Accounting, Engineering)' },
    ],
  },
  {
    key: 'stateNomination' as keyof PointsState,
    label: 'State/Territory Nomination',
    options: [
      { value: 0, label: 'SC 189 (no nomination needed)' },
      { value: 5, label: 'SC 190 (state nomination +5 points)' },
      { value: 15, label: 'SC 491 (regional nomination +15 points)' },
    ],
  },
  {
    key: 'partnerSkills' as keyof PointsState,
    label: 'Partner Skills / Single Applicant',
    options: [
      { value: 0, label: 'Partner does not meet skill/English requirements' },
      { value: 5, label: 'Partner has competent English + positive skills assessment' },
      { value: 10, label: 'Single applicant (no partner/spouse)' },
      { value: 10, label: 'Partner is Australian citizen or PR' },
    ],
  },
  {
    key: 'regionalStudy' as keyof PointsState,
    label: 'Study in Regional Australia',
    options: [
      { value: 0, label: 'Not applicable' },
      { value: 5, label: 'Studied in a regional area of Australia' },
    ],
  },
];

export default function EOIGuidePage() {
  const [points, setPoints] = useState<PointsState>(initialPoints);

  const totalPoints = Object.values(points).reduce((sum, val) => sum + val, 0);

  const getScoreColor = () => {
    if (totalPoints >= 80) return 'text-green-600';
    if (totalPoints >= 65) return 'text-blue-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (totalPoints >= 90) return 'Excellent! Very high chance of invitation in the next round.';
    if (totalPoints >= 80) return 'Strong score. Good chance of receiving an invitation quickly.';
    if (totalPoints >= 70) return 'Competitive score. Should receive an invitation for most occupations.';
    if (totalPoints >= 65) return 'Minimum pass mark met. Invitation timeframe depends on your occupation.';
    return 'Below minimum pass mark (65 points). See improvement suggestions below.';
  };

  const improvements: { area: string; currentPoints: number; potential: number; action: string }[] = [];
  if (points.english < 20) {
    improvements.push({
      area: 'English',
      currentPoints: points.english,
      potential: 20,
      action: 'Improve English test scores to Superior (IELTS 8.0 / PTE 79 each)',
    });
  }
  if (points.professionalYear === 0) {
    improvements.push({
      area: 'Professional Year',
      currentPoints: 0,
      potential: 5,
      action: 'Complete a Professional Year program (IT, Accounting, Engineering)',
    });
  }
  if (points.communityLanguage === 0) {
    improvements.push({
      area: 'Community Language',
      currentPoints: 0,
      potential: 5,
      action: 'Obtain NAATI credential for community language',
    });
  }
  if (points.australianStudy === 0) {
    improvements.push({
      area: 'Australian Study',
      currentPoints: 0,
      potential: 5,
      action: 'Complete at least 2 academic years of study at an Australian institution',
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">EOI &amp; Points Calculator Guide</h1>
        <p className="text-indigo-100 text-lg leading-relaxed max-w-4xl">
          Calculate your points score for the Expression of Interest (EOI) under the SkillSelect
          system. The minimum pass mark is 65 points for SC 189, 190, and 491 visas. Use this
          calculator to assess your eligibility and identify areas for improvement.
        </p>
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Points Calculator</h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">Your Total Score</p>
            <p className={`text-4xl font-bold ${getScoreColor()}`}>{totalPoints}</p>
          </div>
        </div>

        <div className="space-y-6">
          {pointsCategories.map((cat) => (
            <div key={cat.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">{cat.label}</label>
                <span className="text-sm font-bold text-indigo-600">+{points[cat.key]} pts</span>
              </div>
              <select
                value={points[cat.key]}
                onChange={(e) => setPoints((prev) => ({ ...prev, [cat.key]: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {cat.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label} ({opt.value} points)
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Score Result */}
      <div className={`rounded-xl shadow-lg p-6 ${totalPoints >= 65 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`text-5xl font-bold ${getScoreColor()}`}>{totalPoints}</div>
          <div>
            <h3 className={`font-bold text-lg ${totalPoints >= 65 ? 'text-green-800' : 'text-red-800'}`}>
              {totalPoints >= 65 ? 'Pass Mark Met' : 'Below Pass Mark'}
            </h3>
            <p className={`text-sm ${totalPoints >= 65 ? 'text-green-700' : 'text-red-700'}`}>
              {getScoreMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {improvements.length > 0 && totalPoints < 90 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Improvement Opportunities</h2>
          <div className="space-y-3">
            {improvements.map((imp, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="flex-shrink-0 bg-indigo-200 text-indigo-800 font-bold text-sm w-12 h-12 rounded-full flex items-center justify-center">
                  +{imp.potential - imp.currentPoints}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{imp.area}</h4>
                  <p className="text-sm text-gray-600 mt-1">{imp.action}</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Current: {imp.currentPoints} pts &rarr; Potential: {imp.potential} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EOI Process */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">EOI Process Overview</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Get Skills Assessment', desc: 'Obtain a positive skills assessment from the relevant assessing body.' },
            { step: 2, title: 'Take English Test', desc: 'Achieve at least Competent English (IELTS 6.0 each / PTE 50 each).' },
            { step: 3, title: 'Submit EOI via SkillSelect', desc: 'Create your EOI online at SkillSelect. No fee to submit an EOI.' },
            { step: 4, title: 'Wait for Invitation', desc: 'Invitations are issued in rounds (usually monthly). Higher points = faster invitation.' },
            { step: 5, title: 'Receive & Accept Invitation', desc: 'You have 60 days to lodge your visa application after receiving an invitation.' },
            { step: 6, title: 'Lodge Visa Application', desc: 'Submit your visa application with all supporting documents and pay the visa fee.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> Points calculations are based on general guidelines. The
            Department of Home Affairs determines the official points score. Always verify your
            eligibility and points claim with a MARA-registered migration agent.
          </p>
        </div>
      </div>
    </div>
  );
}
