import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const fatigueData = Array.from({ length: 30 }).map((_, i) => ({
  day: `D-${30 - i}`,
  decisions: Math.floor(Math.random() * 20) + 10,
  fatigueIndex: Math.min(100, Math.floor(i * 1.5) + 30 + (Math.random() * 20))
}));

const decayData = Array.from({ length: 12 }).map((_, i) => ({
  month: `M+${i}`,
  knowledge: Math.max(20, 100 - i * 8 - (Math.random() * 5))
}));

export default function EntropyDash() {
  const [entropy, setEntropy] = useState(34);
  const [drift, setDrift] = useState(12);

  useEffect(() => {
    const i = setInterval(() => {
      setEntropy(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5) - 2)));
      setDrift(prev => Math.min(100, Math.max(0, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
    }, 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col justify-center"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Entropy & Drift Engine</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">Disorder & Vector Deviation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle 
                  cx="64" cy="64" r="60" fill="none" stroke="#f59e0b" strokeWidth="8"
                  strokeDasharray="377" strokeDashoffset={377 - (377 * entropy) / 100}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <span className="text-3xl font-display font-bold text-white">{entropy}%</span>
            </div>
            <span className="mt-4 text-[10px] uppercase tracking-widest text-white/50">Org Entropy</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle 
                  cx="64" cy="64" r="60" fill="none" stroke="#ef4444" strokeWidth="8"
                  strokeDasharray="377" strokeDashoffset={377 - (377 * drift) / 100}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <span className="text-3xl font-display font-bold text-white">{drift.toFixed(1)}%</span>
            </div>
            <span className="mt-4 text-[10px] uppercase tracking-widest text-white/50">Objective Drift</span>
          </div>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Fragility Mapping</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Single Points of Failure</p>
        
        <div className="space-y-4 relative z-10">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded flex justify-between items-center">
            <div>
              <div className="text-sm text-red-200 font-bold">Node: Chief Architect</div>
              <div className="text-[10px] text-red-200/50 uppercase">Knowledge Concentration</div>
            </div>
            <div className="text-lg font-bold text-red-500">92% Risk</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded flex justify-between items-center">
            <div>
              <div className="text-sm text-yellow-200 font-bold">Process: Vendor Approval</div>
              <div className="text-[10px] text-yellow-200/50 uppercase">Single Point of Failure</div>
            </div>
            <div className="text-lg font-bold text-yellow-500">76% Risk</div>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded flex justify-between items-center">
            <div>
              <div className="text-sm text-white/70 font-bold">Team: Core Infrastructure</div>
              <div className="text-[10px] text-white/40 uppercase">Bus Factor: 2</div>
            </div>
            <div className="text-lg font-bold text-white/70">44% Risk</div>
          </div>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Decision Fatigue</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Cognitive Overload Tracking</p>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fatigueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" hide />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="fatigueIndex" stroke="#ef4444" strokeWidth={2} dot={false} name="Fatigue Index" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Knowledge Decay Prediction</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Future Information Loss Forecast</p>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={decayData}>
              <defs>
                <linearGradient id="colorDecay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Area type="monotone" dataKey="knowledge" stroke="#a855f7" fillOpacity={1} fill="url(#colorDecay)" name="Retained Context %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
