import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function DecisionsListPage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'list'

  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await api.get('/decisions');
        const data = res.data;
        // Map backend Decision schema to frontend Graph schema
        const mappedNodes = data.map((d, index) => ({
          id: d._id.substring(d._id.length - 6).toUpperCase(),
          _rawId: d._id,
          title: d.title,
          status: d.status === 'approved' ? 'LOCKED' : d.status === 'review' ? 'VOTING' : 'ACTIVE',
          type: 'STRATEGIC', // Placeholder until category is added to backend
          x: 20 + (index * 15) % 60,
          y: 30 + (index * 20) % 50,
          impact: 'MEDIUM',
          team: d.creatorId?.name || d.proposedBy?.name || 'User'
        }));
        setNodes(mappedNodes);
      } catch (error) {
        console.error('Failed to fetch decisions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisions();
  }, []);

  return (
    <div className="flex h-full bg-background text-on-surface overflow-hidden relative">
      
      {/* LEFT: WORKSPACE CANVAS */}
      <div className="flex-1 flex flex-col relative border-r border-outline-variant/20">
        
        {/* Workspace Toolbar */}
        <div className="h-14 border-b border-outline-variant/20 bg-surface-container flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <span className="font-display text-lg text-on-surface">Decision Topology Map</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Live Graph</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded border border-outline-variant/30">
            <button onClick={() => setViewMode('graph')} className={`px-3 py-1 text-xs rounded transition-colors ${viewMode === 'graph' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>Graph</button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-xs rounded transition-colors ${viewMode === 'list' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>List</button>
          </div>
        </div>

        {/* Main Graph Area */}
        <div className="flex-1 relative overflow-hidden bg-background">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {viewMode === 'graph' ? (
            <svg className="absolute inset-0 w-full h-full">
              {/* Connecting Lines */}
              <line x1="50%" y1="30%" x2="20%" y2="50%" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4,4" opacity={0.3} />
              <line x1="50%" y1="30%" x2="80%" y2="50%" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4,4" opacity={0.3} />
              <line x1="20%" y1="50%" x2="35%" y2="80%" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4,4" opacity={0.3} />
              <line x1="80%" y1="50%" x2="65%" y2="80%" stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4,4" opacity={0.3} />
              <line x1="50%" y1="30%" x2="65%" y2="80%" stroke="#ef4444" strokeWidth="1" opacity="0.2" />

              {/* Nodes */}
              {nodes.map(node => (
                <g 
                  key={node.id} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(node)}
                >
                  <circle cx={`${node.x}%`} cy={`${node.y}%`} r="24" className={`transition-all duration-300 ${selectedNode?.id === node.id ? 'fill-blue-500/20 stroke-blue-500' : 'fill-surface-container/60 stroke-outline-variant/40 group-hover:fill-surface-container-high group-hover:stroke-outline-variant'}`} strokeWidth="2" />
                  <circle cx={`${node.x}%`} cy={`${node.y}%`} r="6" className={
                    node.status === 'ACTIVE' ? 'fill-blue-400' : 
                    node.status === 'LOCKED' ? 'fill-green-400' : 
                    node.status === 'VOTING' ? 'fill-purple-400' : 'fill-on-surface/40'
                  } />
                  <foreignObject x={`calc(${node.x}% - 100px)`} y={`calc(${node.y}% + 30px)`} width="200" height="60" className="overflow-visible pointer-events-none">
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-on-surface-variant/60 mb-1">{node.id}</div>
                      <div className="text-xs text-on-surface font-bold drop-shadow-sm">{node.title}</div>
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>
          ) : (
            <div className="p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                    <th className="pb-4 font-normal">Node ID</th>
                    <th className="pb-4 font-normal">Title</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="py-8 text-center text-on-surface-variant/60 text-xs">Loading decisions...</td></tr>
                  ) : nodes.length === 0 ? (
                    <tr><td colSpan="4" className="py-8 text-center text-on-surface-variant/60 text-xs">No active decisions in this topological view.</td></tr>
                  ) : nodes.map(node => (
                    <tr key={node.id} onClick={() => setSelectedNode(node)} className="border-b border-outline-variant/10 hover:bg-surface-container-low/40 cursor-pointer transition-colors group">
                      <td className="py-4 text-[10px] font-mono text-on-surface-variant/60">{node.id}</td>
                      <td className="py-4 text-sm text-on-surface group-hover:text-blue-500 transition-colors">{node.title}</td>
                      <td className="py-4"><span className="text-[10px] px-2 py-1 bg-surface-container rounded border border-outline-variant/20 text-on-surface-variant">{node.status}</span></td>
                      <td className="py-4"><span className={`text-[10px] px-2 py-1 rounded border ${node.impact === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-surface-container rounded border border-outline-variant/20 text-on-surface-variant'}`}>{node.impact}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Floating Action Button */}
          <Link to="/decisions/new" className="absolute bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center text-white hover:scale-105 transition-transform hover:bg-blue-500">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </Link>
        </div>
      </div>

      {/* RIGHT: CONTEXTUAL INSPECTOR PANEL */}
      <div className={`w-96 bg-surface-container flex flex-col shrink-0 transition-all duration-300 ${selectedNode ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full border-l border-outline-variant/20'}`}>
        {selectedNode ? (
          <>
            <div className="h-14 border-b border-outline-variant/20 px-6 flex items-center justify-between shrink-0 bg-surface-container-high">
              <div className="text-[10px] font-mono text-on-surface-variant/60">NODE: {selectedNode.id}</div>
              <button onClick={() => setSelectedNode(null)} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-[16px]">close</span></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                    selectedNode.status === 'ACTIVE' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 
                    selectedNode.status === 'LOCKED' ? 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 
                    selectedNode.status === 'VOTING' ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {selectedNode.status}
                  </span>
                  <span className="text-[10px] bg-surface-container-high border border-outline-variant/20 px-2 py-0.5 rounded text-on-surface-variant uppercase">{selectedNode.type}</span>
                </div>
                <h2 className="font-display text-2xl text-on-surface mb-2 leading-tight">{selectedNode.title}</h2>
                <div className="text-xs text-on-surface-variant/80 flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">groups</span> Owner: {selectedNode.team} Team</div>
              </div>

              {/* AI Summary */}
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 relative overflow-hidden group cursor-pointer hover:bg-purple-500/10 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-purple-600 dark:text-purple-400">auto_awesome</span>
                  <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 tracking-widest">AI Generated Summary</span>
                </div>
                <p className="text-xs text-on-surface-variant/90 leading-relaxed relative z-10">
                  This decision shifts licensing to an enterprise tier to save $450k annually. It has a <strong className="text-red-600 dark:text-red-400">high dependency collision</strong> with D-046. If approved, 3 active policies will require automatic supersedence.
                </p>
                <div className="mt-3 flex gap-2 relative z-10">
                  <button className="text-[10px] bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-500/30 transition-colors">Explore Scenarios</button>
                </div>
              </div>

              {/* Dependency List */}
              <div>
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-3 border-b border-outline-variant/20 pb-2">Topological Dependencies</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-blue-600 dark:text-blue-400">arrow_upward</span>
                      <span className="text-xs text-on-surface">D-042 (Blocks)</span>
                    </div>
                    <span className="text-[10px] bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-transparent px-1.5 py-0.5 rounded">High Conflict</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-green-600 dark:text-green-400">arrow_downward</span>
                      <span className="text-xs text-on-surface">D-019 (Depends On)</span>
                    </div>
                    <span className="text-[10px] bg-surface-container-high text-on-surface-variant/60 px-1.5 py-0.5 rounded">Resolved</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-outline-variant/20 space-y-2">
                <Link to={`/decisions/${selectedNode._rawId}`} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all text-center block">Enter Node</Link>
                <button className="w-full py-2.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant text-xs font-bold rounded transition-colors">View Audit Trail</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-4">touch_app</span>
            <div className="text-sm font-bold text-on-surface mb-2">Inspector Panel</div>
            <div className="text-xs text-on-surface-variant/60">Select a node on the graph or list to view deep intelligence analytics and dependencies.</div>
          </div>
        )}
      </div>
    </div>
  );
}
