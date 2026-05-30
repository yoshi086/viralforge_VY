import React, { useState } from 'react';
import { TrendingUp, Flame, ArrowRight, Compass, Award, Search, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

interface TrendingTopicsProps {
  onSelectTopic: (topicTitle: string, navigateTo: 'dashboard' | 'reel') => void;
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
    sparkline: [20, 35, 40, 60, 55, 80, 98]
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
    sparkline: [30, 45, 38, 70, 65, 85, 95]
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
    sparkline: [10, 15, 35, 50, 75, 70, 92]
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
    sparkline: [40, 42, 50, 48, 68, 80, 89]
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
    sparkline: [25, 30, 48, 55, 60, 72, 87]
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
    sparkline: [15, 28, 30, 45, 65, 78, 86]
  }
];

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ onSelectTopic }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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
            Trending Content Forge
          </h1>
          <p className="text-gray-400 mt-1 max-w-xl">
            Real-time viral topics mined from search interest, social media algorithms, and professional networks.
          </p>
        </div>
        
        <div className="flex gap-3 bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-md self-start md:self-auto text-xs">
          <div className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 font-semibold flex items-center gap-1.5 border border-purple-500/30">
            <Flame className="w-3.5 h-3.5 text-purple-400 fill-purple-400 animate-bounce" />
            Live Algorithm Scan
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
              placeholder="Search trending topics..."
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTopics.map((topic) => {
            // Render dynamic sparks
            const maxVal = Math.max(...topic.sparkline);
            const minVal = Math.min(...topic.sparkline);
            const range = maxVal - minVal;
            const points = topic.sparkline.map((val, idx) => {
              const x = (idx / (topic.sparkline.length - 1)) * 100;
              const y = range === 0 ? 50 : 80 - ((val - minVal) / range) * 60;
              return `${x},${y}`;
            }).join(' ');

            return (
              <motion.div 
                layout
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between h-[380px] hover:border-purple-500/35 hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer relative"
              >
                <div className="space-y-4">
                  {/* Header elements */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(topic.category)}`}>
                      {topic.category}
                    </span>
                    <div className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {topic.growth}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-3">
                      {topic.description}
                    </p>
                  </div>

                  {/* Sparkline Visual */}
                  <div className="h-12 w-full bg-[#0d0924]/40 rounded-lg p-1 border border-white/5 relative overflow-hidden flex items-center">
                    <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`grad-${topic.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="url(#sparkGradient)"
                        strokeWidth="2.5"
                        points={points}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-purple-500 animate-pulse"
                      />
                      <path
                        d={`M 0,80 L ${points} L 100,80 Z`}
                        fill={`url(#grad-${topic.id})`}
                      />
                      {/* Fallback stroke gradient */}
                      <svg className="absolute hidden">
                        <defs>
                          <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </svg>
                    <div className="absolute right-2 bottom-1 text-[9px] text-gray-500 font-mono">
                      Score: {topic.trendScore}%
                    </div>
                  </div>

                  {/* Suggested Hook */}
                  <div className="bg-black/35 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      Tested Viral Hook Angle
                    </div>
                    <p className="text-gray-300 text-xs italic line-clamp-2 leading-relaxed">
                      &ldquo;{topic.suggestedHook}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {topic.platforms.map((p) => (
                      <span 
                        key={p} 
                        className="text-[10px] font-medium text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                        title={`High fit index on ${p}`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => onSelectTopic(topic.title, 'reel')}
                      className="p-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer select-none"
                      title="Generate Reel Script"
                    >
                      Reel
                    </button>
                    <button 
                      onClick={() => onSelectTopic(topic.title, 'dashboard')}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold flex items-center gap-1 border border-purple-400/20 hover:border-purple-300/30 transition-all active:scale-95 duration-100 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer select-none"
                    >
                      Forge
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
