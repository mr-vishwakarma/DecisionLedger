import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const benchmarkData = [
  { name: 'Engineering', score: 85, baseline: 75 },
  { name: 'Marketing', score: 72, baseline: 75 },
  { name: 'Finance', score: 92, baseline: 75 },
  { name: 'Legal', score: 95, baseline: 75 },
  { name: 'Sales', score: 68, baseline: 75 },
];

export default function AdvancedGovDash() {
  const [timeYear, setTimeYear] = useState(2024);
  const [isCompressing, setIsCompressing] = useState(false);
  const [policies, setPolicies] = useState([
    { condition: 'Impact > $1M', action: 'Require Board Approval' },
    { condition: 'Risk == High', action: 'Trigger Legal Audit' }
  ]);

  const handleCompress = () => {
    setIsCompressing(true);
    setTimeout(() => setIsCompressing(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 1. Governance Maturity Engine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Maturity Engine</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Governance Scoring</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Overall Governance Score</span>
              <span className="font-bold text-green-400">Level 4 (Managed)</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1 }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Compliance Adherence</span>
              <span className="font-bold text-white">92%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1.2 }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Decision Quality Index</span>
              <span className="font-bold text-white">88%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: '88%' }} transition={{ duration: 1.4 }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Decision Quality Benchmarking */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Quality Benchmarking</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Cross-Team Performance</p>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" fontSize={10} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Quality Score" />
              <Bar dataKey="baseline" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} name="Baseline" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 3. Governance Policy Engine */}
      <motion.div 
        className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Governance Policy Engine</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">IF / THEN Policy Builder</p>
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded text-xs hover:bg-white/10">
            + New Rule
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {policies.map((policy, idx) => (
            <div key={idx} className="min-w-[300px] flex-shrink-0 bg-black/50 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-400">
                <span className="bg-blue-500/20 px-2 py-1 rounded">IF</span>
                <div className="flex-1 border-b border-white/10 border-dashed"></div>
              </div>
              <div className="p-3 bg-white/5 rounded text-sm text-white mb-4">
                {policy.condition}
              </div>
              
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-purple-400">
                <span className="bg-purple-500/20 px-2 py-1 rounded">THEN</span>
                <div className="flex-1 border-b border-white/10 border-dashed"></div>
              </div>
              <div className="p-3 bg-white/5 rounded text-sm text-white">
                {policy.action}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. Organizational Memory Compression */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1 text-center">Memory Compression</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6 text-center">Archive & Synthesize</p>
        
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <AnimatePresence>
              {isCompressing ? (
                <motion.div 
                  initial={{ scale: 1 }} animate={{ scale: [1, 0.5, 1], rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 border-4 border-dashed border-blue-500 rounded-full"
                />
              ) : (
                <motion.div className="text-center">
                  <div className="text-3xl font-display font-bold text-white">2.4<span className="text-sm">TB</span></div>
                  <div className="text-[9px] uppercase text-white/50">Uncompressed</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 border border-white/10 rounded-full"></div>
          </div>
          
          <button 
            onClick={handleCompress}
            disabled={isCompressing}
            className="px-6 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs uppercase tracking-widest hover:bg-blue-500/30 transition-colors"
          >
            {isCompressing ? 'Compressing...' : 'Initiate Neural Compression'}
          </button>
        </div>
      </motion.div>

      {/* 5. Institutional Memory Time Machine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Memory Time Machine</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Historical Org State Explorer</p>
        
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="text-center">
            <motion.div 
              key={timeYear}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-display font-bold text-white"
            >
              {timeYear}
            </motion.div>
            <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Viewing organizational state</div>
          </div>
          
          <div>
            <input 
              type="range" min="2018" max="2025" step="1"
              value={timeYear} onChange={(e) => setTimeYear(parseInt(e.target.value))}
              className="w-full accent-white bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-[10px] text-white/40 font-mono">
              <span>2018</span><span>2021</span><span>2025</span>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
