export interface GeneratedContent {
  topic: string;
  trendScore: number;
  viralityScore: number;
  platformSplit: {
    reels: number;
    tiktok: number;
    linkedin: number;
  };
  script: {
    hook: string;
    story: string;
    cta: string;
  };
  captions: {
    punchy: string;
    storytelling: string;
    question: string;
  };
  linkedinPost: string;
  expectedMetrics: {
    views: string;
    likes: string;
    shares: string;
    engagement: string;
  };
}

export function generateContentForTopic(topic: string): GeneratedContent {
  const cleaned = topic.trim().toLowerCase();
  
  // Calculate deterministic scores based on string length and content to feel real but dynamic
  let scoreBase = Math.floor(70 + (cleaned.length % 20));
  if (cleaned.includes('ai') || cleaned.includes('artificial') || cleaned.includes('gpt') || cleaned.includes('automation')) {
    scoreBase += 8;
  }
  if (cleaned.includes('money') || cleaned.includes('rich') || cleaned.includes('passive') || cleaned.includes('dollar') || cleaned.includes('stack')) {
    scoreBase += 6;
  }
  if (cleaned.includes('hack') || cleaned.includes('secret') || cleaned.includes('mistake') || cleaned.includes('stop')) {
    scoreBase += 4;
  }
  const trendScore = Math.min(99, Math.max(72, scoreBase));
  const viralityScore = Math.min(98, Math.max(70, scoreBase - 3 + (cleaned.length % 7)));

  // Define default values
  let hook = `This is the absolute biggest mistake people are making with ${topic || 'this topic'} in 2026.`;
  let story = `Most people spend hours trying to figure this out, but the solution is actually incredibly simple. Step 1: Stop repeating old habits. Step 2: Implement a highly streamlined workflow. Step 3: Let automation handle the bulk of the manual processes. By doing this, you save nearly 20 hours a week.`;
  let cta = `Drop a ⚡ in the comments below, and I will DM you my complete setup checklist for free!`;

  let punchy = `Stop wasting time on this. 🙅‍♂️\n\nHere is how to solve ${topic || 'your biggest bottleneck'} in 3 steps.\n\nSave this for later and share with a creator! ⚡\n\n#${topic.replace(/\s+/g, '')} #ProductivityHacks #CreatorEconomy #ViralForge`;
  let storytelling = `I spent 45 hours researching ${topic || 'this strategy'} so that you do not have to. 🧵\n\nWhen I first started, I was completely overwhelmed. But once I realized the secret, everything clicked. The key is in the leverage. Focus only on high-impact levers and delegate the rest.\n\nRead the full script and try it today. 🔥\n\n#SuccessMindset #Automation #Workflow #WorkflowOptimization`;
  let question = `What is your biggest roadblock when it comes to ${topic || 'your current goals'}? 🤔\n\nI am answering every single comment today. Let us discuss below! 👇\n\n#QandA #Community #CreatorMindset #ForgeAhead`;

  let linkedinPost = `Most people are looking at ${topic || 'this sector'} completely wrong.

Let me explain.

We have been conditioned to believe that success requires working 80-hour weeks. But after studying high-performing creators, the truth is quite different:

1. Leveraged Systems > Hard Work
2. Process Documentation > Raw Intelligence
3. Active Elimination > Feature Bloat

The result? They build more with 90 minutes of focused effort than others do in a full workday.

What is your current system for optimizing this? Let me know in the comments below.

#BusinessSystems #Solopreneur #AIAutomation #Productivity #Scale`;

  // Keywords customizers
  if (cleaned.includes('ai') || cleaned.includes('artificial') || cleaned.includes('gpt') || cleaned.includes('bot') || cleaned.includes('automation')) {
    hook = `I built a custom AI agent that does 40 hours of admin work in 4 minutes. Here is the exact stack.`;
    story = `First, I fed a simple API key into a low-code database wrapper. Next, I wrote a system prompt instructing the model to fetch and categorize incoming client emails automatically. Lastly, I connected it directly to Slack. The total build time was under 15 minutes, and it has already saved me an entire workweek.`;
    cta = `Want the exact prompt templates? Comment "AUTOMATE" below and I'll send them straight to your inbox! 🤖`;
    
    punchy = `Stop doing manual work. 🤖\n\nI built an AI agent to handle all my client CRM tasks in 4 minutes. Here is the stack:\n1. Zapier / Make\n2. OpenAI API\n3. Notion DB\n\nComment 'PROMPT' for the templates! 👇\n\n#AITools #Automation #Workflow #Solopreneur`;
    storytelling = `AI isn't going to replace you. But the person using AI will. 🧵\n\nLast month, I was drowning in administrative spreadsheets and client emails. I decided enough was enough and spent one Sunday building a custom pipeline.\n\nThe results? 90% of my administrative overhead was automated instantly. I spent my week writing, creating, and scaling instead.\n\nHere is how you can do it too...\n\n#ArtificialIntelligence #WorkflowDesign #NoCode #StartupScaler`;
    question = `What manual task in your business is stealing the most of your time? 🕰️\n\nLet me know in the comments and I will tell you which AI tool can automate it in under 10 minutes! 👇\n\n#AIAutomation #BusinessScale #ManagerHacks`;
    
    linkedinPost = `AI isn’t a novelty anymore. It’s an operating system.

But 95% of businesses are still using it like a fancy search engine.

They ask ChatGPT to "write an email" instead of building a structured agent that reads CRM data, synthesizes context, drafts responses, and queues them for human review.

If you are still copy-pasting text, you are missing the leverage. 

The real winners are building automated workflows that run silently in the background while they sleep.

Here is the 3-step automation stack we set up for clients:
1. Trigger: A new contact is added to HubSpot.
2. AI step: Analyze contact website & LinkedIn via API to extract pain points.
3. Outcome: Feed custom variables into Slack to prepare personalized outreach.

Cost: $0.12 per lead. Time saved: 20 minutes per lead.

Stop typing prompts manually. Start forging pipelines.

#AIAutomation #WorkflowDesign #BusinessSystems #FutureOfWork`;
  } else if (cleaned.includes('money') || cleaned.includes('crypto') || cleaned.includes('passive') || cleaned.includes('financial') || cleaned.includes('finance') || cleaned.includes('stack') || cleaned.includes('rich') || cleaned.includes('sale') || cleaned.includes('sell')) {
    hook = `Do not start a business in 2026. Build a single cashflow pipeline instead.`;
    story = `Traditional businesses require inventory, office space, and employees. High-leverage cashflow models require a laptop, three subscription tools, and an organic traffic funnel. By focusing strictly on micro-consulting or template sales, you operating at 95% profit margins.`;
    cta = `Comment "CASHFLOW" and I'll send you my top 5 micro-assets you can build this weekend! 💸`;

    punchy = `Stop exchanging time for money. 💸\n\nBuild one leveraged asset and sell it while you sleep. High-margin digital products are the future.\n\nClick the link in bio to download my beginner list! ⚡\n\n#PassiveIncome #DigitalProducts #Solopreneur #CreatorCapital`;
    storytelling = `I went from flat broke to a $10,000/month digital assets portfolio. 📈\n\nThe pivot was simple: I stopped selling hours and started building systems. I packaged my everyday spreadsheets, notion boards, and design files and listed them on platforms like Gumroad.\n\nNow, my systems do the selling, processing, and delivery for me.\n\n#FinancialFreedom #CreatorEconomy #SideHustleIdeas #AssetBuilding`;
    question = `If you could make an extra $1,000/month in passive income, what asset would you build first? 👇\n\nLet's brainstorm in the comments!\n\n#SideHustle #MoneyMindset #Assets`;

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
  } else if (cleaned.includes('fitness') || cleaned.includes('gym') || cleaned.includes('health') || cleaned.includes('eat') || cleaned.includes('sleep') || cleaned.includes('diet')) {
    hook = `The absolute biggest fitness lie you have been told is that you need 2 hours in the gym.`;
    story = `Science shows that 90% of muscle hypertrophy and cardiorespiratory health is unlocked in the first 45 minutes of active resistance. Over-training leads to elevated cortisol, sleep disruptions, and system crashes. Keep it intense, keep it short, and focus on nutrition.`;
    cta = `Drop a 🏃‍♂️ below, and I'll send you my 30-minute high-density protocol!`;

    punchy = `45 minutes > 2 hours in the gym. 🏋️‍♂️\n\nOptimize for high intensity and low resting intervals. Consistency is your only metric.\n\nSave this and crush your next session! ⚡\n\n#FitnessTips #GymMotivation #HighDensityTraining #Biohacking`;
    storytelling = `I completely transformed my physical health in exactly 12 weeks. ⚡\n\nI didn't starve myself, and I didn't spend hours on a treadmill. I focused on three variables: sleeping 7.5 hours per night, drinking 3.5 liters of water, and doing compound lifting exercises 3 times a week.\n\nSimplicity outlasts complexity every single time.\n\n#HealthJourney #Biohacking #ConsistencyCode #GymMotivation`;
    question = `What is holding you back most from achieving your health and fitness goals? 🤷‍♂️\n\nLet's troubleshoot it in the comments together! 👇\n\n#FitnessCommunity #GoalSetting #HealthIsWealth`;

    linkedinPost = `Peak professional performance starts with physical health.

It’s impossible to write creative copy, lead a team, or build high-value software when your body is running on 4 hours of sleep and processed sugar.

Your brain is a biological engine. 

If you want elite output, you have to feed it elite input:

1. The Sleep Protocol: 7-8 hours of dark, cool room recovery.
2. The Hydration Routine: 1 liter of mineralized water before checking your phone.
3. The Movement Habit: A 10-minute sunlight walk immediately after waking up.

Stop looking for the next productivity hack. Go drink a glass of water and get outside.

#Biohacking #ExecutiveHealth #ProductivitySystem #PeakPerformance #WorkLifeBalance`;
  } else if (cleaned.includes('productivity') || cleaned.includes('work') || cleaned.includes('focus') || cleaned.includes('schedule') || cleaned.includes('habit') || cleaned.includes('time')) {
    hook = `Stop using the Pomodoro method. It is actually ruining your deep focus.`;
    story = `Your brain takes 23 minutes to enter a state of flow after a distraction. Interrupted focus blocks prevent your prefrontal cortex from doing heavy-duty creative work. Switch to 90-minute hyper-focus blocks, then take a full 15-minute screen-free break.`;
    cta = `Comment "FOCUS" and I'll send you my custom Notion Calendar block schedule for free! 🗓️`;

    punchy = `Throw away your 25-minute timer. ⏱️\n\nSwitch to 90-minute hyper-focus blocks. Real flow takes time to activate.\n\nSave this post to optimize your desk today! ⚡\n\n#ProductivityTips #DeepWork #FlowState #CreatorHacks`;
    storytelling = `I used to work 12 hours a day and got absolutely nothing done. 🧵\n\nI was constantly checking Slack, answering notifications, and jumping between tasks. I was busy, but I wasn't productive. I realized I had to build a digital fortress. I turned off all notifications and scheduled two 90-minute blocks of uninterrupted creative focus.\n\nNow, I do in 3 hours what used to take me a full day.\n\n#TimeManagement #WorkflowHacks #DeepWork #ProductiveLife`;
    question = `How many hours of uninterrupted deep focus do you get in an average workday? 🤷‍♂️\n\nBe honest! Let us talk in the comments below. 👇\n\n#WorkHabits #DeepFocus #FocusEconomy`;

    linkedinPost = `Being "busy" is a form of laziness.

It is lazy thinking. It's much easier to clear your inbox and attend useless sync meetings than it is to sit in isolation and solve a complex problem.

Elite creators do not work 80 hours a week. They work 4 hours a week with 20x the concentration of average workers.

They accomplish this by ruthlessly guarding their calendar:
- Zero notifications turned on by default.
- Asynchronous communication for 95% of tasks.
- Dedicated "maker" days (uninterrupted creation) vs "manager" days (meetings).

If you want high-quality output, you must protect your high-quality input time.

#Productivity #TimeManagement #DeepWork #CreatorEconomy #WorkCulture`;
  }

  // Create expected platform split
  const reelsSplit = Math.floor(30 + (cleaned.length % 15));
  const tiktokSplit = Math.floor(35 + ((cleaned.length * 3) % 15));
  const linkedinSplit = 100 - reelsSplit - tiktokSplit;

  // Expected metrics
  const viewsVal = Math.floor(50 + (trendScore * 1.5) + (cleaned.length % 10));
  const likesVal = Math.floor(viewsVal * 0.08);
  const sharesVal = Math.floor(likesVal * 0.15);

  return {
    topic,
    trendScore,
    viralityScore,
    platformSplit: {
      reels: reelsSplit,
      tiktok: tiktokSplit,
      linkedin: linkedinSplit
    },
    script: {
      hook,
      story,
      cta
    },
    captions: {
      punchy,
      storytelling,
      question
    },
    linkedinPost,
    expectedMetrics: {
      views: `${viewsVal}K`,
      likes: `${likesVal.toFixed(1)}K`,
      shares: `${sharesVal.toFixed(0)}`,
      engagement: `${((likesVal + sharesVal / 10) / viewsVal * 100).toFixed(1)}%`
    }
  };
}
