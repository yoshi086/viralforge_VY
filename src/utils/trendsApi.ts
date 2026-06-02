export interface TrendChartPoint {
  name: string;
  growth: number;
  interest: number;
  virality: number;
  engagement: number;
}

export interface TrendOpportunity {
  reelIdeas: string[];
  viralHooks: string[];
  linkedinPostIdeas: string[];
  hashtags: string[];
  recommendedCta: string;
}

export interface TrendAnalysis {
  whyTrending: string;
  audienceDemographics: string;
  contentOpportunities: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  bestPlatform: string;
  bestPostingTime: string;
}

export interface TrendItem {
  id: string;
  topic: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Business' | 'Finance' | 'Creator Economy';
  trendScore: number;
  growthVelocity: number;
  viralityPotential: number;
  sentimentScore: number;
  audienceInterest: number;
  momentum: 'Exploding' | 'Rising' | 'Growing' | 'Declining';
  confidence: number;
  forecast24h: number;
  forecast7d: number;
  forecast30d: number;
  analysis: TrendAnalysis;
  recommendations: TrendOpportunity;
  chartPoints: TrendChartPoint[];
}

// Template array to seed 53 hyper-realistic, diverse trends
const SEED_TEMPLATES = [
  // AI Category
  { topic: 'Multi-Agent Autonomous AI Workflows', category: 'AI' as const, momentum: 'Exploding' as const, platform: 'LinkedIn', format: 'Technical breakdown slideshow' },
  { topic: 'Local LLMs on Consumer Hardware', category: 'AI' as const, momentum: 'Rising' as const, platform: 'YouTube', format: 'Benchmarking screenshare video' },
  { topic: 'AI-Generated Voice Synthesis in Podcasts', category: 'AI' as const, momentum: 'Growing' as const, platform: 'TikTok', format: 'Side-by-side audiotrack comparisons' },
  { topic: 'Vector Databases & Retrieval Augmented Generation', category: 'AI' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'SaaS architecture mapping' },
  { topic: 'Zero-Code AI Micro-Agent Orchestration', category: 'AI' as const, momentum: 'Exploding' as const, platform: 'Instagram Reels', format: '15s setup screen speedruns' },
  { topic: 'Cognitive LLM Wrappers for CRM Pipelines', category: 'AI' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'Lead qualification checklists' },
  { topic: 'Decentralized Open-Source AI Fine-Tuning', category: 'AI' as const, momentum: 'Growing' as const, platform: 'YouTube', format: 'Colab notebook walkthrough guide' },
  { topic: 'Synthetic Training Datasets for Small Models', category: 'AI' as const, momentum: 'Declining' as const, platform: 'LinkedIn', format: 'Data density comparators' },
  { topic: 'AI Copilots Inside IDE Code Editors', category: 'AI' as const, momentum: 'Growing' as const, platform: 'YouTube', format: 'Live debugging speed test' },
  
  // Technology Category
  { topic: 'Decentralized Edge GPU Computing Networks', category: 'Technology' as const, momentum: 'Exploding' as const, platform: 'X / Twitter', format: 'Server node setup guide' },
  { topic: 'Quantum Computing Simulators in Web Browsers', category: 'Technology' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'Algorithmic code snapshots' },
  { topic: 'Spatial Computing UI/UX Design Protocols', category: 'Technology' as const, momentum: 'Growing' as const, platform: 'Instagram Reels', format: 'Sleek interface hover zooms' },
  { topic: 'Low-Latency WebRTC Video Streaming APIs', category: 'Technology' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'SaaS latency scorecard curves' },
  { topic: 'WebAssembly (WASM) for Serverless Backends', category: 'Technology' as const, momentum: 'Exploding' as const, platform: 'LinkedIn', format: 'Benchmark compile charts' },
  { topic: 'Biomimetic Hardware & Neural Synapse Interfaces', category: 'Technology' as const, momentum: 'Declining' as const, platform: 'YouTube', format: 'Conceptual 3D motion animations' },
  { topic: 'Decentralized Identity Verification Cryptography', category: 'Technology' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'Security protocol audits block' },
  { topic: 'Solid-State Battery Chemistry for Mobiles', category: 'Technology' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Energy density line curves' },
  { topic: 'Rust Web Frameworks & Actix-Web Speedruns', category: 'Technology' as const, momentum: 'Exploding' as const, platform: 'YouTube', format: 'HTTP routing compile benchmarks' },
  
  // Startups Category
  { topic: 'Solopreneur $10k/mo Micro-SaaS Blueprints', category: 'Startups' as const, momentum: 'Exploding' as const, platform: 'LinkedIn', format: 'Zero employee workspace stacks' },
  { topic: 'Lean Bootstrapping with Stripe API Ecosystems', category: 'Startups' as const, momentum: 'Rising' as const, platform: 'X / Twitter', format: 'Stripe balance dashboard screenshots' },
  { topic: 'Equity Crowdfunding Platforms for Web Assets', category: 'Startups' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Portfolio cap table spreadsheets' },
  { topic: 'Async-Only Remote Work Startup Management', category: 'Startups' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Notion wiki template guides' },
  { topic: 'B2B Micro-Asset Acquisition Networks', category: 'Startups' as const, momentum: 'Exploding' as const, platform: 'LinkedIn', format: 'Valuation multiple calculators' },
  { topic: 'Subscription-Based Content Design Agency Models', category: 'Startups' as const, momentum: 'Rising' as const, platform: 'Instagram Reels', format: 'Aesthetic canvas transitions' },
  { topic: 'Micro-Consulting DMs Lead Generation Funnels', category: 'Startups' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Cold outreach webhook pipelines' },
  { topic: 'Zero-Capital SaaS Scaling Checklists', category: 'Startups' as const, momentum: 'Exploding' as const, platform: 'Instagram Reels', format: '3-step setup guide text overlays' },
  { topic: 'Automated Cold Email Pitching Systems', category: 'Startups' as const, momentum: 'Declining' as const, platform: 'LinkedIn', format: 'Spam filter checklist sheets' },
  
  // Business Category
  { topic: 'Andrew Huberman-Backed 90-Min Focus Blocks', category: 'Business' as const, momentum: 'Exploding' as const, platform: 'Instagram Reels', format: 'Morning sunlight desk layouts' },
  { topic: 'Asynchronous Collaboration Tools Over Meetings', category: 'Business' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'Slack workflow sync guidelines' },
  { topic: 'Fractional Executive Leadership Services', category: 'Business' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Advisory contract spreadsheets' },
  { topic: 'Corporate Carbon Tax Accounting SaaS', category: 'Business' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Emissions auditing scorecards' },
  { topic: 'Digital Wellness Protocols in Tech Hubs', category: 'Business' as const, momentum: 'Rising' as const, platform: 'TikTok', format: 'Desk setups & workspace decors' },
  { topic: 'Asymmetric Business Leverage Stacks', category: 'Business' as const, momentum: 'Exploding' as const, platform: 'LinkedIn', format: 'SaaS tool interconnect timeline paths' },
  { topic: 'Continuous Integration Deployments for B2B', category: 'Business' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Vite build speed logs' },
  { topic: 'Traditional Corporate Office Space Downsizing', category: 'Business' as const, momentum: 'Declining' as const, platform: 'LinkedIn', format: 'Commercial lease line graphs' },
  { topic: 'Micro-Meeting 15-Minute Daily Standups', category: 'Business' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Time limit checklist protocols' },
  
  // Finance Category
  { topic: 'Passive Income Digital Gumroad Asset Funnels', category: 'Finance' as const, momentum: 'Exploding' as const, platform: 'Instagram Reels', format: 'Gumroad payment sync notifications' },
  { topic: 'High-Yield Treasury Yields Optimization Stacks', category: 'Finance' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'APY comparison sheets' },
  { topic: 'Decentralized Finance Liquidity Pools', category: 'Finance' as const, momentum: 'Growing' as const, platform: 'YouTube', format: 'Metamask setup screenshares' },
  { topic: 'Automated Personal Tax Auditing Software', category: 'Finance' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Deductions checklist files' },
  { topic: 'Micro-Investing Fractional Real Estate Shares', category: 'Finance' as const, momentum: 'Rising' as const, platform: 'Instagram Reels', format: 'App interface dashboard animations' },
  { topic: 'Asymmetric Risk Cryptocurrencies Portfolios', category: 'Finance' as const, momentum: 'Declining' as const, platform: 'YouTube', format: 'Price charts technical patterns' },
  { topic: 'Subscription Software Balance Sheet Tracking', category: 'Finance' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Cost-saving metrics calculators' },
  { topic: 'Automated Invoice Factoring Protocols', category: 'Finance' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'Cashflow multiplier line curves' },
  { topic: 'Zero-Fee Cross-Border Digital Stablecoins', category: 'Finance' as const, momentum: 'Exploding' as const, platform: 'X / Twitter', format: 'Wallet swap step walkthroughs' },
  
  // Creator Economy Category
  { topic: 'Visual Silent Hook Loops in Reels', category: 'Creator Economy' as const, momentum: 'Exploding' as const, platform: 'Instagram Reels', format: 'Silent split-screen zoom interrupt video' },
  { topic: 'Silent Vlogging & Aesthetic Studio Setups', category: 'Creator Economy' as const, momentum: 'Rising' as const, platform: 'TikTok', format: 'Desk keyboard clacking sounds ASMR' },
  { topic: 'Newsletter-First Solopreneur Sponsorship Models', category: 'Creator Economy' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'Subscriber growth Area curves' },
  { topic: 'Short-Form Video Timeline Stepper Scripts', category: 'Creator Economy' as const, momentum: 'Exploding' as const, platform: 'YouTube', format: 'Chronological timeline guides overlays' },
  { topic: 'Creator-Led Cohort Courses Communities', category: 'Creator Economy' as const, momentum: 'Rising' as const, platform: 'LinkedIn', format: 'Curriculum layout checklists' },
  { topic: 'AI Voice Cloning for Multilingual Content', category: 'Creator Economy' as const, momentum: 'Growing' as const, platform: 'TikTok', format: 'Direct audio translation clips' },
  { topic: 'Custom Browser Extensions as Lead Magnets', category: 'Creator Economy' as const, momentum: 'Exploding' as const, platform: 'LinkedIn', format: 'Chrome store speedrun installs' },
  { topic: 'Subscription Newsletter Cap Table Valuation', category: 'Creator Economy' as const, momentum: 'Growing' as const, platform: 'LinkedIn', format: 'LTV/CAC calculator models' },
  { topic: 'Silent B-Roll Video Loops with Caption Prompts', category: 'Creator Economy' as const, momentum: 'Growing' as const, platform: 'Instagram Reels', format: 'Coffee pouring cinematic edits' }
];

// Generates the comprehensive database of 53 trends programmatically
export const seedTrendsDatabase = (): TrendItem[] => {
  return SEED_TEMPLATES.map((tpl, idx) => {
    const id = `trend-${idx + 1}`;
    
    // Deterministic random scores to maintain realistic distributions
    const trendScore = Math.min(99, Math.max(65, 74 + (idx % 22)));
    const growthVelocity = 110 + (idx % 8) * 50 + (idx * 3) % 40;
    const viralityPotential = Math.min(98, Math.max(70, 72 + (idx % 24)));
    const sentimentScore = Math.min(98, Math.max(55, 65 + (idx % 29)));
    const audienceInterest = Math.min(99, Math.max(68, 70 + (idx % 26)));
    const confidence = Math.min(99, Math.max(78, 80 + (idx % 18)));
    
    // Multi-timeline forecasting parameters
    const forecast24h = Math.min(99, Math.max(50, trendScore + (idx % 5) - 2));
    const forecast7d = Math.min(99, Math.max(50, trendScore + (idx % 7) * 2 - 5));
    const forecast30d = Math.min(99, Math.max(50, trendScore + (idx % 9) * 3 - 10));

    // Dynamic Chart Points (Search interest, engagement, curves)
    const chartPoints: TrendChartPoint[] = Array.from({ length: 7 }).map((_, i) => {
      const name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
      const factor = (i + 1) / 7;
      return {
        name,
        growth: Math.round(trendScore * 0.7 * factor + (idx % 10) * 2),
        interest: Math.round(audienceInterest * 0.8 * factor + (idx % 8) * 1.5),
        virality: Math.round(viralityPotential * 0.75 * factor + (idx % 6) * 2.5),
        engagement: Math.round(sentimentScore * 0.65 * factor + (idx % 12) * 1.2)
      };
    });

    const riskLevel = idx % 5 === 0 ? 'High' : idx % 5 === 2 ? 'Medium' : ('Low' as const);
    const bestPostingTime = idx % 2 === 0 ? '09:00 AM EST' : '03:00 PM EST';

    return {
      id,
      topic: tpl.topic,
      category: tpl.category,
      trendScore,
      growthVelocity,
      viralityPotential,
      sentimentScore,
      audienceInterest,
      momentum: tpl.momentum,
      confidence,
      forecast24h,
      forecast7d,
      forecast30d,
      analysis: {
        whyTrending: `The massive rise in search intensity and engagement is driven by a convergence of technological breakthroughs in open-source systems, paired with B2B operators demanding scalable, low-cost async frameworks to reduce operational inefficiencies in 2026.`,
        audienceDemographics: `74% Solopreneurs, Creators, Founders, and Growth Hackers seeking asymmetric leverage models in the ${tpl.category} sector.`,
        contentOpportunities: `Excellent opportunity to compose high-retention cinematic screenshares, B-roll text overlays, process checklists, and zero-employee automation diagrams.`,
        riskLevel,
        bestPlatform: tpl.platform,
        bestPostingTime
      },
      recommendations: {
        reelIdeas: [
          `"I built a custom workflow for ${tpl.topic} in 3 minutes. Here is the cheat code."`,
          `"Stop wasting hours on manual task updates. Do this for ${tpl.category} instead."`,
          `"The exact zero-employee stack I use to run operations."`,
          `"3 automated micro-assets you can build this weekend."`,
          `"Why B2B solopreneurs are abandoning standard sync meetings."`
        ],
        viralHooks: [
          `"They do not want you to know the truth about ${tpl.topic}..."`,
          `"Stop scrolling! If you care about ${tpl.category}, read this."`,
          `"I did 40 hours of B2B admin work in 4 minutes. Here is the stack."`,
          `"The scientific reason why your current ${tpl.category} workflows are failing."`,
          `"Why traditional ${tpl.category} business models are officially dead."`
        ],
        linkedinPostIdeas: [
          `Most professionals are looking at ${tpl.topic} completely backward. They think it requires scaling headcount. But modern Solopreneur stacks prove it requires scaling automated pipelines. Here is the metric comparison...`,
          `We audited B2B operational bottlenecks inside 40 lean startups. The redudancies were staggering. We automated 90% of them using simple database hooks. Here is the exact stack...`,
          `The zero-employee model is no longer a sandbox theory. It is a highly dominant B2B architecture. If you are not building leveraged assets while you sleep, you are leaking margins. Here is how to configure it today...`
        ],
        hashtags: [
          `#${tpl.category.replace(/\s+/g, '')}Intelligence`,
          `#${tpl.topic.replace(/\s+/g, '')}`,
          '#WorkflowAutomation',
          '#ProcessDesign',
          '#LeanSolopreneur',
          '#AsymmetricLeverage',
          '#FutureOfWork',
          '#SystemBuilding',
          '#SaaSAutomation',
          '#ViralForge'
        ],
        recommendedCta: `Comment "${tpl.category.toUpperCase()}" below and I will DM you the entire workspace blueprint for free! ⚡`
      },
      chartPoints
    };
  });
};

export const MOCK_TRENDS_DB = seedTrendsDatabase();

// REST API Request / Response Simulation helper
export const fetchTrendsApi = async (url: string): Promise<any> => {
  // Simulate active HTTP latency (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  if (pathname === '/api/trends/top') {
    // Return Top 10 sorted by score
    return [...MOCK_TRENDS_DB]
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 10);
  }

  if (pathname === '/api/trends/search') {
    const q = searchParams.get('q')?.toLowerCase() || '';
    const cat = searchParams.get('category') || '';
    
    let filtered = [...MOCK_TRENDS_DB];
    if (q) {
      filtered = filtered.filter(t => t.topic.toLowerCase().includes(q));
    }
    if (cat && cat !== 'All') {
      filtered = filtered.filter(t => t.category === cat);
    }
    
    return filtered;
  }

  if (pathname === '/api/trends/predict') {
    const id = searchParams.get('id') || '';
    const item = MOCK_TRENDS_DB.find(t => t.id === id);
    if (!item) return { error: 'Trend not found' };
    return {
      id: item.id,
      forecast24h: item.forecast24h,
      forecast7d: item.forecast7d,
      forecast30d: item.forecast30d,
      confidence: item.confidence
    };
  }

  if (pathname === '/api/trends/recommendations') {
    const id = searchParams.get('id') || '';
    const item = MOCK_TRENDS_DB.find(t => t.id === id);
    if (!item) return { error: 'Trend not found' };
    return item.recommendations;
  }

  // Base GET /api/trends: returns full seeded list with optional filters
  const cat = searchParams.get('category') || '';
  let data = [...MOCK_TRENDS_DB];
  if (cat && cat !== 'All') {
    data = data.filter(t => t.category === cat);
  }
  return data;
};
