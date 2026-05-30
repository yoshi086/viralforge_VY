import React, { useState, useEffect } from 'react';
import { 
  FolderHeart, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Calendar, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Play,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedContentItem {
  id: string;
  user_id: string;
  topic: string;
  caption: string;
  script: string;
  virality_score: number;
  created_at: string;
}

export const MyContent: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  
  // Card Tab toggles: track active tab per card using card ID as key
  const [cardTabs, setCardTabs] = useState<{ [cardId: string]: 'script' | 'caption' }>({});
  
  // Custom Toast alerts
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const fetchSavedContent = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err: any) {
      console.error('Fetch saved content error:', err);
      setError(err.message || 'Failed to retrieve saved content packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('generated_content')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setItems(prev => prev.filter(item => item.id !== id));
      triggerToast('Content package deleted successfully.');
    } catch (err: any) {
      console.error('Delete content error:', err);
      triggerToast('Failed to delete content package.');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const triggerToast = (msg: string) => {
    setToast({ message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Real-time dynamic JS filtering
  const filteredItems = items.filter(item => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      item.topic.toLowerCase().includes(query) ||
      item.caption.toLowerCase().includes(query) ||
      item.script.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (dateFilter === 'all') return true;

    const createdTime = new Date(item.created_at).getTime();
    const nowTime = new Date().getTime();
    const diffDays = (nowTime - createdTime) / (1000 * 60 * 60 * 24);

    if (dateFilter === 'today') {
      const createdDate = new Date(item.created_at).toDateString();
      const todayDate = new Date().toDateString();
      return createdDate === todayDate;
    }
    if (dateFilter === '7days') {
      return diffDays <= 7;
    }
    if (dateFilter === '30days') {
      return diffDays <= 30;
    }

    return true;
  });

  return (
    <div className="space-y-8 fade-in pb-16 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <FolderHeart className="w-8 h-8 text-purple-500 fill-purple-500/20" />
            My Saved Workspace
          </h1>
          <p className="text-gray-400 mt-1 max-w-lg">
            Manage, filter, search, and copy saved viral timelines and algorithm captions.
          </p>
        </div>

        <button 
          onClick={fetchSavedContent}
          className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Database
        </button>
      </div>

      {/* Control filters bar */}
      <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4 text-xs font-sans">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search inputs */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic or content..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-medium"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          </div>

          {/* Date Filter toggler */}
          <div className="flex items-center gap-2 bg-black/45 p-1 rounded-xl border border-white/5 self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: '7days', label: '7 Days' },
              { value: '30days', label: '30 Days' }
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDateFilter(d.value as any)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide cursor-pointer transition-all whitespace-nowrap ${
                  dateFilter === d.value
                    ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white border border-purple-500/20 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Database Error Warning */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-5 flex gap-3.5 items-start text-rose-300 font-semibold leading-relaxed animate-shake">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Connection Alert</span>
            <p className="text-gray-400 text-xs leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold font-mono">Retrieving saved assets...</span>
        </div>
      ) : filteredItems.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const activeTab = cardTabs[item.id] || 'script';
              const createdDate = new Date(item.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28 }}
                  className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-[360px] relative group hover:border-purple-500/20"
                >
                  <div className="space-y-4">
                    {/* Header elements */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-[9px] text-gray-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          Saved {createdDate}
                        </span>
                        <h3 className="text-md font-bold text-white leading-snug truncate group-hover:text-purple-300 transition-colors" title={item.topic}>
                          {item.topic}
                        </h3>
                      </div>
                      <div className="px-2.5 py-1 bg-purple-950/30 border border-purple-500/25 text-purple-300 font-bold rounded-lg text-[10px] font-mono shadow-sm">
                        Virality: {item.virality_score}%
                      </div>
                    </div>

                    {/* Card Inner Tabs selector */}
                    <div className="flex bg-black/45 p-0.5 rounded-lg border border-white/5 text-[10px] font-sans font-bold">
                      <button
                        onClick={() => setCardTabs(prev => ({ ...prev, [item.id]: 'script' }))}
                        className={`flex-1 text-center py-1.5 rounded-md cursor-pointer transition-all flex items-center justify-center gap-1 ${
                          activeTab === 'script'
                            ? 'bg-purple-900/30 text-purple-300 border border-purple-500/15'
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        <Play className="w-3 h-3 shrink-0" />
                        Reel Script
                      </button>
                      <button
                        onClick={() => setCardTabs(prev => ({ ...prev, [item.id]: 'caption' }))}
                        className={`flex-1 text-center py-1.5 rounded-md cursor-pointer transition-all flex items-center justify-center gap-1 ${
                          activeTab === 'caption'
                            ? 'bg-purple-900/30 text-purple-300 border border-purple-500/15'
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        Social Caption
                      </button>
                    </div>

                    {/* Content Display scrollbox */}
                    <div className="bg-black/35 rounded-xl p-4 border border-white/5 h-[145px] overflow-y-auto font-sans leading-relaxed text-xs text-gray-300 whitespace-pre-line font-medium">
                      {activeTab === 'script' ? item.script : item.caption}
                    </div>
                  </div>

                  {/* Actions card footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/15 hover:border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-xl transition-all cursor-pointer"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => copyToClipboard(
                        activeTab === 'script' ? item.script : item.caption,
                        `${item.id}-${activeTab}`
                      )}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 border border-purple-500/20 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer select-none active:scale-95"
                    >
                      {copiedStates[`${item.id}-${activeTab}`] ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Text
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty search/DB states */
        <div className="glass-card rounded-2xl p-16 text-center border border-white/5 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 animate-float">
            <FolderHeart className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">Workspace Empty</h3>
            <p className="text-gray-500 text-xs max-w-sm mt-1 mx-auto font-sans leading-normal">
              {searchQuery.trim() 
                ? `No saved packages match the query "${searchQuery}". Please refine your filters.` 
                : 'You have not saved any content packages in your database yet. Generate a viral package and hit Save.'}
            </p>
          </div>
        </div>
      )}

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
