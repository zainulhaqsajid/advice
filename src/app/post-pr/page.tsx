'use client';

import { useState } from 'react';
import { postPRTopics } from '@/data/postPR';

export default function PostPRPage() {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedTopics(new Set(postPRTopics.map(t => t.id)));
  };

  const collapseAll = () => {
    setExpandedTopics(new Set());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Post-PR Settlement Guide</h1>
        <p className="text-green-100 text-lg leading-relaxed max-w-4xl">
          Congratulations on receiving your Australian Permanent Residency! This guide covers
          everything you need to know after your PR is granted — from Medicare enrolment and
          tax obligations to the pathway to Australian citizenship.
        </p>
      </div>

      {/* Quick Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key First Steps After PR Grant</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🏥</div>
            <h3 className="font-semibold text-blue-900 text-sm">Enrol in Medicare</h3>
            <p className="text-xs text-blue-700 mt-1">Immediate — free public healthcare</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="font-semibold text-green-900 text-sm">Get a TFN</h3>
            <p className="text-xs text-green-700 mt-1">Tax File Number from ATO</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🏦</div>
            <h3 className="font-semibold text-yellow-900 text-sm">Set Up Super</h3>
            <p className="text-xs text-yellow-700 mt-1">Choose your superannuation fund</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">✈️</div>
            <h3 className="font-semibold text-purple-900 text-sm">Note Travel Facility</h3>
            <p className="text-xs text-purple-700 mt-1">5-year travel from grant date</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Collapse All
        </button>
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {postPRTopics.map((topic) => (
          <div
            key={topic.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${
              topic.important ? 'border-red-500' : 'border-blue-500'
            }`}
          >
            <button
              onClick={() => toggleTopic(topic.id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                  {topic.important && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                  expandedTopics.has(topic.id) ? 'rotate-180' : ''
                }`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedTopics.has(topic.id) && (
              <div className="px-6 pb-5 border-t border-gray-100">
                <ul className="mt-4 space-y-3">
                  {topic.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Citizenship Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">PR to Citizenship Timeline</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-blue-800">Year 0</p>
            <p className="text-xs text-blue-600 mt-1">PR Granted</p>
          </div>
          <svg className="w-8 h-8 text-gray-300 rotate-90 md:rotate-0 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-yellow-800">Year 1</p>
            <p className="text-xs text-yellow-600 mt-1">Minimum PR period met</p>
          </div>
          <svg className="w-8 h-8 text-gray-300 rotate-90 md:rotate-0 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-green-800">Year 4</p>
            <p className="text-xs text-green-600 mt-1">Eligible for citizenship</p>
          </div>
          <svg className="w-8 h-8 text-gray-300 rotate-90 md:rotate-0 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-purple-800">Year 5</p>
            <p className="text-xs text-purple-600 mt-1">Travel facility expires (apply RRV)</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> This information is current as of the tool&apos;s last update and
            may change. Always verify requirements on the official Department of Home Affairs website or
            contact relevant government agencies directly.
          </p>
        </div>
      </div>
    </div>
  );
}
