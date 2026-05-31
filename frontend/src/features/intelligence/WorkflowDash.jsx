import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Decision: Q3 Strategy' }, type: 'input' },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Marketing Budget' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: 'Eng Hiring' } },
  { id: '4', position: { x: 400, y: 200 }, data: { label: 'Product Launch' }, type: 'output' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e1-3', source: '1', target: '3' }, { id: 'e3-4', source: '3', target: '4', animated: true }];

export default function WorkflowDash() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="flex flex-col gap-6 h-[85vh]">
      
      {/* 1 & 5. Decision Dependency Engine & Approval Builder */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 h-1/2 flex flex-col"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Dependency Engine & Approval Builder</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">Interactive Node Workflow Explorer</p>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">
            Drag, Drop, Connect
          </div>
        </div>
        
        <div className="flex-1 w-full rounded-lg overflow-hidden border border-white/10 bg-[#050505]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            colorMode="dark"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </motion.div>

      {/* Grid for remaining 3 systems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-1/2 min-h-[300px]">
        
        {/* 2. Cross Team Mapping */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
            <svg width="100%" height="100%">
              <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-white mb-2 z-10 relative">Cross Team Mapping</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6 z-10 relative">Department Dependency</p>
          <div className="flex gap-4 items-center z-10 relative">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300">ENG</div>
            <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-sm font-bold text-purple-300">PROD</div>
            <div className="h-0.5 w-8 bg-gradient-to-r from-purple-500 to-green-500"></div>
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-xs font-bold text-green-300">MKTG</div>
          </div>
        </motion.div>

        {/* 3. Institutional Timeline Explorer */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h3 className="font-display text-xl text-white mb-1">Timeline Explorer</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Historical Scrubbing</p>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative border-l-2 border-white/10 pl-6 space-y-6">
              {[
                { year: '2022', title: 'Seed Funding Secured', active: false },
                { year: '2023', title: 'Pivoted to Enterprise', active: false },
                { year: '2024', title: 'Acquired Competitor', active: true },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full ${item.active ? 'bg-blue-500 ring-4 ring-blue-500/30' : 'bg-white/20'}`}></div>
                  <div className={`text-xs font-bold ${item.active ? 'text-blue-400' : 'text-white/40'}`}>{item.year}</div>
                  <div className={`text-sm ${item.active ? 'text-white' : 'text-white/60'}`}>{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 4. Decision DNA View */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-9xl">biotech</span>
          </div>
          <h3 className="font-display text-xl text-white mb-1 relative z-10">Decision DNA View</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-8 relative z-10">Contextual Breakdown</p>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm text-white/60">Reasoning Chain</span>
              <span className="text-sm font-medium text-white">14 Links</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm text-white/60">People Involved</span>
              <span className="text-sm font-medium text-white">8 Stakeholders</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm text-white/60">Vote Consensus</span>
              <span className="text-sm font-medium text-green-400">100% Unanimous</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Projected Impact</span>
              <span className="text-sm font-medium text-purple-400">High Severity</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
