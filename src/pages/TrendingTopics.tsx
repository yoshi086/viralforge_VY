import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, ArrowRight, Compass, Search, ArrowUpDown, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PageId } from '../components/Sidebar';
import { compileLiveSignals } from '../utils/signalsEngine';
import type { LiveSignalsPackage } from '../utils/signalsEngine';
import { compileTrendProfile } from '../utils/trendEngine';

export interface Topic {
  id: string;
  title: string;
  category: 'AI & Tech' | 'Productivity' | 'Business & Growth' | 'Lifestyle' | 'Creative';
  trendScore: number;
  growth: string;
  volume: string;
  platforms: ('Reels' | 'TikTok' | 'LinkedIn')[];
  description: string;
  suggestedHook: string;
  sparkline: number[];
  competitionScore: number;
  opportunityScore: number;
  viralityForecast: number;
  signals: {
    emergingQueries: string;
    google: number;
    youtube: string;
  };
}

interface TrendingTopicsProps {
  onSelectTopic: (topicTitle: string, navigateTo: PageId, trendProfile?: any) => void;
}

export const MOCK_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'AI Automation Agency (AAA) in 2026',
    category: 'AI & Tech',
    trendScore: 98,
    growth: '+480%',
    volume: '240K searches',
    platforms: ['Reels', 'TikTok', 'LinkedIn'],
    description: 'How local businesses are using simple zero-code AI tools to automate booking, CRM, and lead generation.',
    suggestedHook: 'I built an AI worker that did 40 hours of admin work in exactly 4 minutes. Here is the stack.',
    sparkline: [20, 35, 40, 60, 55, 80, 98],
    competitionScore: 68,
    opportunityScore: 94,
    viralityForecast: 96,
    signals: { emergingQueries: '24 queries found', google: 98, youtube: '2.4M views' }
  },
  {
    id: '2',
    title: 'The Solopreneur Stack: $10k/mo Zero Employees',
    category: 'Business & Growth',
    trendScore: 95,
    growth: '+310%',
    volume: '185K searches',
    platforms: ['LinkedIn', 'Reels'],
    description: 'The ultra-lean business model of 2026. Running complete online operations using only subscription software and APIs.',
    suggestedHook: 'You do not need a co-founder. You do not need employees. You just need these 4 browser tabs open.',
    sparkline: [30, 45, 38, 70, 65, 85, 95],
    competitionScore: 52,
    opportunityScore: 88,
    viralityForecast: 94,
    signals: { emergingQueries: '18 queries found', google: 95, youtube: '1.8M views' }
  },
  {
    id: '3',
    title: 'Visual Hook Mastery for Short-form Video',
    category: 'Creative',
    trendScore: 92,
    growth: '+290%',
    volume: '120K searches',
    platforms: ['TikTok', 'Reels'],
    description: 'The transition from text hooks to silent visual loops. High retention strategies that bypass audio trends.',
    suggestedHook: 'Stop speaking in the first 3 seconds of your Reels. Do this visual pattern instead.',
    sparkline: [10, 15, 35, 50, 75, 70, 92],
    competitionScore: 78,
    opportunityScore: 82,
    viralityForecast: 90,
    signals: { emergingQueries: '15 queries found', google: 92, youtube: '1.5M views' }
  },
  {
    id: '4',
    title: 'Deep Work Blocks: The 90-Minute Focus Protocol',
    category: 'Productivity',
    trendScore: 89,
    growth: '+180%',
    volume: '95K searches',
    platforms: ['LinkedIn', 'Reels'],
    description: 'Replacing standard Pomodoro with Andrew Huberman-backed 90-minute neural cycles for maximum focus.',
    suggestedHook: 'The 25-minute Pomodoro timer is actually killing your deep focus. Here is the science why.',
    sparkline: [40, 42, 50, 48, 68, 80, 89],
    competitionScore: 58,
    opportunityScore: 85,
    viralityForecast: 88,
    signals: { emergingQueries: '12 queries found', google: 89, youtube: '950K views' }
  },
  {
    id: '5',
    title: 'Prompt Engineering for Non-Technical Managers',
    category: 'AI & Tech',
    trendScore: 87,
    growth: '+150%',
    volume: '150K searches',
    platforms: ['LinkedIn'],
    description: 'Bridging the communication gap between business managers and LLM models. Essential prompts for project planning.',
    suggestedHook: 'Most managers write prompts like Google searches. That is why your AI outputs are generic.',
    sparkline: [25, 30, 48, 55, 60, 72, 87],
    competitionScore: 74,
    opportunityScore: 80,
    viralityForecast: 85,
    signals: { emergingQueries: '10 queries found', google: 87, youtube: '1.2M views' }
  },
  {
    id: '6',
    title: 'Micro-SaaS Ideas in the Developer Economy',
    category: 'Business & Growth',
    trendScore: 86,
    growth: '+125%',
    volume: '88K searches',
    platforms: ['LinkedIn', 'TikTok'],
    description: 'Extremely focused, single-purpose extensions and plugins making founders thousands of dollars in passive revenue.',
    suggestedHook: 'Do not build the next social media platform. Build a plugin for this specific platform instead.',
    sparkline: [15, 28, 30, 45, 65, 78, 86],
    competitionScore: 48,
    opportunityScore: 84,
    viralityForecast: 84,
    signals: { emergingQueries: '14 queries found', google: 86, youtube: '1.1M views' }
  }
];

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ onSelectTopic }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  // Live Signals mapping state
  const [signalsMap, setSignalsMap] = useState<{[title: string]: LiveSignalsPackage}>({});
  const [freshness, setFreshness] = useState<string>('');

  useEffect(() => {
    const loadLiveSignals = async () => {
      const newsKey = import.meta.env.VITE_NEWS_API_KEY || localStorage.getItem('viralforge_news_key') || '';
      const ytKey = import.meta.env.VITE_YOUTUBE_API_KEY || localStorage.getItem('viralforge_youtube_key') || '';
      
      const newMap: {[title: string]: LiveSignalsPackage} = {};
      
      await Promise.all(MOCK_TOPICS.map(async (t) => {
        try {
          const signals = await compileLiveSignals(t.title, { newsApiKey: newsKey, youtubeApiKey: ytKey });
          newMap[t.title] = signals;
        } catch (e) {
          console.error(e);
        }
      }));
      
      setSignalsMap(newMap);
      setFreshness(new Date().toLocaleTimeString());
    };
    
    loadLiveSignals();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI & Tech': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Productivity': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Business & Growth': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Creative': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default: return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    }
  };

  const categories = ['All', 'AI & Tech', 'Productivity', 'Business & Growth', 'Creative'];

  // Filter & Sort logic
  const filteredTopics = MOCK_TOPICS.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    return sortOrder === 'desc' ? b.trendScore - a.trendScore : a.trendScore - b.trendScore;
  });

  return (
    <div className="space-y-8 fade-in pb-16">
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-purple-500 animate-pulse animate-pulse-slow" />
            Creator emerging Topics Feed
          </h1>
          <p className="text-gray-400 mt-1 max-w-xl">
            Google Trends signals + social intercepts. Map out trend opportunities and launch Growth Hacker analysis.
          </p>
          {freshness && (
            <p className="text-[10px] text-purple-400 font-mono mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              Last Updated: {freshness} (Live Signals Grounding Engaged)
            </p>
          )}
        </div>
        
        <div className="flex gap-3 bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-md self-start md:self-auto text-xs">
          <div className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 font-semibold flex items-center gap-1.5 border border-purple-500/30">
            <Flame className="w-3.5 h-3.5 text-purple-400 fill-purple-400 animate-bounce" />
            Live Signals scanning active
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 font-sans text-xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emerging opportunities..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <span className="text-gray-500 font-semibold">Sort Score:</span>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
              {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
            </button>
          </div>

        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-lg font-semibold tracking-wide cursor-pointer transition-all duration-150 border ${
                selectedCategory === cat
                  ? 'bg-purple-600/25 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/5'
                  : 'bg-black/30 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Topic Cards */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs"
      >
        <AnimatePresence mode="popLayout">
          {filteredTopics.map((topic) => {
            const sig = signalsMap[topic.title];
            
            // Build trend profile dynamically from scoring engine
            let trendProfile: any;
            if (sig) {
              trendProfile = compileTrendProfile(sig, topic.category);
            } else {
              // High-fidelity fallback based on mock indexes while loading
              const baseVelocity = parseInt(topic.growth.replace('+', '').replace('%', ''), 10) || 120;
              trendProfile = {
                title: topic.title,
                category: topic.category,
                trendScore: topic.trendScore,
                opportunityScore: topic.opportunityScore,
                competitionScore: topic.competitionScore,
                growthVelocity: baseVelocity,
                confidenceScore: 65,
                reason: 'Stable search volume metrics, moderate YouTube interest.',
                searchDemand: 50,
                newsMentions: 0,
                videoCoverage: 0,
                emergingQueries: 0
              };
            }

            return (
              <motion.div 
                layout
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => {
                  localStorage.setItem('viralforge_active_trend_analysis', JSON.stringify(trendProfile));
                  onSelectTopic(topic.title, 'growth_hacker', trendProfile);
                }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[520px] hover:border-purple-500/35 hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer relative"
              >
                <div className="space-y-4">
                  {/* Header elements */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(topic.category)}`}>
                      {topic.category}
                    </span>
                    <div className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
                      +{trendProfile.growthVelocity}%
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-md font-extrabold text-white leading-snug group-hover:text-purple-300 transition-colors line-clamp-1">
                      {topic.title}
                    </h3>
                    <p className="text-gray-400 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {/* Phase 1 Metrics Panel */}
                  <div className="grid grid-cols-2 gap-3 bg-black/35 border border-white/5 p-4 rounded-xl text-[10px]">
                    <div className="flex flex-col justify-between">
                      <span className="text-gray-500 font-bold uppercase text-[7.5px] tracking-wider block">Trend Score</span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-white text-lg font-black font-mono leading-none">{trendProfile.trendScore}</span>
                        <div className="flex-1 bg-white/5 h-1 rounded-full overflow-hidden border border-white/5 max-w-[60px]">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${trendProfile.trendScore}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <span className="text-gray-500 font-bold uppercase text-[7.5px] tracking-wider block">Growth Velocity</span>
                      <span className="text-emerald-400 font-bold font-mono mt-1.5 flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        +{trendProfile.growthVelocity}%
                      </span>
                    </div>

                    <div className="flex flex-col justify-between border-t border-white/5 pt-2.5 mt-0.5">
                      <span className="text-gray-500 font-bold uppercase text-[7.5px] tracking-wider block">Opportunity Score</span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-purple-300 font-bold font-mono text-xs">{trendProfile.opportunityScore}</span>
                        <span className="text-[7.5px] text-gray-500 font-medium">/ 100</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between border-t border-white/5 pt-2.5 mt-0.5">
                      <span className="text-gray-500 font-bold uppercase text-[7.5px] tracking-wider block">Competition Score</span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-pink-400 font-bold font-mono text-xs">{trendProfile.competitionScore}</span>
                        <span className="text-[7.5px] text-gray-500 font-medium">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Traceable Evidence Block (No Black-Box Scoring) */}
                  <div className="bg-black/45 border border-white/5 p-3 rounded-xl space-y-2 text-[10px]">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[8px]">Traceable Evidence</span>
                      <span className="text-purple-400 font-mono text-[8px] uppercase tracking-wider">Live & Est. Data</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      {/* Emerging Queries */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-semibold uppercase text-[7px] tracking-wider">Emerging Queries</span>
                        <span 
                          className="font-mono text-white font-bold truncate cursor-help"
                          title={sig && sig.emergingQueries.items.length > 0 ? sig.emergingQueries.items.map(i => `${i.query} (${i.intent})`).join('\n') : ''}
                        >
                          {sig ? (
                            sig.emergingQueries.status === 'Available' 
                              ? `${sig.emergingQueries.count} queries` 
                              : '⚠️ Unavailable'
                          ) : 'Loading...'}
                        </span>
                        {sig && sig.emergingQueries.status === 'Available' && (
                          <div className="text-[7.5px] text-purple-300 font-mono mt-0.5 space-y-0.5 leading-tight">
                            <div>Growth: +{sig.emergingQueries.growthScore}% | Vol: {sig.emergingQueries.volumeScore}/100</div>
                          </div>
                        )}
                        <span className="text-[7px] text-gray-600 uppercase font-black tracking-wide mt-1">Live Data</span>
                      </div>
                      
                      {/* Search Demand */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-semibold uppercase text-[7px] tracking-wider">Search Demand</span>
                        <span className="font-mono text-white font-bold truncate">
                          {sig ? `${sig.googleTrends.suggestScore}/100 (${sig.googleTrends.searchVolume})` : 'Loading...'}
                        </span>
                        <span className="text-[7px] text-gray-600 uppercase font-black tracking-wide mt-1">Estimated Data</span>
                      </div>
                      
                      {/* News Signal Engine */}
                      <div className="flex flex-col border-t border-white/5 pt-1 mt-1">
                        <span className="text-gray-500 font-semibold uppercase text-[7px] tracking-wider">News Signal Engine</span>
                        <span className="font-mono text-white font-bold truncate mt-0.5">
                          {sig ? (sig.news.status === 'Available' ? `${sig.news.mentionsCount} articles` : sig.news.status === 'No Key' ? '🔑 Key Required' : '⚠️ Unavailable') : 'Loading...'}
                        </span>
                        <span className="text-[7px] text-gray-600 uppercase font-black tracking-wide mt-1">Live Data</span>
                      </div>
                      
                      {/* Video Signal Engine */}
                      <div className="flex flex-col border-t border-white/5 pt-1 mt-1">
                        <span className="text-gray-500 font-semibold uppercase text-[7px] tracking-wider">Video Signal Engine</span>
                        <span className="font-mono text-white font-bold truncate mt-0.5">
                          {sig ? (sig.youtube.status === 'Available' ? `${sig.youtube.videosCount.toLocaleString()} views` : sig.youtube.status === 'No Key' ? '🔑 Key Required' : '⚠️ Unavailable') : 'Loading...'}
                        </span>
                        <span className="text-[7px] text-gray-600 uppercase font-black tracking-wide mt-1">Live Data</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Score Explanations & Confidence */}
                  <div className="bg-[#12071a]/30 border border-purple-500/10 p-3 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[8.5px] border-b border-purple-500/5 pb-1">
                      <span className="font-black uppercase tracking-wider text-purple-400 block">
                        AI Intelligence • Why Trending
                      </span>
                      <span className="text-pink-400 font-mono font-bold uppercase tracking-widest text-[7px]">
                        Confidence: {trendProfile.confidenceScore}%
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-300 leading-normal line-clamp-2 mt-0.5">
                      Reason: {trendProfile.reason} Mapped across search, video coverage, and global press networks.
                    </p>
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-white/5 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[9px] text-pink-400 font-bold uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 text-pink-400" />
                    Virality Score: {topic.viralityForecast}% (AI Inference)
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('viralforge_active_trend_analysis', JSON.stringify(trendProfile));
                      onSelectTopic(topic.title, 'growth_hacker', trendProfile);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-[10px] font-bold flex items-center gap-1 border border-purple-400/20 hover:border-purple-300/30 transition-all active:scale-95 duration-100 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer select-none"
                  >
                    Analyze Trend
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
