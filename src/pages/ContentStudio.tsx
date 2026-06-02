import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  Download
} from 'lucide-react';
import { generateContentForTopic } from '../utils/generator';
import { generateWithGemini } from '../utils/gemini';
import type { GeneratedContent } from '../utils/generator';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { PageId } from '../components/Sidebar';

interface ContentStudioProps {
  initialTopic?: string;
  clearInitialTopic?: () => void;
  onSelectTopic?: (topicTitle: string, navigateTo: PageId) => void;
  handoffPackage?: any;
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

export const ContentStudio: React.FC<ContentStudioProps> = ({ 
  initialTopic = '', 
  clearInitialTopic,
  onSelectTopic: _onSelectTopic,
  handoffPackage
}) => {
  const { user } = useAuth();
  const [topic, setTopic] = useState(initialTopic);
  
  // Custom creator variables
  const [selectedNiche, setSelectedNiche] = useState('AI & Technology');
  const [selectedTone, setSelectedTone] = useState('Contrarian & Bold');
  const [targetAudience, setTargetAudience] = useState('Solopreneurs & Creators');
  const [duration, setDuration] = useState('45s');
  const [creatorGoal, setCreatorGoal] = useState<'Gain Followers' | 'Build Authority' | 'Generate Leads' | 'Promote Product'>('Gain Followers');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Cooldown State for rate limit resilience
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  
  // Persistence states
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  
  // Pipeline animation step tracking
  const [pipelineStep, setPipelineStep] = useState(0);
  const pipelineTasks = [
    'Analyzing Trend & Audience...',
    'Creating Pattern-Interrupt Hook...',
    'Building 5 Chronological Scenes...',
    'Generating Voiceover Script...',
    'Generating Visual B-Roll Prompts...',
    'Creating Publishing Package...',
    'AI Reel Production Blueprint Completed!'
  ];

  // Automatic Cooldown Countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

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
      const scriptText = `Title: ${content.concept.title}\n\nObjective: ${content.concept.objective}\n\nVoiceover Narration:\nHook: ${content.voiceoverScript.hook}\nBody: ${content.voiceoverScript.mainContent}\nCTA: ${content.voiceoverScript.cta}`;
      const activeCaptionText = content.publishingPackage.instagramCaption;

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
    const handleRetryState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.isRetrying) {
        setRetryMessage(customEvent.detail.message || 'AI engine busy, retrying...');
      } else {
        setRetryMessage(null);
      }
    };
    window.addEventListener('gemini-retry-state', handleRetryState);
    return () => {
      window.removeEventListener('gemini-retry-state', handleRetryState);
    };
  }, []);

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
        setPipelineStep((prev) => (prev < 6 ? prev + 1 : prev));
      }, 300); // 300ms intervals for a highly realistic scan feel
    } else if (content) {
      setPipelineStep(6);
    }
    return () => clearInterval(interval);
  }, [loading, content]);

  const handleGenerate = async (topicToUse = topic, forceRefresh = false) => {
    if (!topicToUse.trim()) return;
    if (loading) return; // Prevent duplicate requests
    setLoading(true);
    setError(null);
    setPipelineStep(0);

    try {
      const activeKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (activeKey.trim()) {
        const result = await generateWithGemini(topicToUse, activeKey, creatorGoal, handoffPackage, forceRefresh);
        setContent(result);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1800)); // Artificial wait for animated stepper
        const result = generateContentForTopic(topicToUse, creatorGoal);
        setContent(result);
      }
    } catch (err: any) {
      console.error(err); // Log provider errors only to console
      
      const isQuota = err.isQuotaExceeded || 
                      err.message?.toLowerCase().includes('quota') || 
                      err.message?.toLowerCase().includes('exhausted') || 
                      err.message?.toLowerCase().includes('rate limit');
      
      if (isQuota) {
        const seconds = err.retryAfterSeconds || 60; // fallback to 60s
        setCooldownRemaining(seconds);
        setError("AI Engine Cooling Down");
      } else {
        setError(err?.message || 'Failed to generate content with Gemini API. Check your API key.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState((prev) => ({ ...prev, [key]: true }));
    triggerToast('Content copied to clipboard!');
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const copyFullPackage = () => {
    if (!content) return;
    
    let text = `=== AI REEL PRODUCTION BLUEPRINT ===\n`;
    text += `Topic: ${content.topic}\n`;
    text += `Reel Title: ${content.concept.title}\n`;
    text += `Objective: ${content.concept.objective}\n`;
    text += `Target Audience: ${content.concept.targetAudience}\n`;
    text += `Virality Score: ${content.viralityScore}%\n`;
    text += `Trend Score: ${content.trendScore}/100\n`;
    text += `Best Posting Time: ${content.publishingPackage.bestPostingTime}\n\n`;
    
    text += `=== 5-SCENE STORYBOARD ===\n`;
    content.scenes.forEach((scene) => {
      text += `SCENE ${scene.sceneNumber} (${scene.duration})\n`;
      text += `- Visual B-Roll: ${scene.visualDescription}\n`;
      text += `- Speaking Line: "${scene.voiceoverText}"\n`;
      text += `- Text Overlay: ${scene.onScreenText}\n`;
      text += `- AI Video Prompt: ${scene.visualPrompt}\n`;
      text += `- Auto Caption: ${scene.autoCaption}\n\n`;
    });
    
    text += `=== FULL VOICEOVER SCRIPT ===\n`;
    text += `Hook (0:00 - 0:03): "${content.voiceoverScript.hook}"\n`;
    text += `Body (0:03 - 0:40): "${content.voiceoverScript.mainContent}"\n`;
    text += `CTA (0:40 - 0:45): "${content.voiceoverScript.cta}"\n\n`;
    
    text += `=== THUMBNAIL DESIGN ===\n`;
    text += `- Text Overlay: "${content.thumbnail.text}"\n`;
    text += `- Design Concept: ${content.thumbnail.concept}\n`;
    text += `- Emotion Trigger: ${content.thumbnail.emotionTrigger}\n\n`;
    
    text += `=== PUBLISHING PACKAGE ===\n`;
    text += `Instagram Caption:\n${content.publishingPackage.instagramCaption}\n\n`;
    text += `LinkedIn Post:\n${content.publishingPackage.linkedinPost}\n\n`;
    text += `Hashtags: ${content.publishingPackage.hashtags}\n`;
    
    navigator.clipboard.writeText(text);
    triggerToast('Entire Reel package copied to clipboard!');
  };

  const copyAllPrompts = () => {
    if (!content) return;
    
    const prompts = content.scenes.map(s => `Scene ${s.sceneNumber} Video Prompt:\n"${s.visualPrompt}"`).join('\n\n');
    navigator.clipboard.writeText(prompts);
    triggerToast('All 5 storyboard visual prompts copied!');
  };

  const downloadTxt = () => {
    if (!content) return;
    
    let text = `=== AI REEL PRODUCTION BLUEPRINT ===\n`;
    text += `Topic: ${content.topic}\n`;
    text += `Reel Title: ${content.concept.title}\n`;
    text += `Objective: ${content.concept.objective}\n`;
    text += `Target Audience: ${content.concept.targetAudience}\n`;
    text += `Virality Score: ${content.viralityScore}%\n`;
    text += `Trend Score: ${content.trendScore}/100\n`;
    text += `Best Posting Time: ${content.publishingPackage.bestPostingTime}\n\n`;
    
    text += `=== 5-SCENE STORYBOARD ===\n`;
    content.scenes.forEach((scene) => {
      text += `SCENE ${scene.sceneNumber} (${scene.duration})\n`;
      text += `- Visual B-Roll: ${scene.visualDescription}\n`;
      text += `- Speaking Line: "${scene.voiceoverText}"\n`;
      text += `- Text Overlay: ${scene.onScreenText}\n`;
      text += `- AI Video Prompt: ${scene.visualPrompt}\n`;
      text += `- Auto Caption: ${scene.autoCaption}\n\n`;
    });
    
    text += `=== FULL VOICEOVER SCRIPT ===\n`;
    text += `Hook (0:00 - 0:03): "${content.voiceoverScript.hook}"\n`;
    text += `Body (0:03 - 0:40): "${content.voiceoverScript.mainContent}"\n`;
    text += `CTA (0:40 - 0:45): "${content.voiceoverScript.cta}"\n\n`;
    
    text += `=== THUMBNAIL DESIGN ===\n`;
    text += `- Text Overlay: "${content.thumbnail.text}"\n`;
    text += `- Design Concept: ${content.thumbnail.concept}\n`;
    text += `- Emotion Trigger: ${content.thumbnail.emotionTrigger}\n\n`;
    
    text += `=== PUBLISHING PACKAGE ===\n`;
    text += `Instagram Caption:\n${content.publishingPackage.instagramCaption}\n\n`;
    text += `LinkedIn Post:\n${content.publishingPackage.linkedinPost}\n\n`;
    text += `Hashtags: ${content.publishingPackage.hashtags}\n`;
    
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `reel_blueprint_${content.topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('Reel blueprint downloaded successfully!');
  };

  // Removed local derivations since they are now dynamically generated by the AI Creative Director & Reel Producer

  return (
    <div className="space-y-8 fade-in pb-16 font-sans">
      
      {/* Header section */}
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse-slow" />
            Creator Content Studio
          </h1>
          <p className="text-gray-400 mt-1 max-w-xl">
            A unified creator workspace. Map out scripts, captions, hashtags, and CTA loops from a single emerging opportunity.
          </p>
        </div>
        
        {/* API key status indicator */}
        <div className="flex justify-center">
          <div
            className="px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest flex items-center gap-2 backdrop-blur-md bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AI INTELLIGENCE ENGINE ENGAGED
          </div>
        </div>
      </div>

      {/* Main Studio Controls Deck */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
        
        {handoffPackage && (
          <div className="bg-[#12071a]/55 border border-purple-500/25 text-purple-300 rounded-xl p-4.5 flex gap-3 items-center justify-between text-xs font-sans">
            <div className="flex gap-3 items-center flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 animate-pulse mr-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-purple-400 font-bold tracking-wider block uppercase">⚡ ViralForge AI Domination Handoff Engaged</span>
                <p className="text-gray-300 font-medium leading-relaxed">
                  Generating strategic content based on the competitor gap angle: <span className="text-white font-extrabold italic">&ldquo;{handoffPackage.winningStrategy?.recommendedAngle || handoffPackage.bestOpportunity?.recommendedAngle || handoffPackage.contentGapEngine?.recommendedAngle || 'Unique strategic positioning'}&rdquo;</span>.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#09030d] border border-purple-500/20 text-purple-400 font-mono font-bold text-[9px] uppercase tracking-wider shrink-0">Strategic Grounding</span>
          </div>
        )}
        
        {/* Cooldown Warning Alert */}
        {cooldownRemaining > 0 && (
          <div className="bg-amber-950/20 border border-amber-500/25 text-amber-300 rounded-2xl p-4 flex gap-3 items-center justify-between text-xs font-sans animate-pulse">
            <div className="flex gap-2.5 items-center">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-spin-slow" />
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider block text-[10px] font-mono">AI Engine Cooling Down</span>
                <p className="text-gray-400 mt-0.5 font-medium">Gemini rate limits exceeded. Automatically re-enabling in {cooldownRemaining} seconds.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 font-mono font-extrabold text-sm tracking-wide">
              {cooldownRemaining}s
            </span>
          </div>
        )}

        {/* Core Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Target Trend / Topic</label>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. AI Automation Agency in 2026..."
                className="flex-1 bg-black/45 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 text-xs font-semibold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate(topic, false);
                }}
              />
              <button
                onClick={() => handleGenerate(topic, false)}
                disabled={loading || cooldownRemaining > 0 || !topic.trim()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold flex items-center justify-center gap-1.5 border border-purple-400/20 transition-all cursor-pointer select-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Synthesizing Package...
                  </>
                ) : cooldownRemaining > 0 ? (
                  <>
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    Cooling Down ({cooldownRemaining}s)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    One-Click Domination Package
                  </>
                )}
              </button>
            </div>

            {/* Smart Secondary Actions: Force Refresh */}
            {topic.trim() && !loading && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleGenerate(topic, true)}
                  disabled={cooldownRemaining > 0}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Bypass 6-hour cache and query Gemini directly"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Force Refresh Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Core Creator Goal Select Bar (Premium Glass buttons) */}
        <div className="space-y-2 border-t border-white/5 pt-5 font-sans">
          <label className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Primary Creator Goal</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {([
              { id: 'Gain Followers', label: 'Gain Followers', desc: 'Optimize for mass appeal & virality' },
              { id: 'Build Authority', label: 'Build Authority', desc: 'Technical proofs & case studies' },
              { id: 'Generate Leads', label: 'Generate Leads', desc: 'Checklists & comment-to-DM hooks' },
              { id: 'Promote Product', label: 'Promote Product', desc: 'SaaS solutions & trials focus' }
            ] as const).map((g) => {
              const isActive = creatorGoal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setCreatorGoal(g.id)}
                  className={`p-3 text-left cursor-pointer transition-all duration-150 relative overflow-hidden rounded-xl border ${
                    isActive 
                      ? 'border-purple-500/40 bg-purple-500/10 text-white shadow-md shadow-purple-500/5' 
                      : 'border-white/5 bg-black/25 text-gray-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{g.label}</span>
                  <span className="text-[9px] text-gray-500 font-medium block mt-0.5 leading-tight">{g.desc}</span>
                  {isActive && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-purple-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Parameters Tuning */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans border-t border-white/5 pt-5">
          {/* Niche Selector */}
          <div className="space-y-1.5">
            <span className="text-gray-500 font-bold uppercase tracking-wide block">Niche Category</span>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-purple-500/40 text-xs font-semibold cursor-pointer"
            >
              <option value="AI & Technology">AI & Technology</option>
              <option value="SaaS & Startups">SaaS & Startups</option>
              <option value="Creator Economy">Creator Economy</option>
              <option value="Personal Finance">Personal Finance</option>
              <option value="Productivity & Health">Productivity & Health</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <span className="text-gray-500 font-bold uppercase tracking-wide block">Brand Tone Dials</span>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-purple-500/40 text-xs font-semibold cursor-pointer"
            >
              <option value="Contrarian & Bold">Contrarian & Bold</option>
              <option value="Educational & Authoritative">Educational & Authoritative</option>
              <option value="Aesthetic & Cinematic">Aesthetic & Cinematic</option>
              <option value="Punchy & Entertaining">Punchy & Entertaining</option>
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <span className="text-gray-500 font-bold uppercase tracking-wide block">Target Audience Profile</span>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-purple-500/40 text-xs font-semibold"
            />
          </div>

          {/* Video Duration */}
          <div className="space-y-1.5">
            <span className="text-gray-500 font-bold uppercase tracking-wide block">Video Duration Limit</span>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-purple-500/40 text-xs font-semibold cursor-pointer"
            >
              <option value="15s">15 seconds (Micro-Hook)</option>
              <option value="30s">30 seconds (Value Drop)</option>
              <option value="45s">45 seconds (Balanced Tutorial)</option>
              <option value="60s">60 seconds (Deep Breakdown)</option>
            </select>
          </div>
        </div>

      </div>

      {/* API Warning/Status Banner if no key */}
      {error && (
        <div className="glass-card rounded-2xl p-5 border border-red-500/30 bg-red-950/10 text-red-300 text-xs font-sans flex items-start gap-3 fade-in">
          <span className="text-base leading-none">⚠️</span>
          <div className="space-y-2">
            <span className="font-bold font-mono uppercase">API Execution Error</span>
            <p className="text-red-400 text-xs leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Stepper Timeline AI scanning */}
      {loading && (
        <div className="glass-card rounded-2xl p-5 border border-purple-500/10 bg-purple-950/5 space-y-4">
          {retryMessage ? (
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
              ⚡ {retryMessage}
            </h3>
          ) : (
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
              AI Content Studio Workflow Stepper
            </h3>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-[10px] leading-relaxed">
            {pipelineTasks.map((task, idx) => {
              const stepActive = pipelineStep >= idx;
              const stepDone = pipelineStep > idx;
              
              return (
                <div 
                  key={idx}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                    stepDone 
                      ? 'bg-emerald-950/10 border-emerald-500/15 text-emerald-400 font-semibold' 
                      : stepActive 
                        ? 'bg-purple-950/20 border-purple-500/30 text-purple-300 font-semibold animate-pulse' 
                        : 'bg-black/20 border-transparent text-gray-600 opacity-40'
                  }`}
                >
                  <div className="shrink-0">
                    {stepDone ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/10 shrink-0" />
                    ) : stepActive ? (
                      <div className="w-4 h-4 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-800 shrink-0" />
                    )}
                  </div>
                  <span className="truncate">{task}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER FORGED CONTENT PACKAGE */}
      <AnimatePresence mode="wait">
        {content && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {content.isCachedResult && (
              <div className="bg-purple-950/20 border border-purple-500/15 text-purple-300 rounded-xl p-3.5 flex gap-2.5 items-center justify-between text-[10px] font-sans">
                <div className="flex gap-2.5 items-center">
                  <span className="text-purple-400 font-bold">⚡ SHOWING RECENT AI ANALYSIS</span>
                  <span className="text-gray-500">|</span>
                  <p>Displaying cached analysis concept synced during peak service demand.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#12071a] border border-purple-500/20 text-purple-400 font-mono font-bold text-[8.5px]">6H CACHE</span>
              </div>
            )}
            
            {/* Unified Export Actions Save Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md gap-4 text-xs font-bold font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-white uppercase tracking-wider block">AI Reel Production Blueprint Ready</span>
                  <span className="text-[10px] text-gray-400 font-medium">Export and sync your creative direction and storyboard prompts.</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleSaveToSupabase}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white rounded-xl shadow-lg border border-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 select-none text-[9.5px] uppercase font-black tracking-wider animate-pulse-slow"
                >
                  {saving ? 'Saving...' : 'Save Blueprint'}
                </button>
                
                <button
                  onClick={copyFullPackage}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[9.5px] uppercase font-black tracking-wider"
                >
                  Copy Full Package
                </button>

                <button
                  onClick={copyAllPrompts}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[9.5px] uppercase font-black tracking-wider"
                >
                  Copy All Prompts
                </button>

                <button
                  onClick={downloadTxt}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[9.5px] uppercase font-black tracking-wider"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  Download TXT
                </button>
              </div>
            </div>

            {/* AI Reel Studio Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT SIDE: STORYBOARD PREVIEW DECK (7 Cols) - The Visual Centerpiece */}
              <div className="lg:col-span-7 space-y-5">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Play className="w-4.5 h-4.5 text-purple-400 fill-purple-400/10" />
                    AI Reel Storyboard Preview (Scenes 1-5)
                  </h3>
                  <p className="text-[10px] text-gray-500 font-sans mt-0.5">Chronological scene B-roll direction, spoken lines, overlays, and visual prompts.</p>
                </div>

                <div className="space-y-6 border-l border-white/5 pl-5 ml-2.5 font-sans">
                  {content.scenes.map((scene, idx) => (
                    <div key={idx} className="relative group/scene">
                      {/* Timeline circle node */}
                      <div className="absolute -left-[28.5px] top-1.5 w-3.5 h-3.5 rounded-full border border-purple-500/40 bg-[#0c0514] flex items-center justify-center text-[8px] font-black text-purple-300 shadow-sm shadow-purple-500/10 font-mono">
                        {scene.sceneNumber}
                      </div>

                      <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-purple-500/20 transition-all duration-200 space-y-4 bg-black/10">
                        {/* Scene Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-950/20 border border-purple-500/15 text-purple-400 font-mono">
                              SCENE {scene.sceneNumber}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-1.5 leading-tight uppercase font-mono tracking-wide">
                              Scene Duration: {scene.duration}
                            </h4>
                          </div>

                          <button
                            onClick={() => copyText(scene.visualPrompt, `scene_${idx}`)}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all text-[8.5px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                            title="Copy prompt for Runway/Veo video rendering"
                          >
                            {copiedState[`scene_${idx}`] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            Copy Visual Prompt
                          </button>
                        </div>

                        {/* Speaking Narrator Dialogue */}
                        <div className="bg-black/35 rounded-xl p-3.5 border border-white/5 space-y-1">
                          <span className="text-[8.5px] uppercase tracking-wider text-purple-400 font-bold block font-mono">VOICEOVER (SPEAKING LINE)</span>
                          <p className="text-white text-xs leading-relaxed italic font-medium">
                            &ldquo;{scene.voiceoverText}&rdquo;
                          </p>
                        </div>

                        {/* On-screen Text Overlay */}
                        <div className="bg-[#12071a]/30 border border-purple-500/10 rounded-xl p-3 flex items-start gap-2 text-xs">
                          <span className="text-[8.5px] text-purple-400 font-mono font-bold uppercase shrink-0 mt-0.5">TEXT OVERLAY:</span>
                          <span className="text-purple-300 font-extrabold font-mono text-[10.5px] tracking-wide uppercase">
                            {scene.onScreenText}
                          </span>
                        </div>

                        {/* Technical Prompts & Action */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[11px] leading-relaxed">
                          
                          {/* Visual prompt for Video API */}
                          <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-1">
                            <span className="text-[8.5px] text-gray-500 font-bold uppercase tracking-wider font-mono">AI Visual Prompt (Runway/Veo)</span>
                            <p className="text-gray-300 leading-normal font-medium italic">&ldquo;{scene.visualPrompt}&rdquo;</p>
                          </div>

                          {/* Scene Auto-Caption */}
                          <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-1">
                            <span className="text-[8.5px] text-gray-500 font-bold uppercase tracking-wider font-mono">Auto Scene Caption</span>
                            <p className="text-gray-400 leading-normal font-medium">{scene.autoCaption}</p>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Video Production Ready Card */}
                  <div className="relative group/production-ready animate-float">
                    <div className="absolute -left-[28.5px] top-1.5 w-3.5 h-3.5 rounded-full border border-emerald-500/40 bg-[#020805] flex items-center justify-center text-[7px] font-black text-emerald-300 font-mono">
                      ✓
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-dashed border-emerald-500/25 bg-emerald-950/5 text-center space-y-3 font-sans hover:border-emerald-500/40 transition-all duration-200">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                        <CheckCircle className="w-5 h-5 fill-emerald-500/10 text-emerald-400 animate-pulse" />
                      </div>
                      <div className="max-w-md mx-auto space-y-1.5">
                        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 font-mono block">Video Production Ready</span>
                        <p className="text-gray-300 text-[11px] leading-relaxed font-medium">
                          This storyboard is optimized for AI video tools such as Kling, Veo, Runway and CapCut. Export the generated visual prompts and narration directly into your preferred editor.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT SIDE: CREATIVE DESKS & CONTROLS (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. REEL CONCEPT & SCORES */}
                <div className="glass-card rounded-2xl p-5 border border-white/5 bg-black/10 space-y-4 font-sans text-xs flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <span className="text-purple-400 font-extrabold uppercase font-mono text-[8.5px] block tracking-widest">
                      Creative Director Desk • Concept
                    </span>
                    <h2 className="text-md font-black text-white leading-tight uppercase font-mono border-b border-white/5 pb-2.5">
                      Reel Concept & Metadata
                    </h2>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block">Reel Production Title</span>
                        <p className="text-white font-extrabold text-[12.5px] mt-0.5">{content.concept.title}</p>
                      </div>

                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block">Strategic Objective</span>
                        <p className="text-gray-300 font-medium leading-relaxed mt-0.5">{content.concept.objective}</p>
                      </div>

                      {/* Virality Score & Trend Analysis High-Impact Display */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                        <div className="bg-gradient-to-br from-purple-950/45 to-pink-950/20 border border-purple-500/20 rounded-xl p-3.5 relative overflow-hidden shadow-lg shadow-purple-500/5 group">
                          <span className="text-[8.5px] text-purple-400 uppercase tracking-widest font-mono font-bold block">Virality Score</span>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-300 font-mono tracking-tight">{content.viralityScore}%</span>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">High Opportunity</span>
                          </div>
                          {/* subtle decorative background glow */}
                          <div className="absolute -right-3 -bottom-3 w-10 h-10 bg-purple-500/10 rounded-full blur-md group-hover:scale-110 transition-all pointer-events-none" />
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-950/45 to-[#0b1424]/20 border border-blue-500/20 rounded-xl p-3.5 relative overflow-hidden shadow-lg shadow-blue-500/5 group">
                          <span className="text-[8.5px] text-blue-400 uppercase tracking-widest font-mono font-bold block">Trend Analysis</span>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-teal-300 font-mono tracking-tight">{content.trendScore}/100</span>
                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider shrink-0 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md">Trending Hot</span>
                          </div>
                          {/* subtle decorative background glow */}
                          <div className="absolute -right-3 -bottom-3 w-10 h-10 bg-blue-500/10 rounded-full blur-md group-hover:scale-110 transition-all pointer-events-none" />
                        </div>
                      </div>

                      {/* Small text describing Trend Analysis to fulfill "Trend Analysis output" completely */}
                      <div className="bg-black/35 border border-white/5 rounded-xl p-3 text-[10.5px] text-gray-400 leading-relaxed font-sans mt-2">
                        <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider font-mono block mb-1">Search demand profile</span>
                        Interest volume is highly optimized with strong query indicators from search suggestions and emerging queries.
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block">Target Audience</span>
                          <span className="text-white font-bold block mt-0.5">{content.concept.targetAudience}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block">Best Posting Time</span>
                          <span className="text-blue-300 font-bold block mt-0.5">{content.publishingPackage.bestPostingTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Forecast Scorecard */}
                  <div className="border-t border-white/5 pt-4 space-y-2.5">
                    <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest font-mono block">Performance Forecast metrics</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                      <div className="bg-black/35 border border-white/5 p-2 rounded-xl">
                        <span className="text-gray-500 block uppercase text-[7.5px] font-bold">Views</span>
                        <span className="text-white font-black text-[11px] block mt-0.5">{content.expectedMetrics.views}</span>
                      </div>
                      <div className="bg-black/35 border border-white/5 p-2 rounded-xl">
                        <span className="text-gray-500 block uppercase text-[7.5px] font-bold">Likes</span>
                        <span className="text-white font-black text-[11px] block mt-0.5">{content.expectedMetrics.likes}</span>
                      </div>
                      <div className="bg-black/35 border border-white/5 p-2 rounded-xl">
                        <span className="text-gray-500 block uppercase text-[7.5px] font-bold">Shares</span>
                        <span className="text-white font-black text-[11px] block mt-0.5">{content.expectedMetrics.shares}</span>
                      </div>
                      <div className="bg-black/35 border border-white/5 p-2 rounded-xl">
                        <span className="text-purple-300 block uppercase text-[7.5px] font-bold">Engage</span>
                        <span className="text-purple-300 font-black text-[11px] block mt-0.5">{content.expectedMetrics.engagement}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. THUMBNAIL INTELLIGENCE - Visually Attractive Upgraded Layout */}
                <div className="glass-card rounded-2xl p-5 border border-white/5 bg-black/10 space-y-4 font-sans text-xs">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div>
                        <span className="text-blue-400 font-extrabold uppercase font-mono text-[8.5px] block tracking-widest">
                          Thumbnail Desk • Intelligence
                        </span>
                        <h2 className="text-md font-black text-white leading-tight uppercase font-mono mt-0.5">
                          Thumbnail Design
                        </h2>
                      </div>
                      <button
                        onClick={() => copyText(content.thumbnail.concept, 'copyThumb')}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-mono font-bold text-[8.5px] uppercase flex items-center gap-1 cursor-pointer transition-all shrink-0"
                      >
                        {copiedState['copyThumb'] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy Design Concept
                      </button>
                    </div>

                    {/* Simulated cover cover mock cover frame */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/50 via-purple-950/40 to-slate-950/60 flex flex-col justify-between p-4 shadow-inner group/thumb shadow-purple-500/10">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                      
                      <div className="flex justify-between items-center z-10">
                        <span className="px-2 py-0.5 bg-black/55 text-gray-400 rounded text-[7.5px] font-mono tracking-widest uppercase border border-white/5">Reel Cover Preview</span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>
                      
                      <div className="my-auto z-10 text-center px-3 py-1 bg-black/45 backdrop-blur-sm border border-purple-500/20 rounded-lg max-w-[85%] mx-auto shadow-xl group-hover/thumb:scale-[1.03] transition-all duration-200">
                        <h4 className="text-[11px] font-black tracking-tight leading-snug uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 font-mono">
                          {content.thumbnail.text}
                        </h4>
                      </div>
                      
                      <div className="flex justify-between items-center z-10 text-[7.5px] font-mono text-gray-500">
                        <span>EMOTION: {content.thumbnail.emotionTrigger.toUpperCase()}</span>
                        <span>DESIGN: ACTIVE COVER</span>
                      </div>
                      
                      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover/thumb:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block">Thumbnail Copy Text</span>
                        <p className="text-white font-extrabold text-[12px] mt-0.5 text-blue-300">&ldquo;{content.thumbnail.text}&rdquo;</p>
                      </div>

                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block">Design Concept Prompt</span>
                        <p className="text-gray-300 font-medium italic mt-0.5 leading-relaxed">&ldquo;{content.thumbnail.concept}&rdquo;</p>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Emotion Trigger</span>
                          <span className="px-2.5 py-0.5 rounded bg-pink-950/20 border border-pink-500/10 text-pink-300 font-bold block mt-0.5 font-mono text-[9px] uppercase">
                            {content.thumbnail.emotionTrigger}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. COMPLETE VOICEOVER SCRIPT */}
                <div className="glass-card rounded-2xl p-5 border border-purple-500/15 bg-purple-950/5 space-y-4 font-sans text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-purple-500/10 pb-2.5">
                      <div>
                        <span className="text-purple-400 font-extrabold uppercase font-mono text-[8.5px] block tracking-widest">
                          Voiceover Desk • Narration
                        </span>
                        <h2 className="text-md font-black text-white leading-tight uppercase font-mono mt-0.5">
                          Full AI Voiceover Script
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          const fullVO = `Hook:\n"${content.voiceoverScript.hook}"\n\nContent:\n"${content.voiceoverScript.mainContent}"\n\nCTA:\n"${content.voiceoverScript.cta}"`;
                          copyText(fullVO, 'copyVO');
                        }}
                        className="px-2.5 py-1 rounded bg-purple-600/10 hover:bg-purple-600/25 border border-purple-500/20 text-purple-300 hover:text-white font-mono font-bold text-[8.5px] uppercase flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedState['copyVO'] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy Narration
                      </button>
                    </div>

                    <div className="space-y-3 leading-relaxed">
                      <div className="bg-[#0f0714] border border-purple-500/10 rounded-xl p-3.5">
                        <span className="text-[8.5px] text-purple-400 font-bold uppercase tracking-wider block font-mono">0:00 - 0:03 • opening spoken hook</span>
                        <p className="text-white text-xs leading-normal italic font-semibold mt-1">&ldquo;{content.voiceoverScript.hook}&rdquo;</p>
                      </div>

                      <div className="bg-black/35 border border-white/5 rounded-xl p-3.5">
                        <span className="text-[8.5px] text-gray-500 font-bold uppercase tracking-wider block font-mono">0:03 - 0:40 • core content value drop</span>
                        <p className="text-gray-300 text-xs leading-relaxed mt-1 font-semibold">&ldquo;{content.voiceoverScript.mainContent}&rdquo;</p>
                      </div>

                      <div className="bg-[#080d14] border border-blue-500/10 rounded-xl p-3.5">
                        <span className="text-[8.5px] text-blue-400 font-bold uppercase tracking-wider block font-mono">0:40 - 0:45 • closing spoken CTA</span>
                        <p className="text-white text-xs leading-normal font-semibold mt-1">&ldquo;{content.voiceoverScript.cta}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PUBLISHING DECK */}
                <div className="glass-card rounded-2xl p-5 border border-white/5 bg-black/10 space-y-4 font-sans text-xs">
                  <div className="space-y-4">
                    <span className="text-blue-400 font-extrabold uppercase font-mono text-[8.5px] block tracking-widest">
                      Publisher Desk • Social packages
                    </span>
                    
                    {/* Instagram Caption Block */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                          Instagram caption
                        </span>
                        <button
                          onClick={() => copyText(content.publishingPackage.instagramCaption, 'copyInstaCap')}
                          className="text-[8px] font-mono text-pink-400 hover:text-white uppercase font-bold cursor-pointer"
                        >
                          {copiedState['copyInstaCap'] ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-black/30 border border-white/5 p-3 rounded-xl max-h-[120px] overflow-y-auto text-[11px] text-gray-300 italic whitespace-pre-wrap leading-relaxed">
                        {content.publishingPackage.instagramCaption}
                      </div>
                    </div>

                    {/* LinkedIn Authority outline */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block flex items-center gap-1">
                          <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" />
                          LinkedIn authority Post
                        </span>
                        <button
                          onClick={() => copyText(content.publishingPackage.linkedinPost, 'copyLIPost')}
                          className="text-[8px] font-mono text-blue-400 hover:text-white uppercase font-bold cursor-pointer"
                        >
                          {copiedState['copyLIPost'] ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-black/30 border border-white/5 p-3 rounded-xl max-h-[120px] overflow-y-auto text-[11px] text-gray-300 whitespace-pre-line leading-relaxed">
                        {content.publishingPackage.linkedinPost}
                      </div>
                    </div>

                    {/* Tags List */}
                    <div className="bg-[#12071a]/45 border border-purple-500/15 p-3.5 rounded-xl flex justify-between items-center relative group/tags text-[11px]">
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="text-[8.5px] text-gray-500 font-bold uppercase block font-mono">Domination tags</span>
                        <span className="text-purple-300 font-mono text-[10px] block mt-0.5 truncate" title={content.publishingPackage.hashtags}>
                          {content.publishingPackage.hashtags}
                        </span>
                      </div>
                      <button
                        onClick={() => copyText(content.publishingPackage.hashtags, 'copyTags')}
                        className="p-1.5 text-gray-600 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                      >
                        {copiedState['copyTags'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating success Toast overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-sans shadow-2xl flex items-center gap-3"
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
