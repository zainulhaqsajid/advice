'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/context/AuthContext';

type AuthMethod = 'select' | 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleSocialLogin = (provider: 'apple' | 'google') => {
    const user: User = {
      id: `${provider}_${Date.now()}`,
      name: provider === 'apple' ? 'Apple User' : 'Google User',
      email: `user@${provider}.com`,
      authProvider: provider,
    };
    login(user);
    router.push('/dashboard');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }
    const user: User = {
      id: `email_${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      authProvider: 'email',
    };
    login(user);
    router.push('/dashboard');
  };

  const handleSendOTP = () => {
    if (!phone || phone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    const user: User = {
      id: `phone_${Date.now()}`,
      name: name || `User ${phone.slice(-4)}`,
      email: '',
      phone,
      authProvider: 'phone',
    };
    login(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-500 mt-2">Sign in to save your progress, reports, and checklists</p>
          </div>

          {authMethod === 'select' && (
            <div className="space-y-4">
              {/* Apple Sign In */}
              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>

              {/* Google Sign In */}
              <button
                onClick={() => handleSocialLogin('google')}
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

              {/* Phone Sign In */}
              <button
                onClick={() => setAuthMethod('phone')}
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Continue with Phone (OTP)
              </button>
            </div>
          )}

          {/* Email Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => { setAuthMethod('select'); setError(''); }}
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
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-700 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-blue-800 transition-colors"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </form>
          )}

          {/* Phone OTP Form */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => { setAuthMethod('select'); setError(''); setOtpSent(false); }}
                className="text-blue-600 text-sm font-medium hover:underline mb-2"
              >
                &larr; Back to all options
              </button>

              <h2 className="text-xl font-bold text-gray-900">Sign In with Phone</h2>
              <p className="text-sm text-gray-500">We will send you a one-time verification code via SMS.</p>

              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <select className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500">
                        <option>+61</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+91</option>
                        <option>+92</option>
                        <option>+86</option>
                        <option>+63</option>
                        <option>+64</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="4XX XXX XXX"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  )}

                  <button
                    onClick={handleSendOTP}
                    className="w-full bg-green-600 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-green-700 transition-colors"
                  >
                    Send OTP Code
                  </button>
                </>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm font-medium">
                      OTP code sent to {phone}. For demo, enter any 6-digit code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP Code</label>
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
                    className="w-full bg-green-600 text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-green-700 transition-colors"
                  >
                    Verify & Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="w-full text-gray-500 text-sm hover:underline"
                  >
                    Resend OTP Code
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree that this tool provides general information only and does not
          constitute migration advice. Your data is stored locally on your device.
        </p>
      </div>
    </div>
  );
}
