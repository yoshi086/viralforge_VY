import React, { useState } from 'react';
import { Mail, Lock, Sparkles, AlertTriangle, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignupProps {
  onNavigateToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide all requested fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (signUpError) throw signUpError;
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Background Layer */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Glassmorphic Signup Container */}
      <div className="glass-card max-w-md w-full rounded-3xl p-8 border border-white/5 shadow-2xl shadow-purple-500/5 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl -z-10 -mr-10 -mt-10" />

        {/* Branding Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mx-auto animate-float">
            <Zap className="w-6 h-6 text-white fill-white/10" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-mono">
              ViralForge<span className="text-purple-400">AI</span>
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-purple-400 font-extrabold mt-1">
              Create SaaS Account
            </p>
          </div>
          <p className="text-gray-400 text-xs">
            Turn Any Topic Into Viral Content In Seconds
          </p>
        </div>

        {/* Success view */}
        {success ? (
          <div className="space-y-6 text-center py-4 font-sans">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-md font-bold text-white">Registration Complete!</h3>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
                Your workspace account has been successfully created. Please check your email inbox to confirm your account or proceed directly to sign in.
              </p>
            </div>
            <button
              onClick={onNavigateToLogin}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg border border-purple-500/20 transition-all cursor-pointer font-sans"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            
            {/* Error warnings */}
            {error && (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3.5 flex gap-2.5 items-start text-rose-300 font-semibold leading-relaxed animate-shake animate-shake-slow">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@domain.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium font-sans"
                required
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium font-sans"
                required
              />
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium font-sans"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-900/30 disabled:to-blue-900/30 text-white font-bold rounded-xl shadow-lg border border-purple-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-98 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  Create Forge Account
                </>
              )}
            </button>

            {/* Redirect links */}
            <div className="text-center pt-2 border-t border-white/5 font-sans">
              <span className="text-gray-500">Already have an account? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
              >
                Sign In Instead
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
