import type { GeneratedContent } from './generator';

/**
 * Service to communicate with Google's Gemini API directly.
 * Uses fetch to bypass node_modules dependencies and provide instant performance.
 */
export async function generateWithGemini(topic: string, apiKey: string): Promise<GeneratedContent> {
  if (!apiKey.trim()) {
    throw new Error('API key is empty');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Construct prompt explaining exactly how the JSON schema must be formed
  const prompt = `
You are the high-performance AI engine for ViralForge AI, an elite content strategist.
Analyze this topic: "${topic}"

Forge an engaging set of viral content assets. You MUST reply in valid, parseable JSON format. Do NOT wrap your JSON in markdown code blocks.
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
  "script": {
    "hook": "A highly-engaging pattern-interrupt opening hook (0-3s) for a 45-second reel script.",
    "story": "The core story/value drop (3-40s) of the reel script. Keep it punchy, scannable, and practical.",
    "cta": "A high-conversion loop CTA (40-45s) for the end of the reel."
  },
  "captions": {
    "punchy": "A short, attention-grabbing Instagram caption with emojis and hashtags.",
    "storytelling": "A longer storytelling narrative Instagram caption with emojis and hashtags.",
    "question": "An interactive caption built around a question to drive comments, with hashtags."
  },
  "linkedinPost": "A professional, high-authority LinkedIn post with line spaces, bullet points, hashtags, and standard spacing."
}

Ensure all texts are highly customized to the topic: "${topic}". Do not output generic placeholders.
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || `HTTP ${response.status} Error`;
      throw new Error(`Gemini API Request failed: ${message}`);
    }

    const data = await response.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Gemini API returned an empty response.');
    }

    // Clean response text just in case markdown brackets exist
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

    const parsedContent = JSON.parse(cleanedJson);

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
      trendScore,
      viralityScore,
      platformSplit: {
        reels: reelsSplit,
        tiktok: tiktokSplit,
        linkedin: linkedinSplit
      },
      script: {
        hook: parsedContent.script?.hook || `How to master ${topic} in 2026.`,
        story: parsedContent.script?.story || 'Step 1: Focus on leverage. Step 2: Automate structural details.',
        cta: parsedContent.script?.cta || 'Comment "GROW" and I\'ll send the guidelines!'
      },
      captions: {
        punchy: parsedContent.captions?.punchy || `#${topic.replace(/\s+/g, '')} #Tips #Viral`,
        storytelling: parsedContent.captions?.storytelling || `Let's discuss how we optimized ${topic}.`,
        question: parsedContent.captions?.question || `What is your biggest roadblock with ${topic}?`
      },
      linkedinPost: parsedContent.linkedinPost || `Here is how we optimized ${topic} workflows...`,
      expectedMetrics: {
        views: `${viewsVal}K`,
        likes: `${likesVal.toFixed(1)}K`,
        shares: `${sharesVal.toFixed(0)}`,
        engagement: `${((likesVal + sharesVal / 10) / viewsVal * 100).toFixed(1)}%`
      }
    };
  } catch (error) {
    console.error('Gemini call error:', error);
    throw error;
  }
}
