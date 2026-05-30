import React, { useState } from 'react';
import { BarChart2, Eye, ThumbsUp, Share2, MessageSquare, Globe, Info } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

interface MetricCard {
  label: string;
  value: string;
  growth: string;
  desc: string;
  icon: React.ReactNode;
  colorClass: string;
}

export const Analytics: React.FC = () => {
  const [platform, setPlatform] = useState<'all' | 'reels' | 'tiktok' | 'linkedin'>('all');
  const [timeframe, setTimeframe] = useState<'7' | '30'>('7');

  // Platform multipliers for realistic dynamic data recalculations
  const getMultiplier = () => {
    switch (platform) {
      case 'reels': return 1.15;
      case 'tiktok': return 1.38;
      case 'linkedin': return 0.65;
      default: return 1.0;
    }
  };

  const mult = getMultiplier();

  // 1. Four Premium Metrics Cards
  const metrics: MetricCard[] = [
    {
      label: 'Expected Views',
      value: `${Math.round(284 * mult)}K`,
      growth: '+42.5%',
      desc: 'Projected catalog impressions',
      icon: <Eye className="w-4.5 h-4.5 text-purple-400" />,
      colorClass: 'border-purple-500/20 bg-purple-500/5'
    },
    {
      label: 'Expected Likes',
      value: `${(22.8 * mult).toFixed(1)}K`,
      growth: '+38.2%',
      desc: 'Viewer active approval rating',
      icon: <ThumbsUp className="w-4.5 h-4.5 text-blue-400" />,
      colorClass: 'border-blue-500/20 bg-blue-500/5'
    },
    {
      label: 'Expected Shares',
      value: `${Math.round(4120 * mult)}`,
      growth: '+52.1%',
      desc: 'Viral multiplier expansion rate',
      icon: <Share2 className="w-4.5 h-4.5 text-pink-400" />,
      colorClass: 'border-pink-500/20 bg-pink-500/5'
    },
    {
      label: 'Expected Comments',
      value: `${Math.round(980 * mult)}`,
      growth: '+29.4%',
      desc: 'Discussion & feedback volume',
      icon: <MessageSquare className="w-4.5 h-4.5 text-cyan-400" />,
      colorClass: 'border-cyan-500/20 bg-cyan-500/5'
    }
  ];

  // Recharts Chart Mock Data Sets
  const historyData7 = [
    { name: 'Mon', Virality: Math.round(45 * mult), Trend: Math.round(30 * mult) },
    { name: 'Tue', Virality: Math.round(58 * mult), Trend: Math.round(42 * mult) },
    { name: 'Wed', Virality: Math.round(48 * mult), Trend: Math.round(35 * mult) },
    { name: 'Thu', Virality: Math.round(72 * mult), Trend: Math.round(60 * mult) },
    { name: 'Fri', Virality: Math.round(65 * mult), Trend: Math.round(50 * mult) },
    { name: 'Sat', Virality: Math.round(89 * mult), Trend: Math.round(78 * mult) },
    { name: 'Sun', Virality: Math.round(95 * mult), Trend: Math.round(85 * mult) }
  ];

  const historyData30 = [
    { name: 'Week 1', Virality: Math.round(35 * mult), Trend: Math.round(28 * mult) },
    { name: 'Week 2', Virality: Math.round(52 * mult), Trend: Math.round(40 * mult) },
    { name: 'Week 3', Virality: Math.round(68 * mult), Trend: Math.round(55 * mult) },
    { name: 'Week 4', Virality: Math.round(92 * mult), Trend: Math.round(80 * mult) }
  ];

  const currentChartData = timeframe === '7' ? historyData7 : historyData30;

  // Platform Performance Chart Data (Bar Chart)
  const performanceData = [
    { name: 'Instagram', Views: Math.round(240 * mult), Engagement: Math.round(18 * mult) },
    { name: 'TikTok', Views: Math.round(320 * mult), Engagement: Math.round(26 * mult) },
    { name: 'LinkedIn', Views: Math.round(140 * mult), Engagement: Math.round(14 * mult) }
  ];

  // Custom tooltips styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-purple-500/25 p-3 rounded-xl text-xs font-sans shadow-2xl backdrop-blur-md">
          <p className="font-bold text-purple-300 mb-1">{label}</p>
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
    <div className="space-y-8 fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <BarChart2 className="w-8 h-8 text-purple-500 fill-purple-500/20" />
            Expected Reach Analytics
          </h1>
          <p className="text-gray-400 mt-1 max-w-lg">
            Forecast model results based on theme catalog parameters and search interest indexing.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-2.5 bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-md self-start md:self-auto text-xs">
          {(['all', 'reels', 'tiktok', 'linkedin'] as const).map((plt) => (
            <button
              key={plt}
              onClick={() => setPlatform(plt)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-150 ${
                platform === plt
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {plt === 'all' ? 'All Channels' : plt}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Show: Expected Views, expected Likes, expected Shares, expected Comments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className={`glass-card rounded-2xl p-5 border ${m.colorClass} relative overflow-hidden group flex flex-col justify-between h-[145px]`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6" />
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5 font-sans">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold block">
                  {m.label}
                </span>
                <h3 className="text-3xl font-extrabold text-white font-mono leading-none tracking-tight">
                  {m.value}
                </h3>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl">
                {m.icon}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-sans">
              <span className="text-emerald-400 font-bold">
                {m.growth}
              </span>
              <span className="text-gray-500">
                {m.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Section: Virality History, Trend Growth, Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Virality History (Area Chart) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 font-sans">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Virality History Curve
              </h3>
            </div>
            
            <div className="flex bg-black/45 p-1 rounded-xl border border-white/5">
              {[
                { value: '7', label: '7 Days' },
                { value: '30', label: '30 Days' }
              ].map((time) => (
                <button
                  key={time.value}
                  onClick={() => setTimeframe(time.value as any)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    timeframe === time.value
                      ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-white border border-purple-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[220px] font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Virality" stroke="#9333ea" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Trend Growth (Line Chart) */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-6">
          <div className="font-sans">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">
              Trend Search Interest
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Weekly search intensity index</p>
          </div>

          <div className="w-full h-[200px] font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Trend" stroke="#2563eb" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Cross-Platform Performance (Bar Chart) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="font-sans">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-pink-400">
              Platform Distribution Performance
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Views vs Active engagement index</p>
          </div>

          <div className="w-full h-[220px] font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Bar dataKey="Views" fill="#9333ea" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Bar dataKey="Engagement" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Footer hint */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
        <Info className="w-4 h-4 text-purple-400 animate-bounce" />
        <span>Metrics and area metrics are derived from search patterns. Toggle platform filters above to examine individual splits.</span>
      </div>
    </div>
  );
};
