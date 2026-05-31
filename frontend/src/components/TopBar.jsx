import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/useAuth';

function TopBar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef(null);

  const notifications = useMemo(
    () => [
      { id: 1, text: 'Sarah K. voted on Q3 Expansion Protocol', time: 'Just now', unread: true },
      { id: 2, text: 'Marcus V. flagged Security Mesh v4', time: '12 min ago', unread: true },
      { id: 3, text: 'DecisionEngine AI generated a consensus report', time: '45 min ago', unread: false },
      { id: 4, text: 'Lena W. closed Asset Reallocation', time: '2 hours ago', unread: false },
    ],
    []
  );

  const quickActions = useMemo(
    () => [
      { icon: 'add_circle', label: 'Create New Decision', kbd: 'N', path: '/decisions/new' },
      { icon: 'search', label: 'Search Decisions', kbd: 'S', path: '/decisions' },
      { icon: 'person', label: 'Find Team Member', kbd: 'P', path: '/teams' },
      { icon: 'analytics', label: 'View Analytics', kbd: 'A', path: '/analytics' },
    ],
    []
  );

  const profileLinks = useMemo(
    () => [
      ['account_circle', 'Profile Info', '/profile'],
      ['settings', 'Settings', '/settings'],
      ['groups', 'Team', '/teams'],
      ['logout', 'Logout', '/logout'],
    ],
    []
  );

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Obsidian Intelligence';
    if (path.startsWith('/decisions/new')) return 'New Decision';
    if (path.startsWith('/decisions/')) return 'Decision Details';
    if (path === '/decisions') return 'Decisions';
    if (path === '/votes') return 'My Votes';
    if (path === '/timeline') return 'Timeline';
    if (path === '/teams') return 'Teams';
    if (path === '/analytics') return 'Analytics';
    if (path === '/profile') return 'Profile Info';
    if (path === '/settings') return 'Settings';
    return 'DecisionLedger';
  }, [location.pathname]);

  const closeOverlays = useCallback(() => {
    setShowSearch(false);
    setShowNotifications(false);
    setShowProfile(false);
  }, []);

  const runQuickAction = useCallback((path) => {
    navigate(path, { replace: true });
    setShowSearch(false);
    toast.info('Opened workspace action.');
  }, [navigate]);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowSearch(true);
      }

      if (event.key === 'Escape') {
        closeOverlays();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeOverlays]);

  return (
    <>
      <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-50 h-14 shrink-0">
        <div className="flex justify-between items-center w-full px-6 h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
              aria-label="Open navigation"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <h1 className="font-geist font-semibold text-on-surface text-[15px] tracking-tight">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 hover:border-outline-variant/60 transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">search</span>
              <span className="text-xs text-on-surface-variant/60 font-medium">Search archive...</span>
              <kbd className="ml-4 text-[10px] text-on-surface-variant/40 bg-surface-container-high px-1.5 py-0.5 rounded font-mono border border-outline-variant/20">Ctrl K</kbd>
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(false);
                  setShowNotifications((value) => !value);
                }}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all relative"
                aria-label="Open notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-[#1d2027] border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl z-50"
                  >
                    <div className="px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between">
                      <span className="text-sm font-semibold text-on-surface">Notifications</span>
                      <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">2 new</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto custom-scrollbar">
                      {notifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toast.info(item.text)}
                          className={`w-full text-left px-4 py-3 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/10 ${item.unread ? '' : 'opacity-60'}`}
                        >
                          <div className="flex items-start gap-2">
                            {item.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                            <div>
                              <p className="text-sm text-on-surface leading-snug">{item.text}</p>
                              <p className="text-[11px] text-on-surface-variant mt-1">{item.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => toast.info('Workspace switcher is ready for backend data.')}
              className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all"
              aria-label="Open workspace apps"
            >
              <span className="material-symbols-outlined text-xl">apps</span>
            </button>

            <div className="relative flex items-center gap-2.5 pl-2 ml-1 border-l border-outline-variant/20">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  setShowProfile((value) => !value);
                }}
                className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Open profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSlLRmfv1g-MdxHNNcZbnGEPsa0I6O9wPmOLoGwQadw_t7EJfCrlIeCHUDJMdBm9cAlckFrg7z4oYbpj8fAi9IRvoVPj_LHrYYgyZ1MS4mDge_qJPDdJSd-MYb5DU5Ctuf5CVOJ-feeVlL1yk2X6a0sXglcZeV1wILsE8JWA5tKtJY9_i3CkiReMtOfQf73FY2Ywa4I3Vxwc2kP_9SMXR9FMnXExvJpiF_CNJWubF9vAukIAfr8sX8gCr-joXlQNMU9AxNUcweSe8"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 bg-[#1d2027] border border-outline-variant/30 rounded-xl p-2 shadow-2xl z-50"
                  >
                    <div className="px-3 py-3 border-b border-outline-variant/20">
                      <p className="text-sm font-semibold text-on-surface">{user?.name || 'Sarah Kim'}</p>
                      <p className="text-xs text-on-surface-variant">{user?.email || 'sarah@decisionledger.io'}</p>
                    </div>
                    {profileLinks.map(([icon, label, path]) => (
                      <Link
                        key={path}
                        to={path}
                        replace
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-xl glass-card rounded-xl overflow-hidden shadow-2xl border border-outline-variant/40"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  placeholder="Search decisions, people, tags..."
                  className="flex-1 bg-transparent border-none outline-none text-on-surface text-sm placeholder:text-on-surface-variant/50"
                />
                <kbd className="text-[10px] text-on-surface-variant/40 bg-surface-container-high px-1.5 py-0.5 rounded font-mono border border-outline-variant/20">ESC</kbd>
              </div>

              <div className="p-2 border-b border-outline-variant/10">
                <p className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider px-2 py-1">Quick Actions</p>
                {quickActions.map((action) => (
                  <button
                    key={action.path}
                    type="button"
                    onClick={() => runQuickAction(action.path)}
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-lg group-hover:text-primary transition-colors">{action.icon}</span>
                      <span className="text-sm text-on-surface">{action.label}</span>
                    </div>
                    <kbd className="text-[10px] text-on-surface-variant/40 bg-surface-container-high px-1.5 py-0.5 rounded font-mono border border-outline-variant/20">{action.kbd}</kbd>
                  </button>
                ))}
              </div>

              <div className="p-2">
                <p className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider px-2 py-1">Recent Searches</p>
                {['Q3 Expansion Protocol', 'Security Mesh', 'Marcus Vane'].map((search) => (
                  <button
                    key={search}
                    type="button"
                    onClick={() => toast.info(`Searching ${search}`)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">history</span>
                    <span className="text-sm text-on-surface-variant">{search}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}
      {showProfile && <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />}
    </>
  );
}

export default memo(TopBar);
