import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const trustData = [
  { name: 'Finance', value: 85, color: '#3b82f6' },
  { name: 'Legal', value: 92, color: '#a855f7' },
  { name: 'Ops', value: 78, color: '#ef4444' },
  { name: 'Leadership', value: 88, color: '#10b981' }
];

export default function AgentsDash() {
  const [activeAgent, setActiveAgent] = useState('none');
  const [consensus, setConsensus] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setConsensus(prev => (prev < 100 ? prev + 2 : 0));
    }, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 1. Multi Agent Decision Simulator & Explainability */}
      <motion.div 
        className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex-1">
          <h3 className="font-display text-xl text-white mb-1">Multi-Agent Decision Simulator</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Competing Recommendations</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            {['Finance', 'Legal', 'Ops', 'Leadership'].map(agent => (
              <button 
                key={agent}
                onClick={() => setActiveAgent(agent)}
                className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${
                  activeAgent === agent 
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                {agent} Agent
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeAgent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 bg-white/5 border border-white/10 rounded-lg h-32 flex items-center"
            >
              <div className="text-sm text-white/80 leading-relaxed font-mono">
                {activeAgent === 'none' && 'Select an agent to simulate recommendation...'}
                {activeAgent === 'Finance' && '> SIMULATION: Proceed with acquisition. CAPEX impact within bounds. ROI projected at +14% YoY.'}
                {activeAgent === 'Legal' && '> SIMULATION: Block acquisition. Antitrust exposure detected in EU region. Risk multiplier exceeds 2.5x threshold.'}
                {activeAgent === 'Ops' && '> SIMULATION: Conditional proceed. Require 6-month integration runway and +20 headcount in DevOps.'}
                {activeAgent === 'Leadership' && '> SIMULATION: Override. Strategic alignment demands immediate execution. Absorbing legal risk.'}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Explainability Engine */}
        <div className="w-full md:w-1/3 bg-black/50 border border-white/5 p-4 rounded-lg flex flex-col justify-center">
          <h4 className="text-xs text-white/50 uppercase tracking-widest mb-4">Explainability Engine</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Reasoning Nodes</span>
              <span className="text-blue-400 font-bold">14,021</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
              <motion.div className="h-full bg-blue-500" animate={{ width: activeAgent !== 'none' ? '100%' : '0%' }} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Confidence</span>
              <span className="text-green-400 font-bold">94.2%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Autonomous Governance Simulator */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Autonomous Governance</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Policy Sandbox</p>
        
        <div className="space-y-4">
          {['Enforce Quorum Before Draft', 'Auto-Approve Low Impact', 'Mandatory Legal Review'].map((policy, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-sm text-white/80">{policy}</span>
              <div className="w-10 h-5 bg-green-500/20 rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-3 h-3 bg-green-500 rounded-full translate-x-5"></div>
              </div>
            </div>
          ))}
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-200">
            <strong>Simulation Output:</strong> Applying these policies accelerates throughput by 14% while increasing legal compliance by 8%.
          </div>
        </div>
      </motion.div>

      {/* 3 & 4. Consensus Formation & Trust Engine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Consensus & Trust</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">Live Formation Metrics</p>
          </div>
          <div className="text-3xl font-display font-bold text-white">{consensus}%</div>
        </div>
        
        <div className="flex-1 flex items-center gap-6">
          <div className="h-40 w-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trustData} innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                  {trustData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">Trust</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="w-full bg-white/5 p-3 rounded border border-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-500/20 border-r border-blue-500" 
                animate={{ width: `${consensus}%` }} transition={{ duration: 0.5 }}
              />
              <div className="relative z-10 text-xs font-bold text-white flex justify-between">
                <span>Alignment Merging</span>
                <span>{consensus} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
