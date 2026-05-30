import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { PageId } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { TrendingTopics } from './pages/TrendingTopics';
import { ReelGenerator } from './pages/ReelGenerator';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { LinkedInPosts } from './pages/LinkedInPosts';
import { ViralityPrediction } from './pages/ViralityPrediction';
import { Analytics } from './pages/Analytics';
import { ParticleBackground } from './components/ParticleBackground';
import { Key, X, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { MyContent } from './pages/MyContent';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  
  // Manage Gemini API key
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('viralforge_gemini_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectTopic = (topic: string, navigateTo: 'dashboard' | 'reel') => {
    setSelectedTopic(topic);
    setCurrentPage(navigateTo);
  };

  const clearTopic = () => {
    setSelectedTopic('');
  };

  const handleSaveKey = () => {
    const cleanedKey = tempKey.trim();
    localStorage.setItem('viralforge_gemini_key', cleanedKey);
    setApiKey(cleanedKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleClearKey = () => {
    localStorage.removeItem('viralforge_gemini_key');
    setApiKey('');
    setTempKey('');
    setShowSettings(false);
  };

  // 1. Session Loading Spinner Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030208] text-gray-100 flex flex-col items-center justify-center font-sans overflow-hidden relative">
        <ParticleBackground />
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 flex items-center justify-center mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            <Zap className="w-6 h-6 text-purple-400 fill-purple-400/10 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono">ViralForge AI</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Initializing Workspace Session...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login/Signup Interceptions
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030208] text-gray-100 flex flex-col font-sans overflow-hidden relative">
        <ParticleBackground />
        {authView === 'login' ? (
          <Login onNavigateToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onNavigateToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // 3. Authenticated Protected Workspace Router
  return (
    <div className="min-h-screen bg-[#030208] text-gray-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-white overflow-hidden relative">
      {/* Dynamic Floating Particles Canvas */}
      <ParticleBackground />

      {/* Decorative Cosmic Glow Background Elements */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        onChangePage={setCurrentPage} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Protected Workspace */}
      <main 
        className={`flex-1 min-h-screen pt-20 lg:pt-0 p-6 lg:p-10 transition-all duration-300 w-full overflow-x-hidden ${
          isCollapsed ? 'lg:pl-[106px]' : 'lg:pl-[284px]'
        }`}
      >
        <div className="max-w-6xl mx-auto w-full py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (currentPage === 'dashboard' && selectedTopic ? '-' + selectedTopic : '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentPage === 'dashboard' && (
                <Dashboard 
                  initialTopic={selectedTopic} 
                  clearInitialTopic={clearTopic} 
                  apiKey={apiKey}
                  onOpenSettings={() => {
                    setTempKey(apiKey);
                    setShowSettings(true);
                  }}
                />
              )}
              {currentPage === 'trending' && (
                <TrendingTopics onSelectTopic={handleSelectTopic} />
              )}
              {currentPage === 'reel' && (
                <ReelGenerator defaultTopic={selectedTopic} />
              )}
              {currentPage === 'caption' && (
                <CaptionGenerator />
              )}
              {currentPage === 'linkedin' && (
                <LinkedInPosts />
              )}
              {currentPage === 'prediction' && (
                <ViralityPrediction />
              )}
              {currentPage === 'saved' && (
                <MyContent />
              )}
              {currentPage === 'analytics' && (
                <Analytics />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Glassmorphic Settings Modal for Gemini API Key */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card max-w-md w-full rounded-2xl p-6 border border-purple-500/20 font-sans space-y-5 shadow-2xl shadow-purple-500/10"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  Gemini API Configuration
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg border border-transparent transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content info */}
              <div className="space-y-4 text-xs leading-relaxed text-gray-400">
                <div className="bg-purple-950/20 border border-purple-500/15 rounded-xl p-3.5 flex gap-2.5 items-start">
                  <Zap className="w-4.5 h-4.5 text-purple-400 shrink-0 mt-0.5" />
                  <p>
                    To unlock real-time custom scripts, social captions, and formatted professional posts, configure your Google Gemini API Key.
                  </p>
                </div>

                {/* Key Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 font-mono text-sm tracking-widest"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <a 
                    href="https://aistudio.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-purple-400 font-semibold"
                  >
                    Get your free API key from Google AI Studio ↗
                  </a>
                  <span>Secured in local storage</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-2 border-t border-white/5">
                {apiKey.trim() && (
                  <button
                    onClick={handleClearKey}
                    className="px-4 py-2.5 bg-red-950/20 hover:bg-red-900/15 text-red-400 border border-red-500/25 rounded-xl text-xs font-bold transition-all cursor-pointer hover:border-red-500/40"
                  >
                    Remove Key
                  </button>
                )}
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold transition-all ml-auto cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveKey}
                  disabled={saveSuccess}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all border border-purple-500/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:from-emerald-600 disabled:to-emerald-500 disabled:border-emerald-500/35"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Key Saved!
                    </>
                  ) : (
                    'Save Configuration'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
