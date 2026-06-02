import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Compass, 
  Swords, 
  BarChart2, 
  Flame, 
  Target 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  initialTopic?: string;
  clearInitialTopic?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = () => {

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* 1. Futuristic Hero block */}
      <section className="relative text-center py-10 lg:py-14 space-y-6">
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[600px] h-[300px] bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-[120px] opacity-75 animate-pulse-slow" />
        </div>

        {/* Credentials Status Pill */}
        <div className="flex justify-center">
          <div
            className="px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest flex items-center gap-2 backdrop-blur-md bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AI INTELLIGENCE SYSTEM ENGAGED
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-purple-300 to-blue-200 bg-clip-text text-transparent text-glow-purple"
          >
            ViralForge AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto tracking-wide"
          >
            Professional AI Creator Operating System
          </motion.p>
        </div>
      </section>

      {/* 2. Unified SaaS Journey Flowchart (DISCOVER -> ANALYZE -> CREATE -> OPTIMIZE -> PUBLISH) */}
      <section className="space-y-5">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-purple-400" />
          The Creator Intelligence Lifecycle
        </h3>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 relative overflow-hidden bg-black/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-xs relative">
            
            {/* Step 1: Discover */}
            <div className="space-y-3.5 bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px] group hover:border-purple-500/35 transition-all">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">Step 01</span>
                  <h4 className="font-extrabold text-white block mt-0.5">DISCOVER Trends</h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Scan search databases & social intercepts before competitors.
              </p>
            </div>

            {/* Step 2: Analyze */}
            <div className="space-y-3.5 bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px] group hover:border-blue-500/35 transition-all">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">Step 02</span>
                  <h4 className="font-extrabold text-white block mt-0.5">ANALYZE Competitors</h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Decrypt success formulas, repeat hooks, and scan content gaps.
              </p>
            </div>

            {/* Step 3: Create */}
            <div className="space-y-3.5 bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px] group hover:border-pink-500/35 transition-all">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 block">Step 03</span>
                  <h4 className="font-extrabold text-white block mt-0.5">CREATE Packages</h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Merge Reels, LinkedIn, and captions into a single Domination plan.
              </p>
            </div>

            {/* Step 4: Optimize */}
            <div className="space-y-3.5 bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px] group hover:border-cyan-500/35 transition-all">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">Step 04</span>
                  <h4 className="font-extrabold text-white block mt-0.5">OPTIMIZE Metrics</h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Simulate virality scores, views, and reach before publishing.
              </p>
            </div>

            {/* Step 5: Publish */}
            <div className="space-y-3.5 bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px] group hover:border-emerald-500/35 transition-all">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">Step 05</span>
                  <h4 className="font-extrabold text-white block mt-0.5">PUBLISH & Dominate</h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Push flawless content packages out to social networks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Real-time Mission Control Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        
        {/* Scanned Signals */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[125px] relative overflow-hidden group">
          <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest block">Scanned Opportunities Signals</span>
          <div className="space-y-0.5 mt-2">
            <h4 className="text-3xl font-extrabold text-white font-mono leading-none tracking-tight">45,210</h4>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">▲ Exploding database limits</span>
          </div>
        </div>

        {/* Active Categories */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[125px] relative overflow-hidden group">
          <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest block">Active Niche Verticals Mapped</span>
          <div className="space-y-0.5 mt-2">
            <h4 className="text-3xl font-extrabold text-white font-mono leading-none tracking-tight">5 Channels</h4>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block">● Fully synchronized models</span>
          </div>
        </div>

        {/* AI Domination plans */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[125px] relative overflow-hidden group">
          <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest block">AI Domination Plans Synthesized</span>
          <div className="space-y-0.5 mt-2">
            <h4 className="text-3xl font-extrabold text-white font-mono leading-none tracking-tight">24 Packages</h4>
            <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block">★ High operational leverage</span>
          </div>
        </div>

      </section>

      {/* 4. Strategic Niche Opportunity Highlight Card */}
      <section className="glass-card rounded-3xl p-6 border border-purple-500/20 bg-purple-950/5 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-3.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-xs">
            <Flame className="w-4.5 h-4.5 text-purple-400 fill-purple-400/10 animate-bounce" />
            Top Creator Flagship Niche Opportunity Lock
          </div>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold tracking-widest uppercase">Low Competition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="md:col-span-2 space-y-1">
            <h4 className="text-md font-bold text-white leading-normal">Local LLMs fine-tuning scripts</h4>
            <p className="text-gray-400 leading-relaxed">
              Knowledge builders are bypassing cloud server bills and scaling localized model operations directly on consumer hardware. Operating at 98% opportunity score indexes.
            </p>
          </div>

          <div className="bg-[#12071a]/55 border border-purple-500/15 p-4 rounded-2xl flex flex-col justify-between h-[100px] shrink-0">
            <div>
              <span className="text-[8px] text-gray-500 font-bold uppercase block">Opportunity rating</span>
              <span className="text-white font-mono font-black text-lg block mt-0.5">98% Score</span>
            </div>
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest">▲ Hyper-Growth Velocity</span>
          </div>
        </div>
      </section>

    </div>
  );
};
