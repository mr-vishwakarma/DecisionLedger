import { motion } from 'framer-motion';

const Dashboard = () => {
  // Mock Data
  const decisions = [
    { id: 1, title: 'Switch to MongoDB', status: 'Finalized', date: '2026-05-20', proposer: 'Alice' },
    { id: 2, title: 'Adopt TailwindCSS v4', status: 'Pending', date: '2026-05-24', proposer: 'Bob' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Recent Decisions</h1>
        <button className="px-4 py-2 bg-brand-electric hover:bg-brand-electric-hover text-white rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all font-medium">
          + New Decision
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decisions.map((decision, index) => (
          <motion.div 
            key={decision.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-xl hover:border-white/20 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                decision.status === 'Finalized' ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20' 
                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {decision.status}
              </span>
              <span className="text-xs text-brand-text-muted">{decision.date}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-electric transition-colors">
              {decision.title}
            </h3>
            
            <p className="text-sm text-brand-text-muted">
              Proposed by <span className="text-white/80">{decision.proposer}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
