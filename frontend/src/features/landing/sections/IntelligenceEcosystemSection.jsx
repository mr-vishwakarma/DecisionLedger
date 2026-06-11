import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntelligenceEcosystemSection() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState('slack');

  const handleAiDemo = (type) => {
    setAiPrompt(type);
    setIsTyping(true);
    setAiResponse('');
    
    setTimeout(() => {
      setIsTyping(false);
      if (type === 'Summarize Q3 Strategy') {
        setAiResponse("The Q3 Strategy decision (Node #842) was approved unanimously on Aug 12. Primary goals: expand enterprise sales team (+15 headcount) and delay consumer feature X. High risk flagged by Legal regarding data compliance in new regions.");
      } else if (type === 'Analyze Risk Profile') {
        setAiResponse("Current risk trajectory is increasing. 3 major decisions in the past week skipped standard security review. Recommend enforcing strict Policy Rule #4 for all engineering infrastructure changes.");
      }
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#0a0a0a] px-margin-page py-32 border-b border-white/5">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-blue-500 mb-6 block">13 / Artificial Intelligence</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-6">Ask the Ledger.</h2>
            <p className="font-body text-sm text-white/60 mb-8">
              A massive archive is useless if you can't synthesize it. The integrated AI assistant reads the entire decision graph to provide summaries and risk forecasts.
            </p>

            <div className="bg-black/50 border border-white/10 rounded-xl p-6 flex-1 flex flex-col">
              <div className="flex gap-2 mb-6">
                <button onClick={() => handleAiDemo('Summarize Q3 Strategy')} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 hover:bg-white/10">Summarize Q3 Strategy</button>
                <button onClick={() => handleAiDemo('Analyze Risk Profile')} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 hover:bg-white/10">Analyze Risk Profile</button>
              </div>
              
              <div className="flex-1 bg-[#050505] border border-white/5 rounded-lg p-4 font-mono text-sm">
                <div className="text-white/40 mb-4">{aiPrompt ? `> ${aiPrompt}` : '> Select a prompt above...'}</div>
                {isTyping && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-4 bg-blue-500"></motion.div>}
                {aiResponse && <div className="text-blue-300 leading-relaxed">{aiResponse}</div>}
              </div>
            </div>
          </div>

          
          <div className="flex flex-col gap-6">
            <div className="bg-[#050505] border border-white/10 p-8 rounded-xl flex-1 flex flex-col justify-center">
              <h3 className="font-display text-2xl text-white mb-6">Interactive Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">2.4<span className="text-sm text-white/50">hrs</span></div>
                  <div className="text-[9px] uppercase text-white/40 tracking-widest">Avg Approval Speed</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-1">14%</div>
                  <div className="text-[9px] uppercase text-white/40 tracking-widest">Current Bottlenecks</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 p-8 rounded-xl flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-[120px] material-symbols-outlined text-white/5 -mb-6 -mr-6 pointer-events-none">memory</div>
              <h3 className="font-display text-2xl text-white mb-2 relative z-10">Knowledge Retention</h3>
              <p className="text-xs text-white/60 mb-6 relative z-10 max-w-sm">Organizational memory is permanently preserved. See the exact reasoning chain behind any pivot.</p>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
                <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} whileInView={{ width: '98%' }} transition={{ duration: 1.5 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#050505] px-margin-page py-32 border-b border-white/5">
        <div className="max-w-6xl w-full text-center mb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block">14 / Comparisons</span>
          <h2 className="font-display text-5xl tracking-tighter text-white">Compare Alternatives</h2>
        </div>

        <div className="max-w-5xl w-full mx-auto overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
                <th className="p-4 font-normal">Feature</th>
                <th className="p-4 font-normal">Spreadsheets</th>
                <th className="p-4 font-normal">Chat Apps</th>
                <th className="p-4 font-normal text-blue-400">DecisionLedger</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { feature: 'Searchable Context', a: 'Poor', b: 'Poor', c: 'Excellent' },
                { feature: 'Voting / Consensus', a: 'Manual', b: 'Emojis only', c: 'Cryptographic' },
                { feature: 'Approval Workflows', a: 'None', b: 'None', c: 'Automated' },
                { feature: 'Audit Trails (SOC2)', a: 'Fail', b: 'Fail', c: 'Pass' },
                { feature: 'Immutability', a: 'Editable', b: 'Deletable', c: 'Permanent' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white/80">{row.feature}</td>
                  <td className="p-4 text-red-400/80">{row.a}</td>
                  <td className="p-4 text-yellow-400/80">{row.b}</td>
                  <td className="p-4 text-green-400 font-bold">{row.c} <span className="material-symbols-outlined text-sm align-middle ml-1">check_circle</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#0a0a0a] px-margin-page py-32">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-purple-500 mb-6 block">15 / Ecosystem</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-6">Integrates Everywhere</h2>
            <p className="font-body text-sm text-white/60 mb-12 max-w-md">
              Push approvals to Slack. Sync metadata from Jira. Connect custom internal tools via our REST API. The Ledger sits at the center of your stack.
            </p>

            <div className="flex gap-4">
              {['slack', 'teams', 'email', 'api'].map(int => (
                <button 
                  key={int}
                  onMouseEnter={() => setActiveIntegration(int)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center border transition-all ${
                    activeIntegration === int ? 'bg-white text-black scale-110' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {int === 'api' ? 'api' : int === 'email' ? 'mail' : int === 'slack' ? 'forum' : 'groups'}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-8 text-sm text-white/70 font-mono h-8">
              {activeIntegration === 'slack' && '→ Pushing approval notification to #engineering-leadership'}
              {activeIntegration === 'teams' && '→ Syncing consensus vote to Microsoft Teams channel'}
              {activeIntegration === 'email' && '→ Dispatching cryptographic receipt via secure email'}
              {activeIntegration === 'api' && '→ POST /api/v1/decisions/842/vote'}
            </div>
          </div>

          
          <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 flex flex-col gap-4">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 text-center">System Architecture</h3>
            
            <motion.div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-center" whileHover={{ scale: 1.02 }}>
              <div className="text-xs font-bold text-blue-400">Presentation Layer</div>
              <div className="text-[10px] text-white/50">React / WebGL / Interfaces</div>
            </motion.div>
            
            <div className="flex justify-center"><div className="w-px h-6 bg-white/20"></div></div>
            
            <motion.div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg text-center" whileHover={{ scale: 1.02 }}>
              <div className="text-xs font-bold text-purple-400">Intelligence Engine</div>
              <div className="text-[10px] text-white/50">Governance / Analytics / Autonomous Agents</div>
            </motion.div>

            <div className="flex justify-center"><div className="w-px h-6 bg-white/20"></div></div>
            
            <motion.div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-center" whileHover={{ scale: 1.02 }}>
              <div className="text-xs font-bold text-green-400">Immutable Storage Layer</div>
              <div className="text-[10px] text-white/50">Cryptographic Hash Trees / Distributed DB</div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
