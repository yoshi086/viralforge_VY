import React, { useState } from 'react';
import { Video, Sparkles, Copy, Check, Clock, Volume2, Monitor, Film, Download, RefreshCw } from 'lucide-react';

interface ReelGeneratorProps {
  defaultTopic?: string;
}

interface TimelineStep {
  time: string;
  type: 'hook' | 'story' | 'cta';
  title: string;
  dialogue: string;
  visual: string;
  audio: string;
}

export const ReelGenerator: React.FC<ReelGeneratorProps> = ({ defaultTopic = '' }) => {
  const [topic, setTopic] = useState(defaultTopic);
  const [niche, setNiche] = useState('Tech & AI');
  const [audience, setAudience] = useState('Creators & Founders');
  const [tone, setTone] = useState<'energetic' | 'educational' | 'dramatic' | 'urgent'>('energetic');
  const [length, setLength] = useState<'15' | '30' | '45' | '60'>('30');
  
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<TimelineStep[] | null>(null);
  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateReelScript = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      const cleaned = topic.trim().toLowerCase();
      let hookDialogue = `Stop spending hours on ${topic}! Do this instead.`;
      let storyDialogue1 = `Most ${audience} waste days trying to figure this out. Here is the cheat code for ${niche}.`;
      let storyDialogue2 = `First, identify the bottlenecks. Second, automate them with simple webhooks. Third, sit back and watch the scaling.`;
      let ctaDialogue = `Want my custom setup sheet? Comment "GROW" below and I will send it over!`;

      // Custom keywords
      if (cleaned.includes('ai') || cleaned.includes('automate') || cleaned.includes('tech')) {
        hookDialogue = `I built a custom AI database for ${niche} in 3 minutes. Here is the secret.`;
        storyDialogue1 = `No coding, no developers, just standard low-code tools connected to a simple API.`;
        storyDialogue2 = `Step 1: Set up a trigger inside Make.com. Step 2: Feed that input into an LLM prompt. Step 3: Write the finalized output straight to Notion.`;
        ctaDialogue = `Comment "AUTOMATE" and I will DM you the entire workspace blueprint for free!`;
      } else if (cleaned.includes('money') || cleaned.includes('passive') || cleaned.includes('finance')) {
        hookDialogue = `Traditional side hustles are dead for ${audience} in 2026. Do this instead.`;
        storyDialogue1 = `Instead of exchanging your hours for pennies, build single high-leverage assets in ${niche}.`;
        storyDialogue2 = `Spend 3 hours packaging your digital spreadsheets, notion templates, or design elements, and list them on Gumroad.`;
        ctaDialogue = `Comment "CASHFLOW" and I'll send you my top 5 assets you can launch this weekend!`;
      } else if (cleaned.includes('fitness') || cleaned.includes('health') || cleaned.includes('gym')) {
        hookDialogue = `Stop doing 2-hour workouts. You are actually killing your progress in ${niche}.`;
        storyDialogue1 = `After 45 minutes of heavy resistance, your body enters elevated cortisol states.`;
        storyDialogue2 = `Optimize for high density compound movements: squats, deadlifts, and overhead presses. Limit rest to 60 seconds.`;
        ctaDialogue = `Comment "STRONG" and I will send you my high-density workout protocol free!`;
      }

      // Adjust based on tone
      if (tone === 'dramatic') {
        hookDialogue = `They do not want ${audience} to know the truth about ${topic}...`;
        storyDialogue1 = `They want you busy, working in circles, so you never look at the actual leverage in ${niche}.`;
      } else if (tone === 'urgent') {
        hookDialogue = `Stop scrolling! If you care about ${topic}, you need to watch this.`;
        storyDialogue1 = `The algorithm is shifting fast for ${niche}, and if you do not implement this today, you will be left behind.`;
      } else if (tone === 'educational') {
        hookDialogue = `Here is the scientific reason why your ${topic} workflow is failing.`;
        storyDialogue1 = `According to neurological studies on ${audience}, excessive multi-tasking drains cognitive energy reserves.`;
      }

      const timeline: TimelineStep[] = [
        {
          time: '0:00 - 0:03',
          type: 'hook',
          title: 'The Pattern Interrupt Hook',
          dialogue: hookDialogue,
          visual: 'Quick split-screen frame cut. Text on screen: large, bold purple font with neon stroke. Direct gaze to camera. High energy zoom.',
          audio: 'Sound Effect: Heavy synth bass drop. Fast transition whoosh. Upbeat high-tempo electronic beat starts.'
        },
        {
          time: `0:03 - 0:${length === '15' ? '10' : length === '30' ? '18' : length === '45' ? '28' : '38'}`,
          type: 'story',
          title: 'The Core Bottleneck & Insight',
          dialogue: storyDialogue1,
          visual: 'A quick 3-second B-roll clip showing frustration or a chaotic desktop. Fast screen transition with zoom effect. Green checkmark overlay.',
          audio: 'Beat gets slightly louder. Audio effect: minor typewriter clicking sound synced with screen text.'
        },
        {
          time: `0:${length === '15' ? '10' : length === '30' ? '18' : length === '45' ? '28' : '38'} - 0:${length === '15' ? '13' : length === '30' ? '25' : length === '45' ? '38' : '52'}`,
          type: 'story',
          title: 'Actionable Step-by-Step Value Drop',
          dialogue: storyDialogue2,
          visual: 'Screenshare b-roll showing actual tools / dashboard in action. Highlighting the steps with a neon border. Fast cuts on beat.',
          audio: 'Keyboard clacking sounds. Background track drops to 20% volume to highlight speaker dialogue.'
        },
        {
          time: `0:${length === '15' ? '13' : length === '30' ? '25' : length === '45' ? '38' : '52'} - 0:${length}`,
          type: 'cta',
          title: 'The Loop Conversion CTA',
          dialogue: ctaDialogue,
          visual: 'Camera zooms back to speaker. Text overlay animation: "COMMENT \'KEYWORD\' BELOW". A floating arrow pointing down.',
          audio: 'Background beat drops suddenly. Sound Effect: Sparkle ding. Loop transition whoosh back to start of audio.'
        }
      ];

      setScript(timeline);
      setLoading(false);
    }, 700);
  };

  const copyStepText = (step: TimelineStep, index: number) => {
    const formatted = `[${step.time}] - ${step.title}\nDialogue: "${step.dialogue}"\nVisuals: ${step.visual}\nAudio: ${step.audio}`;
    navigator.clipboard.writeText(formatted);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyFullScript = () => {
    if (!script) return;
    const formatted = script.map(s => 
      `=== [${s.time}] ${s.title.toUpperCase()} ===\nDialogue: "${s.dialogue}"\nVisual Direction: ${s.visual}\nAudio Direction: ${s.audio}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(formatted);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleSaveScript = () => {
    if (!script) return;
    const formatted = script.map(s => 
      `=== [${s.time}] ${s.title.toUpperCase()} ===\nDialogue: "${s.dialogue}"\nVisual Direction: ${s.visual}\nAudio Direction: ${s.audio}\n`
    ).join('\n');
    
    // Trigger real text download
    const element = document.createElement("a");
    const file = new Blob([formatted], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `reel_script_${niche.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Film className="w-8 h-8 text-purple-500 fill-purple-500/20" />
          Interactive Reel Builder
        </h1>
        <p className="text-gray-400 mt-1 max-w-lg">
          Craft chronological short-form timelines. Fully mapped with dialogue lines, b-roll directions, visual cuts, and audio cues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-white/5 font-sans text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-400">
              Script Parameters
            </h3>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Reel Core Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is your short-form video about?"
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium text-xs"
              />
            </div>

            {/* Niche Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Niche Category
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Solopreneur, Gym fitness, AI SaaS..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium"
              />
            </div>

            {/* Target Audience Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Beginners, Founders, Busy Managers..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium"
              />
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Target Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { value: '15', label: '15s' },
                  { value: '30', label: '30s' },
                  { value: '45', label: '45s' },
                  { value: '60', label: '60s' }
                ].map((len) => (
                  <button
                    key={len.value}
                    onClick={() => setLength(len.value as any)}
                    className={`py-2 text-[10px] font-bold rounded-lg cursor-pointer border transition-all ${
                      length === len.value
                        ? 'bg-purple-600/25 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/5'
                        : 'bg-black/35 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Script Energy Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'energetic', label: '⚡ Energetic' },
                  { value: 'educational', label: '🧠 Explainer' },
                  { value: 'dramatic', label: '🎭 Dramatic' },
                  { value: 'urgent', label: '🚨 Urgent' }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value as any)}
                    className={`py-2 px-2.5 text-left text-[10px] font-semibold rounded-lg cursor-pointer border transition-all ${
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
              onClick={generateReelScript}
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-900/30 disabled:to-blue-900/30 text-white font-bold rounded-xl shadow-lg border border-purple-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-98"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  Generate Script
                </>
              )}
            </button>

          </div>
        </div>

        {/* Timeline Script Column */}
        <div className="lg:col-span-2 space-y-6">
          {script ? (
            <div className="space-y-6">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-md font-sans text-xs">
                <span className="text-gray-400 font-medium">
                  Workspace Timeline: <span className="text-purple-300 font-bold uppercase">{tone}</span> ({length}s)
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveScript}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    Save Script
                  </button>

                  <button
                    onClick={generateReelScript}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                    Regenerate
                  </button>

                  <button
                    onClick={copyFullScript}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 border border-purple-500/20 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 transition-all cursor-pointer select-none"
                  >
                    {copiedFull ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy All
                  </button>
                </div>
              </div>

              {/* Timeline Blocks */}
              <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8 font-sans">
                {script.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node indicator */}
                    <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#030208] z-10 flex items-center justify-center transition-all ${
                      step.type === 'hook' ? 'border-purple-500' :
                      step.type === 'cta' ? 'border-blue-500' : 'border-gray-500'
                    }`} />

                    <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all space-y-4">
                      {/* Step Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            step.type === 'hook' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' :
                            step.type === 'cta' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' :
                            'bg-gray-500/10 text-gray-400 border border-white/5'
                          }`}>
                            {step.type}
                          </span>
                          <h4 className="text-md font-bold text-white mt-2 leading-tight">
                            {step.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-purple-300 font-mono bg-purple-950/20 px-2.5 py-1 rounded-lg border border-purple-500/20">
                            {step.time}
                          </span>
                          <button
                            onClick={() => copyStepText(step, idx)}
                            className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/5 transition-all cursor-pointer"
                            title="Copy step details"
                          >
                            {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Step Dialogue */}
                      <div className="bg-black/35 rounded-xl p-3.5 border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold block mb-1">DIALOGUE (SPEAKING LINE)</span>
                        <p className="text-white text-sm leading-relaxed italic font-medium">
                          &ldquo;{step.dialogue}&rdquo;
                        </p>
                      </div>

                      {/* Grid for visuals and audio */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                        <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-start gap-2">
                          <Monitor className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Visual Action & B-Roll</span>
                            <p className="text-gray-300 leading-relaxed">{step.visual}</p>
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-start gap-2">
                          <Volume2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Audio & SFX Cues</span>
                            <p className="text-gray-300 leading-relaxed">{step.audio}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 animate-float">
                <Video className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white uppercase font-mono">Timeline Editor Empty</h4>
                <p className="text-gray-400 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
                  Select a topic, configure niche categories, and click &ldquo;Generate Script&rdquo; to build your chronological short-form video script.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
