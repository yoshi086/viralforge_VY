import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Programmatic mock database inside vite.config.ts for real HTTP REST queries
const MOCK_TOPICS = [
  { topic: 'Multi-Agent Autonomous AI Workflows', category: 'AI', momentum: 'Exploding', platform: 'LinkedIn' },
  { topic: 'Local LLMs on Consumer Hardware', category: 'AI', momentum: 'Rising', platform: 'YouTube' },
  { topic: 'AI-Generated Voice Synthesis in Podcasts', category: 'AI', momentum: 'Growing', platform: 'TikTok' },
  { topic: 'Vector Databases & Retrieval Augmented Generation', category: 'AI', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Zero-Code AI Micro-Agent Orchestration', category: 'AI', momentum: 'Exploding', platform: 'Instagram Reels' },
  { topic: 'Cognitive LLM Wrappers for CRM Pipelines', category: 'AI', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'Decentralized Open-Source AI Fine-Tuning', category: 'AI', momentum: 'Growing', platform: 'YouTube' },
  { topic: 'Synthetic Training Datasets for Small Models', category: 'AI', momentum: 'Declining', platform: 'LinkedIn' },
  { topic: 'AI Copilots Inside IDE Code Editors', category: 'AI', momentum: 'Growing', platform: 'YouTube' },
  
  { topic: 'Decentralized Edge GPU Computing Networks', category: 'Technology', momentum: 'Exploding', platform: 'X / Twitter' },
  { topic: 'Quantum Computing Simulators in Web Browsers', category: 'Technology', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'Spatial Computing UI/UX Design Protocols', category: 'Technology', momentum: 'Growing', platform: 'Instagram Reels' },
  { topic: 'Low-Latency WebRTC Video Streaming APIs', category: 'Technology', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'WebAssembly (WASM) for Serverless Backends', category: 'Technology', momentum: 'Exploding', platform: 'LinkedIn' },
  { topic: 'Biomimetic Hardware & Neural Synapse Interfaces', category: 'Technology', momentum: 'Declining', platform: 'YouTube' },
  { topic: 'Decentralized Identity Verification Cryptography', category: 'Technology', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'Solid-State Battery Chemistry for Mobiles', category: 'Technology', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Rust Web Frameworks & Actix-Web Speedruns', category: 'Technology', momentum: 'Exploding', platform: 'YouTube' },
  
  { topic: 'Solopreneur $10k/mo Micro-SaaS Blueprints', category: 'Startups', momentum: 'Exploding', platform: 'LinkedIn' },
  { topic: 'Lean Bootstrapping with Stripe API Ecosystems', category: 'Startups', momentum: 'Rising', platform: 'X / Twitter' },
  { topic: 'Equity Crowdfunding Platforms for Web Assets', category: 'Startups', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Async-Only Remote Work Startup Management', category: 'Startups', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'B2B Micro-Asset Acquisition Networks', category: 'Startups', momentum: 'Exploding', platform: 'LinkedIn' },
  { topic: 'Subscription-Based Content Design Agency Models', category: 'Startups', momentum: 'Rising', platform: 'Instagram Reels' },
  { topic: 'Micro-Consulting DMs Lead Generation Funnels', category: 'Startups', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Zero-Capital SaaS Scaling Checklists', category: 'Startups', momentum: 'Exploding', platform: 'Instagram Reels' },
  { topic: 'Automated Cold Email Pitching Systems', category: 'Startups', momentum: 'Declining', platform: 'LinkedIn' },
  
  { topic: 'Andrew Huberman-Backed 90-Min Focus Blocks', category: 'Business', momentum: 'Exploding', platform: 'Instagram Reels' },
  { topic: 'Asynchronous Collaboration Tools Over Meetings', category: 'Business', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'Fractional Executive Leadership Services', category: 'Business', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Corporate Carbon Tax Accounting SaaS', category: 'Business', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Digital Wellness Protocols in Tech Hubs', category: 'Business', momentum: 'Rising', platform: 'TikTok' },
  { topic: 'Asymmetric Business Leverage Stacks', category: 'Business', momentum: 'Exploding', platform: 'LinkedIn' },
  { topic: 'Continuous Integration Deployments for B2B', category: 'Business', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Traditional Corporate Office Space Downsizing', category: 'Business', momentum: 'Declining', platform: 'LinkedIn' },
  { topic: 'Micro-Meeting 15-Minute Daily Standups', category: 'Business', momentum: 'Growing', platform: 'LinkedIn' },
  
  { topic: 'Passive Income Digital Gumroad Asset Funnels', category: 'Finance', momentum: 'Exploding', platform: 'Instagram Reels' },
  { topic: 'High-Yield Treasury Yields Optimization Stacks', category: 'Finance', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'Decentralized Finance Liquidity Pools', category: 'Finance', momentum: 'Growing', platform: 'YouTube' },
  { topic: 'Automated Personal Tax Auditing Software', category: 'Finance', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Micro-Investing Fractional Real Estate Shares', category: 'Finance', momentum: 'Rising', platform: 'Instagram Reels' },
  { topic: 'Asymmetric Risk Cryptocurrencies Portfolios', category: 'Finance', momentum: 'Declining', platform: 'YouTube' },
  { topic: 'Subscription Software Balance Sheet Tracking', category: 'Finance', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Automated Invoice Factoring Protocols', category: 'Finance', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'Zero-Fee Cross-Border Digital Stablecoins', category: 'Finance', momentum: 'Exploding', platform: 'X / Twitter' },
  
  { topic: 'Visual Silent Hook Loops in Reels', category: 'Creator Economy', momentum: 'Exploding', platform: 'Instagram Reels' },
  { topic: 'Silent Vlogging & Aesthetic Studio Setups', category: 'Creator Economy', momentum: 'Rising', platform: 'TikTok' },
  { topic: 'Newsletter-First Solopreneur Sponsorship Models', category: 'Creator Economy', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Short-Form Video Timeline Stepper Scripts', category: 'Creator Economy', momentum: 'Exploding', platform: 'YouTube' },
  { topic: 'Creator-Led Cohort Courses Communities', category: 'Creator Economy', momentum: 'Rising', platform: 'LinkedIn' },
  { topic: 'AI Voice Cloning for Multilingual Content', category: 'Creator Economy', momentum: 'Growing', platform: 'TikTok' },
  { topic: 'Custom Browser Extensions as Lead Magnets', category: 'Creator Economy', momentum: 'Exploding', platform: 'LinkedIn' },
  { topic: 'Subscription Newsletter Cap Table Valuation', category: 'Creator Economy', momentum: 'Growing', platform: 'LinkedIn' },
  { topic: 'Silent B-Roll Video Loops with Caption Prompts', category: 'Creator Economy', momentum: 'Growing', platform: 'Instagram Reels' }
];

const SEEDED_DATABASE = MOCK_TOPICS.map((tpl, idx) => {
  const id = `trend-${idx + 1}`;
  const trendScore = Math.min(99, Math.max(65, 74 + (idx % 22)));
  const growthVelocity = 110 + (idx % 8) * 50 + (idx * 3) % 40;
  const viralityPotential = Math.min(98, Math.max(70, 72 + (idx % 24)));
  const sentimentScore = Math.min(98, Math.max(55, 65 + (idx % 29)));
  const audienceInterest = Math.min(99, Math.max(68, 70 + (idx % 26)));
  const confidence = Math.min(99, Math.max(78, 80 + (idx % 18)));
  const forecast24h = Math.min(99, Math.max(50, trendScore + (idx % 5) - 2));
  const forecast7d = Math.min(99, Math.max(50, trendScore + (idx % 7) * 2 - 5));
  const forecast30d = Math.min(99, Math.max(50, trendScore + (idx % 9) * 3 - 10));

  const chartPoints = Array.from({ length: 7 }).map((_, i) => {
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

  const riskLevel = idx % 5 === 0 ? 'High' : idx % 5 === 2 ? 'Medium' : 'Low';
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
        `#${tpl.category}Intelligence`,
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

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'vite-mock-trends-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {

          // 1. Google suggest queries proxy to bypass client CORS restrictions
          if (req.url && req.url.startsWith('/api/google-suggest-proxy')) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'application/json');
            
            const parsedUrl = new URL(req.url, 'http://localhost');
            const q = parsedUrl.searchParams.get('q') || '';
            const targetUrl = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`;
            
            fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              }
            })
            .then(proxyRes => proxyRes.json())
            .then(data => {
              res.end(JSON.stringify(data));
            })
            .catch(err => {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            });
            return;
          }

          // 2. Reddit proxy to bypass browser CORS and client IP blocks
          if (req.url && req.url.startsWith('/api/reddit-proxy')) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'application/json');
            
            const parsedUrl = new URL(req.url, 'http://localhost');
            const targetUrl = parsedUrl.searchParams.get('url') || '';
            
            if (!targetUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing target url parameter' }));
              return;
            }

            const executeProxyFetch = (urlToFetch: string, fallbackUrl?: string) => {
              fetch(urlToFetch, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ViralForgeAI/1.0',
                  'Accept': 'application/json'
                }
              })
              .then(async (redditRes) => {
                if (!redditRes.ok) {
                  if (fallbackUrl) {
                    console.warn(`Vite proxy: Primary URL ${urlToFetch} failed (HTTP ${redditRes.status}). Retrying with fallback: ${fallbackUrl}`);
                    executeProxyFetch(fallbackUrl);
                    return;
                  }
                  res.statusCode = redditRes.status;
                  const text = await redditRes.text().catch(() => '');
                  res.end(JSON.stringify({ 
                    error: `Reddit Proxy failed with HTTP ${redditRes.status} ${redditRes.statusText}. Response body: ${text}` 
                  }));
                  return;
                }
                const data = await redditRes.json();
                res.end(JSON.stringify(data));
              })
              .catch((err) => {
                if (fallbackUrl) {
                  console.warn(`Vite proxy: Primary URL ${urlToFetch} threw error (${err.message}). Retrying with fallback: ${fallbackUrl}`);
                  executeProxyFetch(fallbackUrl);
                  return;
                }
                res.statusCode = 500;
                res.end(JSON.stringify({ error: `Proxy Server Fetch Error: ${err.message}` }));
              });
            };

            const fallbackUrl = targetUrl.replace('www.reddit.com', 'old.reddit.com');
            executeProxyFetch(targetUrl, fallbackUrl !== targetUrl ? fallbackUrl : undefined);
            return;
          }


          if (req.url && req.url.startsWith('/api/trends')) {
            res.setHeader('Content-Type', 'application/json');
            
            const parsedUrl = new URL(req.url, 'http://localhost');
            const pathname = parsedUrl.pathname;
            const searchParams = parsedUrl.searchParams;

            // Handle /api/trends/top
            if (pathname === '/api/trends/top') {
              const data = [...SEEDED_DATABASE]
                .sort((a, b) => b.trendScore - a.trendScore)
                .slice(0, 10);
              res.end(JSON.stringify(data));
              return;
            }

            // Handle /api/trends/predict
            if (pathname === '/api/trends/predict') {
              const id = searchParams.get('id') || '';
              const item = SEEDED_DATABASE.find(t => t.id === id);
              if (!item) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Trend not found' }));
                return;
              }
              res.end(JSON.stringify({
                id: item.id,
                forecast24h: item.forecast24h,
                forecast7d: item.forecast7d,
                forecast30d: item.forecast30d,
                confidence: item.confidence
              }));
              return;
            }

            // Handle /api/trends/recommendations
            if (pathname === '/api/trends/recommendations') {
              const id = searchParams.get('id') || '';
              const item = SEEDED_DATABASE.find(t => t.id === id);
              if (!item) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Trend not found' }));
                return;
              }
              res.end(JSON.stringify(item.recommendations));
              return;
            }

            // Handle /api/trends/search
            if (pathname === '/api/trends/search') {
              const q = searchParams.get('q')?.toLowerCase() || '';
              const cat = searchParams.get('category') || '';
              let filtered = [...SEEDED_DATABASE];
              
              if (q) {
                filtered = filtered.filter(t => t.topic.toLowerCase().includes(q));
              }
              if (cat && cat !== 'All') {
                filtered = filtered.filter(t => t.category === cat);
              }
              
              res.end(JSON.stringify(filtered));
              return;
            }

            // Base GET /api/trends
            const cat = searchParams.get('category') || '';
            let data = [...SEEDED_DATABASE];
            if (cat && cat !== 'All') {
              data = data.filter(t => t.category === cat);
            }
            res.end(JSON.stringify(data));
            return;
          }
          next();
        });
      }
    }
  ]
});
