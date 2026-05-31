import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Mock Data Generators
const generateTimeSeriesData = (points) => Array.from({ length: points }).map((_, i) => ({
  time: `T-${points - i}`,
  value: Math.floor(Math.random() * 40) + 60
}));

const radarData = [
  { subject: 'Stakeholders', A: 120, fullMark: 150 },
  { subject: 'Dependencies', A: 98, fullMark: 150 },
  { subject: 'Risk Level', A: 86, fullMark: 150 },
  { subject: 'Time to Close', A: 99, fullMark: 150 },
  { subject: 'Capital Impact', A: 85, fullMark: 150 },
  { subject: 'Compliance', A: 65, fullMark: 150 },
];

export default function AnalyticsDash() {
  const [confidenceData, setConfidenceData] = useState(generateTimeSeriesData(20));
  const [healthScore, setHealthScore] = useState(92);
  const [debtScore, setDebtScore] = useState(14);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidenceData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: 'Now',
          value: Math.floor(Math.random() * 20) + 70
        });
        return newData;
      });
      setHealthScore(prev => Math.min(100, Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1))));
      setDebtScore(prev => Math.max(0, prev + (Math.random() > 0.8 ? 1 : -0.5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getConfidenceLevel = (val) => val > 80 ? 'High' : val > 60 ? 'Medium' : 'Low';
  const currentConfidence = confidenceData[confidenceData.length - 1].value;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Decision Confidence Engine */}
      <motion.div 
        className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Decision Confidence Engine</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">Live Predictive Scoring</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            currentConfidence > 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            currentConfidence > 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {getConfidenceLevel(currentConfidence)}: {currentConfidence}%
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidenceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2. Decision Health Monitoring */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col justify-between"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div>
          <h3 className="font-display text-xl text-white mb-1">Health Monitoring</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-6">System Pulse</p>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <motion.div 
            className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center relative z-10"
            animate={{ 
              boxShadow: healthScore > 90 ? ['0 0 0px rgba(34,197,94,0)', '0 0 40px rgba(34,197,94,0.4)', '0 0 0px rgba(34,197,94,0)'] : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-display text-4xl font-bold text-white">{healthScore}</span>
          </motion.div>
          <div className="mt-8 w-full space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-wider">
              <span className="text-green-400">Healthy (850)</span>
              <span className="text-yellow-400">Delayed (42)</span>
              <span className="text-red-400">Risky (12)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full flex overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
              <div className="h-full bg-yellow-500" style={{ width: '10%' }}></div>
              <div className="h-full bg-red-500" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Decision Velocity Analytics */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Velocity Analytics</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Throughput Speed</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Avg. Approval Time</span>
              <span className="font-bold text-white">4.2 Days</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1 }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Throughput (Decisions/Mo)</span>
              <span className="font-bold text-white">128</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1.2 }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Execution Speed</span>
              <span className="font-bold text-green-400">+12% vs Last Qtr</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1.4 }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Decision Complexity Analyzer */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Complexity Analyzer</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Multivariate Assessment</p>
        <div className="flex-1 w-full min-h-[250px] -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="Complexity" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 5. Decision Debt Engine */}
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Decision Debt Engine</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Undocumented Gaps</p>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="text-5xl font-display font-bold text-red-400">
            {debtScore.toFixed(1)}<span className="text-xl">%</span>
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider leading-relaxed">
            Overall<br/>Governance<br/>Debt
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex justify-between items-center">
            <span className="text-sm text-red-200">Missing Context Records</span>
            <span className="font-bold text-red-400">42 Nodes</span>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex justify-between items-center">
            <span className="text-sm text-yellow-200">Unresolved Dependencies</span>
            <span className="font-bold text-yellow-400">18 Links</span>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center">
            <span className="text-sm text-white/60">Abandoned Drafts</span>
            <span className="font-bold text-white">104 Items</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
