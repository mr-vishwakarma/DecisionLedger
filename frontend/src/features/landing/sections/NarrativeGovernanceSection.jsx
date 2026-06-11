import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stories = [
  { company: 'Acme Corp', problem: 'Lost 6 months reversing an architecture decision due to forgotten context.', outcome: 'Achieved 100% architectural clarity and saved $2M in redundant rework.' },
  { company: 'Global Bank', problem: 'Regulatory fines due to undocumented compliance approvals.', outcome: 'Passed SOC2/ISO audits with zero exceptions using immutable voting ledgers.' }
];

export default function NarrativeGovernanceSection() {
  const [activeStory, setActiveStory] = useState(0);
  const [scaleUsers, setScaleUsers] = useState(10);
  
  useEffect(() => {
    const storyInterval = setInterval(() => {
      setActiveStory(prev => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(storyInterval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      
      
      <section className="min-h-screen w-full flex items-center justify-center relative bg-[#050505] px-margin-page border-b border-white/5 py-32">
        <div className="max-w-6xl w-full">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block text-center">08 / The Narrative</span>
          <h2 className="font-display text-5xl tracking-tighter text-white mb-16 text-center">History Validates the Architecture</h2>

          <div className="relative h-[300px] flex items-center justify-center bg-black/50 border border-white/10 rounded-2xl p-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStory}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col md:flex-row items-center gap-12"
              >
                <div className="flex-1 text-center md:text-right border-b md:border-b-0 md:border-r border-red-500/30 pb-8 md:pb-0 md:pr-12">
                  <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold block mb-4">The Problem</span>
                  <div className="text-xl font-display text-white/80">"{stories[activeStory].problem}"</div>
                  <div className="mt-4 text-xs text-white/40 font-mono">— {stories[activeStory].company} Before</div>
                </div>
                
                <div className="flex-1 text-center md:text-left pt-8 md:pt-0 md:pl-12">
                  <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold block mb-4">The Outcome</span>
                  <div className="text-xl font-display text-white">"{stories[activeStory].outcome}"</div>
                  <div className="mt-4 text-xs text-white/40 font-mono">— {stories[activeStory].company} After</div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4">
              {stories.map((_, idx) => (
                <div key={idx} className={`h-1 transition-all rounded ${idx === activeStory ? 'w-8 bg-white' : 'w-4 bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      
      <section className="min-h-[80vh] w-full flex items-center justify-center relative bg-[#0a0a0a] px-margin-page border-b border-white/5 py-32">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-blue-500 mb-6 block">09 / Collaboration</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-6">Multi-Stakeholder Consensus</h2>
            <p className="font-body text-sm text-white/60 mb-12">
              Watch alignment happen live. Comments, votes, and contextual debates are fused directly into the node, locking the narrative permanently into the ledger.
            </p>
            
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-purple-500 mb-6 block">10 / Security</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-6">Why Immutability Matters</h2>
            <p className="font-body text-sm text-white/60">
              In chat apps, history can be deleted or lost. In our architecture, the cryptographic ledger ensures that once a decision is locked, it becomes a permanent artifact of organizational history.
            </p>
          </div>
          
          <div className="relative h-[500px] bg-[#050505] border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col gap-4 shadow-2xl">
            <div className="absolute top-0 right-0 p-4"><span className="material-symbols-outlined text-green-500">lock</span></div>
            
            
            <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="bg-white/5 p-4 rounded-lg border border-white/10 mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-400">@sarah_eng</span>
                <span className="text-[9px] text-white/30">Just now</span>
              </div>
              <div className="text-sm text-white/80">I vote YES. The new API architecture solves our scaling issues.</div>
            </motion.div>
            
            <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-purple-400">@legal_team</span>
                <span className="text-[9px] text-white/30">2m ago</span>
              </div>
              <div className="text-sm text-white/80">Approved. Vendor compliance checks out.</div>
            </motion.div>
            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-auto bg-green-500/20 border border-green-500/50 p-4 rounded-lg text-center">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest block mb-1">Consensus Reached</span>
              <span className="text-[10px] text-white/50 font-mono">Hash: 0x9a8b...f12c</span>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#050505] px-margin-page border-b border-white/5 py-32">
        <div className="max-w-6xl w-full text-center mb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block">11 / Compliance</span>
          <h2 className="font-display text-5xl md:text-6xl tracking-tighter text-white mb-6">Enterprise Trust & Governance</h2>
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-4xl text-white mb-6 block">account_tree</span>
            <h3 className="font-display text-2xl text-white mb-4">Approval Flows</h3>
            <p className="text-sm text-white/60">Build complex routing logic. E.g., If Budget &gt; $50k, mandate CFO sign-off before proceeding.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-4xl text-white mb-6 block">security</span>
            <h3 className="font-display text-2xl text-white mb-4">Granular Permissions</h3>
            <p className="text-sm text-white/60">Strict RBAC controls. Ensure sensitive strategic data is only accessible by cleared executive nodes.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-4xl text-white mb-6 block">verified_user</span>
            <h3 className="font-display text-2xl text-white mb-4">Audit Trails</h3>
            <p className="text-sm text-white/60">Pass SOC2 and ISO compliance effortlessly. Every interaction is timestamped and cryptographically secured.</p>
          </div>
        </div>
      </section>

      
      <section className="min-h-[80vh] w-full flex flex-col items-center justify-center relative bg-[#020202] px-margin-page py-32">
        <div className="max-w-4xl w-full text-center">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block">12 / Scalability</span>
          <h2 className="font-display text-5xl tracking-tighter text-white mb-16">Infrastructure that Adapts</h2>

          <div className="bg-black/50 border border-white/10 p-12 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between mb-8 text-[10px] uppercase tracking-widest font-bold text-white/50">
              <span>10 Users</span><span>100 Users</span><span>1k Users</span><span>10k+ Users</span>
            </div>
            <input 
              type="range" min="10" max="10000" step="10"
              value={scaleUsers} onChange={(e) => setScaleUsers(parseInt(e.target.value))}
              className="w-full accent-blue-500 bg-white/10 h-2 rounded-lg appearance-none cursor-pointer mb-12 relative z-10"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
              <div>
                <div className="text-3xl font-display font-bold text-white mb-2">{scaleUsers.toLocaleString()}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40">Active Nodes</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-blue-400 mb-2">{(scaleUsers * 4.2).toFixed(0)}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40">Decisions/Mo</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-purple-400 mb-2">{(scaleUsers * 0.05).toFixed(1)}ms</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40">Query Latency</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-green-400 mb-2">99.99%</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40">Uptime SLA</div>
              </div>
            </div>

            
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: `${Math.max(4, 50 - (scaleUsers / 250))}px ${Math.max(4, 50 - (scaleUsers / 250))}px`
            }}></div>
          </div>
        </div>
      </section>

    </div>
  );
}
