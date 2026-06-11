import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkspaceSettings from './sections/WorkspaceSettings';
import GovernanceSettings from './sections/GovernanceSettings';
import SecuritySettings from './sections/SecuritySettings';
import PermissionsSettings from './sections/PermissionsSettings';
import TeamsSettings from './sections/TeamsSettings';
import AISettings from './sections/AISettings';
import IntegrationsSettings from './sections/IntegrationsSettings';
import AutomationSettings from './sections/AutomationSettings';
import AnalyticsSettings from './sections/AnalyticsSettings';
import AdvancedSettings from './sections/AdvancedSettings';
import SystemSettings from './sections/SystemSettings';

const SETTINGS_CATEGORIES = [
  {
    group: 'Organization',
    items: [
      { id: 'workspace', label: 'Workspace', icon: 'domain' },
      { id: 'teams', label: 'Teams & Org', icon: 'group_work' },
      { id: 'permissions', label: 'Permissions', icon: 'admin_panel_settings' },
    ]
  },
  {
    group: 'Intelligence & Control',
    items: [
      { id: 'governance', label: 'Governance Engine', icon: 'policy' },
      { id: 'automation', label: 'Automations', icon: 'smart_toy' },
      { id: 'ai', label: 'AI Configuration', icon: 'psychology' },
      { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
    ]
  },
  {
    group: 'Infrastructure',
    items: [
      { id: 'security', label: 'Security & Audit', icon: 'security' },
      { id: 'integrations', label: 'Integrations', icon: 'hub' },
      { id: 'advanced', label: 'Advanced Settings', icon: 'settings_applications' },
      { id: 'system', label: 'System', icon: 'dns' },
    ]
  }
];

export default function SettingsCenter() {
  const [activeSection, setActiveSection] = useState('workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderSection = () => {
    switch (activeSection) {
      case 'workspace': return <WorkspaceSettings />;
      case 'governance': return <GovernanceSettings />;
      case 'security': return <SecuritySettings />;
      case 'permissions': return <PermissionsSettings />;
      case 'teams': return <TeamsSettings />;
      case 'ai': return <AISettings />;
      case 'integrations': return <IntegrationsSettings />;
      case 'automation': return <AutomationSettings />;
      case 'analytics': return <AnalyticsSettings />;
      case 'advanced': return <AdvancedSettings />;
      case 'system': return <SystemSettings />;
      default: return <WorkspaceSettings />;
    }
  };

  return (
    <div className="flex h-full bg-background overflow-hidden relative">
      
      
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="flex-shrink-0 border-r border-outline-variant/30 bg-surface-container-low flex flex-col h-full"
      >
        <div className="p-6 border-b border-outline-variant/30 flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <span className="material-symbols-outlined">settings_suggest</span>
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
              <h1 className="text-lg font-bold font-geist text-on-surface truncate">Control Center</h1>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant truncate">Enterprise Config</p>
            </motion.div>
          )}
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          {isSidebarOpen && (
            <div className="mb-6 relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search settings (Ctrl+K)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          <div className="space-y-6">
            {SETTINGS_CATEGORIES.map((group, idx) => (
              <div key={idx}>
                {isSidebarOpen && <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-3 px-3">{group.group}</div>}
                <div className="space-y-1">
                  {group.items.map(item => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                          ${isActive 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-transparent'
                          }
                          ${!isSidebarOpen ? 'justify-center' : ''}
                        `}
                      >
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        {isSidebarOpen && <span className="truncate">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant/30 text-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex justify-center py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">{isSidebarOpen ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'}</span>
          </button>
        </div>
      </motion.aside>

      
      <main className="flex-1 overflow-y-auto relative h-full bg-surface">
        <div className="noise-overlay pointer-events-none absolute inset-0 z-0 mix-blend-overlay opacity-[0.03]"></div>
        <div className="max-w-6xl mx-auto p-8 relative z-10">
          <AnimatePresence mode="wait">
            {renderSection()}
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
