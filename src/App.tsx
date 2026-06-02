import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { PageId } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { TrendingTopics } from './pages/TrendingTopics';
import { GrowthHacker } from './pages/GrowthHacker';
import { ContentStudio } from './pages/ContentStudio';
import { Analytics } from './pages/Analytics';
import { ParticleBackground } from './components/ParticleBackground';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTrendProfile, setSelectedTrendProfile] = useState<any>(null);

  const handleSelectTopic = (topic: string, navigateTo: PageId, trendProfile?: any) => {
    setSelectedTopic(topic);
    setSelectedTrendProfile(trendProfile || null);
    setCurrentPage(navigateTo);
  };

  const clearTopic = () => {
    setSelectedTopic('');
    setSelectedTrendProfile(null);
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
                />
              )}
              {currentPage === 'trending' && (
                <TrendingTopics onSelectTopic={handleSelectTopic} />
              )}
              {currentPage === 'growth_hacker' && (
                <GrowthHacker 
                  initialTopic={selectedTopic} 
                  trendProfile={selectedTrendProfile}
                  onSelectTopic={handleSelectTopic} 
                />
              )}
              {currentPage === 'content_studio' && (
                <ContentStudio 
                  initialTopic={selectedTopic} 
                  clearInitialTopic={clearTopic} 
                  onSelectTopic={handleSelectTopic}
                  handoffPackage={selectedTrendProfile}
                />
              )}
              {currentPage === 'analytics' && (
                <Analytics />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
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
