import React, { useState } from 'react';
import { Award, Sparkles, Target, ShieldCheck, HelpCircle } from 'lucide-react';
import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const ViralityPrediction: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState(false);
  
  // Scoring parameters
  const [score, setScore] = useState(82);
  const [factors, setFactors] = useState({
    hook: 88,
    audience: 74,
    ctr: 81,
    shares: 85
  });

  const [radarData, setRadarData] = useState([
    { subject: 'Engagement', A: 80, fullMark: 100 },
    { subject: 'Reach', A: 92, fullMark: 100 },
    { subject: 'Shareability', A: 85, fullMark: 100 },
    { subject: 'Search Interest', A: 78, fullMark: 100 },
    { subject: 'Longevity', A: 65, fullMark: 100 }
  ]);

  const handlePredict = () => {
    if (!topic.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const cleaned = topic.trim().toLowerCase();
      
      // Calculate scores based on inputs
      let base = 70 + (cleaned.length % 18);
      if (cleaned.includes('ai') || cleaned.includes('gpt') || cleaned.includes('automate')) base += 8;
      if (cleaned.includes('money') || cleaned.includes('rich') || cleaned.includes('passive')) base += 6;
      
      const finalScore = Math.min(99, Math.max(68, base));
      
      setScore(finalScore);
      setFactors({
        hook: Math.min(98, finalScore + (cleaned.length % 6)),
        audience: Math.min(95, finalScore - 5 + (cleaned.length % 9)),
        ctr: Math.min(97, finalScore - 2 + (cleaned.length % 4)),
        shares: Math.min(99, finalScore + 1 + (cleaned.length % 5))
      });

      setRadarData([
        { subject: 'Engagement', A: Math.min(98, finalScore - 2 + (cleaned.length % 7)), fullMark: 100 },
        { subject: 'Reach', A: Math.min(99, finalScore + 6), fullMark: 100 },
        { subject: 'Shareability', A: Math.min(98, finalScore + 2 + (cleaned.length % 5)), fullMark: 100 },
        { subject: 'Search Interest', A: Math.min(99, finalScore - 4 + (cleaned.length % 9)), fullMark: 100 },
        { subject: 'Longevity', A: Math.min(95, 55 + (cleaned.length % 35)), fullMark: 100 }
      ]);

      setPredicted(true);
      setLoading(false);
    }, 800);
  };

  // Recharts Pie Chart Gauge configurations
  const gaugeData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Award className="w-8 h-8 text-purple-500 fill-purple-500/20" />
          Virality Prediction Matrix
        </h1>
        <p className="text-gray-400 mt-1 max-w-lg">
          Forecast social distribution velocity and evaluate hook indexing potential before publishing.
        </p>
      </div>

      {/* Input chamber */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl -z-10 -mr-20 -mt-20" />
        
        <div className="flex flex-col gap-4">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-4 h-4 text-purple-400" />
            Analyze Niche Query
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 3 AI prompts that double executive output..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePredict();
              }}
            />
            <button
              onClick={handlePredict}
              disabled={loading || !topic.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-900/30 disabled:to-blue-900/30 text-white font-bold rounded-xl shadow-lg border border-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  Predict Virality
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Matrix Display */}
      {predicted && !loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Score Gauge */}
          <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between items-center text-center space-y-6">
            <div className="w-full text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
                Virality Gauge
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Expected catalog rating</p>
            </div>

            {/* Recharts Pie Gauge container */}
            <div className="w-full h-[180px] relative flex items-center justify-center font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={62}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell fill="url(#gaugeColor)" />
                    <Cell fill="rgba(255,255,255,0.03)" />
                  </Pie>
                  <defs>
                    <linearGradient id="gaugeColor" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute bottom-[20%] flex flex-col items-center">
                <span className="text-4xl font-black text-white font-mono leading-none tracking-tight">{score}</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 mt-1 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  Score Rating
                </span>
              </div>
            </div>

            <div className="w-full bg-purple-950/20 border border-purple-500/10 rounded-xl p-3 flex gap-2 items-start text-left text-[11px] leading-relaxed text-gray-400 font-sans">
              <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p>
                A score of <span className="text-purple-300 font-semibold">{score}/100</span> indicates that this content satisfies up to {score}% of current organic search catalog index patterns.
              </p>
            </div>
          </div>

          {/* Column 2: Progress Bars */}
          <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">
                Critical Score Factors
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Breakdown by organic leverage</p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              
              {/* Factor 1: Hook Strength */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-300">Hook Retention Potential</span>
                  <span className="text-white font-mono font-bold">{factors.hook}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${factors.hook}%` }}
                  />
                </div>
              </div>

              {/* Factor 2: Audience Fit */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-300">Audience Interest Fit</span>
                  <span className="text-white font-mono font-bold">{factors.audience}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${factors.audience}%` }}
                  />
                </div>
              </div>

              {/* Factor 3: CTR Potential */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-300">Thumbnail / Preview CTR</span>
                  <span className="text-white font-mono font-bold">{factors.ctr}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${factors.ctr}%` }}
                  />
                </div>
              </div>

              {/* Factor 4: Shares Multiplier */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-300">Shareability Index</span>
                  <span className="text-white font-mono font-bold">{factors.shares}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${factors.shares}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Column 3: Radar Chart */}
          <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-full space-y-6">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-pink-400">
                Vector Analysis Map
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Multi-dimensional rating index</p>
            </div>

            {/* Radar chart frame */}
            <div className="w-full h-[200px] flex items-center justify-center font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.04)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8 }} />
                  <Radar
                    name="Score Matrix"
                    dataKey="A"
                    stroke="#9333ea"
                    fill="#9333ea"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : (
        !loading && (
          <div className="glass-card rounded-2xl p-12 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 animate-float">
              <Award className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase font-mono">Prediction Matrix Idle</h4>
              <p className="text-gray-400 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
                Input your content topic above and click &ldquo;Predict Virality&rdquo; to build score gauges, progress vectors, and multi-dimensional radar charts.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};
