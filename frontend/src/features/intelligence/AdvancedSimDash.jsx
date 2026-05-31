import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const initialNodes = [
  { id: 'start', position: { x: 250, y: 5 }, data: { label: 'Decision Node A' }, type: 'input' },
  { id: 'branch1', position: { x: 100, y: 100 }, data: { label: 'Simulated Path 1' } },
  { id: 'branch2', position: { x: 400, y: 100 }, data: { label: 'Actual Outcome' } },
  { id: 'impact1', position: { x: 100, y: 200 }, data: { label: '+14% Market Share' }, type: 'output' },
  { id: 'impact2', position: { x: 400, y: 200 }, data: { label: '+5% Market Share' }, type: 'output' },
];
const initialEdges = [
  { id: 'e-start-b1', source: 'start', target: 'branch1', animated: true, label: 'Counterfactual' },
  { id: 'e-start-b2', source: 'start', target: 'branch2' },
  { id: 'e-b1-i1', source: 'branch1', target: 'impact1', animated: true },
  { id: 'e-b2-i2', source: 'branch2', target: 'impact2' }
];

const forecastData = Array.from({ length: 12 }).map((_, i) => ({
  month: `M+${i}`,
  risk: Math.max(10, 80 - i * 5 + Math.random() * 10),
  success: Math.min(95, 40 + i * 4 + Math.random() * 10)
}));

export default function AdvancedSimDash() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showCounterfactual, setShowCounterfactual] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-[85vh]">
      
      {/* 1 & 2. Scenario Branch Explorer & Counterfactual Engine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 h-1/2 flex flex-col relative"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Counterfactual Engine & Scenario Branching</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">"What If?" Simulation</p>
          </div>
          <button 
            onClick={() => setShowCounterfactual(!showCounterfactual)}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-lg text-xs uppercase font-bold tracking-wider hover:bg-blue-500/30 transition-all"
          >
            {showCounterfactual ? 'Hide Analysis' : 'Run Counterfactual'}
          </button>
        </div>
        
        <div className="flex-1 flex gap-4 w-full h-full relative">
          <div className="flex-1 rounded-lg overflow-hidden border border-white/10 bg-[#050505]">
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView colorMode="dark">
              <Background variant="dots" gap={12} size={1} />
              <Controls />
            </ReactFlow>
          </div>
          
          <AnimatePresence>
            {showCounterfactual && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '30%' }}
                exit={{ opacity: 0, width: 0 }}
                className="bg-black/50 border border-white/10 rounded-lg p-4 flex flex-col justify-center overflow-hidden"
              >
                <h4 className="text-xs text-white/50 uppercase tracking-widest mb-4">Delta Analysis</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Risk Delta</div>
                    <div className="text-xl font-display text-red-400 font-bold">+12% Exposure</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Impact Delta</div>
                    <div className="text-xl font-display text-green-400 font-bold">+$4.2M Rev</div>
                  </div>
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <div className="text-xs text-white/80 leading-relaxed italic">
                      "Choosing Path 1 would have accelerated the timeline by 2 weeks, but increased compliance risk."
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Grid for remaining 3 systems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-1/2 min-h-[300px]">
        
        {/* 3. Decision Forecast Engine */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h3 className="font-display text-xl text-white mb-1">Decision Forecast Engine</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Predictive Trajectories</p>
          
          <div className="flex-1 w-full min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" name="Probability of Success" />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" name="Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 4. Cascading Impact Engine */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center items-center"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
          
          <h3 className="font-display text-xl text-white mb-1 relative z-10 text-center">Cascading Impact Engine</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-8 relative z-10 text-center">Downstream Ripple Effects</p>
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)] mb-4"></div>
            <div className="text-sm font-bold text-white">Primary: +$2M</div>
            <div className="text-xs text-white/60">Secondary: Hiring Freeze</div>
            <div className="text-[10px] text-white/40">Tertiary: Product Delay (2w)</div>
          </div>
        </motion.div>

        {/* 5. Risk Propagation Mapping */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-30"></div>
          <h3 className="font-display text-xl text-white mb-1 relative z-10">Risk Propagation Mapping</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6 relative z-10">Systemic Exposure Spread</p>
          
          <div className="relative z-10 grid grid-cols-5 gap-2 h-32">
            {Array.from({ length: 25 }).map((_, i) => {
              // Create a localized heatmap effect
              const distance = Math.abs((i % 5) - 2) + Math.abs(Math.floor(i / 5) - 2);
              const intensity = Math.max(0, 1 - distance * 0.25);
              const color = `rgba(239, 68, 68, ${intensity})`; // Red
              
              return (
                <div key={i} className="rounded-sm border border-white/5" style={{ backgroundColor: color }}>
                  <motion.div 
                    className="w-full h-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center text-[10px] text-white/50 uppercase tracking-wider relative z-10">
            Source Node (Center) spreading High Risk
          </div>
        </motion.div>

      </div>
    </div>
  );
}
