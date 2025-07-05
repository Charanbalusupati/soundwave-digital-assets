
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, RefreshCw } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, resendVerification, resetPassword } = useAuth();

  // Handle email confirmation from URL
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (accessToken && refreshToken && type === 'signup') {
        // The auth state change will handle the success message
        console.log('Email confirmed successfully');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  // Redirect if already authenticated
  if (user && user.email_confirmed_at) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (showForgotPassword) {
        await resetPassword(email);
        setShowForgotPassword(false);
        setEmail('');
      } else if (isLogin) {
        await signIn(email, password);
      } else {
        if (password.length < 6) {
          alert('Password must be at least 6 characters long');
          return;
        }
        await signUp(email, password, fullName);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    setIsLoading(true);
    try {
      await resendVerification(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {showForgotPassword 
                ? 'Reset Password' 
                : isLogin 
                  ? 'Welcome Back' 
                  : 'Create Account'
              }
            </h1>
            <p className="text-gray-600">
              {showForgotPassword
                ? 'Enter your email to receive reset instructions'
                : isLogin 
                  ? 'Sign in to your SoundSnap account' 
                  : 'Join SoundSnap today'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !showForgotPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {!showForgotPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {showForgotPassword 
                    ? 'Sending Reset Email...' 
                    : isLogin 
                      ? 'Signing In...' 
                      : 'Creating Account...'
                  }
                </div>
              ) : (
                showForgotPassword 
                  ? 'Send Reset Email' 
                  : isLogin 
                    ? 'Sign In' 
                    : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {!showForgotPassword && (
              <>
                <div className="text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                {isLogin && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <div className="text-center">
                    <button
                      onClick={handleResendVerification}
                      disabled={isLoading || !email}
                      className="flex items-center justify-center mx-auto text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Resend verification email
                    </button>
                  </div>
                )}
              </>
            )}

            {showForgotPassword && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setEmail('');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>

          {/* Email verification notice */}
          {user && !user.email_confirmed_at && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                Please verify your email address to complete your registration.
                <button
                  onClick={handleResendVerification}
                  className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
                >
                  Resend verification email
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
