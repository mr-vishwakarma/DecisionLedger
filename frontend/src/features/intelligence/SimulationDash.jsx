import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SimulationDash() {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [intelligenceScore, setIntelligenceScore] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntelligenceScore(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      <motion.div 
        className="col-span-1 lg:col-span-3 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-xl p-8 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.3)' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
          <div>
            <h2 className="font-display text-4xl text-white mb-2">Executive Command Center</h2>
            <p className="text-sm text-white/60 uppercase tracking-widest max-w-md">Global Sovereign Overview & High-Level Leadership Aggregate View</p>
          </div>
          
          <div className="flex items-center gap-6 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Proprietary Rating</div>
              <div className="text-sm font-medium text-white">Institutional Intelligence Score</div>
            </div>
            <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {intelligenceScore}
            </div>
          </div>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Scaling Simulator</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Growth Modeling</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2 text-white/70">
              <span>Organization Multiplier</span>
              <span>{scaleFactor}x</span>
            </div>
            <input 
              type="range" min="1" max="10" step="0.5"
              value={scaleFactor} onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded border border-white/5">
              <div className="text-[10px] uppercase text-white/50 tracking-wider">Projected Nodes</div>
              <div className="text-xl font-bold text-white">{Math.floor(1250 * scaleFactor).toLocaleString()}</div>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/5">
              <div className="text-[10px] uppercase text-white/50 tracking-wider">Compute Load</div>
              <div className="text-xl font-bold text-yellow-400">{(45 * scaleFactor).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Stress Testing Engine</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Complexity Simulation</p>
        
        <div className="flex flex-col items-center justify-center h-40">
          <motion.div 
            className="w-20 h-20 border-4 border-dashed border-red-500/50 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <span className="material-symbols-outlined text-red-400 text-3xl">warning</span>
          </motion.div>
          <button className="mt-6 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs uppercase tracking-widest hover:bg-red-500/30 transition-colors">
            Initiate Stress Protocol
          </button>
        </div>
      </motion.div>

      
      <div className="flex flex-col gap-6">
        
        
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex-1"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h3 className="font-display text-xl text-white mb-1">Decision Replay</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Visual History Playback</p>
          
          <div className="bg-black/50 border border-white/5 rounded-lg p-4 flex items-center justify-center gap-6">
            <button className="text-white/50 hover:text-white transition-colors"><span className="material-symbols-outlined">fast_rewind</span></button>
            <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"><span className="material-symbols-outlined">play_arrow</span></button>
            <button className="text-white/50 hover:text-white transition-colors"><span className="material-symbols-outlined">fast_forward</span></button>
          </div>
          <div className="w-full h-1 bg-white/20 mt-4 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-white"></div>
          </div>
        </motion.div>

        
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex-1"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h3 className="font-display text-xl text-white mb-1">Predictive Insights</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-4">AI Recommendations</p>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-200 flex gap-3">
              <span className="material-symbols-outlined text-blue-400">lightbulb</span>
              Recommend extending voting period for Node 12 based on historical delay patterns.
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-200 flex gap-3">
              <span className="material-symbols-outlined text-yellow-400">warning</span>
              Warning: 45% probability of budget overrun in current trajectory.
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
