import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import api from '../../services/api';

export default function AnalyticsPage() {
  const [reportType, setReportType] = useState('predictive');
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/decisions')
      .then(res => {
        setDecisions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch decisions for analytics', err);
        setLoading(false);
      });
  }, []);

  const totalDecCount = decisions.length;

  // Dynamically map anomaly scatter chart
  const anomalyData = decisions.map((d, i) => {
    const voteCount = d.votes?.length || 0;
    const isDraftLong = d.status === 'draft' && (new Date() - new Date(d.createdAt)) > 86400000; // > 1 day
    return {
      x: i * 10 + 10,
      y: voteCount * 10 + (isDraftLong ? 50 : 20),
      z: voteCount * 10 + 10,
      name: isDraftLong ? 'Anomaly' : 'Normal',
      fill: isDraftLong ? '#ef4444' : '#3b82f6',
      title: d.title
    };
  });

  // Provide fallback anomaly data if none is returned
  const finalAnomalyData = anomalyData.length > 0 ? anomalyData : [
    { x: 10, y: 200, z: 200, name: 'Normal', fill: '#3b82f6' },
    { x: 20, y: 260, z: 260, name: 'Normal', fill: '#3b82f6' },
    { x: 50, y: 400, z: 400, name: 'Anomaly', fill: '#ef4444' },
  ];

  // Group decisions by quarter (Q1, Q2, Q3, Q4)
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const currentYear = new Date().getFullYear();
  
  const forecastData = quarters.map((q, idx) => {
    const startMonth = idx * 3;
    const endMonth = startMonth + 3;
    
    const count = decisions.filter(d => {
      const date = new Date(d.createdAt);
      return date.getFullYear() === currentYear && date.getMonth() >= startMonth && date.getMonth() < endMonth;
    }).length;

    return {
      name: q,
      actual: count > 0 ? count : (idx === 0 && totalDecCount > 0 ? totalDecCount : null),
      forecast: count > 0 ? count + 1 : idx + 2
    };
  });


  return (
    <div className="flex flex-col h-full bg-background text-on-surface overflow-hidden p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="font-display text-2xl text-on-surface">Enterprise Intelligence Analytics</h1>
          <div className="text-[10px] font-mono text-on-surface-variant/60 mt-1 uppercase tracking-widest">Predictive Modeling & Anomaly Detection</div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 p-1.5 rounded-lg">
          <button onClick={() => setReportType('predictive')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${reportType === 'predictive' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>Predictive</button>
          <button onClick={() => setReportType('anomalies')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${reportType === 'anomalies' ? 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>Anomalies</button>
          <button onClick={() => setReportType('builder')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${reportType === 'builder' ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>AI Builder</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {reportType === 'predictive' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-surface-container border border-outline-variant/30 p-6 rounded-xl flex flex-col h-[400px]">
                <h3 className="font-display text-lg text-on-surface mb-6">Decision Throughput Forecast</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.15} vertical={false} />
                      <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                      <YAxis stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                        itemStyle={{ fontSize: '12px' }}
                        labelStyle={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="url(#colorActual)" />
                      <Area type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeDasharray="5 5" fill="url(#colorForecast)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl flex flex-col">
                <h3 className="font-display text-lg text-on-surface mb-6">Forecast Factors</h3>
                <div className="space-y-4 flex-1">
                  <div className="p-3 bg-surface-container-low border border-outline-variant/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-on-surface-variant">Q4 Hiring Freeze Lifted</span>
                      <span className="text-[10px] text-green-700 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 px-2 rounded">+15%</span>
                    </div>
                    <div className="h-1 w-full bg-outline-variant/20 rounded overflow-hidden"><div className="h-full bg-blue-500 w-[75%]"></div></div>
                  </div>
                  <div className="p-3 bg-surface-container-low border border-outline-variant/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-on-surface-variant">EU Compliance Rollout</span>
                      <span className="text-[10px] text-red-700 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 px-2 rounded">-8%</span>
                    </div>
                    <div className="h-1 w-full bg-outline-variant/20 rounded overflow-hidden"><div className="h-full bg-blue-500 w-[40%]"></div></div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors">Adjust Model Weights</button>
              </div>
            </div>
          </div>
        )}

        {reportType === 'anomalies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-surface-container border border-outline-variant/30 p-6 rounded-xl flex flex-col h-[400px]">
                <h3 className="font-display text-lg text-on-surface mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Friction Anomaly Detection
                </h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.15} />
                      <XAxis type="number" dataKey="x" name="Time (Days)" stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                      <YAxis type="number" dataKey="y" name="Friction Index" stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} />
                      <RechartsTooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Scatter name="Decisions" data={finalAnomalyData} fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl flex flex-col font-sans">
                <h3 className="font-display text-lg text-on-surface mb-6">Detected Anomalies</h3>
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {(() => {
                    const realAnomalies = decisions
                      .filter(d => d.status === 'draft' && (new Date() - new Date(d.createdAt)) > 86400000)
                      .map(d => ({
                        severity: (d.votes?.length || 0) > 3 ? 'High' : 'Med',
                        title: d.title,
                        msg: `Decision "${d.title}" remains in Draft stage for too long with ${d.votes?.length || 0} votes.`,
                        time: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'
                      }));

                    const finalAnomaliesList = realAnomalies.length > 0 ? realAnomalies : [
                      { severity: 'High', title: 'Legal review phase', msg: 'Legal review phase for "Acquisition XYZ" took 400% longer than historical averages for M&A nodes.', time: '2h ago' },
                      { severity: 'Med', title: 'Abstention rate', msg: 'Abstention rate in HR policies spiked to 45% (baseline is 12%). Indicates potential clarity issue.', time: '1d ago' }
                    ];

                    return finalAnomaliesList.map((anom, i) => (
                      <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg cursor-pointer hover:bg-red-500/10 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold uppercase tracking-widest ${anom.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>Severity: {anom.severity}</span>
                          <span className="text-[10px] text-red-600 dark:text-red-400 font-mono">{anom.time}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{anom.msg}</p>
                        <button className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 hover:underline">Investigate Root Cause &rarr;</button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'builder' && (
          <div className="flex flex-col items-center justify-center h-[500px] border border-outline-variant/30 bg-surface-container rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-bl-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-tr-full -ml-32 -mb-32"></div>
            
            <div className="text-center max-w-lg relative z-10 px-6">
              <span className="material-symbols-outlined text-5xl text-purple-600 dark:text-purple-400 mb-6">auto_awesome</span>
              <h2 className="font-display text-3xl text-on-surface mb-4">Explainable AI Report Builder</h2>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                Describe the intelligence you need. The ledger will automatically map the required data nodes, generate the visualizations, and provide an explainable narrative.
              </p>
              
              <div className="bg-surface-container-high border border-outline-variant/30 rounded-xl p-2 flex shadow-2xl">
                <input type="text" placeholder="e.g., 'Show me how Engineering decisions impacted Q2 budget...'" className="flex-1 bg-transparent border-none text-sm text-on-surface px-4 outline-none placeholder-on-surface-variant/40" />
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(147,51,234,0.4)]">Generate</button>
              </div>
              
              <div className="mt-8 flex justify-center gap-2">
                <span className="text-[10px] bg-surface-container-high border border-outline-variant/20 px-2 py-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer">Trend Analysis</span>
                <span className="text-[10px] bg-surface-container-high border border-outline-variant/20 px-2 py-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer">Team Bottlenecks</span>
                <span className="text-[10px] bg-surface-container-high border border-outline-variant/20 px-2 py-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer">Cost Forecasting</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
