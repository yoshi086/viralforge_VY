import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Flame, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Compass, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  Play, 
  MessageSquare, 
  CheckCircle, 
  Copy, 
  Check, 
  ChevronRight, 
  Sliders,
  FolderHeart,
  LineChart as LineIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { fetchTrendsApi } from '../utils/trendsApi';
import type { TrendItem } from '../utils/trendsApi';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendsIntelligenceProps {
  onSelectTopic: (topicTitle: string, navigateTo: 'dashboard' | 'reel') => void;
}

export const TrendsIntelligence: React.FC<TrendsIntelligenceProps> = ({ onSelectTopic }) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minTrendScore, setMinTrendScore] = useState<number>(65);
  const [minGrowth, setMinGrowth] = useState<number>(100);
  const [minVirality, setMinVirality] = useState<number>(70);
  
  // Recent Searches & Suggestions
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Multi-Agent AI Workflows',
    'Micro-SaaS Blueprints',
    '90-Min Focus Blocks'
  ]);
  const suggestions = [
    'Autonomous Workflows',
    'Rust Web Speedruns',
    'Silent Hook Loops',
    'GPU Edge Computing'
  ];

  // Selection state
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  
  // AI Agent Timeline Stepper states
  const [timelineStep, setTimelineStep] = useState<number>(0);
  const [timelineRunning, setTimelineRunning] = useState<boolean>(false);
  const timelineTasks = [
    'Collecting Signals & Algorithm Crawls',
    'Analyzing Autocomplete & Google Trends Sources',
    'Calculating Dynamic Trend Score',
    'Predicting 24h/7d/30d Velocity Growth',
    'Finding High-Leverage Content Opportunities',
    'Generating Viral Hooks & Recommendations'
  ];

  // Chart Tab selection
  const [activeChartTab, setActiveChartTab] = useState<'growth' | 'interest' | 'virality' | 'engagement'>('growth');
  
  // Copied item flags & notification triggers
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [toast, setToast] = useState<string | null>(null);

  // Retrieve initial datasets
  const loadTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      // Query our custom HTTP Rest mock API endpoint
      const response = await fetchTrendsApi(`/api/trends/search?q=${searchQuery}&category=${selectedCategory}`);
      setTrends(response || []);
      
      // Auto-select the first trend on mount
      if (response && response.length > 0 && !selectedTrend) {
        handleSelectTrend(response[0]);
      }
    } catch (err: any) {
      console.error('Fetch trends error:', err);
      setError('Failed to query Trends HTTP server endpoints. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, [searchQuery, selectedCategory]);

  const handleSelectTrend = (trend: TrendItem) => {
    setSelectedTrend(trend);
    
    // Trigger the dynamic AI Agent Scanning Timeline sequence
    setTimelineStep(0);
    setTimelineRunning(true);
  };

  // Run sequential stepper ticks
  useEffect(() => {
    let interval: number;
    if (timelineRunning) {
      interval = window.setInterval(() => {
        setTimelineStep(prev => {
          if (prev < 5) {
            return prev + 1;
          } else {
            setTimelineRunning(false);
            return prev;
          }
        });
      }, 240); // Buttey-smooth 240ms tick rate
    }
    return () => clearInterval(interval);
  }, [timelineRunning]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 2)]);
    }
    loadTrends();
  };

  const selectSuggestion = (sug: string) => {
    setSearchQuery(sug);
    if (!recentSearches.includes(sug)) {
      setRecentSearches(prev => [sug, ...prev.slice(0, 2)]);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setToast('Content copied successfully');
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
      setToast(null);
    }, 2000);
  };

  // Perform dynamic range sliders filtration
  const filteredTrends = trends.filter(item => {
    return (
      item.trendScore >= minTrendScore &&
      item.growthVelocity >= minGrowth &&
      item.viralityPotential >= minVirality
    );
  });

  const getMomentumBadge = (momentum: string) => {
    switch (momentum) {
      case 'Exploding':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Rising':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Growing':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'Exploding': return <Flame className="w-3.5 h-3.5 fill-rose-500 animate-bounce" />;
      case 'Rising': return <Zap className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />;
      case 'Growing': return <TrendingUp className="w-3.5 h-3.5" />;
      default: return <TrendingDown className="w-3.5 h-3.5" />;
    }
  };

  // Dynamic Chart tooltips styling
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-purple-500/25 p-3 rounded-xl text-xs font-sans shadow-2xl backdrop-blur-md">
          <p className="font-bold text-purple-300 mb-1">Timeline: {label}</p>
          {payload.map((pld: any, idx: number) => (
            <div key={idx} className="flex justify-between gap-6 py-0.5 font-mono">
              <span className="text-gray-400">{pld.name}:</span>
              <span className="text-white font-extrabold">{pld.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 fade-in pb-16 font-sans">
      
      {/* Header Title Block */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Compass className="w-8 h-8 text-purple-500 animate-pulse-slow" />
          Trends Intelligence Agency
        </h1>
        <p className="text-gray-400 mt-1 max-w-lg">
          Discover, predict, and analyze future social growth patterns using real-time HTTP signals intercepts.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Searches & Lists Controls */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* AI search and suggestions capsule */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-purple-400" />
              AI Trend Interceptor
            </h3>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic or industry..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium text-xs"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-4" />
            </form>

            {/* AI suggestions pills */}
            <div className="space-y-2 text-[10px]">
              <span className="text-gray-500 font-bold uppercase tracking-wider block">Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => selectSuggestion(sug)}
                    className="bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-300 px-2.5 py-1 rounded-lg border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-1.5 text-[10px] border-t border-white/5 pt-3">
                <span className="text-gray-500 font-bold uppercase tracking-wider block">Recent Signals:</span>
                <div className="space-y-1">
                  {recentSearches.map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(rec)}
                      className="w-full text-left py-1 text-gray-400 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer truncate"
                    >
                      <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                      {rec}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filters Accordion card */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 font-sans text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Dynamic Filters
            </h3>

            {/* Category selection bar */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category Segment</label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'AI', 'Technology', 'Startups', 'Business', 'Finance', 'Creator Economy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-purple-600/25 text-purple-300 border-purple-500/40'
                        : 'bg-black/30 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders selectors */}
            <div className="space-y-3 pt-2 border-t border-white/5 font-sans">
              {/* Slider 1: Trend Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[10px]">
                  <span className="text-gray-400 uppercase tracking-wider">Min Trend Score</span>
                  <span className="text-white font-mono">{minTrendScore}%</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="95"
                  value={minTrendScore}
                  onChange={(e) => setMinTrendScore(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 2: Growth velocity */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[10px]">
                  <span className="text-gray-400 uppercase tracking-wider">Min Growth Velocity</span>
                  <span className="text-white font-mono">+{minGrowth}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  value={minGrowth}
                  onChange={(e) => setMinGrowth(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 3: Virality potential */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[10px]">
                  <span className="text-gray-400 uppercase tracking-wider">Min Virality Index</span>
                  <span className="text-white font-mono">{minVirality}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="90"
                  value={minVirality}
                  onChange={(e) => setMinVirality(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Top 10 trends list section */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-pink-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-pink-400 fill-pink-500/10" />
                Top 10 Signals Grid
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Count: {filteredTrends.slice(0, 10).length}</span>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-card p-3.5 border border-white/5 bg-black/25 rounded-xl animate-pulse space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-12 bg-white/10 rounded" />
                      <div className="h-4 w-6 bg-white/10 rounded" />
                    </div>
                    <div className="h-3 w-4/5 bg-white/10 rounded" />
                    <div className="flex gap-2">
                      <div className="h-2 w-16 bg-white/5 rounded" />
                      <div className="h-2 w-12 bg-white/5 rounded" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="text-center py-6 text-xs text-rose-400 font-sans bg-rose-500/5 rounded-xl border border-rose-500/10 p-3 flex flex-col items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  {filteredTrends.slice(0, 10).map((item) => {
                    const isSelected = selectedTrend?.id === item.id;
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectTrend(item)}
                        className={`glass-card p-3.5 border rounded-xl cursor-pointer transition-all duration-200 text-xs flex justify-between items-center gap-3 relative ${
                          isSelected 
                            ? 'border-purple-500/40 bg-purple-500/5 shadow-lg shadow-purple-500/5' 
                            : 'border-white/5 bg-black/25 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-1.5 max-w-[70%]">
                          <span className="text-[9px] text-purple-400 uppercase tracking-wider font-extrabold block">{item.category}</span>
                          <h4 className="font-bold text-white leading-snug truncate block">{item.topic}</h4>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-0.5 ${getMomentumBadge(item.momentum)}`}>
                              {getMomentumIcon(item.momentum)}
                              {item.momentum}
                            </span>
                            <span className="text-[8px] font-semibold text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                              +{item.growthVelocity}% vel
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black text-white font-mono leading-none tracking-tight block">
                            {item.trendScore}
                          </span>
                          <span className="text-[7px] text-gray-500 uppercase tracking-wider font-black block mt-0.5">Rating Score</span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredTrends.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-500 font-sans">
                      No signals match active range sliders.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Steppers, Charts & opportunity scanner blocks */}
        <div className="xl:col-span-2 space-y-6">
          {selectedTrend ? (
            <div className="space-y-6 font-sans">
              
              {/* Stepper Timeline AI scanning */}
              <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    AI Agent Signal Analyzer Timeline
                  </h3>
                  
                  <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border ${
                    timelineRunning 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm'
                  }`}>
                    {timelineRunning ? '● Crawling Sources...' : '● Signal Mapping Lock'}
                  </span>
                </div>

                {/* Animated Timeline Ticks */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-[10px] leading-relaxed">
                  {timelineTasks.map((task, idx) => {
                    const stepActive = timelineStep >= idx;
                    const stepDone = timelineStep > idx || (!timelineRunning && timelineStep === 5);
                    
                    return (
                      <div 
                        key={idx}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                          stepDone 
                            ? 'bg-emerald-950/10 border-emerald-500/15 text-emerald-400' 
                            : stepActive 
                              ? 'bg-purple-950/20 border-purple-500/30 text-purple-300 font-semibold' 
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

              {/* Reveal Main workspace assets only after scanning is complete (or simulation is off) */}
              <AnimatePresence mode="wait">
                {(!timelineRunning || timelineStep >= 5) && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    
                    {/* Header Details Panel */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-md gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-purple-400 uppercase tracking-widest font-black block">Active Signal Analysis</span>
                        <h2 className="text-lg font-bold text-white font-sans">{selectedTrend.topic}</h2>
                      </div>
                      
                      {/* Forge redirection button */}
                      <button
                        onClick={() => onSelectTopic(selectedTrend.topic, 'dashboard')}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl shadow-lg border border-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-98 shrink-0 hover:shadow-purple-500/10"
                      >
                        Forge Content Package
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>

                    {/* Interactive Charts Panel */}
                    <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-6">
                      <div className="flex justify-between items-center flex-wrap gap-4 font-sans border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                          <LineIcon className="w-5 h-5 text-blue-400" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            Interactive Predictive Curves
                          </h3>
                        </div>
                        
                        {/* Tab Selector */}
                        <div className="flex bg-black/45 p-0.5 rounded-lg border border-white/5 text-[9px] font-bold uppercase tracking-wider">
                          {[
                            { id: 'growth' as const, label: 'Growth Curve' },
                            { id: 'interest' as const, label: 'Search Interest' },
                            { id: 'virality' as const, label: 'Virality Curve' },
                            { id: 'engagement' as const, label: 'Engagement Forecast' }
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setActiveChartTab(t.id)}
                              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                                activeChartTab === t.id
                                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/15 shadow-sm'
                                  : 'text-gray-500 hover:text-white'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recharts Curve Renderer */}
                      <div className="w-full h-[220px] font-sans text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          {activeChartTab === 'growth' ? (
                            <AreaChart data={selectedTrend.chartPoints} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="curveGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <Tooltip content={<CustomChartTooltip />} />
                              <Area type="monotone" name="Growth Index" dataKey="growth" stroke="#9333ea" strokeWidth={2.5} fillOpacity={1} fill="url(#curveGrowthGrad)" />
                            </AreaChart>
                          ) : activeChartTab === 'interest' ? (
                            <LineChart data={selectedTrend.chartPoints} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <Tooltip content={<CustomChartTooltip />} />
                              <Line type="monotone" name="Search Interest" dataKey="interest" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                            </LineChart>
                          ) : activeChartTab === 'virality' ? (
                            <LineChart data={selectedTrend.chartPoints} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <Tooltip content={<CustomChartTooltip />} />
                              <Line type="monotone" name="Virality Curve" dataKey="virality" stroke="#ec4899" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                            </LineChart>
                          ) : (
                            <AreaChart data={selectedTrend.chartPoints} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="curveEngagementGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                              <Tooltip content={<CustomChartTooltip />} />
                              <Area type="monotone" name="Engagement Index" dataKey="engagement" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#curveEngagementGrad)" />
                            </AreaChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* AI Trend Analysis Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Analysis Block */}
                      <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-1.5 border-b border-white/5 pb-3">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          AI Signals Analysis
                        </h3>

                        <div className="space-y-4 text-xs font-sans">
                          {/* Why trending */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Why It Is Trending</span>
                            <p className="text-gray-300 leading-relaxed font-semibold">{selectedTrend.analysis.whyTrending}</p>
                          </div>
                          
                          {/* Audience interest */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Audience Segment demographics</span>
                            <p className="text-gray-300 leading-relaxed">{selectedTrend.analysis.audienceDemographics}</p>
                          </div>

                          {/* Post optimization parameters grid */}
                          <div className="grid grid-cols-2 gap-3.5 text-[10px] pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2 bg-black/35 border border-white/5 p-3 rounded-xl">
                              <Compass className="w-4 h-4 text-blue-400 shrink-0" />
                              <div>
                                <span className="text-gray-500 font-extrabold uppercase block tracking-wide">Best Platform</span>
                                <span className="text-white font-bold block mt-0.5">{selectedTrend.analysis.bestPlatform}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-black/35 border border-white/5 p-3 rounded-xl">
                              <Clock className="w-4 h-4 text-pink-400 shrink-0" />
                              <div>
                                <span className="text-gray-500 font-extrabold uppercase block tracking-wide">Best Posting Time</span>
                                <span className="text-white font-bold block mt-0.5">{selectedTrend.analysis.bestPostingTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Trend Predictions Block */}
                      <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-pink-400 flex items-center gap-1.5 border-b border-white/5 pb-3">
                            <Sliders className="w-4 h-4 text-pink-400" />
                            Multi-Timeline Predictions
                          </h3>

                          {/* Steppers indices values */}
                          <div className="space-y-4 font-sans text-xs pt-1.5">
                            {[
                              { label: 'Next 24 Hours Forecast', value: selectedTrend.forecast24h, color: 'from-blue-500 to-purple-500' },
                              { label: 'Next 7 Days Forecast', value: selectedTrend.forecast7d, color: 'from-purple-500 to-pink-500' },
                              { label: 'Next 30 Days Forecast', value: selectedTrend.forecast30d, color: 'from-pink-500 to-rose-500' }
                            ].map((fc, idx) => (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between font-bold text-[10px]">
                                  <span className="text-gray-400 uppercase tracking-wider">{fc.label}</span>
                                  <span className="text-white font-mono">{fc.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                  <div 
                                    className={`h-full rounded-full bg-gradient-to-r ${fc.color} transition-all duration-1000`}
                                    style={{ width: `${fc.value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Confidence card footer */}
                        <div className="bg-[#12071a]/45 border border-purple-500/15 rounded-xl p-3.5 flex justify-between items-center text-xs font-sans mt-4">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wide block">Rating Confidence</span>
                              <span className="text-[10px] text-purple-300 font-bold block mt-0.5">RLS Signal Indexed</span>
                            </div>
                          </div>
                          <span className="text-lg font-black text-white font-mono">{selectedTrend.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Opportunities & Recommendations Panel */}
                    <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-6">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                          <FolderHeart className="w-4 h-4 text-blue-400" />
                          AI content Opportunity Scanner
                        </h3>
                        
                        {/* Copy hashtags buttons */}
                        <button
                          onClick={() => copyToClipboard(selectedTrend.recommendations.hashtags.join(' '), 'allHashtags')}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          {copiedStates['allHashtags'] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          Copy Hashtags
                        </button>
                      </div>

                      {/* Opportunity decks segment */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
                        
                        {/* Reels Opportunity deck */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                            <Play className="w-3.5 h-3.5 fill-purple-500/10 text-purple-400" />
                            5 Reel Creative Ideas
                          </h4>
                          <div className="space-y-3.5">
                            {selectedTrend.recommendations.reelIdeas.map((idea, i) => (
                              <div key={i} className="bg-black/35 rounded-xl p-3 border border-white/5 relative group/item">
                                <p className="text-gray-300 leading-normal pr-5">{idea}</p>
                                <button
                                  onClick={() => copyToClipboard(idea, `reel-${i}`)}
                                  className="absolute right-2 top-2 p-1 text-gray-600 hover:text-white rounded hover:bg-white/5 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                                  title="Copy Idea"
                                >
                                  {copiedStates[`reel-${i}`] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Viral Hooks Opportunity deck */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-pink-500/10 text-pink-400" />
                            5 Tested Viral Hooks
                          </h4>
                          <div className="space-y-3.5">
                            {selectedTrend.recommendations.viralHooks.map((hook, i) => (
                              <div key={i} className="bg-black/35 rounded-xl p-3 border border-white/5 relative group/item">
                                <p className="text-gray-300 leading-normal italic pr-5">&ldquo;{hook}&rdquo;</p>
                                <button
                                  onClick={() => copyToClipboard(hook, `hook-${i}`)}
                                  className="absolute right-2 top-2 p-1 text-gray-600 hover:text-white rounded hover:bg-white/5 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                                  title="Copy Hook"
                                >
                                  {copiedStates[`hook-${i}`] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* LinkedIn Opportunity deck */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            3 LinkedIn Authority Posts
                          </h4>
                          <div className="space-y-3.5">
                            {selectedTrend.recommendations.linkedinPostIdeas.map((post, i) => (
                              <div key={i} className="bg-black/35 rounded-xl p-3 border border-white/5 relative group/item">
                                <p className="text-gray-300 leading-normal pr-5 line-clamp-4">{post}</p>
                                <button
                                  onClick={() => copyToClipboard(post, `post-${i}`)}
                                  className="absolute right-2 top-2 p-1 text-gray-600 hover:text-white rounded hover:bg-white/5 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                                  title="Copy post idea"
                                >
                                  {copiedStates[`post-${i}`] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Hashtags & CTA Footer */}
                      <div className="border-t border-white/5 pt-5 flex flex-col sm:flex-row gap-5 justify-between text-xs">
                        
                        {/* Hashtags pills */}
                        <div className="space-y-2 max-w-[60%]">
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Recommended Tagsfit</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedTrend.recommendations.hashtags.map((tag) => (
                              <span 
                                key={tag}
                                className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA guidelines */}
                        <div className="bg-purple-950/20 border border-purple-500/15 rounded-xl p-4 flex gap-2.5 items-start max-w-sm shrink-0">
                          <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Target Conversion CTA</span>
                            <p className="text-gray-300 text-[10px] leading-relaxed font-semibold italic">{selectedTrend.recommendations.recommendedCta}</p>
                          </div>
                        </div>

                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-16 text-center border border-white/5 flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 animate-float">
                <Compass className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white uppercase font-mono">Signal Chamber Idle</h4>
                <p className="text-gray-500 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
                  Select an active signal card from the Top 10 list on the left to activate AI timelines, curves charts, and content opportunity recommendations.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Floating success Toast overlay */}
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
              <p className="text-[10px] text-gray-400 mt-0.5">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
