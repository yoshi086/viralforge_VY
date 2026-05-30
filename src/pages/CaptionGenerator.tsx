import React, { useState } from 'react';
import { MessageSquare, Sparkles, Copy, Check, Hash, Smile, Download, RefreshCw, Layers, CheckCircle, FolderHeart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const CaptionGenerator: React.FC = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');
  const [tone, setTone] = useState<'professional' | 'humorous' | 'motivational' | 'direct'>('motivational');
  
  const [result, setResult] = useState<{
    caption: string;
    hashtags: string;
    emojis: string;
  } | null>(null);
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Custom states for downloads and database saves
  const [downloaded, setDownloaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const generateCaptions = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setDownloaded(false);

    setTimeout(() => {
      let cap = '';
      let tags = '';
      let emo = '';

      const cleaned = topic.trim().toLowerCase();

      // Platform styling shifts
      const pHeader = platform === 'instagram' ? '⚡ INSTAGRAM ENGAGEMENT SECRET ⚡' 
                      : platform === 'tiktok' ? '🔥 TIKTOK VIRAL METHOD 🔥' 
                      : '🎥 SHORTS LEVERAGE MATRIX 🎥';

      // Base content
      let coreValue = `If you are still trying to scale ${topic} without automation, you are working 10x harder than you need to. High-performance creators do not do manual tasks; they construct single-purpose systems that run in the background.`;
      
      if (cleaned.includes('ai') || cleaned.includes('automate') || cleaned.includes('tech')) {
        coreValue = `Most people spend hours writing prompts manually. The real leverage lies in low-code database connections and automated webhooks that handle the volume while you sleep.`;
      } else if (cleaned.includes('money') || cleaned.includes('passive') || cleaned.includes('finance')) {
        coreValue = `Forget massive investments. Micro-assets like templates, single-purpose widgets, or checklists are the absolute highest margin models in 2026.`;
      } else if (cleaned.includes('fitness') || cleaned.includes('health') || cleaned.includes('gym')) {
        coreValue = `Stop overtraining. Consistency outlasts intensity, and simple compound movements deliver 90% of structural gains.`;
      }

      // Tone customizer
      if (tone === 'motivational') {
        cap = `${pHeader}\n\nYou are exactly one system away from scaling your operations. ${coreValue} Protect your energy, construct your pipeline, and build your legacy.`;
        emo = '🚀 ⚡ 🏆 🧠 💎 📈';
        tags = `#${topic.replace(/\s+/g, '')} #MindsetPower #SolopreneurSystem #SaaSScale`;
      } else if (tone === 'humorous') {
        cap = `${pHeader}\n\nMe explaining why I need to spend 4 hours automating a 5-minute task: 💀\n\nBut seriously, ${coreValue} Why work hard when you can work smart and take long lunches?`;
        emo = '💀 😂 🍿 🤷‍♂️ 🎮 🤖';
        tags = `#${topic.replace(/\s+/g, '')} #DeveloperLife #AutomationHumor #WorkSmart`;
      } else if (tone === 'professional') {
        cap = `${pHeader}\n\nExecutive Summary:\nOperational redundancies account for severe productivity leakage. ${coreValue} Implementing API loops is standard protocol for modern growth.`;
        emo = '💼 📈 🎯 📋 🤝 ⚙️';
        tags = `#${topic.replace(/\s+/g, '')} #ProcessOptimization #ExecutiveFramework #OperationalEfficiency`;
      } else {
        cap = `${pHeader}\n\nDirect truth:\n${coreValue} Build a system today or remain stuck doing manual administrative tasks forever. Your choice.`;
        emo = '🎯 🛑 ✔️ 🔍 ⏳ 💡';
        tags = `#${topic.replace(/\s+/g, '')} #FocusProtocol #SystemBuilding #NoExcuses`;
      }

      setResult({
        caption: cap,
        hashtags: tags,
        emojis: emo
      });
      setLoading(false);
    }, 700);
  };

  const copyField = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadCaption = () => {
    if (!result) return;
    const formatted = `=== VIRAL CAPTION ===\n${result.caption}\n\n=== HASHTAGS ===\n${result.hashtags}\n\n=== EMOJI PACK ===\n${result.emojis}`;
    
    const element = document.createElement("a");
    const file = new Blob([formatted], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `caption_${platform}_${tone}.txt`;
    document.body.appendChild(element);
    element.click();
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const triggerToast = (msg: string) => {
    setToast({ message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveToSupabase = async () => {
    if (!result) return;
    if (!user) {
      triggerToast('Please log in to save content.');
      return;
    }

    setSaving(true);
    try {
      const captionText = `${result.caption}\n\n${result.hashtags}\n\nEmojis: ${result.emojis}`;
      const viralityScore = Math.min(99, 78 + (topic.length % 12));

      const { error: insertError } = await supabase
        .from('generated_content')
        .insert({
          user_id: user.id,
          topic: topic,
          caption: captionText,
          script: '', // script not available in Caption generator
          virality_score: viralityScore
        });

      if (insertError) throw insertError;
      
      triggerToast('Content saved successfully');
    } catch (err: any) {
      console.error('Error saving caption:', err);
      triggerToast(err.message || 'Failed to save caption package.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <MessageSquare className="w-8 h-8 text-purple-500 fill-purple-500/20 animate-pulse" />
          Smart Caption Forge
        </h1>
        <p className="text-gray-400 mt-1 max-w-lg">
          Generate high-performance captions. Tailor platforms, tone variables, and hashtags to boost algorithm indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/5 font-sans text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
              Caption Filters
            </h3>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Topic or Niche
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is your caption about?"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium text-xs"
              />
            </div>

            {/* Platform Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-pink-400" />
                Target Platform
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'tiktok', label: 'TikTok' },
                  { value: 'youtube', label: 'Shorts' }
                ].map((plt) => (
                  <button
                    key={plt.value}
                    onClick={() => setPlatform(plt.value as any)}
                    className={`py-2 text-[10px] font-bold rounded-lg cursor-pointer border transition-all ${
                      platform === plt.value
                        ? 'bg-purple-600/25 text-purple-300 border-purple-500/40 shadow-sm'
                        : 'bg-black/35 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {plt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Caption Vibe & Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'motivational', label: '🚀 Inspiring' },
                  { value: 'direct', label: '🎯 Direct' },
                  { value: 'humorous', label: '🍿 Humorous' },
                  { value: 'professional', label: '💼 Executive' }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value as any)}
                    className={`py-2.5 px-3 text-left text-[10px] font-semibold rounded-lg cursor-pointer border transition-all ${
                      tone === t.value
                        ? 'bg-blue-600/25 text-blue-300 border-blue-500/40 shadow-sm'
                        : 'bg-black/35 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={generateCaptions}
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-900/30 disabled:to-blue-900/30 text-white font-bold rounded-xl shadow-lg border border-purple-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-98"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  Forge Captions
                </>
              )}
            </button>

          </div>
        </div>

        {/* Results Deck */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 font-sans">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-md text-xs">
                <span className="text-gray-400 font-medium">
                  Optimized Caption Assets: <span className="text-purple-300 font-bold uppercase">{platform}</span>
                </span>
                
                <div className="flex gap-2">
                  {/* Local download button */}
                  <button
                    onClick={handleDownloadCaption}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    Download TXT
                  </button>

                  {/* Supabase save button */}
                  <button
                    onClick={handleSaveToSupabase}
                    disabled={saving}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 border border-purple-500/20 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer select-none disabled:cursor-not-allowed active:scale-95 transition-all"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FolderHeart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Save to Workspace
                      </>
                    )}
                  </button>

                  <button
                    onClick={generateCaptions}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Outputs cards grid */}
              <div className="grid grid-cols-1 gap-6">
                {/* 1. Main Caption */}
                <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3.5 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-purple-400 block">
                      Generated Social Caption
                    </span>
                    <button
                      onClick={() => copyField(result.caption, 'caption')}
                      className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                    >
                      {copiedKey === 'caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                    <p className="text-gray-300 text-xs whitespace-pre-line leading-relaxed font-medium">
                      {result.caption}
                    </p>
                  </div>
                </div>

                {/* 2. Hashtags & Emojis split grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hashtags Card */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3.5 flex flex-col justify-between h-[160px]">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-400 flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5" />
                          Recommended Hashtags
                        </span>
                        <button
                          onClick={() => copyField(result.hashtags, 'tags')}
                          className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                        >
                          {copiedKey === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-gray-300 text-xs font-mono leading-relaxed line-clamp-3">
                        {result.hashtags}
                      </p>
                    </div>
                  </div>

                  {/* Emojis Card */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3.5 flex flex-col justify-between h-[160px]">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-pink-400 flex items-center gap-1">
                          <Smile className="w-3.5 h-3.5" />
                          Emoji Suggestions
                        </span>
                        <button
                          onClick={() => copyField(result.emojis, 'emojis')}
                          className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                        >
                          {copiedKey === 'emojis' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-2xl text-center py-2 leading-relaxed tracking-wider">
                        {result.emojis}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 animate-float">
                <MessageSquare className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white uppercase font-mono">Caption Board Idle</h4>
                <p className="text-gray-400 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
                  Type a content topic, select social platforms, choose your style/tone, and click &ldquo;Forge Captions&rdquo; to build your captions.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

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
