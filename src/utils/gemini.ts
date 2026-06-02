import type { GeneratedContent } from './generator';

export interface EvidenceGrounding {
  source: string;
  signal: string;
  confidence: string;
  reasoning: string;
}

export interface ExplainableGrowthStrategy {
  topic: string;
  isCachedResult?: boolean;
  insufficientData: boolean;

  // Universal Relevance Validation Engine fields
  topicContextMap: string[];
  filteredEvidenceCount: {
    news: number;
    videos: number;
    search: number;
  };

  // Question 1: What are competitors doing?
  competitorAnalysis: {
    topCreators: string[];
    topVideos: string[];
    mostCommonTopics: string[];
    mostCommonHooks: string[];
    mostCommonFormats: string[];
  };

  // Question 2: What are competitors NOT doing?
  contentGapAnalysis: {
    opportunityLevel: 'High Opportunity' | 'Medium Opportunity' | 'Low Opportunity';
    underservedTopics: string[];
    missingAngles: string[];
    lowCompetitionOpportunities: string[];
  };

  // Question 3: What should I do?
  winningStrategy: {
    recommendedTopic: string;
    recommendedAngle: string;
    recommendedHook: string;
    recommendedFormat: string;
    recommendedCTA: string;
    expectedAdvantage: string;
  };
}

export interface DraftAnalysisResult {
  isCachedResult?: boolean;
  viralityScore: number;
  viralityEvidence: string;
  predictedReach: number; // e.g. in thousands
  predictedReachEvidence: string;
  predictedViews: number; // e.g. in thousands
  predictedViewsEvidence: string;
  predictedEngagement: number; // e.g. percent
  predictedEngagementEvidence: string;
  hookStrength: number;
  hookStrengthEvidence: string;
  audienceMatch: number;
  audienceMatchEvidence: string;
  trendRelevance: number;
  trendRelevanceEvidence: string;
  contentQuality: number;
  contentQualityEvidence: string;
  confidenceScore: number;
  analysisWhy: string;
  dataSourcesAudit: string;
  optimizations: string[];
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

// Deterministic fast 32-bit string hashing
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Global window event emitter for retry messages
export function dispatchRetryState(isRetrying: boolean, attempt: number, delay: number) {
  const event = new CustomEvent('gemini-retry-state', {
    detail: { isRetrying, attempt, delay, message: 'AI engine busy, retrying...' }
  });
  window.dispatchEvent(event);
}

// Helper to parse retry duration from Gemini error message
export function parseRetryAfter(message: string): number | undefined {
  const regexes = [
    /(?:retry|try again|cooling down|wait)\s+(?:in|after)?\s*(\d+)\s*(?:seconds?|s\b)/i,
    /(\d+)\s*(?:seconds?|s\b)\s*(?:until|before|to retry|remaining)/i,
    /retry after (\d+)/i
  ];
  for (const regex of regexes) {
    const match = message.match(regex);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return undefined;
}

// Token Compression Engine: Compress raw News, YouTube and Search payloads into a dense Topic Evidence Summary
export function compressEvidence(signals: any): string {
  let data: any = signals;
  if (typeof signals === 'string') {
    try {
      data = JSON.parse(signals);
    } catch (e) {
      return signals;
    }
  }

  if (!data) return "No evidence available.";

  const topic = data.topic || "";
  const newsItems = data.news?.items || [];
  const youtubeItems = data.youtube?.items || [];
  const googleSuggests = data.googleTrends?.items || [];
  const emergingQueries = data.emergingQueries?.items || [];

  const newsCount = newsItems.length;
  const ytCount = youtubeItems.length;
  const searchCount = googleSuggests.length + emergingQueries.length;

  const newsTitles = newsItems.slice(0, 5).map((n: any) => `- "${n.title}" (Source: ${n.source})`).join('\n');

  const topQueriesList = [
    ...googleSuggests.slice(0, 5).map((g: any) => g.query),
    ...emergingQueries.slice(0, 5).map((e: any) => e.query)
  ];
  const uniqueQueries = Array.from(new Set(topQueriesList)).slice(0, 6);
  const topQueriesFormatted = uniqueQueries.map(q => `- ${q}`).join('\n');

  const sortedVideos = [...youtubeItems].sort((a: any, b: any) => {
    const engagementA = (a.viewCount || 0) + (a.likeCount || 0) * 5;
    const engagementB = (b.viewCount || 0) + (b.likeCount || 0) * 5;
    return engagementB - engagementA;
  });
  const topVideosFormatted = sortedVideos.slice(0, 5).map((v: any) => 
    `- "${v.title}" by ${v.channelTitle} (${v.viewCount ? v.viewCount.toLocaleString() : 0} views, ${v.likeCount ? v.likeCount.toLocaleString() : 0} likes)`
  ).join('\n');

  return `
TOPIC EVIDENCE SUMMARY FOR: "${topic}"
---------------------------------------
Evidence Volume Stats:
- News Articles Detected: ${newsCount}
- YouTube Videos Analyzed: ${ytCount}
- Search Queries Captured: ${searchCount}

News Signals / Top Emerging Themes:
${newsTitles || "No recent news signals found."}

Top Suggest & Emerging Queries:
${topQueriesFormatted || "No search suggest signals found."}

Top Engagement Videos (YouTube Competitor Benchmarks):
${topVideosFormatted || "No YouTube video signals found."}
`.trim();
}

// Centralized execution wrapper with Cache and 3-Retry Exponential Backoff Strategy
export async function executeGeminiWithRetryAndCache<T>(
  trend: string,
  feature: 'growth_hacker' | 'content_studio' | 'analytics',
  prompt: string,
  config: any,
  apiKey: string,
  forceRefresh?: boolean
): Promise<T & { isCachedResult?: boolean }> {
  const cacheKey = `viralforge_analysis_cache:${trend.replace(/\s+/g, '_').toLowerCase()}:${feature}`;

  // 1. Check Cache (6 Hours Expiry)
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const entry: CacheEntry = JSON.parse(cachedStr);
        const age = Date.now() - entry.timestamp;
        if (age < 6 * 60 * 60 * 1000) { // 6 Hours Cache
          console.log(`[Cache Hit] Returning active 6-hour cached result for ${trend} - ${feature}`);
          return {
            ...entry.data,
            isCachedResult: true
          };
        }
      }
    } catch (cacheErr) {
      console.warn('Cache lookup failed:', cacheErr);
    }
  } else {
    console.log(`[Cache Bypass] Force refresh active for ${trend} - ${feature}`);
  }

  // 2. Setup retry strategy
  const retries = [2000, 5000];
  const maxAttempts = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // attempts 1-2 use gemini-2.5-flash, attempt 3 uses gemini-2.5-flash-lite
    const modelName = attempt < 3 ? 'gemini-2.5-flash' : 'gemini-2.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      console.log(`[AI Request] Attempt ${attempt}/${maxAttempts} using ${modelName} for ${trend}...`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...config
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `HTTP ${response.status} Error`;
        
        // Quota Limit Detection
        const isQuota = response.status === 429 || 
                        message.toLowerCase().includes('quota') || 
                        message.toLowerCase().includes('exhausted') || 
                        message.toLowerCase().includes('rate limit');
        
        if (isQuota) {
          const retryAfter = parseRetryAfter(message);
          const quotaErr = new Error(message) as any;
          quotaErr.isQuotaExceeded = true;
          quotaErr.retryAfterSeconds = retryAfter;
          throw quotaErr;
        }

        throw new Error(message);
      }

      const data = await response.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error('Gemini API returned an empty response.');
      }

      let cleanedJson = responseText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.substring(7);
      }
      if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.substring(3);
      }
      if (cleanedJson.endsWith('```')) {
        cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);
      }
      cleanedJson = cleanedJson.trim();

      const parsedData = JSON.parse(cleanedJson);

      // Save successful response to cache
      try {
        const entry: CacheEntry = { data: parsedData, timestamp: Date.now() };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch (saveErr) {
        console.warn('Cache write failed:', saveErr);
      }

      // Clear any global retry state in the UI
      dispatchRetryState(false, 0, 0);

      return parsedData;
    } catch (err: any) {
      console.error(`[AI Request Error] Attempt ${attempt} failed:`, err.message || err);
      lastError = err;

      if (attempt < maxAttempts) {
        const delay = retries[attempt - 1];
        dispatchRetryState(true, attempt, delay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Clear global retry state
  dispatchRetryState(false, 0, 0);

  // 3. Fallback: If request fails and there is ANY cached result (even expired), return it!
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const entry: CacheEntry = JSON.parse(cachedStr);
      console.warn(`[Cache Fallback] Gemini service failed. Returning cached result for ${trend} - ${feature}`);
      return {
        ...entry.data,
        isCachedResult: true
      };
    }
  } catch (fallbackErr) {
    console.warn('Cache fallback lookup failed:', fallbackErr);
  }

  // 4. Throw last error to let UI catch quota & countdown telemetry
  throw lastError;
}

export async function generateWithGemini(
  topic: string,
  apiKey?: string,
  goal?: string,
  handoffPackage?: any,
  forceRefresh?: boolean
): Promise<GeneratedContent> {
  const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!activeKey.trim()) {
    throw new Error('AI Intelligence Engine credentials missing. Define VITE_GEMINI_API_KEY inside your .env configuration.');
  }

  let goalInstructions = "";
  if (goal) {
    goalInstructions = `
Your primary creative content creation goal is: "${goal}".
You MUST tailor the narration, captions, and LinkedIn post structure to align with this strategic objective:
- "Gain Followers": Optimize for extreme mass appeal, high-retention visual hooks, and a strong, punchy "Follow for more daily strategy blueprints" call-to-action.
- "Build Authority": Focus on deep technical frameworks, industry case studies, contrarian professional arguments, and an outro CTA asking them to "Save this post to reference during your next team review".
- "Generate Leads": Spotlight a highly valuable free checklist, template, or guide. Use a direct lead magnet CTA instructing users to "Comment a specific keyword (e.g. 'BLUEPRINT' or 'SYSTEM') below to receive the resource instantly in your DMs".
- "Promote Product": Address operational friction points, showcase a 3-step solution enabled by your SaaS/product, and direct users to "Click the link in my bio to start a 7-day trial completely free".
`;
  }

  let handoffInstructions = "";
  if (handoffPackage) {
    const recommendedAngle = handoffPackage.winningStrategy?.recommendedAngle || handoffPackage.contentDirection?.angle || handoffPackage.bestOpportunity?.recommendedAngle || handoffPackage.contentGapEngine?.recommendedAngle || '';
    const outperformHook = handoffPackage.winningStrategy?.recommendedHook || handoffPackage.winningHooks?.[0]?.outperformHook || handoffPackage.winningHook?.outperformHook || handoffPackage.winningHooks?.[0]?.recommendedOutperformHook || '';
    const whyItWorks = handoffPackage.winningStrategy?.expectedAdvantage || handoffPackage.winningHooks?.[0]?.evidence?.reasoning || handoffPackage.winningHook?.whyItWorks || handoffPackage.winningHooks?.[0]?.whyItWorks || '';

    handoffInstructions = `
You MUST ground this generation strictly on the following strategic handoff package synthesized by the AI Growth Hacker:
- Content Gap: "${recommendedAngle}" (Low competition underserved angle)
- Winning Hook Recommendation: "${outperformHook}" (Psychological reason: ${whyItWorks})

Please incorporate these specific points into the generated script, captions, and LinkedIn post. Do NOT make up generic content. Ground your creative writing directly inside these recommended strategist constraints.
`;
  }

  const prompt = `
You are the elite AI Creative Director and Reel Producer for ViralForge AI.
Your mission is to compile a complete, production-ready AI Reel Production Package centered around: "${topic}".
${goalInstructions}
${handoffInstructions}

You MUST reply in valid, parseable JSON format. Do NOT wrap your JSON in markdown code blocks.
Your JSON response must match this EXACT schema:
{
  "topic": "${topic}",
  "trendScore": number (value between 70 and 99 reflecting search interest),
  "viralityScore": number (value between 70 and 100 reflecting virality chance),
  "platformSplit": {
    "reels": number,
    "tiktok": number,
    "linkedin": number
  },
  
  "concept": {
    "title": "A premium, high-retention reel title",
    "objective": "A highly customized objective for the reel",
    "targetAudience": "The specific ideal viewer segment targeted"
  },
  
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": "3s",
      "visualDescription": "Detailed visual B-roll description, split-screen directions, camera movements, text layouts.",
      "voiceoverText": "The actual narration spoken in this scene (0-3s pattern interrupt hook).",
      "onScreenText": "Short, punchy capitalized text overlays shown on screen.",
      "visualPrompt": "A highly descriptive prompt for AI Video Generators like Runway, Veo, or Pika to render this scene.",
      "autoCaption": "The specific auto-caption for this scene."
    },
    {
      "sceneNumber": 2,
      "duration": "10s",
      "visualDescription": "Visual action showing tools, screenshares, dashboard nodes, or high-pacing cuts.",
      "voiceoverText": "Narration for the core problem or value delivery.",
      "onScreenText": "On-screen text overlay for the value delivery.",
      "visualPrompt": "Runway/Veo visual prompt for scene 2.",
      "autoCaption": "Scene 2 auto-caption."
    },
    {
      "sceneNumber": 3,
      "duration": "12s",
      "visualDescription": "Step-by-step close-ups, screenshares, or manual workflows shown.",
      "voiceoverText": "Narration for the next actionable value drop.",
      "onScreenText": "On-screen text overlay for scene 3.",
      "visualPrompt": "Runway/Veo visual prompt for scene 3.",
      "autoCaption": "Scene 3 auto-caption."
    },
    {
      "sceneNumber": 4,
      "duration": "10s",
      "visualDescription": "Data nodes, 3D visualization, B-roll typing or process shots.",
      "voiceoverText": "Narration highlighting high-leverage outcomes.",
      "onScreenText": "On-screen text overlay for scene 4.",
      "visualPrompt": "Runway/Veo visual prompt for scene 4.",
      "autoCaption": "Scene 4 auto-caption."
    },
    {
      "sceneNumber": 5,
      "duration": "5s",
      "visualDescription": "Direct gaze back to camera, smiling, pointing down to comments callout.",
      "voiceoverText": "Narration for the loop conversion CTA.",
      "onScreenText": "On-screen text overlay: COMMENT 'KEYWORD' BELOW.",
      "visualPrompt": "Runway/Veo visual prompt for scene 5.",
      "autoCaption": "Scene 5 auto-caption."
    }
  ],
  
  "voiceoverScript": {
    "hook": "Narrator opening spoken hook (first 3s).",
    "mainContent": "Full main narration value drop body script.",
    "cta": "Final narration conversion CTA line."
  },
  
  "thumbnail": {
    "text": "Punchy 3-4 word high-contrast text overlay",
    "concept": "Detailed description of the visual thumbnail design concept",
    "emotionTrigger": "The psychological emotion triggered, e.g. Urgency, Curiosity"
  },
  
  "publishingPackage": {
    "instagramCaption": "Engaging Instagram caption with line spaces, emojis, structural bullets, and tags.",
    "linkedinPost": "A professional, high-authority LinkedIn post outline with line spaces, bullet points, and hashtags.",
    "hashtags": "Recommended tags list separated by spaces.",
    "cta": "Recommended call-to-action line.",
    "bestPostingTime": "Best day and hour to publish, e.g. Tuesday 09:30 AM EST"
  }
}

Ensure all scenes, prompts, captions, and posts are deeply customized to the topic: "${topic}". Do not output generic placeholders.
`;

  const config = {
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  const parsedContent = await executeGeminiWithRetryAndCache<any>(
    topic,
    'content_studio',
    prompt,
    config,
    activeKey,
    forceRefresh
  );

  // Calculate metrics deterministically if not returned, to ensure type safety
  const trendScore = Number(parsedContent.trendScore) || 85;
  const viralityScore = Number(parsedContent.viralityScore) || 80;
  const reelsSplit = Number(parsedContent.platformSplit?.reels) || 35;
  const tiktokSplit = Number(parsedContent.platformSplit?.tiktok) || 45;
  const linkedinSplit = Number(parsedContent.platformSplit?.linkedin) || 20;

  const viewsVal = Math.floor(50 + (trendScore * 1.5));
  const likesVal = Math.floor(viewsVal * 0.08);
  const sharesVal = Math.floor(likesVal * 0.15);

  return {
    topic: parsedContent.topic || topic,
    isCachedResult: parsedContent.isCachedResult,
    trendScore,
    viralityScore,
    platformSplit: {
      reels: reelsSplit,
      tiktok: tiktokSplit,
      linkedin: linkedinSplit
    },
    concept: {
      title: parsedContent.concept?.title || `Mastering ${topic}`,
      objective: parsedContent.concept?.objective || `Educating creators on high-level leverage.`,
      targetAudience: parsedContent.concept?.targetAudience || `Solopreneurs and builders.`
    },
    scenes: parsedContent.scenes || [],
    voiceoverScript: {
      hook: parsedContent.voiceoverScript?.hook || parsedContent.script?.hook || `How to master ${topic} in 2026.`,
      mainContent: parsedContent.voiceoverScript?.mainContent || parsedContent.script?.story || `Here is the step-by-step workflow...`,
      cta: parsedContent.voiceoverScript?.cta || parsedContent.script?.cta || `Comment GROW to receive it!`
    },
    thumbnail: {
      text: parsedContent.thumbnail?.text || `Optimize ${topic}`,
      concept: parsedContent.thumbnail?.concept || `A sleek dark laptop with purple database graphs.`,
      emotionTrigger: parsedContent.thumbnail?.emotionTrigger || `Curiosity`
    },
    publishingPackage: {
      instagramCaption: parsedContent.publishingPackage?.instagramCaption || parsedContent.captions?.punchy || `Are you struggling with ${topic}?`,
      linkedinPost: parsedContent.publishingPackage?.linkedinPost || parsedContent.linkedinPost || `Here is how we optimized ${topic}...`,
      hashtags: parsedContent.publishingPackage?.hashtags || `#${topic.replace(/\s+/g, '')} #Tips`,
      cta: parsedContent.publishingPackage?.cta || `Comment for templates!`,
      bestPostingTime: parsedContent.publishingPackage?.bestPostingTime || `Tuesday 09:30 AM EST`
    },
    expectedMetrics: {
      views: `${viewsVal}K`,
      likes: `${likesVal.toFixed(1)}K`,
      shares: `${sharesVal.toFixed(0)}`,
      engagement: `${((likesVal + sharesVal / 10) / viewsVal * 100).toFixed(1)}%`
    }
  };
}

export async function generateExplainableGrowthHackerStrategy(
  topic: string,
  signalsJsonString: string,
  apiKey?: string,
  forceRefresh?: boolean
): Promise<ExplainableGrowthStrategy> {
  const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!activeKey.trim()) {
    throw new Error('AI Intelligence Engine credentials missing. Define VITE_GEMINI_API_KEY inside your .env configuration.');
  }

  // Token Compression Optimization
  const compressedSummary = compressEvidence(signalsJsonString);

  const prompt = `
You are the advanced high-fidelity Universal Creator Intelligence Engine for ViralForge AI, operating as an Evidence Interpretation Engine.
Your sole mission is to formulate a highly focused, evidence-backed strategy centered ONLY around the selected topic: "${topic}".

CORE PIPELINE & WORKFLOW:

Step 1: Build a Topic Context Map
Extract dominant entities, themes, and sub-themes dynamically from the collected raw evidence summary below. Create a custom 5-8 item "topicContextMap" of concepts directly associated with "${topic}".
Examples:
- Cristiano Ronaldo -> ["Football", "Goals", "Portugal", "Al Nassr", "Champions League", "Training"]
- ISRO -> ["Space Missions", "Chandrayaan", "Satellites", "Rockets", "Research"]
- Prabhas -> ["Telugu Cinema", "Films", "Acting", "Baahubali", "Kalki", "Fan Communities"]
- Machine Learning -> ["AI Models", "Algorithms", "Data Science", "Neural Networks", "Training"]

Step 2: Evidence Relevance Scoring & Filtration
Evaluate every news article, YouTube video, and search query in the Raw Evidence Package against your generated Topic Context Map.
- Assign a relevance score between 0.0 (completely unrelated) and 1.0 (directly related) to each item.
- Strict Threshold: Filter out and discard all evidence items with a score below 0.6 immediately.
- Compile a "Filtered Evidence Package" containing only items scoring >= 0.6.
- Count the number of filtered news articles, YouTube videos, and search signals.

Step 3: Strategist Analysis Formulation
Build the strategist recommendations using ONLY the Filtered Evidence Package. Do not use generic news, unrelated trends, or generic search queries.

Step 4: Relevance Validation Self-Audit
Before including any recommendation, competitor creator, video, common topic, hook, gap, missing angle, or strategy field:
- Ask: "Does this directly relate to the Topic Context Map?"
- If NO: Reject it, do not include it, and generate a better topic-relevant alternative.
- Universal Success Test: If a recommendation, hook, or gap could be reused unchanged for a completely different topic, reject it and regenerate. It must be 100% custom and specific to the exact evidence and context of "${topic}".

ABSOLUTE PROHIBITIONS:
- Never use hardcoded allowed lists or pre-defined topic templates. All topics follow the exact same dynamic relevance pipeline.
- NEVER invent fictional creator names. Use ONLY actual channel titles discovered in the YouTube video signals evidence.
- NEVER generate placeholder creators or estimated creators. Do NOT fill missing slots. If only 3 creators are found in the evidence, return exactly 3 creators.
- NEVER invent fictional competitor hooks. Extract actual video titles or hooks from the provided YouTube video signals evidence.

LIVE EVIDENCE SUMMARY PACKAGE:
${compressedSummary}

INSTRUCTIONS:
1. Parse the Live Evidence Package.
2. If the package contains zero news articles, zero YouTube videos, AND zero search queries (or is completely irrelevant to "${topic}"), set "insufficientData": true.
3. Formulate the response to answer exactly three questions:
   - Question 1: What are competitors doing? (Competitor Analysis)
   - Question 2: What are they missing? (Fan Demand Not Served)
   - Question 3: What should I do? (Winning Strategy)

You MUST respond in valid, parseable JSON format. Do NOT wrap your JSON in markdown code blocks.
Your response MUST strictly match this EXACT schema:
{
  "topic": "${topic}",
  "insufficientData": false,
  "topicContextMap": ["Dynamic 5-8 terms directly associated with this topic extracted from evidence"],
  "filteredEvidenceCount": {
    "news": number (count of articles scoring >= 0.6),
    "videos": number (count of YouTube videos scoring >= 0.6),
    "search": number (count of search/suggest queries scoring >= 0.6)
  },
  
  "competitorAnalysis": {
    "topCreators": ["Extract actual discovered creator/channel names from YouTube signals list. Maximum 5. Do NOT invent placeholders."],
    "topVideos": ["Extract actual discovered video titles from YouTube signals list. Maximum 5. Do NOT invent placeholders."],
    "mostCommonTopics": ["Up to 5 common themes observed in news/videos."],
    "mostCommonHooks": ["Up to 5 common hooks observed in discovered competitor video titles."],
    "mostCommonFormats": ["Up to 5 common formats observed, e.g. Teardowns, Tutorials, Screenshares."]
  },

  "contentGapAnalysis": {
    "opportunityLevel": "Must be exactly: High Opportunity or Medium Opportunity or Low Opportunity",
    "underservedTopics": ["Top 3 underserved subtopics derived from evidence gaps."],
    "missingAngles": ["Top 3 missing angles or low-competition perspectives."],
    "lowCompetitionOpportunities": ["Top 3 low-competition opportunities."]
  },

  "winningStrategy": {
    "recommendedTopic": "One clear strategic topic recommendation based on gaps",
    "recommendedAngle": "One clear low-competition angle to exploit",
    "recommendedHook": "One clear outperform hook written to dominate",
    "recommendedFormat": "One clear video or post format recommended",
    "recommendedCTA": "One clear loop CTA designed to convert",
    "expectedAdvantage": "One clear explanation of the expected structural advantage"
  }
}
`;

  const config = {
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  const parsedContent = await executeGeminiWithRetryAndCache<ExplainableGrowthStrategy>(
    topic,
    'growth_hacker',
    prompt,
    config,
    activeKey,
    forceRefresh
  );

  return parsedContent;
}

export async function analyzeDraftWithGemini(
  draft: string,
  platform: string,
  niche: string,
  apiKey?: string,
  forceRefresh?: boolean
): Promise<DraftAnalysisResult> {
  const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!activeKey.trim()) {
    throw new Error('AI Intelligence Engine credentials missing. Define VITE_GEMINI_API_KEY inside your .env configuration.');
  }

  const prompt = `
You are the advanced NLP Creator Intelligence Engine for ViralForge AI.
Analyze this user script/hook draft:
"${draft}"
 
Target Platform: ${platform}
Niche Segment: ${niche}
 
Evaluate this content across 8 essential dimensions. Every score you assign MUST be traceable, backed by linguistic features, keyword density, hook mechanics, or specific platform dynamics. 
 
You MUST reply in valid, parseable JSON format. Do NOT wrap your JSON in markdown code blocks.
Your response MUST strictly match this EXACT schema:
{
  "viralityScore": number (0-100),
  "viralityEvidence": "Traceable explanation of why this virality score was assigned, referencing specific phrases in the draft and their viral index.",
  "predictedReach": number (in thousands, e.g. 145),
  "predictedReachEvidence": "Traceable explanation of predicted organic reach based on platform algorithmic matching of terms like those in the draft.",
  "predictedViews": number (in thousands, e.g. 110),
  "predictedViewsEvidence": "Traceable explanation of predicted view count based on initial hook velocity and interest index.",
  "predictedEngagement": number (percentage, e.g. 8.4),
  "predictedEngagementEvidence": "Traceable explanation based on call-to-action placement and engagement triggers.",
  "hookStrength": number (0-100),
  "hookStrengthEvidence": "Linguistic audit of the first 3 seconds (opening line) detailing hook effectiveness.",
  "audienceMatch": number (0-100),
  "audienceMatchEvidence": "Analysis of how closely the draft vocabulary and tone fit target demographics in ${niche}.",
  "trendRelevance": number (0-100),
  "trendRelevanceEvidence": "Score reflecting search interest overlap and recent search suggestions.",
  "contentQuality": number (0-100),
  "contentQualityEvidence": "Linguistic assessment of message clarity, brevity, flow, and pacing.",
  "confidenceScore": number (0-100),
  "analysisWhy": "A summary of why this analytical prediction was made.",
  "dataSourcesAudit": "Specify exact public trends databases (e.g. Search Intelligence Engine autocomplete suggestions, Video Signal Engine views, News Signal Engine) used for model weight alignments.",
  "optimizations": [
    "Optimizing change 1 (highly actionable, referencing specific lines in the draft)",
    "Optimizing change 2",
    "Optimizing change 3"
  ]
}
`;

  const config = {
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  const trendKey = `draft_${simpleHash(draft)}`;
  const parsedContent = await executeGeminiWithRetryAndCache<DraftAnalysisResult>(
    trendKey,
    'analytics',
    prompt,
    config,
    activeKey,
    forceRefresh
  );

  return parsedContent;
}

