import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GovernanceSettings() {
  const [rules, setRules] = useState([
    { id: 1, condition: 'Budget > $10,000', action: 'Require Executive Approval' },
    { id: 2, condition: 'Risk == High', action: 'Require Security Review & 75% Consensus' }
  ]);
  
  const [activeTab, setActiveTab] = useState('rules');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-outline-variant/30 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-geist font-bold text-on-surface">Governance Engine</h2>
          <p className="text-sm text-on-surface-variant mt-1">Configure automated policies, routing, and decision constraints.</p>
        </div>
        <div className="flex bg-surface-container-high rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'rules' ? 'bg-primary text-background' : 'text-on-surface-variant hover:text-on-surface'}`}
          >Policy Rules</button>
          <button 
            onClick={() => setActiveTab('voting')}
            className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'voting' ? 'bg-primary text-background' : 'text-on-surface-variant hover:text-on-surface'}`}
          >Voting Engine</button>
          <button 
            onClick={() => setActiveTab('retention')}
            className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'retention' ? 'bg-primary text-background' : 'text-on-surface-variant hover:text-on-surface'}`}
          >Retention</button>
        </div>
      </div>
      
      {activeTab === 'rules' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-geist font-bold text-lg">Active Policy Rules</h3>
              <button className="btn-primary flex items-center gap-2"><span className="material-symbols-outlined text-sm">add</span> New Rule</button>
            </div>
            
            <div className="space-y-4">
              {rules.map(rule => (
                <div key={rule.id} className="glass-card p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="px-3 py-1.5 bg-surface-container-highest rounded text-xs font-mono font-bold text-on-surface-variant whitespace-nowrap">
                      IF <span className="text-blue-500">{rule.condition}</span>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant hidden sm:block">arrow_forward</span>
                    <div className="px-3 py-1.5 bg-primary/10 rounded text-xs font-mono font-bold text-primary whitespace-nowrap">
                      THEN <span className="text-primary">{rule.action}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button className="p-2 hover:bg-error/10 hover:text-error rounded text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </div>
              ))}
              
              <div className="glass-card p-6 rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center bg-surface-container-low/50">
                <span className="material-symbols-outlined text-outline-variant mb-2">account_tree</span>
                <p className="text-sm font-semibold text-on-surface-variant">Build new policy rule</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">Configure trigger conditions and governance actions.</p>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl space-y-6 self-start sticky top-6">
            <h3 className="font-geist font-bold text-md border-b border-outline-variant/30 pb-2">Rule Simulator</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Test Condition</label>
                <select className="w-full bg-surface-container-high border border-outline-variant/50 rounded p-2 text-sm text-on-surface">
                  <option>Risk == High</option>
                  <option>Budget &gt; $10,000</option>
                </select>
              </div>
              <div className="p-4 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-lg">
                <div className="flex items-center gap-2 text-[#16a34a] font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Rule Triggered
                </div>
                <p className="text-xs text-[#16a34a]/80">The action "Require Security Review & 75% Consensus" will be applied.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'voting' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-outline-variant/30 space-y-6">
            <h3 className="font-geist font-bold text-lg">Consensus Thresholds</h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-bold block mb-2">Default Approval Requirement</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="w-full accent-primary" defaultValue="51" />
                  <span className="font-mono font-bold">51%</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Percentage of active voters required to approve standard decisions.</p>
              </div>
              <div>
                <label className="text-sm font-bold block mb-2">Quorum Minimum</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="w-full accent-primary" defaultValue="33" />
                  <span className="font-mono font-bold">33%</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Minimum percentage of eligible voters who must participate.</p>
              </div>
            </div>
            
            <hr className="border-outline-variant/20" />
            
            <h3 className="font-geist font-bold text-lg mt-6">Voting Duration Defaults</h3>
            <div className="flex items-center gap-4">
              <input type="number" defaultValue="72" className="bg-surface-container-high border border-outline-variant/50 rounded px-3 py-2 w-24 text-on-surface font-mono" />
              <span className="text-sm text-on-surface-variant">Hours</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'retention' && (
        <div className="glass-card p-8 rounded-xl border border-outline-variant/30 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary/40 mb-4 block">inventory_2</span>
            <h3 className="text-lg font-bold text-on-surface mb-2">Retention Engine</h3>
            <p className="text-sm text-on-surface-variant">Configure data lifecycle rules.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
