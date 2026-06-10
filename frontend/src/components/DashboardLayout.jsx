import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/useAuth';

export default function DashboardLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const { user, showAiChat, setShowAiChat } = useAuth();

  // Global Keybindings
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setCommandPaletteOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Command Center', path: '/dashboard', icon: 'dashboard' },
    { name: 'Decision Workspace', path: '/decisions', icon: 'account_tree' },
    { name: 'Voting Analytics', path: '/votes', icon: 'how_to_vote' },
    { name: 'Observatory', path: '/timeline', icon: 'history' },
    { name: 'Team Topology', path: '/teams', icon: 'hub' },
    { name: 'Enterprise Analytics', path: '/analytics', icon: 'analytics' },
  ];

  const displayName = user?.name || 'Cmdr. Shepard';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CS';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface font-body">
      
      {/* GLOBAL COMMAND PALETTE OVERLAY */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-start pt-32 px-4"
            onClick={() => setCommandPaletteOpen(false)}
          >
            <motion.div 
              initial={{ y: -20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: -20, scale: 0.95 }}
              className="bg-surface-container-high border border-outline-variant/40 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-3 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-on-surface-variant/60 mr-3">search</span>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search decisions, teams, or run AI commands..." 
                  className="w-full bg-transparent border-none text-lg text-on-surface focus:outline-none placeholder-on-surface-variant/30"
                />
                <span className="text-[10px] bg-surface-container-highest px-2 py-1 rounded text-on-surface-variant/60">ESC</span>
              </div>
              <div className="p-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60 px-3 py-2">Navigation</div>
                {navItems.map(item => (
                  <div key={item.path} onClick={() => navigate(item.path)} className="px-3 py-2 hover:bg-surface-container-highest text-on-surface-variant rounded cursor-pointer flex items-center text-sm">
                    <span className="material-symbols-outlined text-[16px] mr-2">{item.icon}</span> Go to {item.name}
                  </div>
                ))}
                <div className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60 px-3 py-2 mt-2">Suggested Commands</div>
                <div onClick={() => navigate('/decisions/new')} className="px-3 py-2 hover:bg-blue-500/10 text-blue-400 rounded cursor-pointer flex items-center text-sm"><span className="material-symbols-outlined text-[16px] mr-2">add_circle</span> Initialize New Decision Node</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR NAVIGATION */}
      <div className="w-64 border-r border-outline-variant/20 bg-surface-container flex flex-col hidden md:flex shrink-0">
        <Link to="/" className="h-16 flex items-center px-6 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="font-display font-bold text-xl text-on-surface">DecisionLedger</span>
        </Link>
        <div className="flex-1 py-6 px-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4 px-2">Intelligence Core</div>
          
          <div className="px-2 pb-4">
            <Link to="/decisions/new" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-3 rounded-lg shadow-lg hover:scale-[1.02] transition-all border border-blue-500/20">
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              New Decision
            </Link>
          </div>

          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} className={`px-4 py-2.5 rounded flex items-center cursor-pointer transition-colors ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1' : 'hover:bg-surface-container-high text-on-surface-variant'}`}>
                <span className="material-symbols-outlined mr-3 text-[18px]">{item.icon}</span> {item.name}
              </Link>
            )
          })}
        </div>
        <div className="p-4 border-t border-outline-variant/20 flex flex-col gap-2">
          <Link to="/profile" className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high p-2 rounded transition-colors">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg text-white">{userInitials}</div>
            <div className="min-w-0 flex-1 font-sans">
              <div className="text-xs font-bold truncate text-on-surface">{displayName}</div>
              {user?.companyName && (
                <div className="text-[10px] text-blue-400 font-semibold truncate uppercase tracking-wider">{user.companyName}</div>
              )}
              <div className="text-[9px] text-on-surface-variant truncate">{user?.email || 'Global Admin'}</div>
            </div>
          </Link>
          <Link to="/logout" className="flex items-center gap-2 hover:bg-red-500/10 text-on-surface-variant hover:text-error px-3 py-1.5 rounded text-xs transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-outline-variant/20 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl text-on-surface">
              {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Workspace'}
            </h1>
            <div className="h-4 w-px bg-outline-variant/20 hidden md:block"></div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-green-400 hidden md:flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span> System Optimal
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[10px] font-mono text-on-surface-variant/60 border border-outline-variant/30 px-3 py-1.5 rounded hover:bg-surface-container-high flex items-center transition-colors" onClick={() => setCommandPaletteOpen(true)}>
              <span className="material-symbols-outlined text-[14px] mr-2">search</span> CMD + K
            </button>
            <Link to="/decisions/new" className="w-8 h-8 rounded bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors" title="Create New Decision">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </Link>
            <button onClick={() => setShowAiChat(!showAiChat)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${showAiChat ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'}`} title="Governance AI">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
