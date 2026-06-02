import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { compileLiveSignals } from '../utils/signalsEngine';
import { generateExplainableGrowthHackerStrategy } from '../utils/gemini';
import type { ExplainableGrowthStrategy } from '../utils/gemini';
import type { PageId } from '../components/Sidebar';
import { 
  Zap, 
  Sparkles, 
  Swords, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface GrowthHackerProps {
  initialTopic?: string;
  trendProfile?: any;
  onSelectTopic?: (topicTitle: string, navigateTo: PageId, trendProfile?: any) => void;
}

export const GrowthHacker: React.FC<GrowthHackerProps> = ({ initialTopic, trendProfile, onSelectTopic }) => {
  const [customTopic, setCustomTopic] = useState(initialTopic || '');
  
  // Strategy States
  const [liveStrategy, setLiveStrategy] = useState<ExplainableGrowthStrategy | null>(null);
  const [loadingLiveAnalysis, setLoadingLiveAnalysis] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Cooldown State for rate limit resilience
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Custom event listener for retry telemetry
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

  // Action to launch Content Studio (One-Click Handoff)
  const handleGenerateContentPackage = () => {
    if (!liveStrategy || !onSelectTopic) return;
    onSelectTopic(liveStrategy.topic, 'content_studio', liveStrategy);
  };

  // Run detailed strategical audit
  const handleRunAnalysis = async (topicToUse = customTopic, forceRefresh = false) => {
    if (!topicToUse.trim()) return;
    if (loadingLiveAnalysis) return; // Prevent duplicate requests
    
    setLoadingLiveAnalysis(true);
    setLiveStrategy(null);
    setRetryMessage(null);

    const newsKey = import.meta.env.VITE_NEWS_API_KEY || localStorage.getItem('viralforge_news_key') || '';
    const ytKey = import.meta.env.VITE_YOUTUBE_API_KEY || localStorage.getItem('viralforge_youtube_key') || '';
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('viralforge_gemini_key') || '';

    try {
      // 1. Scan live signals
      const signals = await compileLiveSignals(topicToUse, { newsApiKey: newsKey, youtubeApiKey: ytKey });
      
      const newsCount = signals.news.items.length;
      const videosCount = signals.youtube.items.length;
      const searchSignalsCount = signals.googleTrends.items.length + signals.emergingQueries.items.length;

      // Insufficient Data check
      if (newsCount === 0 && videosCount === 0 && searchSignalsCount === 0) {
        setLiveStrategy({
          topic: topicToUse,
          insufficientData: true,
          topicContextMap: [],
          filteredEvidenceCount: {
            news: 0,
            videos: 0,
            search: 0
          },
          competitorAnalysis: {
            topCreators: [],
            topVideos: [],
            mostCommonTopics: [],
            mostCommonHooks: [],
            mostCommonFormats: []
          },
          contentGapAnalysis: {
            opportunityLevel: 'Low Opportunity',
            underservedTopics: [],
            missingAngles: [],
            lowCompetitionOpportunities: []
          },
          winningStrategy: {
            recommendedTopic: '',
            recommendedAngle: '',
            recommendedHook: '',
            recommendedFormat: '',
            recommendedCTA: '',
            expectedAdvantage: ''
          }
        });
        setLoadingLiveAnalysis(false);
        return;
      }

      // 2. Call strategist Gemini Wrapper
      if (geminiKey.trim()) {
        const strategy = await generateExplainableGrowthHackerStrategy(topicToUse, JSON.stringify(signals), geminiKey, forceRefresh);
        setLiveStrategy(strategy);
      } else {
        throw new Error('AI Intelligence Engine credentials missing. Define VITE_GEMINI_API_KEY inside your .env configuration.');
      }
    } catch (err: any) {
      console.error(err); // Log provider errors only to console
      
      // Quota Limit Detection
      const isQuota = err.isQuotaExceeded || 
                      err.message?.toLowerCase().includes('quota') || 
                      err.message?.toLowerCase().includes('exhausted') || 
                      err.message?.toLowerCase().includes('rate limit');
      
      if (isQuota) {
        const seconds = err.retryAfterSeconds || 60; // fallback to 60s
        setCooldownRemaining(seconds);
      }
    } finally {
      setLoadingLiveAnalysis(false);
    }
  };

  // Trigger auto-scan on initial load if topic passed
  useEffect(() => {
    if (initialTopic) {
      setCustomTopic(initialTopic);
      handleRunAnalysis(initialTopic, false);
    } else if (trendProfile && trendProfile.title) {
      setCustomTopic(trendProfile.title);
      handleRunAnalysis(trendProfile.title, false);
    }
  }, [initialTopic, trendProfile]);

  return (
    <div className="space-y-6 fade-in pb-16 font-sans">
      
      {/* Header section */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <Swords className="w-7 h-7 text-purple-500" />
          AI Growth Hacker
        </h1>
        <p className="text-gray-400 mt-1 text-xs">
          Universal creator intelligence strategy. Answer exactly three questions: what are competitors doing, what are they missing, and how do you win.
        </p>
      </div>

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

      {/* Topic Input Bar */}
      <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Type any trend or topic (e.g. Taylor Swift, IPL, Esports, Electric Vehicles...)"
              className="flex-1 bg-black/45 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 text-xs font-semibold"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunAnalysis(customTopic, false);
              }}
            />
            <button
              onClick={() => handleRunAnalysis(customTopic, false)}
              disabled={loadingLiveAnalysis || cooldownRemaining > 0 || !customTopic.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold flex items-center justify-center gap-1.5 border border-purple-400/20 transition-all cursor-pointer select-none"
            >
              {loadingLiveAnalysis ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Interpreting...
                </>
              ) : cooldownRemaining > 0 ? (
                <>
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  Cooling Down ({cooldownRemaining}s)
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  Analyze Topic
                </>
              )}
            </button>
          </div>

          {/* Smart Secondary Actions: Force Refresh */}
          {customTopic.trim() && !loadingLiveAnalysis && (
            <div className="flex justify-end">
              <button
                onClick={() => handleRunAnalysis(customTopic, true)}
                disabled={cooldownRemaining > 0}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all text-[9px] font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                title="Bypass 6-hour cache and query Gemini directly"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Force Refresh Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Stepper Workflow */}
      {loadingLiveAnalysis && (
        <div className="min-h-[250px] flex flex-col items-center justify-center space-y-4 glass-card rounded-2xl p-8 border border-purple-500/10 bg-purple-950/5">
          <div className="w-12 h-12 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div className="text-center space-y-1 max-w-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono animate-pulse">
              {retryMessage ? retryMessage : "Interpreting evidence..."}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">Formulating competitor, gap, and winning strategist packages...</p>
          </div>
        </div>
      )}

      {/* STRATEGICAL WORKSPACE */}
      <AnimatePresence mode="wait">
        {liveStrategy && !loadingLiveAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {liveStrategy.insufficientData ? (
              <div className="glass-card rounded-2xl p-10 text-center border border-white/5 bg-black/15 text-sm font-bold text-gray-400 uppercase font-mono tracking-wide">
                Insufficient relevant public data available.
              </div>
            ) : (
              <div className="space-y-6">
                
                {liveStrategy.isCachedResult && (
                  <div className="bg-purple-950/20 border border-purple-500/15 text-purple-300 rounded-xl p-3 flex gap-2.5 items-center justify-between text-[10px] font-sans shadow-inner">
                    <div className="flex gap-2.5 items-center">
                      <span className="text-purple-400 font-bold">⚡ SHOWING RECENT AI ANALYSIS</span>
                      <span className="text-gray-500">|</span>
                      <p>Displaying cached strategist concept synced during peak service demand.</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[#12071a] border border-purple-500/20 text-purple-400 font-mono font-bold text-[8.5px]">6H CACHE</span>
                  </div>
                )}

                {/* Topic Context Map & Relevance Filtration Bar */}
                {liveStrategy.topicContextMap && liveStrategy.topicContextMap.length > 0 && (
                  <div className="glass-card rounded-2xl p-4.5 border border-white/5 bg-black/5 space-y-3 font-sans">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-widest">
                          Universal Relevance Validation Context Map
                        </span>
                      </div>
                      
                      {/* Filtered Evidence Counts status */}
                      {liveStrategy.filteredEvidenceCount && (
                        <div className="flex items-center gap-3 text-[9px] font-mono text-gray-500 font-bold uppercase tracking-wider">
                          <span>Filtered Signals (&ge;0.6 Score):</span>
                          <span className="px-2 py-0.5 rounded bg-purple-950/30 border border-purple-500/20 text-purple-300">
                            News: {liveStrategy.filteredEvidenceCount.news}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-950/30 border border-blue-500/20 text-blue-300">
                            Videos: {liveStrategy.filteredEvidenceCount.videos}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-pink-950/30 border border-pink-500/20 text-pink-300">
                            Search: {liveStrategy.filteredEvidenceCount.search}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Visual Tag Deck */}
                    <div className="flex flex-wrap gap-2">
                      {liveStrategy.topicContextMap.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/15 text-white font-extrabold text-[10.5px] shadow-sm select-none transition-all duration-150"
                        >
                          # {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  
                  {/* SECTION 1: COMPETITOR ANALYSIS */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5 bg-black/10 flex flex-col justify-between space-y-4 font-sans text-xs">
                    <div>
                      <span className="text-purple-400 font-extrabold uppercase font-mono text-[9px] block tracking-widest mb-1">Section 1 • Question</span>
                      <h2 className="text-sm font-black text-white leading-tight mb-4 border-b border-white/5 pb-2.5">
                        What are competitors doing?
                      </h2>
                      
                      <div className="space-y-4">
                        {liveStrategy.competitorAnalysis.topCreators.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Discovered Top Creators</span>
                            <ul className="space-y-1">
                              {liveStrategy.competitorAnalysis.topCreators.map((creator, idx) => (
                                <li key={idx} className="text-white font-semibold flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-purple-500" />
                                  {creator}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {liveStrategy.competitorAnalysis.topVideos.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Discovered Top Videos</span>
                            <ul className="space-y-1">
                              {liveStrategy.competitorAnalysis.topVideos.map((vid, idx) => (
                                <li key={idx} className="text-gray-300 font-medium leading-tight flex items-start gap-1.5 italic">
                                  <span className="w-1 h-1 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                                  &ldquo;{vid}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {liveStrategy.competitorAnalysis.mostCommonTopics.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Most Common Topics</span>
                            <div className="flex flex-wrap gap-1.5">
                              {liveStrategy.competitorAnalysis.mostCommonTopics.map((topicItem, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400 font-semibold text-[10px]">
                                  {topicItem}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {liveStrategy.competitorAnalysis.mostCommonHooks.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Most Common Hooks</span>
                            <ul className="space-y-1 text-gray-400">
                              {liveStrategy.competitorAnalysis.mostCommonHooks.map((hook, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 leading-tight">
                                  <span className="w-1 h-1 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                                  &ldquo;{hook}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {liveStrategy.competitorAnalysis.mostCommonFormats.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Most Common Formats</span>
                            <div className="flex flex-wrap gap-1.5">
                              {liveStrategy.competitorAnalysis.mostCommonFormats.map((fmt, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-purple-950/20 border border-purple-500/10 text-purple-300 font-semibold font-mono text-[9px] uppercase">
                                  {fmt}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: CONTENT GAP ANALYSIS */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5 bg-black/10 flex flex-col justify-between space-y-4 font-sans text-xs">
                    <div>
                      <span className="text-pink-400 font-extrabold uppercase font-mono text-[9px] block tracking-widest mb-1">Section 2 • Question</span>
                      <h2 className="text-sm font-black text-white leading-tight mb-4 border-b border-white/5 pb-2.5 flex justify-between items-center">
                        What are competitors NOT doing?
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                          liveStrategy.contentGapAnalysis.opportunityLevel === 'High Opportunity'
                            ? 'bg-emerald-950/30 border border-emerald-500/20 text-emerald-400'
                            : liveStrategy.contentGapAnalysis.opportunityLevel === 'Medium Opportunity'
                              ? 'bg-amber-950/30 border border-amber-500/20 text-amber-400'
                              : 'bg-white/5 border border-white/10 text-gray-400'
                        }`}>
                          {liveStrategy.contentGapAnalysis.opportunityLevel}
                        </span>
                      </h2>

                      <div className="space-y-5">
                        {liveStrategy.contentGapAnalysis.underservedTopics.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-pink-400/90 font-bold uppercase tracking-wider block font-mono">Underserved Topics</span>
                            <ul className="space-y-1.5">
                              {liveStrategy.contentGapAnalysis.underservedTopics.map((topicItem, idx) => (
                                <li key={idx} className="text-white font-semibold flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                                  {topicItem}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {liveStrategy.contentGapAnalysis.missingAngles.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-pink-400/90 font-bold uppercase tracking-wider block font-mono">Missing Angles</span>
                            <ul className="space-y-1.5">
                              {liveStrategy.contentGapAnalysis.missingAngles.map((angle, idx) => (
                                <li key={idx} className="text-gray-300 font-medium leading-snug flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1.5" />
                                  {angle}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {liveStrategy.contentGapAnalysis.lowCompetitionOpportunities.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-pink-400/90 font-bold uppercase tracking-wider block font-mono">Low Competition Opportunities</span>
                            <ul className="space-y-1.5">
                              {liveStrategy.contentGapAnalysis.lowCompetitionOpportunities.map((opp, idx) => (
                                <li key={idx} className="text-gray-300 font-medium leading-snug flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1.5" />
                                  {opp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: WINNING STRATEGY */}
                  <div className="glass-card rounded-2xl p-5 border-2 border-purple-500/20 bg-purple-950/5 flex flex-col justify-between space-y-6 font-sans text-xs">
                    <div className="space-y-4">
                      <div>
                        <span className="text-purple-400 font-extrabold uppercase font-mono text-[9px] block tracking-widest mb-1">Section 3 • Question</span>
                        <h2 className="text-sm font-black text-white leading-tight border-b border-purple-500/10 pb-2.5">
                          What should I do?
                        </h2>
                      </div>

                      <div className="space-y-3.5 leading-relaxed">
                        <div>
                          <span className="text-[9px] text-purple-400 uppercase tracking-widest font-bold block font-mono">Recommended Topic</span>
                          <p className="text-white font-extrabold text-[12.5px] mt-0.5">{liveStrategy.winningStrategy.recommendedTopic}</p>
                        </div>

                        <div>
                          <span className="text-[9px] text-purple-400 uppercase tracking-widest font-bold block font-mono">Recommended Angle</span>
                          <p className="text-white font-bold text-xs mt-0.5 italic">&ldquo;{liveStrategy.winningStrategy.recommendedAngle}&rdquo;</p>
                        </div>

                        <div>
                          <span className="text-[9px] text-purple-400 uppercase tracking-widest font-bold block font-mono">Recommended Hook</span>
                          <p className="text-white font-extrabold text-xs mt-0.5 italic text-purple-300">&ldquo;{liveStrategy.winningStrategy.recommendedHook}&rdquo;</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-mono">Recommended Format</span>
                            <span className="text-white font-bold block text-[11px] mt-0.5">{liveStrategy.winningStrategy.recommendedFormat}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-mono">Recommended CTA</span>
                            <span className="text-blue-300 font-bold block text-[11px] mt-0.5">{liveStrategy.winningStrategy.recommendedCTA}</span>
                          </div>
                        </div>

                        <div className="border-t border-purple-500/10 pt-3.5">
                          <span className="text-[9px] text-purple-400 uppercase tracking-widest font-bold block font-mono">Expected Competitive Advantage</span>
                          <p className="text-gray-300 font-medium text-[11px] mt-1 leading-normal">&ldquo;{liveStrategy.winningStrategy.expectedAdvantage}&rdquo;</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateContentPackage}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white rounded-xl shadow-xl border border-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-95 uppercase tracking-widest text-[9.5px] font-black"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      Generate Content Package
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!liveStrategy && !loadingLiveAnalysis && (
        <div className="glass-card rounded-2xl p-16 text-center border border-white/5 flex flex-col items-center justify-center space-y-4 min-h-[250px]">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 animate-float">
            <Swords className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wide">Growth Strategist Workspace</h4>
            <p className="text-gray-500 text-xs max-w-xs mt-1.5 mx-auto leading-normal">
              Type any target topic or select a trend to immediately analyze competitor patterns, identify content gaps, and synthesize a winning execution package.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
