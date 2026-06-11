import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const journeyStages = [
  { id: 'problem', title: 'Problem ID', desc: 'A challenge is raised and documented natively within the ledger.', icon: 'report_problem' },
  { id: 'discussion', title: 'Discussion', desc: 'Contextual debate happens directly attached to the node, not in lost Slack threads.', icon: 'forum' },
  { id: 'voting', title: 'Governance Vote', desc: 'Quorum rules apply. Stakeholders cast cryptographically signed votes.', icon: 'how_to_vote' },
  { id: 'approval', title: 'Consensus Approval', desc: 'Automated policy triggers clear the decision for execution.', icon: 'verified' },
  { id: 'execution', title: 'Execution', desc: 'Actions are taken and tracked against the original intent.', icon: 'play_arrow' },
  { id: 'impact', title: 'Impact Measured', desc: 'Analytics engines compare the result vs original forecasts.', icon: 'monitoring' }
];

const industries = {
  startup: { title: 'High-Growth Startups', example: 'Pivoting product roadmap to capture enterprise B2B market, requiring unanimous board consent.' },
  enterprise: { title: 'Global Enterprises', example: 'M&A acquisition of competitor, navigating 14 layers of compliance and legal review.' },
  government: { title: 'Government Agencies', example: 'Policy change affecting public infrastructure, requiring absolute transparent audit trails.' },
  healthcare: { title: 'Healthcare Networks', example: 'Standardizing new patient data protocols across 12 hospitals with strict HIPAA governance.' }
};

const decisionTypes = [
  { type: 'Strategic Hiring', icon: 'person_add' },
  { type: 'Budget Reallocation', icon: 'payments' },
  { type: 'Product Roadmap', icon: 'map' },
  { type: 'Legal Settlement', icon: 'gavel' },
  { type: 'Vendor Selection', icon: 'store' },
  { type: 'Architecture Pivot', icon: 'architecture' }
];

export default function JourneyExplorationSection() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeIndustry, setActiveIndustry] = useState('enterprise');
  const [activeType, setActiveType] = useState(null);

  return (
    <div className="w-full flex flex-col items-center">
      
      
      <section className="min-h-screen w-full flex items-center justify-center relative bg-[#0a0a0a] px-margin-page border-t border-white/5 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0,transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 relative z-10">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-blue-500 mb-6 block">04 / The Infrastructure Pipeline</span>
            <h2 className="font-display text-5xl md:text-6xl tracking-tighter text-white mb-6">The Decision Journey</h2>
            <p className="font-body text-md text-white/50 max-w-2xl mx-auto leading-relaxed">
              Most systems stop tracking after execution. DecisionLedger continues indefinitely, creating a permanent feedback loop of institutional intelligence.
            </p>
          </div>

          
          <div className="relative z-10">
            
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block">
              <motion.div 
                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" 
                animate={{ width: `${(activeStage / (journeyStages.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
              {journeyStages.map((stage, idx) => {
                const isActive = idx === activeStage;
                const isPast = idx < activeStage;
                return (
                  <div key={stage.id} className="relative flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveStage(idx)}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-4 transition-all duration-300 relative z-10 bg-[#0a0a0a] ${
                      isActive ? 'border-blue-500 text-blue-500 scale-125 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 
                      isPast ? 'border-blue-500/50 text-blue-500/50' : 'border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white/50'
                    }`}>
                      <span className="material-symbols-outlined text-xl">{stage.icon}</span>
                    </div>
                    
                    <div className={`text-center transition-all duration-300 ${isActive ? 'opacity-100 transform translate-y-2' : 'opacity-40'}`}>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isActive ? 'text-white' : 'text-white/70'}`}>{stage.title}</div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-white/50 px-2 leading-relaxed"
                          >
                            {stage.desc}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          
          <div className="mt-32 p-8 border border-purple-500/30 bg-purple-900/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><span className="material-symbols-outlined text-6xl text-purple-500">all_inclusive</span></div>
            <h3 className="font-display text-2xl text-white mb-2">Infinite Continuation</h3>
            <p className="text-sm text-white/60 max-w-2xl">
              Unlike chat apps where context dies immediately, the ledger preserves the "Why" forever. Future employees can query this node in 2030 and understand exactly why this strategic bet was placed today.
            </p>
          </div>
        </div>
      </section>

      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#080808] px-margin-page border-t border-white/5 py-32">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-purple-500 mb-6 block">05 / Cross-Industry Application</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-8">Sovereign Architecture for Every Scale</h2>
            
            <div className="flex flex-col gap-2 mb-8">
              {Object.keys(industries).map((key) => (
                <button 
                  key={key} onClick={() => setActiveIndustry(key)}
                  className={`text-left px-6 py-4 rounded-lg transition-all border ${
                    activeIndustry === key ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-transparent border-white/5 text-white/40 hover:bg-white/5'
                  }`}
                >
                  <span className="font-display text-xl">{industries[key].title}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIndustry}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="p-6 bg-black/50 border border-white/10 rounded-lg backdrop-blur-sm"
              >
                <div className="text-[10px] uppercase tracking-widest text-purple-400 mb-2 font-bold">Simulated Ledger Entry</div>
                <div className="text-sm text-white/80 leading-relaxed font-mono">
                  {industries[activeIndustry].example}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          
          <div className="flex flex-col justify-center">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-green-500 mb-6 block">06 / Universal Schema</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-8">Not Just for Code</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {decisionTypes.map((dt, idx) => (
                <motion.div 
                  key={idx}
                  onClick={() => setActiveType(activeType === idx ? null : idx)}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    activeType === idx ? 'bg-green-500/10 border-green-500/50 scale-105 shadow-[0_0_30px_rgba(34,197,94,0.15)] z-10 relative' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl mb-4 block transition-colors ${activeType === idx ? 'text-green-400' : 'text-white/40'}`}>
                    {dt.icon}
                  </span>
                  <div className={`font-bold text-sm ${activeType === idx ? 'text-white' : 'text-white/70'}`}>{dt.type}</div>
                  
                  <AnimatePresence>
                    {activeType === idx && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 text-[10px] text-white/50 uppercase tracking-widest border-t border-green-500/20 pt-4"
                      >
                        Click to view schema framework inside the ledger workspace.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#020202] px-margin-page border-y border-white/5 py-32 overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-[20vw] text-white/[0.02] whitespace-nowrap pointer-events-none tracking-tighter">
          SIMULATION
        </div>

        <div className="max-w-6xl w-full relative z-10 text-center">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block">07 / The Sandbox</span>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-white mb-8">Run the Simulation.</h2>
          <p className="font-body text-md text-white/50 max-w-2xl mx-auto leading-relaxed mb-16">
            We built a massive, interconnected intelligence simulator to demonstrate the raw power of the platform. Jump into the Executive Command Center and watch the simulated organization breathe.
          </p>

          <a 
            href="/systems"
            className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            Enter Executive Command Center
          </a>
        </div>
      </section>
    </div>
  );
}
