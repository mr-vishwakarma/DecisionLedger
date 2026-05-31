import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts';

const retentionData = [
  { year: '2020', retention: 65, loss: 35 },
  { year: '2021', retention: 70, loss: 30 },
  { year: '2022', retention: 85, loss: 15 },
  { year: '2023', retention: 82, loss: 18 },
  { year: '2024', retention: 94, loss: 6 },
];

const scatterData = Array.from({ length: 40 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 400 + 100,
  redundant: Math.random() > 0.8
}));

export default function MemoryDash() {
  const [lossSimulation, setLossSimulation] = useState(15);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 1. Organizational Memory Index */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Organizational Memory Index</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Knowledge Retention Score</p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="loss" stackId="a" fill="#ef4444" fillOpacity={0.5} />
              <Bar dataKey="retention" stackId="a" fill="#3b82f6" fillOpacity={0.8} />
              <Line type="monotone" dataKey="retention" stroke="#60a5fa" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2. Knowledge Loss Simulator */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Knowledge Loss Simulator</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-8">Attrition Impact Modeling</p>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Simulated Executive Departure Impact</span>
              <span className="font-bold text-red-400">-{lossSimulation}% Context</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={lossSimulation} 
              onChange={(e) => setLossSimulation(parseInt(e.target.value))}
              className="w-full accent-red-500 bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-center">
              <div className="text-2xl font-display font-bold text-white mb-1">
                {100 - lossSimulation}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">Retained Ledger</div>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
              <div className="text-2xl font-display font-bold text-red-400 mb-1">
                {Math.floor(lossSimulation * 1.5)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-red-400/70">Orphaned Decisions</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Decision Redundancy Detection */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Redundancy Detection</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Duplicated Efforts Map</p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" dataKey="x" hide />
              <YAxis type="number" dataKey="y" hide />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Scatter name="Unique" data={scatterData.filter(d => !d.redundant)} fill="#3b82f6" fillOpacity={0.6} />
              <Scatter name="Redundant" data={scatterData.filter(d => d.redundant)} fill="#ef4444" fillOpacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4. Pattern Recognition Engine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h3 className="font-display text-xl text-white mb-1">Pattern Recognition</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Historical Behavior Analysis</p>
        
        <div className="space-y-4 relative z-10">
          {[
            { pattern: "Q4 Budget Padding", confidence: 94, trend: "up" },
            { pattern: "Engineering Bottleneck on API Specs", confidence: 88, trend: "stable" },
            { pattern: "Marketing Approvals Bypass Standard Protocol", confidence: 76, trend: "down" }
          ].map((item, i) => (
            <div key={i} className="p-4 border border-white/10 bg-white/5 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium mb-1">{item.pattern}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">{item.confidence}% Confidence Match</div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                item.trend === 'up' ? 'bg-red-500/20 text-red-400' : 
                item.trend === 'down' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'
              }`}>
                <span className="material-symbols-outlined text-sm">
                  {item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'trending_flat'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
