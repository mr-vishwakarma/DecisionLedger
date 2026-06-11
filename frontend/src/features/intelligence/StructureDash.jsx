import { motion } from 'framer-motion';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid
} from 'recharts';

const alignmentData = [
  { subject: 'Financial Goal', A: 140, fullMark: 150 },
  { subject: 'Market Growth', A: 98, fullMark: 150 },
  { subject: 'Brand Authority', A: 86, fullMark: 150 },
  { subject: 'Operational Efficiency', A: 99, fullMark: 150 },
  { subject: 'Employee Retention', A: 125, fullMark: 150 },
];

const relationshipData = Array.from({ length: 30 }).map(() => ({
  x: Math.floor(Math.random() * 10),
  y: Math.floor(Math.random() * 10),
  z: Math.random() * 100 + 50,
}));

export default function StructureDash() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center items-center h-64 lg:h-auto"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-screen pointer-events-none"></div>
        <h3 className="font-display text-xl text-white mb-1 relative z-10 text-center">Institutional Intelligence Graph</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-8 relative z-10 text-center">Interconnected Knowledge Networks</p>
        
        <div className="relative w-full h-full flex items-center justify-center">
          
          <motion.div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-10" />
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 80;
            const y = Math.sin(angle) * 80;
            return (
              <motion.div 
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_5px_#3b82f6]"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x, y, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                <svg className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transformOrigin: 'center' }}>
                  <line x1="50%" y1="50%" x2="50%" y2="50%" stroke="rgba(59,130,246,0.3)" strokeWidth="1">
                    <animate attributeName="x2" to={`${50 - x}%`} dur="1s" fill="freeze" />
                    <animate attributeName="y2" to={`${50 - y}%`} dur="1s" fill="freeze" />
                  </line>
                </svg>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h3 className="font-display text-xl text-white mb-1">Relationship Matrix</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Dependency Visualizations</p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" dataKey="x" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <YAxis type="number" dataKey="y" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Scatter name="Dependencies" data={relationshipData} fill="#a855f7" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="absolute top-0 right-0 w-full h-1 bg-red-500/50">
          <motion.div className="h-full bg-red-500 shadow-[0_0_15px_red]" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
        <h3 className="font-display text-xl text-white mb-1 mt-4">Conflict Detection</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Live Scanning</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-4">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <div>
              <div className="text-sm font-bold text-red-400 mb-1">Resource Conflict Detected</div>
              <div className="text-xs text-red-200/70">Decision #402 (Hiring Freeze) conflicts with Decision #415 (Expand Engineering). Resolution required.</div>
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex gap-4 opacity-50">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <div>
              <div className="text-sm font-bold text-white mb-1">Scan Complete</div>
              <div className="text-xs text-white/70">No scheduling conflicts found in Q3 timeline.</div>
            </div>
          </div>
        </div>
      </motion.div>

      
      <motion.div 
        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <div className="flex-1 flex flex-col">
          <h3 className="font-display text-xl text-white mb-1">Strategic Alignment Radar</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Measure Alignment</p>
          <div className="flex-1 min-h-[200px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={alignmentData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Alignment" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex-1 border-l border-white/10 pl-6 flex flex-col justify-center">
          <h4 className="text-xs text-white/50 uppercase tracking-widest mb-4">Strategic Goal Tracking</h4>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Decision</span>
              <span className="text-sm text-white">Acquire AI Startup</span>
            </div>
            <div className="w-px h-4 bg-white/20 ml-2"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Goal</span>
              <span className="text-sm text-blue-400">Integrate LLM Capabilities</span>
            </div>
            <div className="w-px h-4 bg-white/20 ml-2"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">KPIs</span>
              <span className="text-sm text-purple-400">Reduce manual tagging by 80%</span>
            </div>
            <div className="w-px h-4 bg-white/20 ml-2"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Outcome</span>
              <span className="text-sm text-green-400 font-bold">On Track (+12%)</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
