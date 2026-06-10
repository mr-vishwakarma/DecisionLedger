import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimelinePage() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/timeline')
      .then(res => setEvents(res.data))
      .catch(err => console.error('Failed to fetch timeline', err));
  }, []);

  // Map backend events to UI shape (ensure fields: id, year, month, title, type, description, x, y)
  const historicalEvents = events.map((ev, index) => {
    // Distribute nodes evenly between 15% and 90% of the canvas width
    const x = 15 + (index * 75) / Math.max(1, events.length - 1);
    // Project nodes on a wave aligning with the visual path
    const y = 50 + 15 * Math.sin((x / 100) * 2.5 * Math.PI);
    return {
      id: ev._id || ev.id,
      year: new Date(ev.createdAt).getFullYear(),
      month: new Date(ev.createdAt).toLocaleString('default', { month: 'short' }),
      title: ev.action ? ev.action.replace('_', ' ') : 'EVENT',
      type: ev.action || 'EVENT',
      description: ev.details || 'No details provided.',
      x: Math.round(x),
      y: Math.round(y),
    };
  });

  return (
    <div className="flex flex-col h-full bg-background text-on-surface overflow-hidden p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-on-surface">Decision Observatory</h1>
          <div className="text-[10px] font-mono text-on-surface-variant/60 mt-1 uppercase tracking-widest">Chronological Intelligence Mapping</div>
        </div>
        <div className="flex items-center gap-4 bg-surface-container border border-outline-variant/30 p-2 rounded-lg">
          <button className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded transition-colors" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))}>Zoom In</button>
          <button className="px-3 py-1 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface text-xs font-bold rounded transition-colors" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.5, 0.5))}>Zoom Out</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-8 overflow-hidden">
        
        {/* Main Canvas */}
        <div className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[400px]">
          <div className="absolute top-6 left-6 text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Historical Multi-verse Active
          </div>
          
          <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-surface-container-high/80 backdrop-blur-sm p-3 rounded-lg border border-outline-variant/20 z-10">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer">play_circle</span>
            <div className="w-48 h-1 bg-outline-variant/30 rounded relative cursor-pointer">
              <div className="absolute top-0 left-0 h-full bg-blue-500 rounded" style={{ width: '60%' }}></div>
              <div className="absolute top-1/2 left-[60%] w-3 h-3 bg-primary rounded-full -mt-1.5 -ml-1.5 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"></div>
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant">2023 - Q2</span>
          </div>

          <div 
            className="absolute inset-0 transition-transform duration-500"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
            
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              {/* Main Timeline Spline */}
              <path 
                d={`M 10% 50% C 15% 50%, 20% 40%, 25% 40% C 35% 40%, 35% 60%, 45% 60% C 55% 60%, 55% 30%, 60% 30% C 70% 30%, 70% 50%, 80% 50% L 95% 50%`}
                fill="none" stroke="var(--color-outline-variant)" strokeWidth="3" opacity="0.3"
              />
              
              {/* Alternative Timelines (Counterfactuals) */}
              <path d="M 25% 40% C 30% 20%, 35% 20%, 45% 20%" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="2" strokeDasharray="4,4" />
              <path d="M 60% 30% C 65% 10%, 75% 10%, 80% 30%" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="2" strokeDasharray="4,4" />

              {/* Events */}
              {historicalEvents.map(event => (
                <g 
                  key={event.id} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedEvent(event)}
                >
                  <circle cx={`${event.x}%`} cy={`${event.y}%`} r="12" className={`transition-all duration-300 ${selectedEvent?.id === event.id ? 'fill-blue-500 stroke-blue-400 stroke-4' : 'fill-surface-container-high stroke-outline-variant/60 group-hover:stroke-on-surface'}`} />
                  <circle cx={`${event.x}%`} cy={`${event.y}%`} r="4" className={selectedEvent?.id === event.id ? 'fill-white' : 'fill-on-surface-variant'} />
                  
                  <text x={`${event.x}%`} y={`calc(${event.y}% + 25px)`} textAnchor="middle" className="fill-on-surface-variant/60 text-[10px] font-mono group-hover:fill-on-surface transition-colors">{event.year}</text>
                  <text x={`${event.x}%`} y={`calc(${event.y}% + 40px)`} textAnchor="middle" className="fill-on-surface text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{event.title}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="w-full xl:w-96 bg-surface-container border border-outline-variant/30 rounded-xl flex flex-col shrink-0 overflow-hidden">
          {selectedEvent ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-outline-variant/20 bg-surface-container-high">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">{selectedEvent.type}</span>
                  <span className="text-[10px] font-mono text-on-surface-variant/60">{selectedEvent.month} {selectedEvent.year}</span>
                </div>
                <h2 className="font-display text-2xl text-on-surface">{selectedEvent.title}</h2>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
                <p className="text-sm text-on-surface-variant leading-relaxed">{selectedEvent.description}</p>
                
                <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-lg">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3">Contextual Data</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-on-surface-variant/80"><span>Approvals required</span><span className="text-on-surface font-semibold">4</span></div>
                    <div className="flex justify-between text-xs text-on-surface-variant/80"><span>Time to consensus</span><span className="text-on-surface font-semibold">12 Days</span></div>
                    <div className="flex justify-between text-xs text-on-surface-variant/80"><span>Impact radius</span><span className="text-red-600 dark:text-red-400 font-semibold">Global</span></div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg group hover:bg-purple-500/10 transition-colors cursor-pointer">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">alt_route</span> Counterfactual AI</h3>
                  <p className="text-xs text-on-surface-variant/80">Generate simulated outcomes if this decision was rejected.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
              <span className="material-symbols-outlined text-4xl text-outline-variant/60 mb-4">history</span>
              <div className="text-sm font-bold text-on-surface mb-2">Observatory Panel</div>
              <div className="text-xs text-on-surface-variant/60">Select a historical node on the timeline to replay events and explore counterfactuals.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
