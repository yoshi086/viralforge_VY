export interface EmergingQueriesDiagnosticInfo {
  requestUrl: string;
  httpStatus: number | string;
  errorMessage: string;
  responsePreview: string;
}

export interface YouTubeDiagnosticInfo {
  apiKeyPresent: boolean;
  requestExecuted: boolean;
  httpStatus: number | string;
  responsePreview: string;
  errorMessage: string;
}

export const SOURCE_DIAGNOSTICS: {
  emergingQueries: EmergingQueriesDiagnosticInfo;
  youtube: YouTubeDiagnosticInfo;
} = {
  emergingQueries: {
    requestUrl: 'None executed yet',
    httpStatus: 'N/A',
    errorMessage: 'None',
    responsePreview: 'None'
  },
  youtube: {
    apiKeyPresent: false,
    requestExecuted: false,
    httpStatus: 'N/A',
    responsePreview: 'None',
    errorMessage: 'None'
  }
};

export interface GoogleSuggestSignal {
  query: string;
  relevance: number;
}

export interface EmergingQuerySignal {
  query: string;
  volumeScore: number;
  growthScore: number;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
}

export interface NewsSignal {
  source: string;
  title: string;
  publishedAt: string;
  url: string;
}

export interface YouTubeSignal {
  title: string;
  channelTitle: string;
  publishedAt: string;
  videoId: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface LiveSignalsPackage {
  topic: string;
  lastUpdated: string;
  googleTrends: {
    status: 'Available' | 'Unavailable';
    searchVolume: 'High' | 'Medium' | 'Low';
    suggestScore: number;
    items: GoogleSuggestSignal[];
  };
  emergingQueries: {
    status: 'Available' | 'Unavailable';
    volumeScore: number;
    growthScore: number;
    count: number;
    items: EmergingQuerySignal[];
  };
  news: {
    status: 'Available' | 'Unavailable' | 'No Key';
    mentionsCount: number;
    items: NewsSignal[];
  };
  youtube: {
    status: 'Available' | 'Unavailable' | 'No Key';
    videosCount: number;
    items: YouTubeSignal[];
  };
}


const classifyIntent = (q: string): EmergingQuerySignal['intent'] => {
  const ql = q.toLowerCase();
  if (
    ql.includes('how to') || 
    ql.includes('why') || 
    ql.includes('what') || 
    ql.includes('tutorial') || 
    ql.includes('guide') || 
    ql.includes('learn') || 
    ql.includes('course') || 
    ql.includes('training')
  ) {
    return 'Informational';
  }
  if (
    ql.includes('vs') || 
    ql.includes('best') || 
    ql.includes('review') || 
    ql.includes('comparison') || 
    ql.includes('alternative') || 
    ql.includes('which')
  ) {
    return 'Commercial';
  }
  if (
    ql.includes('buy') || 
    ql.includes('pricing') || 
    ql.includes('download') || 
    ql.includes('hire') || 
    ql.includes('api') || 
    ql.includes('tool') || 
    ql.includes('software') || 
    ql.includes('cost') || 
    ql.includes('code') || 
    ql.includes('setup')
  ) {
    return 'Transactional';
  }
  return 'Navigational';
};

export async function fetchEmergingQueriesSignals(topic: string): Promise<LiveSignalsPackage['emergingQueries']> {
  const encoded = encodeURIComponent(topic);
  const proxyUrl = `/api/google-suggest-proxy?q=${encoded}`;
  
  try {
    let response;
    try {
      response = await fetch(proxyUrl);
    } catch (proxyErr) {
      const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encoded}`;
      response = await fetch(url);
    }
    
    SOURCE_DIAGNOSTICS.emergingQueries.requestUrl = proxyUrl;
    SOURCE_DIAGNOSTICS.emergingQueries.httpStatus = response.status;
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      SOURCE_DIAGNOSTICS.emergingQueries.errorMessage = `Google Autocomplete API returned HTTP ${response.status}: ${response.statusText}`;
      SOURCE_DIAGNOSTICS.emergingQueries.responsePreview = errorText.slice(0, 300) + '...';
      return { status: 'Unavailable', volumeScore: 0, growthScore: 0, count: 0, items: [] };
    }
    
    const data = await response.json();
    SOURCE_DIAGNOSTICS.emergingQueries.errorMessage = 'None';
    SOURCE_DIAGNOSTICS.emergingQueries.responsePreview = JSON.stringify(data).slice(0, 300) + '...';
    
    const suggestions: string[] = data?.[1] || [];
    const count = suggestions.length;
    
    const items: EmergingQuerySignal[] = suggestions.map((sug: string, idx: number) => {
      const queryVolume = Math.min(99, Math.max(15, 90 - idx * 8 - (sug.length % 10)));
      const queryGrowth = Math.min(99, Math.max(20, 85 - idx * 6 + (sug.length % 12)));
      return {
        query: sug,
        volumeScore: queryVolume,
        growthScore: queryGrowth,
        intent: classifyIntent(sug)
      };
    });
    
    const volumeScore = items.length > 0 ? Math.round(items.reduce((acc, curr) => acc + curr.volumeScore, 0) / items.length) : 35;
    const growthScore = items.length > 0 ? Math.round(items.reduce((acc, curr) => acc + curr.growthScore, 0) / items.length) : 30;
    
    return {
      status: 'Available',
      volumeScore,
      growthScore,
      count,
      items
    };
  } catch (err: any) {
    console.error('Fetch emerging queries error:', err);
    SOURCE_DIAGNOSTICS.emergingQueries.errorMessage = `Exception: ${err.message || err}`;
    SOURCE_DIAGNOSTICS.emergingQueries.httpStatus = 'Failed';
    return { status: 'Unavailable', volumeScore: 0, growthScore: 0, count: 0, items: [] };
  }
}

export async function fetchGoogleSuggestSignals(topic: string): Promise<LiveSignalsPackage['googleTrends']> {
  try {
    const encoded = encodeURIComponent(topic);
    const proxyUrl = `/api/google-suggest-proxy?q=${encoded}`;
    let response;
    try {
      response = await fetch(proxyUrl);
    } catch (proxyErr) {
      const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encoded}`;
      response = await fetch(url);
    }
    
    if (!response.ok) {
      return { status: 'Unavailable', searchVolume: 'Low', suggestScore: 0, items: [] };
    }
    
    const data = await response.json();
    const suggestions = data?.[1] || [];
    
    const items: GoogleSuggestSignal[] = suggestions.map((sug: string, idx: number) => ({
      query: sug,
      relevance: Math.max(10, 100 - idx * 12)
    }));
    
    const suggestScore = items.length > 0 ? Math.round(items.reduce((acc, curr) => acc + curr.relevance, 0) / items.length) : 35;
    const searchVolume = suggestScore > 80 ? 'High' : suggestScore > 50 ? 'Medium' : 'Low';
    
    return {
      status: 'Available',
      searchVolume,
      suggestScore,
      items
    };
  } catch (err) {
    console.error('Google Suggest signal fetch error:', err);
    return { status: 'Unavailable', searchVolume: 'Low', suggestScore: 0, items: [] };
  }
}

export async function fetchNewsSignals(topic: string, apiKey: string): Promise<LiveSignalsPackage['news']> {
  if (!apiKey || !apiKey.trim()) {
    return { status: 'No Key', mentionsCount: 0, items: [] };
  }
  
  try {
    const encoded = encodeURIComponent(topic);
    const url = `https://newsapi.org/v2/everything?q=${encoded}&sortBy=popularity&pageSize=5&apiKey=${encodeURIComponent(apiKey)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return { status: 'Unavailable', mentionsCount: 0, items: [] };
    }
    
    const data = await response.json();
    if (data.status === 'error') {
      return { status: 'Unavailable', mentionsCount: 0, items: [] };
    }
    
    const articles = data.articles || [];
    const items: NewsSignal[] = articles.map((art: any) => ({
      source: art.source?.name || 'News Source',
      title: art.title || '',
      publishedAt: art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'Today',
      url: art.url || ''
    }));
    
    return {
      status: 'Available',
      mentionsCount: data.totalResults || items.length,
      items
    };
  } catch (err) {
    console.error('NewsAPI signal fetch error:', err);
    return { status: 'Unavailable', mentionsCount: 0, items: [] };
  }
}

export async function fetchYouTubeSignals(topic: string, apiKey: string): Promise<LiveSignalsPackage['youtube']> {
  if (!apiKey || !apiKey.trim()) {
    SOURCE_DIAGNOSTICS.youtube = {
      apiKeyPresent: false,
      requestExecuted: false,
      httpStatus: 'N/A',
      responsePreview: 'N/A',
      errorMessage: 'Video Signal Engine credentials missing. Define VITE_YOUTUBE_API_KEY inside your .env configuration.'
    };
    return { status: 'No Key', videosCount: 0, items: [] };
  }
  
  SOURCE_DIAGNOSTICS.youtube.apiKeyPresent = true;
  SOURCE_DIAGNOSTICS.youtube.requestExecuted = true;
  
  try {
    const encoded = encodeURIComponent(topic);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&q=${encoded}&maxResults=5&key=${encodeURIComponent(apiKey)}`;
    
    const searchRes = await fetch(searchUrl);
    SOURCE_DIAGNOSTICS.youtube.httpStatus = searchRes.status;
    
    if (!searchRes.ok) {
      const errorText = await searchRes.text().catch(() => '');
      let errorParsed = { error: { message: `HTTP ${searchRes.status} ${searchRes.statusText}` } };
      try {
        errorParsed = JSON.parse(errorText);
      } catch (e) {}
      
      const errMsg = errorParsed?.error?.message || `HTTP ${searchRes.status} Error`;
      SOURCE_DIAGNOSTICS.youtube.errorMessage = `Search API failed: ${errMsg}`;
      SOURCE_DIAGNOSTICS.youtube.responsePreview = errorText.slice(0, 300) + '...';
      
      return { status: 'Unavailable', videosCount: 0, items: [] };
    }
    
    const searchData = await searchRes.json();
    const searchItems = searchData.items || [];
    
    if (searchItems.length === 0) {
      SOURCE_DIAGNOSTICS.youtube.errorMessage = 'None (0 matching videos found)';
      SOURCE_DIAGNOSTICS.youtube.responsePreview = JSON.stringify(searchData).slice(0, 300) + '...';
      return { status: 'Available', videosCount: 0, items: [] };
    }
    
    const videoIds = searchItems.map((item: any) => item.id?.videoId).filter(Boolean).join(',');
    
    if (!videoIds) {
      SOURCE_DIAGNOSTICS.youtube.errorMessage = 'None (no video IDs returned in search data)';
      SOURCE_DIAGNOSTICS.youtube.responsePreview = JSON.stringify(searchData).slice(0, 300) + '...';
      return { status: 'Available', videosCount: 0, items: [] };
    }
    
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${encodeURIComponent(apiKey)}`;
    const statsRes = await fetch(statsUrl);
    SOURCE_DIAGNOSTICS.youtube.httpStatus = `${searchRes.status} / ${statsRes.status}`;
    
    if (!statsRes.ok) {
      const errorText = await statsRes.text().catch(() => '');
      SOURCE_DIAGNOSTICS.youtube.errorMessage = `Videos statistics call failed: HTTP ${statsRes.status}`;
      SOURCE_DIAGNOSTICS.youtube.responsePreview = errorText.slice(0, 300) + '...';
      
      const items: YouTubeSignal[] = searchItems.map((item: any) => ({
        title: item.snippet?.title || '',
        channelTitle: item.snippet?.channelTitle || 'YouTube Creator',
        publishedAt: item.snippet?.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : 'Today',
        videoId: item.id?.videoId || '',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0
      }));
      return {
        status: 'Available',
        videosCount: searchData.pageInfo?.totalResults || items.length * 80,
        items
      };
    }
    
    const statsData = await statsRes.json();
    SOURCE_DIAGNOSTICS.youtube.errorMessage = 'None';
    SOURCE_DIAGNOSTICS.youtube.responsePreview = JSON.stringify(statsData).slice(0, 300) + '...';
    
    const items: YouTubeSignal[] = (statsData.items || []).map((video: any) => {
      const stats = video.statistics || {};
      return {
        title: video.snippet?.title || '',
        channelTitle: video.snippet?.channelTitle || 'YouTube Creator',
        publishedAt: video.snippet?.publishedAt ? new Date(video.snippet.publishedAt).toLocaleDateString() : 'Today',
        videoId: video.id || '',
        viewCount: parseInt(stats.viewCount || '0', 10),
        likeCount: parseInt(stats.likeCount || '0', 10),
        commentCount: parseInt(stats.commentCount || '0', 10)
      };
    });
    
    const totalViews = items.reduce((acc, curr) => acc + curr.viewCount, 0);
    
    return {
      status: 'Available',
      videosCount: totalViews || searchData.pageInfo?.totalResults || items.length * 80,
      items
    };
  } catch (err: any) {
    console.error('YouTube Data API fetch error:', err);
    SOURCE_DIAGNOSTICS.youtube.errorMessage = `Exception: ${err.message || err}`;
    SOURCE_DIAGNOSTICS.youtube.responsePreview = 'An exception was thrown during the fetch process.';
    return { status: 'Unavailable', videosCount: 0, items: [] };
  }
}

export async function compileLiveSignals(
  topic: string, 
  apiKeys?: { newsApiKey?: string; youtubeApiKey?: string }
): Promise<LiveSignalsPackage> {
  const newsKey = apiKeys?.newsApiKey || import.meta.env.VITE_NEWS_API_KEY || '';
  const youtubeKey = apiKeys?.youtubeApiKey || import.meta.env.VITE_YOUTUBE_API_KEY || '';

  const [googleTrends, emergingQueries, news, youtube] = await Promise.all([
    fetchGoogleSuggestSignals(topic),
    fetchEmergingQueriesSignals(topic),
    fetchNewsSignals(topic, newsKey),
    fetchYouTubeSignals(topic, youtubeKey)
  ]);

  return {
    topic,
    lastUpdated: new Date().toLocaleTimeString(),
    googleTrends,
    emergingQueries,
    news,
    youtube
  };
}
