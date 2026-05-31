import { motion } from 'framer-motion';
import {
  Treemap, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid
} from 'recharts';

const bottleneckData = [
  { name: 'Legal Review', size: 4000, fill: '#ef4444' },
  { name: 'Financial Audit', size: 3000, fill: '#f59e0b' },
  { name: 'Security Review', size: 2000, fill: '#3b82f6' },
  { name: 'Executive Signoff', size: 2780, fill: '#8b5cf6' },
  { name: 'HR Approval', size: 1890, fill: '#10b981' },
];

const riskData = Array.from({ length: 20 }).map((_, i) => ({
  x: Math.random() * 100, // Impact
  y: Math.random() * 100, // Probability/Uncertainty
  z: Math.random() * 200 + 50, // Value at Risk
  name: `Initiative ${i+1}`
}));

const complianceData = [
  { name: 'Compliant', value: 85, color: '#22c55e' },
  { name: 'Pending Review', value: 10, color: '#f59e0b' },
  { name: 'Violations', value: 5, color: '#ef4444' },
];

export default function GovernanceDash() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 1. Governance Compliance Engine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Compliance Engine</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Automated Policy Validation</p>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="h-48 w-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-display font-bold text-white">85%</span>
              <span className="text-[9px] uppercase tracking-wider text-white/50">Compliant</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-3 text-sm text-white/80 bg-white/5 p-2 rounded border border-white/5">
              <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
              <span>Stakeholder Completion (12/12)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80 bg-white/5 p-2 rounded border border-white/5">
              <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
              <span>Approval Quorum Reached</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80 bg-red-500/10 p-2 rounded border border-red-500/20">
              <span className="material-symbols-outlined text-red-500 text-lg">warning</span>
              <span>Missing SOC2 Attestation on Node 4</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Decision Bottleneck Detection */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Bottleneck Detection</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Delayed Teams & Blocked Approvals</p>
        
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={bottleneckData}
              dataKey="size"
              aspect={4 / 3}
              stroke="rgba(0,0,0,0.5)"
              fill="#333"
            >
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 3. Institutional Risk Dashboard */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Institutional Risk</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">Impact vs Uncertainty</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" dataKey="x" name="Impact" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <YAxis type="number" dataKey="y" name="Uncertainty" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Scatter name="Risk Matrix" data={riskData} fill="#8b5cf6" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4. Strategic Alignment Mapping */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h3 className="font-display text-xl text-white mb-1 z-10 relative">Strategic Alignment Mapping</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-10 z-10 relative">Decision → Goal → Mission → Impact</p>
        
        <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm mx-auto px-4">
          {[
            { label: 'Decision: Acquire Startup X', active: true },
            { label: 'Goal: Expand Market Share by 15%', active: true },
            { label: 'Mission: Democratize Data Access', active: true },
            { label: 'Impact: Global Sovereign Authority', active: false },
          ].map((node, idx, arr) => (
            <div key={idx} className="relative flex flex-col items-center">
              <motion.div 
                className={`w-full py-3 px-6 rounded-lg border text-center text-sm font-medium transition-all ${
                  node.active ? 'bg-blue-500/10 border-blue-500/30 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/10 text-white/40'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                {node.label}
              </motion.div>
              {idx < arr.length - 1 && (
                <div className={`w-0.5 h-6 ${node.active ? 'bg-blue-500/40' : 'bg-white/10'}`}></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
