'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function AgentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user, loginWithEmail, loginWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const authError = searchParams.get('error');

  // If already logged in, check role
  if (!isLoading && isAuthenticated && user) {
    if (user.role === 'agent' || user.role === 'admin') {
      router.push('/admin');
      return null;
    }
    // Logged in but not agent — show access denied
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-2">
              You are signed in as <strong>{user.email}</strong>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              This account does not have MARA agent or admin privileges.
              Please sign in with an authorised agent account.
            </p>
            <div className="space-y-3">
              <button
                onClick={async () => { await logout(); setError(''); }}
                className="w-full bg-red-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-red-700 transition-colors"
              >
                Sign Out &amp; Try Another Account
              </button>
              <Link
                href="/"
                className="block w-full text-center text-gray-500 text-sm hover:underline"
              >
                Return to home page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    setError('');
    await loginWithGoogle();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      }
      // After login, the component will re-render and the role check above will redirect or show access denied
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MARA Agent Portal</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Authorised migration agents only. Sign in to access the administration dashboard.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">Authentication failed. Please try again.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl px-6 py-3.5 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or sign in with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl px-6 py-3.5 font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? 'Signing in...' : 'Sign In as Agent'}
              </button>
            </form>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-900">Restricted Access</p>
              <p className="text-xs text-amber-700 mt-1">
                Only MARA-registered migration agents with authorised accounts can access the admin dashboard.
                If you are a client, please use the <Link href="/login" className="underline font-medium">client login</Link> instead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700" />
      </div>
    }>
      <AgentLoginForm />
    </Suspense>
  );
}
