import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Zap, Play, MessageSquare, Info, Key, Compass, BarChart2, CheckCircle } from 'lucide-react';
import { generateContentForTopic } from '../utils/generator';
import { generateWithGemini } from '../utils/gemini';
import type { GeneratedContent } from '../utils/generator';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  initialTopic?: string;
  clearInitialTopic?: () => void;
  apiKey: string;
  onOpenSettings: () => void;
}

// Custom LinkedIn SVG Icon
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Animated Counter component
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ value, duration = 800, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span className="font-mono">{count}{suffix}</span>;
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  initialTopic = '', 
  clearInitialTopic,
  apiKey,
  onOpenSettings
}) => {
  const { user } = useAuth();
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [activeCaptionTab, setActiveCaptionTab] = useState<'punchy' | 'storytelling' | 'question'>('punchy');
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});
  
  // Persistence states
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  
  // Pipeline animation step tracking
  const [pipelineStep, setPipelineStep] = useState(0);

  const triggerToast = (msg: string) => {
    setToast({ message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveToSupabase = async () => {
    if (!content) return;
    if (!user) {
      setError('Please log in to save content packages.');
      return;
    }

    setSaving(true);
    try {
      const scriptText = `Hook: ${content.script.hook}\n\nStory: ${content.script.story}\n\nCTA: ${content.script.cta}`;
      const activeCaptionText = content.captions[activeCaptionTab];

      const { error: insertError } = await supabase
        .from('generated_content')
        .insert({
          user_id: user.id,
          topic: content.topic,
          caption: activeCaptionText,
          script: scriptText,
          virality_score: content.viralityScore
        });

      if (insertError) throw insertError;
      
      triggerToast('Content package saved to your saved workspace.');
    } catch (err: any) {
      console.error('Error saving content:', err);
      triggerToast(err.message || 'Failed to save content package.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleGenerate(initialTopic);
      if (clearInitialTopic) {
        clearInitialTopic();
      }
    }
  }, [initialTopic]);

  // Loading animation pipeline stepper
  useEffect(() => {
    let interval: number;
    if (loading) {
      setPipelineStep(0);
      interval = window.setInterval(() => {
        setPipelineStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 200);
    } else if (content) {
      setPipelineStep(4);
    }
    return () => clearInterval(interval);
  }, [loading, content]);

  const handleGenerate = async (topicToUse = topic) => {
    if (!topicToUse.trim()) return;
    setLoading(true);
    setError(null);
    setPipelineStep(0);

    try {
      if (apiKey.trim()) {
        const result = await generateWithGemini(topicToUse, apiKey);
        setContent(result);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = generateContentForTopic(topicToUse);
        setContent(result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate content with Gemini API. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const hasApiKey = apiKey.trim().length > 0;

  // Real-time calculated metric configurations
  const trendScoreVal = content?.trendScore || 0;
  const viralityScoreVal = content?.viralityScore || 0;
  const engagementScoreVal = content ? parseFloat(content.expectedMetrics.engagement) : 0;
  const shareabilityScoreVal = content ? Math.min(99, Math.round(viralityScoreVal * 1.02)) : 0;

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. SaaS Hero Section */}
      <section className="relative text-center py-10 lg:py-16 space-y-6">
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[600px] h-[300px] bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-[120px] opacity-75 animate-pulse-slow" />
        </div>

        {/* Status pill top header */}
        <div className="flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onOpenSettings}
            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15 shadow-lg shadow-emerald-500/5'
                : 'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/15 shadow-lg shadow-purple-500/5 animate-pulse'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-purple-400'}`} />
            {hasApiKey ? 'ENGINE: LIVE GEMINI 2.5 ACTIVE' : 'ENGINE: LOCAL SIMULATOR'}
            <Key className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </motion.button>
        </div>

        {/* Luxury SaaS Title */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono uppercase bg-gradient-to-r from-white via-purple-300 to-blue-200 bg-clip-text text-transparent text-glow-purple"
          >
            ViralForge AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto tracking-wide"
          >
            Turn Any Topic Into Viral Content In Seconds
          </motion.p>
        </div>

        {/* Centered Large Input Chamber */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="max-w-2xl mx-auto w-full px-4 pt-4"
        >
          <div className="gradient-border-card p-2 flex flex-col sm:flex-row gap-2.5 shadow-2xl shadow-purple-500/5 backdrop-blur-xl">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a trending topic, niche, or idea..."
              className="flex-1 bg-transparent px-5 py-4 text-white placeholder-gray-600 focus:outline-none font-medium text-sm border-none ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !topic.trim()}
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-950/20 disabled:to-blue-950/20 text-white text-xs uppercase tracking-wider font-extrabold shadow-lg border border-purple-500/25 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed select-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Forging Pack...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  Generate Viral Package
                </>
              )}
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap items-center justify-center mt-4">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Suggested:</span>
            {['AI tools in 2026', 'Solopreneur Stack', 'Deep focus blocks', 'Fitness lies'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setTopic(s);
                  handleGenerate(s);
                }}
                className="text-[10px] bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-300 px-3 py-1 rounded-full border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* API Warning/Status Banner if no key */}
      {!hasApiKey && (
        <div className="glass-card rounded-2xl p-4.5 border border-purple-500/20 bg-gradient-to-r from-purple-950/10 to-blue-950/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
          <div className="flex gap-2.5 items-center">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/25 shrink-0">
              <Info className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">SaaS Live Generation mode</span>
              <p className="text-gray-400 text-[11px] leading-normal">
                Running in High-Performance simulation. Paste your Gemini API key in the top bar to connect directly with the Google Gemini models.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/15 transition-all cursor-pointer select-none whitespace-nowrap"
          >
            Manage API Credentials
          </button>
        </div>
      )}

      {/* Generation Error Display */}
      {error && (
        <div className="glass-card rounded-2xl p-5 border border-red-500/30 bg-red-950/10 text-red-300 text-sm font-sans flex items-start gap-3 fade-in">
          <span className="text-lg leading-none mt-0.5">⚠️</span>
          <div className="space-y-2">
            <span className="font-bold">Execution Bottleneck</span>
            <p className="text-red-400 text-xs leading-normal">{error}</p>
            <button
              onClick={onOpenSettings}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 px-3 py-1 rounded-lg transition-all cursor-pointer"
            >
              Verify API Key
            </button>
          </div>
        </div>
      )}

      {/* Main Core Generation Modules */}
      {(loading || content) && !error && (
        <div className="space-y-12">
          
          {/* 2. Visual Content Pipeline */}
          <section className="space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              Visual Content Pipeline
            </h3>
            
            <div className="relative p-2.5">
              {/* Horizontal connecting lasers line (desktop) */}
              <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-[#120d29] -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(pipelineStep / 4) * 100}%` }}
                />
              </div>

              {/* Grid of Pipeline Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  { title: 'Core Niche', desc: topic ? `"${topic}"` : 'Topic Input', icon: <Zap className="w-4.5 h-4.5" />, step: 0 },
                  { title: 'Trend Analysis', desc: loading && pipelineStep < 1 ? 'Analyzing...' : 'Interest Mapped', icon: <Compass className="w-4.5 h-4.5" />, step: 1 },
                  { title: 'Reel Script', desc: loading && pipelineStep < 2 ? 'Forging...' : 'Timeline Ready', icon: <Play className="w-4.5 h-4.5" />, step: 2 },
                  { title: 'Social Caption', desc: loading && pipelineStep < 3 ? 'Composing...' : 'Copy Curated', icon: <MessageSquare className="w-4.5 h-4.5" />, step: 3 },
                  { title: 'Virality Predict', desc: loading && pipelineStep < 4 ? 'Calculating...' : 'Index Evaluated', icon: <BarChart2 className="w-4.5 h-4.5" />, step: 4 }
                ].map((node) => {
                  const isActive = pipelineStep >= node.step;
                  const isCurrent = loading && pipelineStep === node.step;
                  
                  return (
                    <div 
                      key={node.step}
                      className={`glass-card rounded-2xl p-4.5 border flex flex-col items-center text-center space-y-3.5 relative overflow-hidden transition-all duration-300 ${
                        isCurrent 
                          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10 scale-102 z-10' 
                          : isActive 
                            ? 'border-white/10 bg-black/40 text-white' 
                            : 'border-white/5 opacity-40 text-gray-500'
                      }`}
                    >
                      {/* Active glow dot */}
                      {isCurrent && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                      )}

                      <div className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                        isCurrent 
                          ? 'bg-purple-600 text-white border-purple-400' 
                          : isActive 
                            ? 'bg-white/5 text-purple-400 border-white/5' 
                            : 'bg-black/20 text-gray-600 border-transparent'
                      }`}>
                        {node.icon}
                      </div>

                      <div className="space-y-1 font-sans">
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${isActive ? 'text-white' : 'text-gray-500'}`}>
                          {node.title}
                        </span>
                        <p className={`text-[11px] truncate max-w-[130px] ${isCurrent ? 'text-purple-300 font-semibold' : isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Premium Metric Cards Grid */}
          <section className="space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              Content Return Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Trend Score */}
              <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[155px] relative overflow-hidden group">
                <div className="space-y-1 bg-[#09071c] p-2 py-1.5 border border-purple-500/10 w-fit rounded-lg">
                  <span className="text-[9px] uppercase tracking-widest font-black text-purple-400">TREND SCORE</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <h4 className="text-3xl font-extrabold text-white font-mono">
                      {loading ? '...' : <AnimatedCounter value={trendScoreVal} suffix="%" />}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                      ▲ Exploding search
                    </span>
                  </div>
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="22" className="stroke-white/5" strokeWidth="4.5" fill="transparent" />
                      {!loading && (
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          className="stroke-purple-500 transition-all duration-1000"
                          strokeWidth="4.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 22}
                          strokeDashoffset={2 * Math.PI * 22 * (1 - trendScoreVal / 100)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <div className="absolute text-[10px] text-white font-mono font-bold">{loading ? '' : trendScoreVal}</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Virality Score */}
              <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[155px] relative overflow-hidden group">
                <div className="space-y-1 bg-[#051125] p-2 py-1.5 border border-blue-500/10 w-fit rounded-lg">
                  <span className="text-[9px] uppercase tracking-widest font-black text-blue-400">VIRALITY SCORE</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <h4 className="text-3xl font-extrabold text-white font-mono">
                      {loading ? '...' : <AnimatedCounter value={viralityScoreVal} suffix="%" />}
                    </h4>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                      ● Sweetspot catalog
                    </span>
                  </div>
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="22" className="stroke-white/5" strokeWidth="4.5" fill="transparent" />
                      {!loading && (
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          className="stroke-blue-500 transition-all duration-1000"
                          strokeWidth="4.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 22}
                          strokeDashoffset={2 * Math.PI * 22 * (1 - viralityScoreVal / 100)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <div className="absolute text-[10px] text-white font-mono font-bold">{loading ? '' : viralityScoreVal}</div>
                  </div>
                </div>
              </div>

              {/* Card 3: Engagement Score */}
              <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[155px] relative overflow-hidden group">
                <div className="space-y-1 bg-[#1a0724] p-2 py-1.5 border border-pink-500/10 w-fit rounded-lg">
                  <span className="text-[9px] uppercase tracking-widest font-black text-pink-400">ENGAGEMENT INDEX</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <h4 className="text-3xl font-extrabold text-white font-mono">
                      {loading ? '...' : <AnimatedCounter value={Math.round(engagementScoreVal * 10)} duration={1000} suffix="%" />}
                    </h4>
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                      ★ Active interaction
                    </span>
                  </div>
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="22" className="stroke-white/5" strokeWidth="4.5" fill="transparent" />
                      {!loading && (
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          className="stroke-pink-500 transition-all duration-1000"
                          strokeWidth="4.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 22}
                          strokeDashoffset={2 * Math.PI * 22 * (1 - (engagementScoreVal * 10) / 100)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <div className="absolute text-[10px] text-white font-mono font-bold">
                      {loading ? '' : (engagementScoreVal).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Shareability Score */}
              <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[155px] relative overflow-hidden group">
                <div className="space-y-1 bg-[#051a24] p-2 py-1.5 border border-cyan-500/10 w-fit rounded-lg">
                  <span className="text-[9px] uppercase tracking-widest font-black text-cyan-400">SHARE MULTIPLIER</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <h4 className="text-3xl font-extrabold text-white font-mono">
                      {loading ? '...' : <AnimatedCounter value={shareabilityScoreVal} suffix="%" />}
                    </h4>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                      ▲ High reshare rate
                    </span>
                  </div>
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="22" className="stroke-white/5" strokeWidth="4.5" fill="transparent" />
                      {!loading && (
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          className="stroke-cyan-500 transition-all duration-1000"
                          strokeWidth="4.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 22}
                          strokeDashoffset={2 * Math.PI * 22 * (1 - shareabilityScoreVal / 100)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <div className="absolute text-[10px] text-white font-mono font-bold">{loading ? '' : shareabilityScoreVal}</div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 4. Display Cards for Script, Caption, LinkedIn Post */}
          <AnimatePresence>
            {content && !loading && (
              <div className="space-y-6">
                
                {/* Save Content Package Master Toolbar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row justify-between items-center bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-md gap-3 font-sans"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">Generated Package Assets</span>
                  </div>
                  <button
                    onClick={handleSaveToSupabase}
                    disabled={saving}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 disabled:from-purple-900/30 disabled:to-blue-900/30 text-white text-xs font-bold rounded-xl shadow-lg border border-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed select-none active:scale-98 shrink-0"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Package...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        Save Content Package
                      </>
                    )}
                  </button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                
                {/* Reel Script Card */}
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-6 lg:row-span-2">
                  <div className="space-y-4 font-sans">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Play className="w-5 h-5 text-purple-400 fill-purple-400/20 animate-pulse" />
                        Short-Form Reel Script (45s)
                      </h3>
                      <button
                        onClick={() => copyText(`${content.script.hook}\n\n${content.script.story}\n\n${content.script.cta}`, 'reelScript')}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                        title="Copy full script"
                      >
                        {copiedState['reelScript'] ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Hook Section */}
                      <div className="space-y-1 bg-purple-950/20 rounded-xl p-4 border border-purple-500/10">
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">0:00 - 0:03 | Hook Section</span>
                        <p className="text-white font-bold leading-relaxed">{content.script.hook}</p>
                      </div>
                      
                      {/* Story Section */}
                      <div className="space-y-1 bg-black/35 rounded-xl p-4 border border-white/5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">0:03 - 0:40 | Story Section</span>
                        <p className="text-gray-300 text-sm leading-relaxed">{content.script.story}</p>
                      </div>
                      
                      {/* CTA Section */}
                      <div className="space-y-1 bg-blue-950/20 rounded-xl p-4 border border-blue-500/10">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">0:40 - 0:45 | CTA Section</span>
                        <p className="text-white font-semibold leading-relaxed">{content.script.cta}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-purple-400" />
                      Duration: exactly 45 seconds
                    </span>
                    <span className="text-purple-300 font-medium">Fit index: Reels / TikTok / Shorts</span>
                  </div>
                </div>

                {/* Generated Caption Card */}
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-400 fill-pink-400/20" />
                      Algorithm-Tailored Captions
                    </h3>
                    <button
                      onClick={() => {
                        const capText = activeCaptionTab === 'punchy' ? content.captions.punchy : 
                                    activeCaptionTab === 'storytelling' ? content.captions.storytelling : 
                                    content.captions.question;
                        copyText(capText, 'captionText');
                      }}
                      className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                      title="Copy caption"
                    >
                      {copiedState['captionText'] ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex bg-black/45 p-1 rounded-xl border border-white/5">
                    {(['punchy', 'storytelling', 'question'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveCaptionTab(tab)}
                        className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-all duration-150 ${
                          activeCaptionTab === tab
                            ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white border border-purple-500/20 shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Text Area */}
                  <div className="bg-black/35 rounded-xl p-4 border border-white/5 min-h-[140px] flex items-center">
                    <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed w-full font-medium">
                      {activeCaptionTab === 'punchy' && content.captions.punchy}
                      {activeCaptionTab === 'storytelling' && content.captions.storytelling}
                      {activeCaptionTab === 'question' && content.captions.question}
                    </p>
                  </div>
                </div>

                {/* Generated LinkedIn Post Card */}
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <LinkedInIcon className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                      Professional LinkedIn Post
                    </h3>
                    <button
                      onClick={() => copyText(content.linkedinPost, 'linkedinPost')}
                      className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                      title="Copy full post"
                    >
                      {copiedState['linkedinPost'] ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-black/35 rounded-xl p-4 border border-white/5 h-[160px] overflow-y-auto">
                    <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed font-medium">
                      {content.linkedinPost}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 font-mono">
                    <span>Estimated Read: ~60 seconds</span>
                    <span>Length: {content.linkedinPost.length} chars</span>
                  </div>
                </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* 5. Idle Empty State */}
      {!loading && !content && !error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-16 text-center border border-white/5 flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-float shadow-lg shadow-purple-500/5">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">Forge Chamber Idle</h3>
            <p className="text-gray-500 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
              Type a topic query in the search bar above or choose one of our suggested algorithms templates to launch your custom marketing package.
            </p>
          </div>
        </motion.div>
      )}

      {/* Toast Notification Alert Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-60 glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-sans shadow-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Success</span>
              <p className="text-[10px] text-gray-400 mt-0.5">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
