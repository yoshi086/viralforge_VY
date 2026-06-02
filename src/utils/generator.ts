export interface ReelScene {
  sceneNumber: number;
  duration: string;
  visualDescription: string;
  voiceoverText: string;
  onScreenText: string;
  visualPrompt: string;
  autoCaption: string;
}

export interface GeneratedContent {
  topic: string;
  isCachedResult?: boolean;
  trendScore: number;
  viralityScore: number;
  platformSplit: {
    reels: number;
    tiktok: number;
    linkedin: number;
  };
  concept: {
    title: string;
    objective: string;
    targetAudience: string;
  };
  scenes: ReelScene[];
  voiceoverScript: {
    hook: string;
    mainContent: string;
    cta: string;
  };
  thumbnail: {
    text: string;
    concept: string;
    emotionTrigger: string;
  };
  publishingPackage: {
    instagramCaption: string;
    linkedinPost: string;
    hashtags: string;
    cta: string;
    bestPostingTime: string;
  };
  expectedMetrics: {
    views: string;
    likes: string;
    shares: string;
    engagement: string;
  };
}

export function generateContentForTopic(topic: string, _goal?: string): GeneratedContent {
  const cleaned = topic.trim().toLowerCase();
  
  // Calculate deterministic scores based on string length and content to feel real but dynamic
  let scoreBase = Math.floor(70 + (cleaned.length % 20));
  if (cleaned.includes('ai') || cleaned.includes('artificial') || cleaned.includes('gpt') || cleaned.includes('automation')) {
    scoreBase += 8;
  }
  if (cleaned.includes('money') || cleaned.includes('rich') || cleaned.includes('passive') || cleaned.includes('dollar')) {
    scoreBase += 6;
  }
  const trendScore = Math.min(99, Math.max(72, scoreBase));
  const viralityScore = Math.min(98, Math.max(70, scoreBase - 3 + (cleaned.length % 7)));

  // 1. Setup Default Reel Production Package values
  let reelTitle = `Mastering ${topic}`;
  let reelObjective = `Educating creators on high-level leverage and scaling.`;
  let targetAudience = `Solopreneurs and digital builders.`;
  let bestPostingTime = `Tuesday 09:30 AM EST`;

  let scene1Visual = `A fast, split-screen video cut showing a frustrated developer scratching their head on one side, and a modern clean Vercel-style dashboard compiling code on the other. Direct gaze to camera.`;
  let scene1Voice = `Stop spending hours working on ${topic}! Do this instead.`;
  let scene1Text = `STOP SPENDING HOURS ON ${topic.toUpperCase()}!`;
  let scene1Prompt = `Modern workspace split-screen, frustrated developer vs glowing futuristic dashboard, neon purple lighting accents, cinematic depth of field, social media style`;
  let scene1Caption = `Are you still struggling with ${topic}? 🤷‍♂️ Let's fix that.`;

  let scene2Visual = `Fast transition whoosh to a screenshare B-roll showing automated webhooks and simple API models routing data streams in real time. Hover boxes highlighted in neon blue.`;
  let scene2Voice = `Most creators waste days trying to figure this out. But the cheat code is incredibly simple.`;
  let scene2Text = `THE CHEAT CODE IS INCREDIBLY SIMPLE`;
  let scene2Prompt = `SaaS product interface, real-time database flow chart showing webhooks and API models lighting up, clean minimalistic vector layout, 8k, photorealistic`;
  let scene2Caption = `Most builders waste hours on manual overhead. Here is the blueprint.`;

  let scene3Visual = `Close-up shot of hands typing high-speed on a premium mechanical keyboard with rgb backing, transitioning to a clean notion workspace organizing projects.`;
  let scene3Voice = `Step one: Automate the bottleneck. Step two: Connect it directly to a database. Step three: Let it run in the background.`;
  let scene3Text = `AUTOMATE • ROUTE • DEPLOY`;
  let scene3Prompt = `Close up of hands typing on a premium mechanical keyboard with neon backlighting, soft background focus, cinematic lighting, sleek tech aesthetic`;
  let scene3Caption = `A simple 3-step loop is all you need to save 20 hours a week.`;

  let scene4Visual = `A 3D database visualization showing data nodes syncing up beautifully. Colorful gradient links connect structural panels.`;
  let scene4Voice = `By bypassing manual copy-pasting, you unlock an immediate operational leverage.`;
  let scene4Text = `IMMEDIATE OPERATIONAL LEVERAGE`;
  let scene4Prompt = `Futuristic 3D node network syncing data streams, neon violet and blue links, dark background grid, high-tech database structure, render engine style`;
  let scene4Caption = `This workflow instantly scales your operational output.`;

  let scene5Visual = `Camera zooms back to speaker smiling and pointing down at a floating text overlay animating the word "COMMENT 'GROW' BELOW".`;
  let scene5Voice = `Drop a lightning bolt in the comments and I will DM you my complete setup checklist for free!`;
  let scene5Text = `COMMENT "GROW" FOR THE CHECKLIST!`;
  let scene5Prompt = `Professional tech creator pointing down directly to camera, friendly smiling expression, soft studio lighting, clean office B-roll background`;
  let scene5Caption = `Comment ⚡ and I will send the entire template directly to your DMs!`;

  let hook = `Stop spending hours on ${topic}! Do this instead.`;
  let mainContent = `Most creators waste days trying to figure this out. But the cheat code is simple: Automate the manual bottlenecks, connect them directly to your database, and let the systems run in the background.`;
  let cta = `Comment "GROW" below and I will DM you the entire setup sheet for free!`;

  let thumbText = `Automate ${topic}`;
  let thumbConcept = `A high-contrast, premium close-up of a developer laptop showing a glowing neon purple database flowchart overlaying the background, deep shadows.`;
  let thumbEmotion = `Curiosity & Authority`;

  let instaCaption = `Are you still wasting hours on ${topic}? 🙅‍♂️\n\nI spent days troubleshooting the bottleneck so you don't have to. Here is the exact 3-step automation blueprint:\n\n1️⃣ Automate manual triggers\n2️⃣ Connect to active databases\n3️⃣ Run silently in the background\n\nSave this for later and share with a creator! ⚡\n\n#${topic.replace(/\s+/g, '')} #Automation #SaaS #Productivity #CreatorEconomy`;
  
  let linkedinPost = `Most people look at ${topic} completely wrong.

They believe scaling requires working 80-hour weeks.

But after studying high-performing creators, the truth is quite different:

1. Leveraged Systems > Hard Work
2. Automated Routing > Manual Processing
3. Active Elimination > Feature Bloat

The result? They build more with 90 minutes of focused effort than others do in a full workday.

Stop typing prompts manually. Start forging pipelines.

#BusinessSystems #AIAutomation #Productivity #Solopreneur #Scale`;

  // 2. Custom Category Overrides
  if (cleaned.includes('ai') || cleaned.includes('artificial') || cleaned.includes('gpt') || cleaned.includes('automation')) {
    reelTitle = `AI Automation Blueprint`;
    reelObjective = `Unlocking 10x leverage using low-code AI agents.`;
    targetAudience = `Tech founders and AI builders.`;
    bestPostingTime = `Wednesday 10:00 AM EST`;

    scene1Visual = `A fast, zoom-in shot of a sleek developer laptop. A terminal compiles code while a 3D AI logo glows softly in the corner of the screen. High energy sound sync.`;
    scene1Voice = `I built a custom AI agent that does 40 hours of admin work in 4 minutes. Here is the exact stack.`;
    scene1Text = `AI AGENT DOES 40 HOURS IN 4 MINUTES`;
    scene1Prompt = `Sleek dark laptop displaying terminal code compiling, a glowing neon purple 3D AI node floating in the corner, dark cybernetic theme, cinematic depth of field`;
    scene1Caption = `I automated 90% of my administrative overhead with this simple AI stack. 🤖`;

    scene2Visual = `Screenshare transition showing Make.com low-code webhooks connected to OpenAI API nodes. Glowing data packets route instantly.`;
    scene2Voice = `No coding, no developers, just standard low-code tools connected to a simple GPT api key.`;
    scene2Text = `NO CODING • NO DEVELOPERS`;
    scene2Prompt = `Make.com visual dashboard displaying webhooks routing data packets to OpenAI API nodes, sleek vector interface design, high resolution`;
    scene2Caption = `You don't need a engineering degree. Standard APIs do the heavy lifting.`;

    scene3Visual = `Close-up on a phone showing a Slack notification lighting up with processed customer contexts and automated email drafts ready to send.`;
    scene3Voice = `Step 1: Set up a webhook trigger. Step 2: Feed that input into an LLM prompt. Step 3: Write the finalized output straight to Notion or Slack.`;
    scene3Text = `WEBHOOK -> PROMPT -> DATABASE`;
    scene3Prompt = `Close up on a smartphone screen showing Slack notifications popping up with glowing client summaries, futuristic tech theme, soft lighting`;
    scene3Caption = `A simple Zapier / GPT / Notion DB pipeline runs 24/7.`;

    scene4Visual = `A high-contrast 3D flowchart visualization showing customer contexts routing and organizing themselves into database folders automatically.`;
    scene4Voice = `The AI reads customer inquiries, synthesizes context, drafts drafts, and queues them in your workspace.`;
    scene4Text = `AUTOMATED CONTEXT ROUTING`;
    scene4Prompt = `Abstract 3D database folders organizing themselves automatically, neon violet data streams, sleek render engine style, minimalistic dark theme`;
    scene4Caption = `The AI handles context categorization while you focus on scaling.`;

    scene5Voice = `Comment "AUTOMATE" below and I will send you the exact prompt and webhook templates for free!`;
    scene5Text = `COMMENT "AUTOMATE" FOR TEMPLATES`;
    scene5Prompt = `Friendly developer typing on keyboard and looking up at camera smiling, glowing workspace monitor in background, soft studio lighting`;
    scene5Caption = `Comment 🤖 and I will send the entire system prompts set straight to your DMs!`;

    hook = `I built a custom AI agent that does 40 hours of admin work in 4 minutes. Here is the exact stack.`;
    mainContent = `You don't need developers. Connect standard low-code tools like Zapier to OpenAI's API. Set a webhook trigger, feed context into the LLM prompt, and write the finalized outcome straight to your database.`;
    cta = `Comment "AUTOMATE" and I will DM you the entire prompt templates workspace for free!`;

    thumbText = `Build AI Agents`;
    thumbConcept = `A futuristic neon-lit developer office showing a glowing purple holographic brain hovering above the desk, cinematic shadows, 8k.`;
    thumbEmotion = `Awe & High Leverage`;

    instaCaption = `AI isn't going to replace you. But the person using AI will. 🤖\n\nI built an AI agent to handle all client CRM tasks in 4 minutes. Here is the exact stack:\n\n1️⃣ Trigger: New CRM Lead\n2️⃣ AI Step: Analyze pain points via GPT\n3️⃣ Outcome: Draft and queue response in Slack\n\nComment 'PROMPT' for the templates! 👇\n\n#AI #AITools #Automation #Workflow #Solopreneur`;

    linkedinPost = `AI isn’t a novelty anymore. It’s an operating system.

But 95% of businesses are still using it like a fancy search engine.

They ask ChatGPT to "write an email" instead of building a structured agent that reads CRM data, synthesizes context, drafts responses, and queues them for review.

If you are still copy-pasting text, you are missing the leverage. 

The real winners are building automated workflows that run silently in the background while they sleep.

Stop typing prompts manually. Start forging pipelines.

#AIAutomation #WorkflowDesign #BusinessSystems #FutureOfWork`;
  } else if (cleaned.includes('money') || cleaned.includes('passive') || cleaned.includes('finance') || cleaned.includes('sell') || cleaned.includes('sale')) {
    reelTitle = `High Margin Digital Assets`;
    reelObjective = `Scaling passive income streams using digital products.`;
    targetAudience = `Creators and solopreneurs looking for cashflow.`;
    bestPostingTime = `Thursday 12:00 PM EST`;

    scene1Visual = `A fast, split-screen frame cut showing a person clocking in at a corporate desk on one side, and a Gumroad sales dashboard scrolling through active payouts on the other.`;
    scene1Voice = `Traditional side hustles are dead for creators in 2026. Do this instead.`;
    scene1Text = `TRADITIONAL SIDE HUSTLES ARE DEAD`;
    scene1Prompt = `Corporate office desk with clocking card machine vs sleek Gumroad analytics dashboard showing passive sales notifications, high contrast, cinematic depth`;
    scene1Caption = `Stop exchanging hours for pennies. Build single high-leverage assets. 💸`;

    scene2Voice = `Instead of exchanging your hours for a boss's salary, package your everyday digital files into cashflow pipelines.`;
    scene2Text = `PACKAGE DIGITAL FILES FOR CASHFLOW`;
    scene2Prompt = `Elegant desk showing digital files, design templates, and notion boards floating above a screen, glowing neon green and gold accents`;
    scene2Caption = `Your everyday templates, spreadsheets, and files are actual assets.`;

    scene3Voice = `Spend 3 hours packaging your digital spreadsheets, notion templates, or design files, and list them on Gumroad.`;
    scene3Text = `BUILD • PACKAGE • LIST`;
    scene3Prompt = `Gumroad listing editor showing digital template upload, sleek dashboard vector interface, clean minimalistic branding`;
    scene3Caption = `Gumroad handles the checkout, delivery, and storage. You just drive traffic.`;

    scene4Voice = `A single digital asset runs at 98% profit margin. No inventory, no shipping, completely automated.`;
    scene4Text = `98% PROFIT MARGINS UNLOCKED`;
    scene4Prompt = `3D bar graphs showing 98% profit margins, neon green glowing metrics, sleek dark grid background, financial scale theme`;
    scene4Caption = `Digital assets require $0 inventory and run at near 100% net margins.`;

    scene5Voice = `Comment "CASHFLOW" and I will send you my top 5 digital assets you can build this weekend!`;
    scene5Text = `COMMENT "CASHFLOW" FOR THE LIST`;
    scene5Prompt = `Smiling digital creator giving thumbs up to camera, cozy high-end home office background, warm lighting`;
    scene5Caption = `Comment 💸 and I'll send my complete side-hustle starter checklist straight to your DMs!`;

    hook = `Traditional side hustles are dead for creators in 2026. Do this instead.`;
    mainContent = `Stop trading time for money. Package your everyday notion templates, spreadsheets, or design documents, and list them on Gumroad. A single asset has a 98% profit margin and sells while you sleep.`;
    cta = `Comment "CASHFLOW" and I will DM you my top 5 assets checklist for free!`;

    thumbText = `98% Profit Margin`;
    thumbConcept = `A sleek home office B-roll background with a premium glass card displaying a massive green sales metric in neon stroke, cinematic shadows.`;
    thumbEmotion = `Abundance & Financial Freedom`;

    instaCaption = `Stop trading hours for dollars. 💸\n\nBuild one leveraged digital asset and sell it while you sleep. High-margin digital products are the future.\n\nClick the link in my bio to download my beginner list! ⚡\n\n#PassiveIncome #DigitalProducts #Solopreneur #CreatorCapital`;

    linkedinPost = `High profit margins are the ultimate business cheat code.

Yet, most founders are obsessed with scaling revenue, even if it means hiring a massive team and shrinking margins to 10%.

Compare that to the modern Solopreneur Stack:
- Revenue: $15,000/month
- Expenses: $350/month (SaaS subscriptions)
- Headcount: 1 (You)
- Profit Margin: 97.6%

When you run an asset-light, highly automated business, you don't need a million-dollar seed round to succeed. You just need 500 loyal customers.

Focus on cashflow, high leverage, and extreme efficiency.

#Solopreneurship #BusinessMetrics #ProfitMargin #LeanStartup #Cashflow`;
  }

  // Create expected platform split
  const reelsSplit = Math.floor(35 + (cleaned.length % 10));
  const tiktokSplit = Math.floor(40 + ((cleaned.length * 2) % 10));
  const linkedinSplit = 100 - reelsSplit - tiktokSplit;

  // Expected metrics
  const viewsVal = Math.floor(55 + (trendScore * 1.6) + (cleaned.length % 8));
  const likesVal = Math.floor(viewsVal * 0.085);
  const sharesVal = Math.floor(likesVal * 0.16);

  const scenes: ReelScene[] = [
    {
      sceneNumber: 1,
      duration: "3s",
      visualDescription: scene1Visual,
      voiceoverText: scene1Voice,
      onScreenText: scene1Text,
      visualPrompt: scene1Prompt,
      autoCaption: scene1Caption
    },
    {
      sceneNumber: 2,
      duration: "10s",
      visualDescription: scene2Visual,
      voiceoverText: scene2Voice,
      onScreenText: scene2Text,
      visualPrompt: scene2Prompt,
      autoCaption: scene2Caption
    },
    {
      sceneNumber: 3,
      duration: "12s",
      visualDescription: scene3Visual,
      voiceoverText: scene3Voice,
      onScreenText: scene3Text,
      visualPrompt: scene3Prompt,
      autoCaption: scene3Caption
    },
    {
      sceneNumber: 4,
      duration: "10s",
      visualDescription: scene4Visual,
      voiceoverText: scene4Voice,
      onScreenText: scene4Text,
      visualPrompt: scene4Prompt,
      autoCaption: scene4Caption
    },
    {
      sceneNumber: 5,
      duration: "5s",
      visualDescription: scene5Visual,
      voiceoverText: scene5Voice,
      onScreenText: scene5Text,
      visualPrompt: scene5Prompt,
      autoCaption: scene5Caption
    }
  ];

  return {
    topic,
    trendScore,
    viralityScore,
    platformSplit: {
      reels: reelsSplit,
      tiktok: tiktokSplit,
      linkedin: linkedinSplit
    },
    concept: {
      title: reelTitle,
      objective: reelObjective,
      targetAudience
    },
    scenes,
    voiceoverScript: {
      hook,
      mainContent,
      cta
    },
    thumbnail: {
      text: thumbText,
      concept: thumbConcept,
      emotionTrigger: thumbEmotion
    },
    publishingPackage: {
      instagramCaption: instaCaption,
      linkedinPost,
      hashtags: `#${topic.replace(/\s+/g, '')} #ReelStudio #ViralContent #CreativeAgency #WorkflowDesign`,
      cta: cta,
      bestPostingTime
    },
    expectedMetrics: {
      views: `${viewsVal}K`,
      likes: `${likesVal.toFixed(1)}K`,
      shares: `${sharesVal.toFixed(0)}`,
      engagement: `${((likesVal + sharesVal / 10) / viewsVal * 100).toFixed(1)}%`
    }
  };
}
