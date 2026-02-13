'use client';

import Link from 'next/link';
import { visaCategories } from '@/data/visaCategories';

const quickTools = [
  {
    name: 'Cost Calculator',
    description: 'Estimate total visa application costs including government fees and related expenses.',
    href: '/cost-calculator',
    icon: '💰',
  },
  {
    name: 'Timeline Estimator',
    description: 'Understand processing times and plan your visa journey milestones.',
    href: '/timeline',
    icon: '📅',
  },
  {
    name: 'Document Checklist',
    description: 'Generate a personalised checklist of required documents for your visa application.',
    href: '/document-checklist',
    icon: '📋',
  },
  {
    name: 'English Test Strategy',
    description: 'Compare IELTS, PTE, TOEFL and other accepted tests to find your best option.',
    href: '/english-test',
    icon: '🗣️',
  },
  {
    name: 'Points Calculator',
    description: 'Calculate your points score for skilled migration and identify improvement areas.',
    href: '/eoi-guide',
    icon: '🧮',
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
          <p>
            <strong>Disclaimer:</strong> This tool provides general information only. Not migration advice.
            Always consult a MARA-registered migration agent for personalised guidance.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl text-white shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 px-4">
          Australian PR Pathway Information Tool
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8 px-4">
          Your comprehensive guide to Australian permanent residency. Covering all 22 visa categories,
          from skilled migration and employer sponsorship to family, business, and humanitarian pathways.
          Understand your options, estimate costs, track timelines, and prepare your application
          with confidence.
        </p>
        <Link
          href="/intake"
          className="inline-block bg-white text-blue-900 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200"
        >
          Get Started - Find Your Pathway
        </Link>
      </section>

      {/* Visa Category Cards Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Visa Categories</h2>
        <p className="text-gray-600 mb-6">
          Explore all 22 Australian visa categories. Select a category to learn about eligibility,
          costs, processing times, and the pathway to permanent residency.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visaCategories.map((category) => (
            <Link
              key={category.id}
              href={category.route}
              className="group block bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{category.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    Subclass {category.subclasses}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {category.targetUser}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          Not sure which visa is right for you?
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Answer a few questions about your situation and we will recommend the most relevant visa
          pathways for you, along with estimated costs, timelines, and next steps.
        </p>
        <Link
          href="/intake"
          className="inline-block bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-800 transition-colors duration-200"
        >
          Get Started
        </Link>
      </section>

      {/* Quick Tools Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Planning Tools</h2>
        <p className="text-gray-600 mb-6">
          Use these tools to estimate costs, understand timelines, prepare documents, and maximise
          your points score.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <span className="text-3xl flex-shrink-0">{tool.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
