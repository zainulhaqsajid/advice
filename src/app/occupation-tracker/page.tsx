'use client';

import { useState } from 'react';
import {
  invitationRounds,
  keyOccupations,
  tradeCourses,
  stateNominations,
  pathwayOptions,
  futurePredictions,
} from '@/data/occupationData';

type ActiveTab = 'rounds' | 'occupations' | 'pathway' | 'trades' | 'states';

export default function OccupationTrackerPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rounds');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTradesOnly, setShowTradesOnly] = useState(false);
  const [expandedRound, setExpandedRound] = useState<string | null>(invitationRounds[0]?.id || null);
  const [expandedPathway, setExpandedPathway] = useState<string | null>('option_a_491_current');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedState, setExpandedState] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(keyOccupations.map(o => o.category)))];

  const filteredOccupations = keyOccupations.filter(o => {
    if (selectedCategory !== 'all' && o.category !== selectedCategory) return false;
    if (showTradesOnly && !o.tradeOccupation) return false;
    return true;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <span className="text-green-500">&#9650;</span>;
      case 'stable': return <span className="text-blue-500">&#9654;</span>;
      case 'declining': return <span className="text-red-500">&#9660;</span>;
      default: return null;
    }
  };

  const getDemandBadge = (prediction: string) => {
    switch (prediction) {
      case 'critical_shortage':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">CRITICAL SHORTAGE</span>;
      case 'high_demand':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">HIGH DEMAND</span>;
      case 'moderate_demand':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">MODERATE</span>;
      case 'low_demand':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">LOW DEMAND</span>;
      default: return null;
    }
  };

  const getSuccessBadge = (likelihood: string) => {
    switch (likelihood) {
      case 'very_high':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">VERY HIGH SUCCESS</span>;
      case 'high':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">HIGH SUCCESS</span>;
      case 'moderate':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">MODERATE</span>;
      case 'low':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">LOW</span>;
      default: return null;
    }
  };

  const getCourseDemandBadge = (demand: string) => {
    switch (demand) {
      case 'very_high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">VERY HIGH DEMAND</span>;
      case 'high':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">HIGH DEMAND</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">MODERATE</span>;
      default: return null;
    }
  };

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'rounds', label: 'Invitation Rounds', icon: '&#128200;' },
    { id: 'occupations', label: 'Occupation List', icon: '&#128188;' },
    { id: 'pathway', label: 'My Pathway Planner', icon: '&#127919;' },
    { id: 'trades', label: 'Trade Courses (Option B)', icon: '&#128295;' },
    { id: 'states', label: 'State Nominations', icon: '&#127470;&#127462;' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Occupation Tracker &amp; Pathway Planner</h1>
        <p className="text-emerald-100 text-lg leading-relaxed max-w-4xl">
          Track the latest SkillSelect invitation rounds, see which occupations are being invited,
          get future demand predictions, and plan your personalised pathway to PR. Includes trade
          course options as a parallel strategy.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
            <span className="font-semibold">Your Status:</span> SC 485 holder
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
            <span className="font-semibold">Points for 491:</span> 75 pts (60 base + 15 nomination)
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
            <span className="font-semibold">Skills Assessment:</span> Positive
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: tab.icon }} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TAB: INVITATION ROUNDS ===== */}
      {activeTab === 'rounds' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Last 3 Invitation Rounds (2025-26)</h2>
            <p className="text-sm text-gray-500 mb-6">
              SkillSelect invitation rounds for SC 189 and SC 491 visas. The government has moved to a quarterly model for 2025-26.
            </p>

            <div className="space-y-3">
              {invitationRounds.map((round) => (
                <div key={round.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedRound(expandedRound === round.id ? null : round.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{round.date}</h3>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          round.visaType === '189' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          SC {round.visaType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span><strong>{round.totalInvitations.toLocaleString()}</strong> invitations</span>
                        <span>Min <strong>{round.minimumPoints}</strong> pts</span>
                        <span>Tie-break: {round.tieBreakDate}</span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                        expandedRound === round.id ? 'rotate-180' : ''
                      }`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedRound === round.id && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      {/* Key Highlights */}
                      <div className="mt-4 mb-4">
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Key Highlights</h4>
                        <ul className="space-y-1">
                          {round.keyHighlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Occupation Breakdown Table */}
                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Occupation Breakdown</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left px-3 py-2 text-gray-600 font-medium">Occupation</th>
                              <th className="text-left px-3 py-2 text-gray-600 font-medium">ANZSCO</th>
                              <th className="text-left px-3 py-2 text-gray-600 font-medium">Category</th>
                              <th className="text-right px-3 py-2 text-gray-600 font-medium">Invited</th>
                              <th className="text-right px-3 py-2 text-gray-600 font-medium">Min Pts</th>
                              <th className="text-center px-3 py-2 text-gray-600 font-medium">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {round.occupationBreakdown.map((occ, i) => (
                              <tr key={i} className={`border-t border-gray-100 ${occ.category === 'Trades' ? 'bg-green-50' : ''}`}>
                                <td className="px-3 py-2 font-medium text-gray-900">{occ.occupation}</td>
                                <td className="px-3 py-2 text-gray-500 font-mono text-xs">{occ.anzscoCode}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    occ.category === 'Trades' ? 'bg-green-100 text-green-800' :
                                    occ.category === 'Healthcare' ? 'bg-red-100 text-red-800' :
                                    occ.category === 'ICT' ? 'bg-blue-100 text-blue-800' :
                                    occ.category === 'Engineering' ? 'bg-purple-100 text-purple-800' :
                                    occ.category === 'Accounting' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {occ.category}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right font-semibold">{occ.invitations}</td>
                                <td className="px-3 py-2 text-right">
                                  <span className={`font-bold ${occ.minimumPoints <= 70 ? 'text-green-600' : occ.minimumPoints <= 85 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {occ.minimumPoints}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center">{getTrendIcon(occ.trend)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Round Prediction */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-bold text-amber-900 text-lg mb-3">Next Round Prediction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-xs text-amber-600 font-medium">Expected Date</p>
                <p className="text-lg font-bold text-amber-900">Jan-Mar 2026</p>
                <p className="text-xs text-gray-500 mt-1">Quarterly schedule, exact date TBA</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-xs text-amber-600 font-medium">Expected Invitations</p>
                <p className="text-lg font-bold text-amber-900">5,000-7,000</p>
                <p className="text-xs text-gray-500 mt-1">Based on program year allocation</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-xs text-amber-600 font-medium">Key Occupations</p>
                <p className="text-lg font-bold text-amber-900">Trades &amp; Healthcare</p>
                <p className="text-xs text-gray-500 mt-1">Expected to dominate at 65 pts</p>
              </div>
            </div>
            <p className="text-sm text-amber-800 mt-4">
              <strong>Your position (75 pts for 491):</strong> With trade occupations consistently invited at 65 points,
              your 75 points (60 base + 15 regional) puts you in a strong competitive position. If your current occupation
              is in trades or healthcare, expect invitation in the next round.
            </p>
          </div>
        </div>
      )}

      {/* ===== TAB: OCCUPATION LIST ===== */}
      {activeTab === 'occupations' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
              <div className="ml-auto">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showTradesOnly}
                    onChange={(e) => setShowTradesOnly(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-600">Trade occupations only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Occupation Cards */}
          <div className="grid grid-cols-1 gap-3">
            {filteredOccupations.map((occ) => {
              const prediction = futurePredictions.find(p => p.occupation === occ.occupation);
              return (
                <div key={occ.anzscoCode} className={`bg-white rounded-xl shadow-lg p-5 border-l-4 ${
                  occ.tradeOccupation ? 'border-green-500' : 'border-blue-500'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{occ.occupation}</h3>
                        {getDemandBadge(occ.futurePrediction)}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">ANZSCO: {occ.anzscoCode} | List: {occ.list}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Min Points (Recent)</p>
                      <p className={`text-2xl font-bold ${occ.minimumPointsRecent <= 70 ? 'text-green-600' : occ.minimumPointsRecent <= 85 ? 'text-blue-600' : 'text-red-600'}`}>
                        {occ.minimumPointsRecent}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500">Assessing Body</p>
                      <p className="text-sm font-semibold text-gray-900">{occ.assessingBody}</p>
                      <p className="text-xs text-gray-500">{occ.assessmentCost}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500">Eligible Visas</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {occ.eligibleVisas.map(v => (
                          <span key={v} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">{v}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500">State Nomination</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {occ.stateNominationAvailable.map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500">Your Competitiveness (75 pts for 491)</p>
                      <p className={`text-sm font-bold ${occ.minimumPointsRecent <= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {occ.minimumPointsRecent <= 75 ? 'COMPETITIVE - Can get invited' : 'NEED MORE POINTS'}
                      </p>
                    </div>
                  </div>

                  {/* Future Prediction */}
                  {prediction && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 mt-3">
                      <p className="text-xs font-bold text-amber-800 mb-1">Future Prediction</p>
                      <div className="flex items-center gap-4 text-xs text-amber-700 mb-1">
                        <span>Now: <strong>{prediction.currentMinPoints} pts</strong></span>
                        <span>&#8594;</span>
                        <span>2026 H2: <strong>{prediction.predictedMinPoints2026H2} pts</strong></span>
                        <span>&#8594;</span>
                        <span>2027: <strong>{prediction.predictedMinPoints2027} pts</strong></span>
                        <span className="ml-2">Trend: {prediction.demandTrend === 'increasing' ? '&#9650; Increasing' : prediction.demandTrend === 'stable' ? '&#9654; Stable' : '&#9660; Decreasing'}</span>
                      </div>
                      <p className="text-xs text-amber-700">{prediction.reasoning}</p>
                      <p className="text-xs text-amber-900 font-semibold mt-1">{prediction.recommendation}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mt-3">{occ.predictionNotes}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== TAB: MY PATHWAY PLANNER ===== */}
      {activeTab === 'pathway' && (
        <div className="space-y-4">
          {/* User Profile Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
                <p className="text-xs text-emerald-600 font-medium">Current Visa</p>
                <p className="text-2xl font-bold text-emerald-800">SC 485</p>
                <p className="text-xs text-emerald-600">Temporary Graduate</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <p className="text-xs text-blue-600 font-medium">Points for 491</p>
                <p className="text-2xl font-bold text-blue-800">75</p>
                <p className="text-xs text-blue-600">60 base + 15 nomination</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <p className="text-xs text-purple-600 font-medium">Skills Assessment</p>
                <p className="text-2xl font-bold text-purple-800">Positive</p>
                <p className="text-xs text-purple-600">Valid for 3 years</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                <p className="text-xs text-orange-600 font-medium">Competitiveness</p>
                <p className="text-2xl font-bold text-orange-800">GOOD</p>
                <p className="text-xs text-orange-600">Above minimum (65 pts)</p>
              </div>
            </div>
          </div>

          {/* Pathway Options */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Your Pathway Options</h2>
            {pathwayOptions.map((option) => (
              <div key={option.id} className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${
                option.id === 'option_a_491_current' ? 'border-blue-500' :
                option.id === 'option_b_trade_course' ? 'border-green-500' :
                option.id === 'option_c_improve_points' ? 'border-purple-500' :
                'border-orange-500'
              }`}>
                <button
                  onClick={() => setExpandedPathway(expandedPathway === option.id ? null : option.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                      {getSuccessBadge(option.successLikelihood)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      expandedPathway === option.id ? 'rotate-180' : ''
                    }`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedPathway === option.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Current Points</p>
                        <p className="text-xl font-bold text-gray-900">{option.currentPoints}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Possible Total</p>
                        <p className="text-xl font-bold text-emerald-600">{option.totalPointsPossible || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Timeline</p>
                        <p className="text-sm font-semibold text-gray-900">{option.timelineMonths}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Estimated Cost</p>
                        <p className="text-sm font-semibold text-gray-900">{option.estimatedCost}</p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">Steps to Follow</h4>
                      <div className="space-y-2">
                        {option.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <p className="text-sm text-gray-700">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 text-sm mb-2">Advantages</h4>
                        <ul className="space-y-1">
                          {option.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 text-sm mb-2">Challenges</h4>
                        <ul className="space-y-1">
                          {option.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Future Prediction */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-amber-900 text-sm mb-2">Future Prediction &amp; Outlook</h4>
                      <p className="text-sm text-amber-800">{option.futurePrediction}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recommendation Box */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-3">Recommended Strategy</h3>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="font-semibold">Primary: Option A (SC 491 with current occupation)</p>
                <p className="text-sm text-emerald-100 mt-1">
                  Apply immediately with your 75 points. Submit ROIs to multiple states. Your points are competitive
                  for most occupations at 491 level.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="font-semibold">Parallel: Option B (Trade course as backup)</p>
                <p className="text-sm text-emerald-100 mt-1">
                  Enrol in a trade course (e.g., Commercial Cookery, Welding) while waiting for Option A.
                  Trade occupations are in critical shortage and invited at 65 points. This gives you a second
                  occupation to fall back on if your primary occupation is competitive.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="font-semibold">Meanwhile: Improve English score</p>
                <p className="text-sm text-emerald-100 mt-1">
                  Target Superior English (IELTS 8.0/PTE 79) for +10 points, bringing you to 85 total.
                  This improves chances across all pathway options.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: TRADE COURSES ===== */}
      {activeTab === 'trades' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Trade Course Options (Option B Strategy)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Study a trade course while on your SC 485 visa as a parallel strategy. Trade occupations are in
              critical shortage and consistently invited at 65 points. You CAN study while on a 485 visa.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 text-sm mb-2">Why Trade Courses?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-700">Trade occupations invited at <strong>65 points</strong> vs 85-95 for professional roles</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-700"><strong>All states</strong> nominating trade workers for 491</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-700">Australian study adds <strong>+5 points</strong> to your score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Course Cards */}
          <div className="space-y-3">
            {tradeCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-green-500">
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                      {getCourseDemandBadge(course.futureDemand)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {course.qualification} (AQF {course.aqfLevel}) | Links to: <strong>{course.linkedOccupation}</strong> ({course.anzscoCode})
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{course.duration}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{course.costRange}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+{course.pointsForQualification} pts</span>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      expandedCourse === course.id ? 'rotate-180' : ''
                    }`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedCourse === course.id && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Provider Examples</p>
                        <p className="text-sm font-semibold text-gray-900">{course.provider}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Assessing Body</p>
                        <p className="text-sm font-semibold text-gray-900">{course.assessingBody}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Can Study on 485?</p>
                        <p className={`text-sm font-bold ${course.canStudyOn485 ? 'text-green-600' : 'text-red-600'}`}>
                          {course.canStudyOn485 ? 'YES - No restriction' : 'NO'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1">States with high demand for this trade:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.statesInDemand.map(s => (
                          <span key={s} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">{course.notes}</p>

                    {/* Future Prediction for this trade */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 mt-3">
                      <p className="text-xs font-bold text-amber-800 mb-1">Future Prediction</p>
                      <p className="text-xs text-amber-700">
                        {course.futureDemand === 'very_high'
                          ? `Critical shortage predicted to continue through 2028+. ${course.linkedOccupation}s will remain at 65 points minimum. States will continue actively nominating. Excellent long-term career prospects.`
                          : course.futureDemand === 'high'
                          ? `Strong demand expected to continue through 2027. ${course.linkedOccupation}s consistently invited at 65-70 points. Good state nomination prospects.`
                          : `Moderate but consistent demand. ${course.linkedOccupation}s available on some state lists. Points may remain at 65-70.`
                        }
                      </p>
                    </div>

                    {/* Points calculation for this pathway */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-xs font-bold text-blue-800 mb-1">Your Points with This Trade (SC 491)</p>
                      <div className="text-xs text-blue-700 space-y-0.5">
                        <p>Your current base points: <strong>60</strong></p>
                        <p>+ Regional nomination (SC 491): <strong>+15</strong></p>
                        <p>+ Trade qualification (AQF {course.aqfLevel}): <strong>+{course.pointsForQualification}</strong></p>
                        <p>+ Australian study (if 2+ years): <strong>+5</strong></p>
                        <p>+ Regional study bonus: <strong>+5</strong></p>
                        <p className="pt-1 border-t border-blue-200 font-bold">Potential total: <strong>{60 + 15 + course.pointsForQualification + 5 + 5}</strong> points</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Course Comparison - Best for Option B</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Course</th>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Duration</th>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Cost</th>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Occupation</th>
                    <th className="text-center px-3 py-2 text-gray-600 font-medium">Demand</th>
                    <th className="text-center px-3 py-2 text-gray-600 font-medium">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeCourses.filter(c => ['cert3_commercial_cookery', 'cert3_welding', 'cert3_carpentry', 'cert3_electrotechnology', 'cert3_plumbing'].includes(c.id)).map((c, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium text-gray-900">{c.qualification}</td>
                      <td className="px-3 py-2 text-gray-600">{c.duration}</td>
                      <td className="px-3 py-2 text-gray-600">{c.costRange}</td>
                      <td className="px-3 py-2 text-gray-600">{c.linkedOccupation}</td>
                      <td className="px-3 py-2 text-center">{getCourseDemandBadge(c.futureDemand)}</td>
                      <td className="px-3 py-2 text-center text-xs">
                        {c.id === 'cert3_commercial_cookery' ? 'Fastest completion' :
                         c.id === 'cert3_welding' ? 'Mining/Resources' :
                         c.id === 'cert3_carpentry' ? 'Housing boom' :
                         c.id === 'cert3_electrotechnology' ? 'Highest demand' :
                         'Essential trade'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: STATE NOMINATIONS ===== */}
      {activeTab === 'states' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">State &amp; Territory Nominations (2025-26)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Total allocation: <strong>20,350 places</strong> (12,850 for SC 190 + 7,500 for SC 491).
              States actively nominating trade occupations.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                <p className="text-xs text-blue-600">SC 190 Places</p>
                <p className="text-2xl font-bold text-blue-800">12,850</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                <p className="text-xs text-purple-600">SC 491 Places</p>
                <p className="text-2xl font-bold text-purple-800">7,500</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
                <p className="text-xs text-emerald-600">Total Places</p>
                <p className="text-2xl font-bold text-emerald-800">20,350</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                <p className="text-xs text-orange-600">States/Territories</p>
                <p className="text-2xl font-bold text-orange-800">8</p>
              </div>
            </div>
          </div>

          {/* State Cards */}
          <div className="space-y-3">
            {stateNominations.map((state) => (
              <div key={state.stateCode} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedState(expandedState === state.stateCode ? null : state.stateCode)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-sm font-bold rounded">{state.stateCode}</span>
                      <h3 className="font-semibold text-gray-900">{state.state}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>SC 190: <strong>{state.sc190Places.toLocaleString()}</strong></span>
                      <span>SC 491: <strong>{state.sc491Places.toLocaleString()}</strong></span>
                      <span>Total: <strong>{state.totalPlaces.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      expandedState === state.stateCode ? 'rotate-180' : ''
                    }`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedState === state.stateCode && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Last Round</p>
                        <p className="text-sm font-semibold text-gray-900">{state.lastRoundDate}</p>
                        <p className="text-xs text-gray-500">{state.lastRoundInvitations} invitations</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Next Round Expected</p>
                        <p className="text-sm font-semibold text-gray-900">{state.nextRoundExpected}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">SC 491 Places Remaining</p>
                        <p className="text-sm font-semibold text-emerald-600">{state.sc491Places.toLocaleString()} allocated</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 font-medium mb-2">Trade Occupations in Demand</p>
                      <div className="flex flex-wrap gap-1">
                        {state.tradeOccupationsInDemand.map(t => (
                          <span key={t} className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 font-medium mb-2">Key Requirements</p>
                      <ul className="space-y-1">
                        {state.keyRequirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Future Prediction for state */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 mt-4">
                      <p className="text-xs font-bold text-amber-800 mb-1">Prediction for {state.stateCode}</p>
                      <p className="text-xs text-amber-700">
                        {state.sc491Places >= 1000
                          ? `Large 491 allocation (${state.sc491Places} places). Good chances for trade workers. Multiple rounds expected through June 2026. Apply early for best results.`
                          : state.sc491Places >= 700
                          ? `Moderate 491 allocation (${state.sc491Places} places). Competitive but achievable for trade occupations. Focus on meeting state-specific requirements.`
                          : `Smaller 491 allocation (${state.sc491Places} places). More competitive. Consider states with larger allocations as primary targets.`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corrected Fees Reference */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Updated Fees Reference (2025-26)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">Visa Application Fees</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">SC 189 (Skilled Independent)</span>
                <span className="font-semibold">$4,770</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">SC 190 (Skilled Nominated)</span>
                <span className="font-semibold">$4,770</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">SC 491 (Regional)</span>
                <span className="font-semibold">$4,770</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">SC 186 (Employer Sponsored)</span>
                <span className="font-semibold">$4,770</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">SC 485 (Graduate)</span>
                <span className="font-semibold">$1,895</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">SC 500 (Student)</span>
                <span className="font-semibold">$1,600</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Partner (820/309/300)</span>
                <span className="font-semibold">$9,365</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">English Test Fees</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">IELTS Academic</span>
                <span className="font-semibold">$410</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">PTE Academic</span>
                <span className="font-semibold">$430</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">TOEFL iBT</span>
                <span className="font-semibold">$345</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Cambridge CAE</span>
                <span className="font-semibold">$395</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">OET</span>
                <span className="font-semibold">$590</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">Skills Assessment Fees</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">ACS (ICT)</span>
                <span className="font-semibold">$570</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Engineers Australia</span>
                <span className="font-semibold">$1,350</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">CPA Australia</span>
                <span className="font-semibold">$650-$1,200</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">VETASSESS</span>
                <span className="font-semibold">$1,300-$1,600</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">TRA (Trades)</span>
                <span className="font-semibold">$300-$600</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">AITSL (Teaching)</span>
                <span className="font-semibold">$1,250</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Fees updated for 2025-26 financial year. Visa fees typically increase on 1 July each year.
          Always verify current fees on the official Department of Home Affairs and assessing body websites.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> Invitation round data, occupation lists, and future predictions are based on
            publicly available information and analysis. Actual outcomes may vary. Points minimums and occupation
            availability can change without notice. Always verify current data on the{' '}
            <strong>Department of Home Affairs SkillSelect</strong> website and consult a MARA-registered migration agent
            for personalised advice. Future predictions are estimates based on trends and government policy signals.
          </p>
        </div>
      </div>
    </div>
  );
}
