import React, { useState } from 'react';
import { 
  Sparkles, 
  Film, 
  BarChart2, 
  Menu, 
  X, 
  Zap, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
  Swords
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type PageId = 'dashboard' | 'trending' | 'growth_hacker' | 'content_studio' | 'analytics';

interface SidebarProps {
  currentPage: PageId;
  onChangePage: (page: PageId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onChangePage,
  isCollapsed,
  setIsCollapsed
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const userEmail = user?.email || 'creator@viralforge.ai';
  const userName = userEmail.split('@')[0];
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
  const initials = userName.substring(0, 2).toUpperCase() || 'VF';

  const handleLogoutClick = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'trending' as PageId, label: 'Trending Topics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'growth_hacker' as PageId, label: 'AI Growth Hacker', icon: <Swords className="w-5 h-5" /> },
    { id: 'content_studio' as PageId, label: 'Content Studio', icon: <Film className="w-5 h-5" /> },
    { id: 'analytics' as PageId, label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  const handleNavClick = (pageId: PageId) => {
    onChangePage(pageId);
    setIsOpen(false); // Close mobile drawer when clicked
  };

  return (
    <>
      {/* Mobile Floating Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#070512]/90 border-b border-white/5 backdrop-blur-md fixed top-0 left-0 w-full z-45">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-md shadow-purple-500/25">
            <Zap className="w-4.5 h-4.5 text-white fill-white/10" />
          </div>
          <span className="text-md font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent uppercase font-mono">
            ViralForge
          </span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5 cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Slide-out Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-45 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#070512]/95 border-r border-white/5 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed ? 'lg:w-[76px]' : 'lg:w-64'
        }`}
      >
        <div>
          {/* Logo Area */}
          <div className={`flex items-center px-6 py-6 border-b border-white/5 relative ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                <Zap className="w-5 h-5 text-white fill-white/10" />
              </div>
              {!isCollapsed && (
                <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent uppercase font-mono animate-pulse">
                  ViralForge<span className="text-xs text-purple-400">AI</span>
                </span>
              )}
            </div>

            {/* Collapse Toggle desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-[#0a0817] border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-transform shadow-md z-55 hover:scale-105"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3.5 py-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 py-3 rounded-xl transition-all duration-150 group cursor-pointer ${
                    isCollapsed ? 'justify-center px-2' : 'px-4'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-950/40 to-blue-950/40 text-purple-300 border border-purple-500/15 shadow-sm shadow-purple-500/5' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  title={item.label}
                >
                  <div className={`transition-colors shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-semibold tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-auto shadow-lg shadow-purple-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Capsule */}
        <div className={`p-4 border-t border-white/5 bg-[#0a081a]/40 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md" title={userEmail}>
                {initials}
              </div>
              <button
                onClick={handleLogoutClick}
                className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all cursor-pointer border border-transparent"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-black/30 border border-white/5 p-2.5 rounded-2xl relative w-full group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-black text-white shadow-md shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden min-w-0 flex-1 pr-7">
                <h4 className="text-[11px] font-bold text-white truncate leading-tight">{capitalizedName}</h4>
                <span className="text-[9px] uppercase tracking-wider text-purple-400 font-extrabold flex items-center gap-0.5 mt-0.5 truncate max-w-full">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={handleLogoutClick}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg border border-transparent transition-all cursor-pointer select-none"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
