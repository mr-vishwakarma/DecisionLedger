import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'gavel', label: 'Decisions', path: '/decisions' },
  { icon: 'how_to_vote', label: 'My Votes', path: '/votes' },
  { icon: 'timeline', label: 'Timeline', path: '/timeline' },
  { icon: 'groups', label: 'Teams', path: '/teams' },
  { icon: 'analytics', label: 'Analytics', path: '/analytics' },
];

const bottomItems = [
  { icon: 'account_circle', label: 'Profile', path: '/profile' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
  { icon: 'logout', label: 'Logout', path: '/logout' },
];

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-full bg-surface-container-lowest border-r border-outline-variant/30 sticky left-0 top-0 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="px-4 h-16 flex items-center gap-3 border-b border-outline-variant/20 shrink-0">
        <img src="/logo.jpg" alt="DecisionLedger" className="w-9 h-9 rounded-lg shrink-0 object-cover shadow-[0_0_16px_rgba(173,198,255,0.2)]" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <h2 className="font-geist font-bold text-on-surface text-[15px] leading-tight whitespace-nowrap">DecisionLedger</h2>
              <p className="text-[10px] text-on-surface-variant tracking-wider uppercase">Enterprise Suite</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/decisions' && location.pathname.startsWith('/decisions'));
          return (
            <Link
              key={item.path}
              to={item.path}
              replace
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="material-symbols-outlined text-[20px] shrink-0" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-outline-variant/20 py-3 px-2 space-y-0.5 shrink-0">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              replace
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-200 w-full"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined text-[20px] shrink-0">
            {collapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

export default memo(Sidebar);
