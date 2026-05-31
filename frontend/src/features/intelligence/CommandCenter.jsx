import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsDash from './AnalyticsDash';
import MemoryDash from './MemoryDash';
import GovernanceDash from './GovernanceDash';
import WorkflowDash from './WorkflowDash';
import SimulationDash from './SimulationDash';
import AgentsDash from './AgentsDash';
import AdvancedSimDash from './AdvancedSimDash';
import StructureDash from './StructureDash';
import EntropyDash from './EntropyDash';
import AdvancedGovDash from './AdvancedGovDash';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'analytics', label: 'Analytics & Health', icon: 'monitoring' },
  { id: 'memory', label: 'Knowledge & Memory', icon: 'memory' },
  { id: 'governance', label: 'Governance & Risk', icon: 'gavel' },
  { id: 'workflow', label: 'Workflow & Timelines', icon: 'account_tree' },
  { id: 'simulation', label: 'Simulation & Command', icon: 'science' },
  { id: 'agents', label: 'Agentic Systems', icon: 'smart_toy' },
  { id: 'advancedSim', label: 'Advanced Simulations', icon: 'query_stats' },
  { id: 'structure', label: 'Structural Intelligence', icon: 'hub' },
  { id: 'entropy', label: 'Health & Entropy', icon: 'health_and_safety' },
  { id: 'advancedGov', label: 'Advanced Governance', icon: 'policy' }
];

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics': return <AnalyticsDash />;
      case 'memory': return <MemoryDash />;
      case 'governance': return <GovernanceDash />;
      case 'workflow': return <WorkflowDash />;
      case 'simulation': return <SimulationDash />;
      case 'agents': return <AgentsDash />;
      case 'advancedSim': return <AdvancedSimDash />;
      case 'structure': return <StructureDash />;
      case 'entropy': return <EntropyDash />;
      case 'advancedGov': return <AdvancedGovDash />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e2ec] font-body flex flex-col overflow-hidden relative">
      {/* Cinematic Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-2xl text-white font-medium hover:opacity-80 transition-opacity">
              DecisionLedger
            </Link>
            <div className="h-6 w-px bg-white/20"></div>
            <span className="font-body text-xs uppercase tracking-[0.2em] text-blue-400">
              Executive Command Center
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest opacity-60">Systems Nominal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-white/10 bg-black/30 backdrop-blur-sm p-4 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
