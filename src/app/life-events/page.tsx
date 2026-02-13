'use client';

import { useState } from 'react';
import { lifeEventGuidance, lifeEventCategories } from '@/data/lifeEvents';

export default function LifeEventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventType: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventType)) next.delete(eventType);
      else next.add(eventType);
      return next;
    });
  };

  const filteredEvents = selectedCategory
    ? lifeEventGuidance.filter((e) => {
        const cat = lifeEventCategories.find((c) => c.id === selectedCategory);
        return cat?.events.includes(e.eventType);
      })
    : lifeEventGuidance;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-l-red-600',
          badge: 'bg-red-100 text-red-700',
          icon: 'text-red-600',
          bg: 'bg-red-50',
        };
      case 'warning':
        return {
          border: 'border-l-yellow-500',
          badge: 'bg-yellow-100 text-yellow-700',
          icon: 'text-yellow-600',
          bg: 'bg-yellow-50',
        };
      default:
        return {
          border: 'border-l-blue-500',
          badge: 'bg-blue-100 text-blue-700',
          icon: 'text-blue-600',
          bg: 'bg-blue-50',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Life Events &amp; Visa Impact</h1>
        <p className="text-purple-100 text-lg leading-relaxed max-w-4xl">
          Life changes can significantly affect your visa status or application. This guide covers
          20 common life events — from relationship changes and new babies to job loss and health
          conditions — and explains how each impacts your Australian immigration journey.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-300 rounded-lg px-5 py-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-bold text-red-800">Emergency Support</h3>
            <p className="text-sm text-red-700 mt-1">
              If you are in immediate danger, call <strong>000</strong>. For domestic violence support,
              call <strong>1800RESPECT (1800 737 732)</strong> available 24/7. For grief support,
              call <strong>GriefLine 1300 845 745</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Events ({lifeEventGuidance.length})
          </button>
          {lifeEventCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name} ({cat.events.length})
            </button>
          ))}
        </div>
        {selectedCategory && (
          <p className="text-sm text-gray-500 mt-3">
            {lifeEventCategories.find((c) => c.id === selectedCategory)?.description}
          </p>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => {
          const styles = getSeverityStyles(event.severity);
          const isExpanded = expandedEvents.has(event.eventType);
          return (
            <div
              key={event.eventType}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${styles.border}`}
            >
              <button
                onClick={() => toggleEvent(event.eventType)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                      {event.severity.toUpperCase()}
                    </span>
                    {event.recommendConsultAgent && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        Consult Agent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{event.visaImpact}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-6 pb-5 border-t border-gray-100">
                  <div className={`mt-4 rounded-lg p-4 ${styles.bg}`}>
                    <h4 className="font-semibold text-gray-900 mb-2">Detailed Guidance</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{event.guidance}</p>
                  </div>
                  {event.supportLinks && event.supportLinks.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Support Resources</h4>
                      <ul className="space-y-1">
                        {event.supportLinks.map((link, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-blue-700">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {link}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {event.recommendConsultAgent && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Recommended:</strong> Consult a MARA-registered migration agent for
                        personalised advice on this situation.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> This information is general guidance only. Life events can
            have complex and far-reaching implications for your visa status. Always consult a
            MARA-registered migration agent or immigration lawyer for advice specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}
