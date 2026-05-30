import React, { useState } from 'react';
import { Mail, Lock, Sparkles, AlertTriangle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onNavigateToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) throw signInError;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Background Layer */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Glassmorphic Login Container */}
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
              SaaS Creator Portal
            </p>
          </div>
          <p className="text-gray-400 text-xs">
            Turn Any Topic Into Viral Content In Seconds
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-5 text-xs">
          
          {/* Error warnings */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3.5 flex gap-2.5 items-start text-rose-300 font-semibold leading-relaxed animate-shake">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Email input field */}
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

          {/* Password input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium font-sans"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-900/30 disabled:to-blue-900/30 text-white font-bold rounded-xl shadow-lg border border-purple-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                Secure Sign In
              </>
            )}
          </button>

          {/* Redirect links */}
          <div className="text-center pt-2 border-t border-white/5 font-sans">
            <span className="text-gray-500">Don't have an account? </span>
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
            >
              Sign Up Now
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
