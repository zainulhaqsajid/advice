'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type AuthMethod = 'select' | 'email' | 'otp';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, loginWithEmail, signUpWithEmail, loginWithGoogle, loginWithOTP, verifyOTP } = useAuth();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const authError = searchParams.get('error');

  if (!isLoading && isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleGoogleLogin = async () => {
    setError('');
    await loginWithGoogle();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        const result = await signUpWithEmail(email, password, name);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccessMessage('Account created! Check your email to confirm, then sign in.');
          setIsSignUp(false);
        }
      } else {
        const result = await loginWithEmail(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          router.push('/dashboard');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOTP = async () => {
    if (!otpEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await loginWithOTP(otpEmail);
      if (result.error) {
        setError(result.error);
      } else {
        setOtpSent(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await verifyOTP(otpEmail, otp);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-500 mt-2">Sign in to save your progress, reports, and checklists</p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">Authentication failed. Please try again.</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {authMethod === 'select' && (
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
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email Sign In */}
              <button
                onClick={() => setAuthMethod('email')}
                className="w-full flex items-center justify-center gap-3 bg-blue-700 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Continue with Email
              </button>

              {/* Email OTP (Passwordless) Sign In */}
              <button
                onClick={() => setAuthMethod('otp')}
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Passwordless Sign In (Email OTP)
              </button>
            </div>
          )}

          {/* Email Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => { setAuthMethod('select'); setError(''); setSuccessMessage(''); }}
                className="text-blue-600 text-sm font-medium hover:underline mb-2"
              >
                &larr; Back to all options
              </button>

              <h2 className="text-xl font-bold text-gray-900">
                {isSignUp ? 'Create Account' : 'Sign In with Email'}
              </h2>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-700 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMessage(''); }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </form>
          )}

          {/* Email OTP Form */}
          {authMethod === 'otp' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => { setAuthMethod('select'); setError(''); setOtpSent(false); }}
                className="text-blue-600 text-sm font-medium hover:underline mb-2"
              >
                &larr; Back to all options
              </button>

              <h2 className="text-xl font-bold text-gray-900">Passwordless Sign In</h2>
              <p className="text-sm text-gray-500">We will send a one-time verification code to your email. No password needed.</p>

              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={submitting}
                    className="w-full bg-green-600 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm font-medium">
                      Verification code sent to {otpEmail}. Check your inbox and enter the 6-digit code below.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Verifying...' : 'Verify & Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="w-full text-gray-500 text-sm hover:underline"
                  >
                    Resend Code
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-900">Your data is secure</p>
              <p className="text-xs text-blue-700 mt-1">
                Your data is stored securely in the cloud. Reports sync across devices.
                By signing in, you agree that this tool provides general information only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
