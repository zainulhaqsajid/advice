'use client';

import { useState } from 'react';
import { englishTestMatrix, testRecommendations, getPointsForLevel } from '@/data/englishTests';
import type { EnglishTestType, EnglishLevel } from '@/types/visa';

const TEST_NAMES: Record<EnglishTestType, string> = {
  ielts: 'IELTS',
  pte: 'PTE Academic',
  toefl: 'TOEFL iBT',
  cae: 'Cambridge CAE',
  oet: 'OET',
};

const LEVELS: { value: EnglishLevel; label: string; points: number }[] = [
  { value: 'competent', label: 'Competent', points: 0 },
  { value: 'proficient', label: 'Proficient', points: 10 },
  { value: 'superior', label: 'Superior', points: 20 },
];

export default function EnglishTestPage() {
  const [selectedTest, setSelectedTest] = useState<EnglishTestType | ''>('');
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>('competent');

  const filteredTests = selectedTest
    ? englishTestMatrix.filter((t) => t.testType === selectedTest)
    : englishTestMatrix;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">English Language Test Comparison</h1>
        <p className="text-orange-100 text-lg leading-relaxed max-w-4xl">
          Compare IELTS, PTE Academic, TOEFL iBT, Cambridge CAE, and OET to find the best
          English language test for your visa application. Understand score requirements,
          costs, validity periods, and how many points each level earns.
        </p>
      </div>

      {/* Points Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Points for English Ability</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LEVELS.map((level) => (
            <div
              key={level.value}
              className={`border-2 rounded-xl p-5 text-center cursor-pointer transition-all ${
                selectedLevel === level.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedLevel(level.value)}
            >
              <h3 className="text-lg font-bold text-gray-900">{level.label} English</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{level.points} pts</p>
              <p className="text-sm text-gray-500 mt-1">
                {level.value === 'competent' && 'Minimum requirement for most skilled visas'}
                {level.value === 'proficient' && 'Additional 10 points on the points test'}
                {level.value === 'superior' && 'Maximum 20 points on the points test'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Filter by Test</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTest('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedTest ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tests
          </button>
          {(Object.entries(TEST_NAMES) as [EnglishTestType, string][]).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setSelectedTest(key === selectedTest ? '' : key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTest === key ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Score Matrix Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Score Requirements by Test &amp; Level</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-orange-900">Test</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-orange-900">Level</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-orange-900">Points</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-orange-900">Required Scores</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-orange-900">Cost</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-orange-900">Validity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTests.map((test, i) => (
                <tr
                  key={`${test.testType}-${test.level}`}
                  className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                    test.level === selectedLevel ? 'ring-2 ring-orange-300 ring-inset' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{test.testName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{test.level}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      test.points === 20 ? 'bg-green-100 text-green-700' :
                      test.points === 10 ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {test.points} pts
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {Object.entries(test.scores).map(([key, val]) => (
                      <span key={key} className="inline-block mr-2">
                        <span className="text-gray-500 capitalize">{key}:</span> <strong>{val}</strong>
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{test.cost}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{test.validity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Which Test Should You Take?</h2>
        <div className="space-y-4">
          {testRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{rec.scenario}</h4>
                <p className="text-sm text-orange-700 font-medium mt-1">Recommended: {rec.recommendation}</p>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
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
            <strong>Disclaimer:</strong> Test scores and costs shown are estimates and may vary.
            Always verify current requirements on the Department of Home Affairs website and
            respective test provider websites.
          </p>
        </div>
      </div>
    </div>
  );
}
