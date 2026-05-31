import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemCostSection() {
  const [costCounter, setCostCounter] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState('current'); // 'current' or 'ledger'
  const [memoryLossIndex, setMemoryLossIndex] = useState(0);

  const memoryStages = [
    { text: "Full Context Present", opacity: 1, blur: 'blur(0px)' },
    { text: "Key Details Forgotten", opacity: 0.7, blur: 'blur(2px)' },
    { text: "Reasoning Lost", opacity: 0.4, blur: 'blur(4px)' },
    { text: "Only the Decision Remains", opacity: 0.1, blur: 'blur(8px)' }
  ];

  useEffect(() => {
    // Animate cost counter
    const costInterval = setInterval(() => {
      setCostCounter(prev => prev + Math.floor(Math.random() * 500) + 100);
    }, 50);

    // Animate memory loss cycle
    const memoryInterval = setInterval(() => {
      setMemoryLossIndex(prev => (prev + 1) % memoryStages.length);
    }, 2500);

    return () => {
      clearInterval(costInterval);
      clearInterval(memoryInterval);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* SECTION 1: PROBLEM SECTION (Organizational Memory Loss) */}
      <section className="min-h-screen w-full flex items-center justify-center relative bg-[#050505] px-margin-page border-t border-white/5 py-32">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-red-500 mb-6 block">01 / The Problem</span>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-white mb-8 leading-tight">
              Organizations forget <span className="italic text-white/50">why</span> decisions happened.
            </h2>
            <p className="font-body text-md text-white/60 max-w-md leading-relaxed mb-8">
              Personnel changes. Slack threads disappear. Spreadsheets lack context. Within 6 months, the reasoning behind strategic pivots is completely lost, leading to repeated mistakes.
            </p>
          </div>
          
          <div className="relative h-[400px] flex flex-col justify-center items-center bg-white/5 border border-white/10 rounded-2xl p-8 overflow-hidden">
            <h3 className="absolute top-6 left-6 text-[10px] uppercase tracking-widest text-white/40">Knowledge Decay Simulation</h3>
            <motion.div 
              className="text-center transition-all duration-1000"
              style={{ opacity: memoryStages[memoryLossIndex].opacity, filter: memoryStages[memoryLossIndex].blur }}
            >
              <div className="text-3xl font-display text-white mb-4">"Acquire Competitor X"</div>
              <div className="text-sm font-mono text-white/70 bg-black/50 p-4 rounded text-left border border-white/10 shadow-xl">
                <span className="text-blue-400">Context:</span> Market consolidation necessary to outpace Series B rival.<br/>
                <span className="text-purple-400">Vote:</span> Unanimous (8/8).<br/>
                <span className="text-red-400">Risk:</span> High regulatory friction in EU.
              </div>
            </motion.div>
            <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2">
              {memoryStages.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === memoryLossIndex ? 'bg-red-500 scale-150' : 'bg-white/20'}`}></div>
              ))}
            </div>
            <div className="absolute bottom-12 text-[10px] uppercase tracking-widest text-red-400 font-bold">
              {memoryStages[memoryLossIndex].text}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COST OF BAD DECISIONS */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-b from-[#050505] to-[#0a0000] px-margin-page border-t border-white/5 py-32">
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-red-500 mb-6 block text-center">02 / The Consequence</span>
        <h2 className="font-display text-5xl tracking-tighter text-white mb-16 text-center max-w-2xl">
          The compounding cost of lost institutional knowledge.
        </h2>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-red-950/20 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-4">hourglass_empty</span>
            <div className="font-display text-4xl text-white mb-2 font-bold">+45 Days</div>
            <div className="text-xs uppercase tracking-widest text-white/50">Average Approval Delay</div>
          </div>
          <div className="bg-red-950/20 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center text-center transform md:-translate-y-8">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-4">payments</span>
            <div className="font-display text-5xl text-red-400 mb-2 font-bold">${costCounter.toLocaleString()}</div>
            <div className="text-xs uppercase tracking-widest text-white/50">Capital Wasted on Repeated Work</div>
            <div className="text-[9px] text-red-500/50 mt-4 uppercase">(Simulated organizational bleed)</div>
          </div>
          <div className="bg-red-950/20 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
            <div className="font-display text-4xl text-white mb-2 font-bold">32%</div>
            <div className="text-xs uppercase tracking-widest text-white/50">Strategic Mistakes Repeated</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW ORGANIZATIONS WORK TODAY */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#050505] px-margin-page border-t border-white/5 py-32">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-blue-500 mb-6 block">03 / The Paradigm Shift</span>
            <h2 className="font-display text-5xl tracking-tighter text-white">Compare Architectures</h2>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white/5 p-1 rounded-full border border-white/10 flex">
              <button 
                onClick={() => setActiveWorkflow('current')}
                className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all ${activeWorkflow === 'current' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'text-white/50 hover:text-white'}`}
              >
                Current Chaos
              </button>
              <button 
                onClick={() => setActiveWorkflow('ledger')}
                className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all ${activeWorkflow === 'ledger' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/50 hover:text-white'}`}
              >
                DecisionLedger
              </button>
            </div>
          </div>

          <div className="relative h-[500px] w-full bg-black/50 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {activeWorkflow === 'current' ? (
                <motion.div 
                  key="current"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full relative"
                >
                  <div className="absolute top-1/4 left-1/4 w-48 h-32 bg-green-900/20 border border-green-500/30 rounded flex flex-col justify-center items-center -rotate-6 transform hover:scale-105 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-green-500 mb-2">grid_on</span>
                    <span className="text-xs text-white/70">Disconnected Spreadsheets</span>
                  </div>
                  <div className="absolute top-1/3 right-1/4 w-48 h-32 bg-purple-900/20 border border-purple-500/30 rounded flex flex-col justify-center items-center rotate-6 transform hover:scale-105 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-purple-500 mb-2">forum</span>
                    <span className="text-xs text-white/70">Lost Chat Threads</span>
                  </div>
                  <div className="absolute bottom-1/4 left-1/3 w-48 h-32 bg-blue-900/20 border border-blue-500/30 rounded flex flex-col justify-center items-center rotate-2 transform hover:scale-105 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-blue-500 mb-2">mail</span>
                    <span className="text-xs text-white/70">Siloed Emails</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-red-500/20 rounded-full animate-ping pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-2 block">warning</span>
                    <span className="font-display text-xl text-white block">No Source of Truth</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="ledger"
                  initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                  className="w-full h-full flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_50%)]"></div>
                  
                  {/* Central Hub */}
                  <div className="relative z-10 w-64 h-64 bg-blue-900/20 border border-blue-500/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                    <span className="material-symbols-outlined text-5xl text-blue-400 mb-2">account_balance</span>
                    <span className="font-display text-xl text-white font-bold tracking-widest uppercase">Immutable Ledger</span>
                  </div>

                  {/* Connected Nodes */}
                  <div className="absolute top-1/2 left-[15%] w-32 h-24 bg-white/5 border border-white/20 rounded flex flex-col items-center justify-center -translate-y-1/2 z-20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-white mb-1">Context</span>
                    <span className="text-[9px] text-white/50 uppercase tracking-widest">Preserved</span>
                  </div>
                  <div className="absolute top-1/2 right-[15%] w-32 h-24 bg-white/5 border border-white/20 rounded flex flex-col items-center justify-center -translate-y-1/2 z-20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-white mb-1">Voting</span>
                    <span className="text-[9px] text-white/50 uppercase tracking-widest">Auditable</span>
                  </div>
                  
                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="85%" y1="50%" x2="50%" y2="50%" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" from="0" to="100" dur="2s" repeatCount="indefinite" />
                    </line>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

    </div>
  );
}
