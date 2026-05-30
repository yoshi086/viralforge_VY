import React, { useState } from 'react';
import { Sparkles, Copy, Check, BookOpen, Award, Download, RefreshCw, Hash, Target } from 'lucide-react';

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

export const LinkedInPosts: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Founders & Executives');
  const [tone, setTone] = useState<'professional' | 'inspiring' | 'contrarian' | 'direct'>('inspiring');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    postText: string;
    ctaText: string;
    hashtagsText: string;
  } | null>(null);
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const generateLinkedInPost = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      let hook = '';
      let body = '';
      let cta = '';
      let tags = '';

      const cleaned = topic.trim().toLowerCase();

      // Hook style based on Tone
      if (tone === 'contrarian') {
        hook = `99% of professionals are looking at ${topic} completely backward.\n\nThey do the hard manual work, but ignore actual leverage. Here is why.`;
      } else if (tone === 'inspiring') {
        hook = `If you are feeling stuck trying to optimize ${topic}, this is for you.\n\nI was in your exact shoes last month. Here is the single strategy that shifted everything.`;
      } else if (tone === 'professional') {
        hook = `We analyzed standard workflows scaling ${topic} operations for ${audience}.\n\nThe operational findings were completely counter-intuitive:`;
      } else {
        hook = `The direct truth about ${topic} that most ${audience} ignore.\n\nRead this before your next strategy planning session:`;
      }

      // Format Body
      body = `To optimize this, high-performance creators implement three micro-strategies:\n\n1. Systems Over Sweat\nStop trying to resolve bottlenecks with raw hours. Document the pipeline and build a repeatable routine.\n\n2. Guard Your Flow Blocks\nSchedule 90-minute isolated focus blocks. Turn off all phone notifications. Continuous context switching drains cognitive capacity by up to 40%.\n\n3. Leverage Micro-Assets\nReduce manual sync meetings by 80%. Provide clean process checklists instead.`;
      
      // Keyword customizers
      if (cleaned.includes('ai') || cleaned.includes('automate') || cleaned.includes('tech')) {
        body = `To automate this, modern enterprises use a simple 3-tier AI stack:\n\n1. The Trigger (Make / Zapier)\nCatches incoming client queries, bookings, or data points instantly.\n\n2. The Brain (OpenAI / Anthropic API)\nSynthesizes context, extracts pain points, and drafts automated replies.\n\n3. The Hub (Notion / Slack)\nStores drafts and alerts a human operator for 1-click approvals.`;
      }

      // Professional CTA
      if (tone === 'professional') {
        cta = 'What operational bottlenecks are you currently troubleshooting in your workflow? Let us exchange frameworks in the comments below.';
      } else if (tone === 'inspiring') {
        cta = 'What is your current system for guarding your deep focus blocks? Let me know below. 👇';
      } else if (tone === 'contrarian') {
        cta = 'Do you agree or disagree? Let us debate in the comments. 👇';
      } else {
        cta = 'Want our exact webhook setup blueprint? Comment "BLUEPRINT" and I will send it over! ⚡';
      }

      tags = `#${topic.replace(/\s+/g, '')} #ProcessScale #BusinessArchitecture #Solopreneurship #LinkedInGrowth`;

      setResult({
        postText: `${hook}\n\n${body}`,
        ctaText: cta,
        hashtagsText: tags
      });
      setLoading(false);
    }, 700);
  };

  const copyField = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSavePost = () => {
    if (!result) return;
    const formatted = `=== LINKEDIN AUTHORITY POST ===\n${result.postText}\n\n=== PROFESSIONAL CTA ===\n${result.ctaText}\n\n=== HASHTAGS ===\n${result.hashtagsText}`;
    
    const element = document.createElement("a");
    const file = new Blob([formatted], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `linkedin_post_${tone}.txt`;
    document.body.appendChild(element);
    element.click();
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fullPost = result ? `${result.postText}\n\n${result.ctaText}\n\n${result.hashtagsText}` : '';
  const wordCount = fullPost ? fullPost.split(/\s+/).length : 0;
  const readTimeSeconds = Math.round((wordCount / 220) * 60);

  // Deterministic boost score
  const engagementScore = result 
    ? Math.min(99, 78 + (topic.length % 12) + (tone === 'contrarian' ? 6 : 4))
    : 0;

  return (
    <div className="space-y-8 fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <LinkedInIcon className="w-8 h-8 text-purple-500 fill-purple-500/20" />
          LinkedIn Authority Writer
        </h1>
        <p className="text-gray-400 mt-1 max-w-lg">
          Forge high-engagement, authority-building LinkedIn posts with structured spacing, professional lists, and conversion hooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/5 font-sans text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
              Post Parameters
            </h3>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Post Topic / Core Concept
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What professional insight would you like to share?"
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium text-xs"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Founders, Marketing Managers..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium"
              />
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Post Vibe & Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'inspiring', label: '🚀 Inspiring' },
                  { value: 'professional', label: '💼 Executive' },
                  { value: 'contrarian', label: '💥 Contrarian' },
                  { value: 'direct', label: '🎯 Direct' }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value as any)}
                    className={`py-2.5 px-3 text-left text-[10px] font-semibold rounded-lg cursor-pointer border transition-all ${
                      tone === t.value
                        ? 'bg-purple-600/25 text-purple-300 border-purple-500/40 shadow-sm'
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
              onClick={generateLinkedInPost}
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
                  Forge LinkedIn Post
                </>
              )}
            </button>

          </div>
        </div>

        {/* Display / Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 font-sans">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-md text-xs">
                <span className="text-gray-400 font-medium">
                  Optimized LinkedIn Post: <span className="text-purple-300 font-bold uppercase">{tone}</span>
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePost}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    Save Post
                  </button>

                  <button
                    onClick={generateLinkedInPost}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                    Regenerate
                  </button>

                  <button
                    onClick={() => copyField(fullPost, 'full')}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 border border-purple-500/20 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    {copiedKey === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Post
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Main Post Preview */}
                <div className="md:col-span-2 space-y-4">
                  {/* Glass Card 1: Main Post body */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-purple-400 block">
                        Authority Post Content
                      </span>
                      <button
                        onClick={() => copyField(result.postText, 'body')}
                        className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                      >
                        {copiedKey === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="bg-black/35 rounded-xl p-5 border border-white/5 text-[#e5e7eb] leading-relaxed text-xs h-[240px] overflow-y-auto whitespace-pre-line font-medium">
                      {result.postText}
                    </div>
                  </div>

                  {/* Glass Card 2: CTA split */}
                  <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-400 block">
                        Professional CTA
                      </span>
                      <button
                        onClick={() => copyField(result.ctaText, 'cta')}
                        className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                      >
                        {copiedKey === 'cta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="bg-black/35 rounded-xl p-4.5 border border-white/5 text-gray-300 text-xs font-semibold leading-relaxed">
                      {result.ctaText}
                    </div>
                  </div>
                </div>

                {/* Analytical Sidebar Info */}
                <div className="md:col-span-1 space-y-6">
                  <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-6">
                    <h3 className="text-[10px] font-extrabold text-white uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-pink-400" />
                      Readability & Virality
                    </h3>

                    {/* Score circle */}
                    <div className="flex flex-col items-center py-2 space-y-2 border-b border-white/5">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="38" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            className="stroke-purple-500"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={2 * Math.PI * 38 * (1 - engagementScore / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-lg font-extrabold text-white font-mono">{engagementScore}</span>
                          <span className="text-[7px] text-gray-500 uppercase tracking-widest font-bold">Boost</span>
                        </div>
                      </div>
                    </div>

                    {/* Details stats */}
                    <div className="space-y-4 text-xs">
                      
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                          Readability
                        </span>
                        <span className="text-white font-semibold text-[10px]">Grade 7 (Easy)</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-pink-400" />
                          Hashtags fit
                        </span>
                        <button
                          onClick={() => copyField(result.hashtagsText, 'tags')}
                          className="text-purple-400 hover:text-purple-300 font-bold hover:underline"
                        >
                          {copiedKey === 'tags' ? 'Copied!' : 'Copy Tags'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Estimated Read</span>
                        <span className="text-white font-mono font-semibold">~{readTimeSeconds}s read</span>
                      </div>

                    </div>
                  </div>

                  <div className="bg-purple-950/20 border border-purple-500/10 rounded-2xl p-4 flex gap-2.5 items-start">
                    <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">LinkedIn Authority Tip</span>
                      <p className="text-gray-400 text-[10px] leading-relaxed">
                        Structure your copy with custom hooks, spacer gaps, lists, and direct CTAs to maximize scroll retention by up to 350%.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 animate-float">
                <LinkedInIcon className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white uppercase font-mono">LinkedIn Editor Empty</h4>
                <p className="text-gray-400 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
                  Type an authority concept, pick your formatting parameters, and click &ldquo;Forge LinkedIn Post&rdquo; to generate post drafts.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
