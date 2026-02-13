'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/intake', label: 'Get Started' },
  { href: '/partner-visa', label: 'Partner Visa' },
  { href: '/parent-visa', label: 'Parent Visa' },
  { href: '/student-visa', label: 'Student Visa' },
  { href: '/tr-pathway', label: 'TR Pathways' },
  { href: '/life-events', label: 'Life Events' },
  { href: '/document-checklist', label: 'Documents' },
  { href: '/cost-calculator', label: 'Costs' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/english-test', label: 'English Test' },
  { href: '/skills-assessment', label: 'Skills Assessment' },
  { href: '/eoi-guide', label: 'EOI Guide' },
  { href: '/post-pr', label: 'Post-PR' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">AU PR Pathway</span>
          </Link>

          {/* Desktop navigation - scrollable */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto max-w-4xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Button - Desktop */}
          <div className="hidden lg:flex items-center ml-2">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-700 text-white hover:bg-green-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {user?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-blue-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            {/* Auth Button - Mobile */}
            <div className="mb-3 pb-3 border-b border-blue-800">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dashboard ({user?.name?.split(' ')[0]})
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
