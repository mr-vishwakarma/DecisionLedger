import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WorkspaceSettings() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-outline-variant/30 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-geist font-bold text-on-surface">Workspace Configuration</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage global identity and base behaviors of your intelligence environment.</p>
        </div>
        <div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">{isEditing ? 'close' : 'edit'}</span>
            {isEditing ? 'Cancel Edit' : 'Edit Configuration'}
          </button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-xl border border-outline-variant/30 space-y-6 relative overflow-hidden">
            {!isEditing && <div className="absolute inset-0 z-10 cursor-not-allowed"></div>}
            
            <h3 className="font-geist font-bold text-lg mb-4">Identity & Branding</h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Workspace Name</label>
                <input 
                  type="text" 
                  defaultValue="Acme Global Intelligence" 
                  disabled={!isEditing}
                  className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-50" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Workspace Slug</label>
                <input 
                  type="text" 
                  defaultValue="acme-corp" 
                  disabled={!isEditing}
                  className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-primary disabled:opacity-50" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Primary Industry / Sector</label>
              <select 
                disabled={!isEditing}
                className="w-full sm:w-1/2 bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-50"
              >
                <option>Enterprise Software & Cloud</option>
                <option>Financial Services</option>
                <option>Healthcare & Biotech</option>
              </select>
            </div>
            
            {isEditing && (
              <div className="pt-6 flex justify-end">
                <button className="btn-primary" onClick={() => setIsEditing(false)}>Save Changes</button>
              </div>
            )}
          </div>

          <div className="glass-card p-6 rounded-xl border border-outline-variant/30 space-y-6">
            <h3 className="font-geist font-bold text-lg mb-4">Localization & Compliance</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Primary Region</label>
                <select className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
                  <option>US East (N. Virginia)</option>
                  <option>EU (Frankfurt)</option>
                  <option>Asia Pacific (Tokyo)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Default Currency</label>
                <select className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-geist font-bold text-md mb-4 border-b border-outline-variant/30 pb-2">Workspace Health</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">Storage Quota</span>
                  <span className="font-mono text-on-surface">45%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">450GB of 1TB used</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">API Rate Limit</span>
                  <span className="font-mono text-on-surface">12%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[12%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">12,000 / 100,000 requests</p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors border border-primary/20">Upgrade Infrastructure</button>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex gap-4">
            <span className="material-symbols-outlined text-primary text-xl">info</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Changing the workspace slug will break existing external API integrations that hardcode the old slug. 
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
