import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    api.get('/analytics')
      .then(res => setAnalytics(res.data))
      .catch(err => console.error('Failed to fetch analytics', err));

    api.get('/decisions')
      .then(res => setDecisions(res.data))
      .catch(err => console.error('Failed to fetch decisions', err));

    api.get('/analytics/timeline')
      .then(res => setTimeline(res.data))
      .catch(err => console.error('Failed to fetch timeline', err));
  }, []);

  // Compute stats dynamically
  const totalDec = analytics?.totalDecisions || 0;
  const finalizedDec = analytics?.finalizedDecisions || 0;
  const pendingDec = analytics?.pendingDecisions || 0;
  const partRate = parseFloat(analytics?.participationRate || 0);

  const govScore = totalDec > 0 ? Math.min(100, Math.round(70 + (finalizedDec / totalDec) * 20 + (partRate / 100) * 10)) : 94;
  const velocity = totalDec > 0 ? (totalDec / 30).toFixed(1) : 0;
  const activeNodes = totalDec - finalizedDec;

  // Forecast Data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const forecastData = last7Days.map(dateStr => {
    const count = decisions.filter(d => d.createdAt && d.createdAt.split('T')[0] === dateStr).length;
    const dateObj = new Date(dateStr);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      name: label,
      velocity: count,
      friction: Math.max(0, 2 - count)
    };
  });

  // Org Health Radar Data
  const orgHealthData = [
    { subject: 'Consensus', A: parseFloat(analytics?.avgConsensus || 80), fullMark: 100 },
    { subject: 'Participation', A: partRate || 70, fullMark: 100 },
    { subject: 'Completion', A: totalDec > 0 ? Math.round((finalizedDec / totalDec) * 100) : 100, fullMark: 100 },
    { subject: 'Speed', A: 85, fullMark: 100 },
    { subject: 'Security', A: 95, fullMark: 100 },
  ];

  // Live network feed
  const liveFeedMapped = timeline.map(act => {
    let type = 'NODE_CREATED';
    if (act.action === 'VOTED') type = 'VOTE_SECURED';
    else if (act.action === 'FINALIZED_DECISION') type = 'POLICY_UPDATE';
    
    return {
      type,
      msg: act.details || `${act.user?.name || 'Someone'} performed ${act.action} on ${act.decision?.title || 'a decision'}`,
      time: act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
    };
  });

  const fallbackFeed = decisions.slice(0, 5).map(d => ({
    type: d.status === 'Finalized' || d.status === 'approved' ? 'POLICY_UPDATE' : 'NODE_CREATED',
    msg: `${d.proposedBy?.name || d.creatorId?.name || 'User'} created decision "${d.title}"`,
    time: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'
  }));

  const liveFeed = liveFeedMapped.length > 0 ? liveFeedMapped : fallbackFeed;

  return (
    <div className="p-8 pb-32 bg-background text-on-surface">
      
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 font-sans">
        <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Governance Score</div>
          <div className="text-4xl font-display text-on-surface font-geist font-bold">{govScore}<span className="text-sm text-primary ml-1">/100</span></div>
          <div className="mt-4 text-xs text-green-500 flex items-center"><span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> Dynamic health metric</div>
        </div>
        <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Pending Bottlenecks</div>
          <div className="text-4xl font-display text-on-surface font-geist font-bold">{pendingDec}</div>
          <div className="mt-4 text-xs text-yellow-400 flex items-center"><span className="material-symbols-outlined text-[14px] mr-1">warning</span> Action required</div>
        </div>
        <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Decision Velocity</div>
          <div className="text-4xl font-display text-on-surface font-geist font-bold">{velocity}<span className="text-sm text-purple-400 ml-1">/day</span></div>
          <div className="mt-4 text-xs text-purple-400 flex items-center"><span className="material-symbols-outlined text-[14px] mr-1">speed</span> Average throughput</div>
        </div>
        <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Active Nodes</div>
          <div className="text-4xl font-display text-on-surface font-geist font-bold">{activeNodes}</div>
          <div className="mt-4 text-xs text-on-surface-variant/60 flex items-center"><span className="material-symbols-outlined text-[14px] mr-1">device_hub</span> Out of {totalDec} total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Center Area: Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Decision Forecasting Chart */}
          <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-lg text-on-surface">Decision Velocity Forecast</h3>
                <div className="text-[10px] font-mono text-on-surface-variant/60 mt-1">AI PROJECTION MODEL v4.1</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded text-xs text-on-surface transition-colors">1M</button>
                <button className="px-3 py-1 bg-transparent hover:bg-surface-container-high border border-transparent rounded text-xs text-on-surface-variant/60 transition-colors">3M</button>
              </div>
            </div>
            <div className="h-[250px] w-full min-h-[250px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.15} vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} tickMargin={10} />
                  <YAxis stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="velocity" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorVelocity)" />
                  <Line type="monotone" dataKey="friction" stroke="#ef4444" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cross-Team Analytics */}
          <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl shadow-lg flex gap-8">
            <div className="w-1/3">
              <h3 className="font-display text-lg text-on-surface">Organizational Health</h3>
              <p className="text-xs text-on-surface-variant/60 mb-6">Radar visualization of structural integrity across 5 core governance metrics.</p>
              <div className="space-y-4 font-sans">
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant/80 mb-1"><span>Consensus</span><span className="text-green-500">{analytics?.avgConsensus || 80}%</span></div>
                  <div className="h-1 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${analytics?.avgConsensus || 80}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant/80 mb-1"><span>Participation</span><span className="text-yellow-500">{partRate || 70}%</span></div>
                  <div className="h-1 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{ width: `${partRate || 70}%` }}></div></div>
                </div>
              </div>
            </div>
            <div className="w-2/3 h-[200px] min-h-[200px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={orgHealthData}>
                  <PolarGrid stroke="var(--color-outline-variant)" opacity={0.25} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                  <Radar name="Organization" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Area: Live Feeds & Knowledge Graph */}
        <div className="space-y-8">
          
          {/* Live Global Feed */}
          <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl shadow-lg h-[300px] flex flex-col font-sans">
            <h3 className="font-display text-lg text-on-surface mb-6">Live Network Feed</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {liveFeed.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1">
                    {item.type === 'VOTE_SECURED' && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>}
                    {item.type === 'AI_ALERT' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>}
                    {item.type === 'NODE_CREATED' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>}
                    {item.type === 'POLICY_UPDATE' && <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>}
                  </div>
                  <div>
                    <div className="text-xs text-on-surface-variant/80 leading-relaxed">{item.msg}</div>
                    <div className="text-[9px] font-mono text-on-surface-variant/40 mt-1">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Knowledge Graph */}
          <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl shadow-lg relative h-[250px] overflow-hidden flex flex-col items-center justify-center group">
            <h3 className="absolute top-6 left-6 font-display text-lg text-on-surface z-10">Knowledge Graph</h3>
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
              <motion.circle cx="50" cy="50" r="30" fill="none" stroke="var(--color-outline-variant)" strokeDasharray="2,2" opacity={0.3} animate={{ rotate: 360, originX: '50px', originY: '50px' }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}/>
              <circle cx="50" cy="50" r="4" fill="var(--color-primary)" />
              <line x1="50" y1="50" x2="30" y2="30" stroke="var(--color-outline-variant)" opacity={0.4} />
              <circle cx="30" cy="30" r="2" fill="#8b5cf6" />
              <line x1="50" y1="50" x2="75" y2="40" stroke="var(--color-outline-variant)" opacity={0.4} />
              <circle cx="75" cy="40" r="3" fill="#10b981" />
              <line x1="50" y1="50" x2="45" y2="80" stroke="var(--color-outline-variant)" opacity={0.4} />
              <circle cx="45" cy="80" r="2.5" fill="#ef4444" />
            </svg>
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <button className="text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/20 transition-colors">Expand Graph View</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
