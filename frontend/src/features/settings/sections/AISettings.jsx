import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AISettings() {
  const [summariesEnabled, setSummariesEnabled] = useState(true);
  const [riskAnalysisEnabled, setRiskAnalysisEnabled] = useState(true);
  const [autonomousEnabled, setAutonomousEnabled] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8 border-b border-outline-variant/30 pb-4">
        <div>
          <h2 className="text-2xl font-geist font-bold text-on-surface">AI Configuration</h2>
          <p className="text-sm text-on-surface-variant mt-1">Configure artificial intelligence behaviors, risk models, and autonomous capabilities.</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Features Config */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-geist font-bold text-lg mb-6">Cognitive Features</h3>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-sm">Automated Decision Summaries</div>
                  <p className="text-xs text-on-surface-variant mt-1">AI agents generate concise TL;DRs for long proposal threads.</p>
                </div>
                <button 
                  onClick={() => setSummariesEnabled(!summariesEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${summariesEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-background rounded-full absolute top-1 transition-transform ${summariesEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-sm">Risk Analysis Engine</div>
                  <p className="text-xs text-on-surface-variant mt-1">Automatically highlight potential conflicts and security risks in proposals.</p>
                </div>
                <button 
                  onClick={() => setRiskAnalysisEnabled(!riskAnalysisEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${riskAnalysisEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-background rounded-full absolute top-1 transition-transform ${riskAnalysisEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    Autonomous Resolution <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 rounded text-[10px] font-bold">BETA</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">Allow AI to automatically approve low-impact operational decisions based on historical ledger data.</p>
                </div>
                <button 
                  onClick={() => setAutonomousEnabled(!autonomousEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${autonomousEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-background rounded-full absolute top-1 transition-transform ${autonomousEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-geist font-bold text-lg mb-6">Model Selection</h3>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Primary Cognitive Engine</label>
              <select className="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
                <option>DecisionLedger Proprietary (Default)</option>
                <option>GPT-4 Enterprise</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Custom Internal Model (Requires API key)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <h3 className="font-geist font-bold text-lg">Live AI Preview</h3>
          </div>
          
          <div className="flex-1 bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Simulated Proposal: Migrate to AWS</div>
            
            <div className="space-y-4">
              {summariesEnabled && (
                <div className="p-3 bg-surface-container rounded-md border border-outline-variant/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Summary
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Proposing migration of main cluster to AWS us-east-1 to reduce latency by 15ms. Estimated cost increase: 12% YoY.
                  </p>
                </div>
              )}
              
              {riskAnalysisEnabled && (
                <div className="p-3 bg-error/10 rounded-md border border-error/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-error mb-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Risk Detected
                  </div>
                  <p className="text-xs text-error leading-relaxed">
                    AWS us-east-1 has experienced 3 major outages in the past 24 months. Consider multi-region redundancy.
                  </p>
                </div>
              )}

              {autonomousEnabled && (
                <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-1">
                    <span className="material-symbols-outlined text-[14px]">smart_toy</span> Agent Action
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                    This decision exceeds the $5,000 threshold for autonomous approval. Routed to human reviewers.
                  </p>
                </div>
              )}
              
              {!summariesEnabled && !riskAnalysisEnabled && !autonomousEnabled && (
                <div className="text-center text-xs text-on-surface-variant py-8 italic">
                  All AI features are currently disabled.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
