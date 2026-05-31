import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';



const PageFrame = memo(function PageFrame({ title, subtitle, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-[1200px] p-6 lg:p-8"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <h1 className="font-geist text-2xl font-bold text-on-surface">{title}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
});

function StatusPill({ children }) {
  return <span className="rounded-md border border-outline-variant/30 bg-surface-container-high px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant">{children}</span>;
}

import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function MyVotesPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  const voteHistory = [
    { id: 'D-042', title: 'Q3 Enterprise Licensing Shift', status: 'ACTIVE', vote: 'APPROVE', weight: 4.2, impact: 'HIGH' },
    { id: 'D-039', title: 'Suspend Vendor Contract A', status: 'REJECTED', vote: 'REJECT', weight: 3.8, impact: 'MEDIUM' },
    { id: 'D-031', title: 'Approve Security Policy v2', status: 'ACTIVE', vote: 'APPROVE', weight: 5.0, impact: 'CRITICAL' },
    { id: 'D-028', title: 'Delay Project Phoenix', status: 'ACTIVE', vote: 'ABSTAIN', weight: 2.1, impact: 'LOW' },
  ];

  const influenceData = [
    { name: 'Jan', power: 45, accuracy: 60 },
    { name: 'Feb', power: 55, accuracy: 65 },
    { name: 'Mar', power: 60, accuracy: 75 },
    { name: 'Apr', power: 85, accuracy: 80 },
    { name: 'May', power: 92, accuracy: 88 },
  ];

  const voteDistribution = [
    { name: 'Approve', value: 65, color: '#3b82f6' },
    { name: 'Reject', value: 20, color: '#ef4444' },
    { name: 'Abstain', value: 15, color: '#8b5cf6' },
  ];

  return (
    <div className="flex flex-col h-full bg-background text-on-surface overflow-hidden p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-on-surface">Voting Intelligence</h1>
          <div className="text-[10px] font-mono text-on-surface-variant/60 mt-1 uppercase tracking-widest">Global Influence & Analytics</div>
        </div>
        <div className="flex items-center gap-4 bg-surface-container border border-outline-variant/30 p-2 rounded-lg">
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'analytics' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>Analytics</button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'history' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>History Ledger</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'analytics' ? (
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex items-center justify-between group">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Influence Metric</div>
                  <div className="text-3xl font-display text-on-surface group-hover:text-primary transition-colors">Top 4%</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">Highly aligned with outcomes</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">military_tech</span>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex items-center justify-between group">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Vote Velocity</div>
                  <div className="text-3xl font-display text-on-surface group-hover:text-primary transition-colors">1.2<span className="text-sm text-on-surface-variant/60">d</span></div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-2">Average time to vote</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">timer</span>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex items-center justify-between group">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Fatigue Index</div>
                  <div className="text-3xl font-display text-on-surface group-hover:text-primary transition-colors">Low</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">Optimal cognitive load</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">battery_charging_full</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Influence Trend */}
              <div className="lg:col-span-2 bg-surface-container border border-outline-variant/30 p-6 rounded-xl">
                <h3 className="font-display text-lg text-on-surface mb-6">Voting Power & Accuracy</h3>
                <div className="h-[250px] min-h-[250px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <BarChart data={influenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.15} vertical={false} />
                      <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                      <YAxis stroke="var(--color-on-surface-variant)" opacity={0.6} fontSize={10} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Bar dataKey="power" fill="#3b82f6" radius={[4,4,0,0]} />
                      <Bar dataKey="accuracy" fill="#8b5cf6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution */}
              <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center">
                <h3 className="font-display text-lg text-on-surface mb-2 w-full text-left">Distribution</h3>
                <div className="h-[200px] w-full min-h-[200px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie data={voteDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {voteDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> App</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Rej</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Abs</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-high text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  <th className="p-4 font-normal">Node ID</th>
                  <th className="p-4 font-normal">Title</th>
                  <th className="p-4 font-normal">Impact</th>
                  <th className="p-4 font-normal">Weight</th>
                  <th className="p-4 font-normal">Your Vote</th>
                </tr>
              </thead>
              <tbody>
                {voteHistory.map(vote => (
                  <tr key={vote.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/40 transition-colors cursor-pointer group">
                    <td className="p-4 text-[10px] font-mono text-on-surface-variant/60">{vote.id}</td>
                    <td className="p-4 text-sm text-on-surface group-hover:text-primary transition-colors">{vote.title}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-1 rounded border ${vote.impact === 'CRITICAL' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-surface-container-high border-outline-variant/20 text-on-surface-variant'}`}>{vote.impact}</span>
                    </td>
                    <td className="p-4 text-sm font-mono text-purple-600 dark:text-purple-400">{vote.weight}x</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                        vote.vote === 'APPROVE' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                        vote.vote === 'REJECT' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
                      }`}>{vote.vote}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamPage() {
  const [activeTab, setActiveTab] = useState('graph');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const { token } = useAuth();

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setIsInviting(true);
    try {
      const res = await fetch('/api/teams/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail, role: 'member' })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send invite');
      
      toast.success('Invite created!');
      setInviteLink(data.inviteLink);
      setInviteEmail('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  const teamMembers = [
    { id: 1, name: 'Cmdr. Shepard', role: 'Global Admin', team: 'Executive', nodes: 42, health: 98 },
    { id: 2, name: 'Sarah Kim', role: 'Head of Product', team: 'Product', nodes: 18, health: 92 },
    { id: 3, name: 'Marcus Vance', role: 'Lead Architect', team: 'Engineering', nodes: 24, health: 85 },
    { id: 4, name: 'Elena Rostova', role: 'VP Operations', team: 'Operations', nodes: 31, health: 88 },
  ];

  return (
    <div className="flex flex-col h-full bg-background text-on-surface overflow-hidden p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl text-on-surface">Organizational Intelligence</h1>
          <div className="text-[10px] font-mono text-on-surface-variant/60 mt-1 uppercase tracking-widest">Network Health & Topology</div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <form onSubmit={handleInvite} className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 p-1 rounded-lg">
            <input 
              type="email" 
              value={inviteEmail} 
              onChange={(e) => setInviteEmail(e.target.value)} 
              placeholder="Email to invite" 
              className="bg-transparent text-sm text-on-surface px-3 py-1 outline-none w-48 placeholder-on-surface-variant/40"
              required 
            />
            <button disabled={isInviting} type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50">
              {isInviting ? 'Sending...' : 'Invite'}
            </button>
          </form>
          <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 p-1 rounded-lg">
            <button onClick={() => setActiveTab('graph')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'graph' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>Topology Graph</button>
            <button onClick={() => setActiveTab('directory')} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'directory' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'text-on-surface-variant/60 hover:text-on-surface'}`}>Intelligence Directory</button>
          </div>
        </div>
      </div>
      
      {inviteLink && (
        <div className="mb-6 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mb-1">Invite Link Generated</div>
            <div className="text-sm text-on-surface-variant font-mono select-all">{inviteLink}</div>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(inviteLink); toast.success('Copied!'); }} className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded transition-colors">Copy</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'graph' ? (
          <div className="flex flex-col h-full gap-6">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Network Density</div>
                <div className="text-3xl font-display text-on-surface">High</div>
              </div>
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Active Nodes</div>
                <div className="text-3xl font-display text-on-surface">4</div>
              </div>
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Avg Health</div>
                <div className="text-3xl font-display text-green-600 dark:text-green-400">91%</div>
              </div>
              <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Friction Points</div>
                <div className="text-3xl font-display text-yellow-600 dark:text-yellow-400">2</div>
              </div>
            </div>

            {/* Interactive Org Graph */}
            <div className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[400px]">
              <div className="absolute top-6 left-6 text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-widest">Live Collaboration Network</div>
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-outline-variant)" />
                  </marker>
                </defs>
                
                {/* Connections */}
                <line x1="50%" y1="30%" x2="30%" y2="60%" stroke="var(--color-outline-variant)" strokeWidth="2" opacity="0.3" markerEnd="url(#arrowhead)" />
                <line x1="50%" y1="30%" x2="70%" y2="60%" stroke="var(--color-outline-variant)" strokeWidth="2" opacity="0.3" markerEnd="url(#arrowhead)" />
                <line x1="30%" y1="60%" x2="50%" y2="80%" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="70%" y1="60%" x2="50%" y2="80%" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeDasharray="4,4" />

                {/* Nodes */}
                <g className="cursor-pointer group">
                  <circle cx="50%" cy="30%" r="30" className="fill-surface-container stroke-blue-500 stroke-2 group-hover:fill-blue-500/10 transition-colors" />
                  <text x="50%" y="30%" textAnchor="middle" dy=".3em" className="fill-on-surface text-xs font-bold">Admin</text>
                  <text x="50%" y="30%" textAnchor="middle" dy="2.5em" className="fill-on-surface-variant/60 text-[9px] font-mono">98%</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="30%" cy="60%" r="25" className="fill-surface-container stroke-purple-500 stroke-2 group-hover:fill-purple-500/10 transition-colors" />
                  <text x="30%" y="60%" textAnchor="middle" dy=".3em" className="fill-on-surface text-xs font-bold">Product</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="70%" cy="60%" r="25" className="fill-surface-container stroke-green-500 stroke-2 group-hover:fill-green-500/10 transition-colors" />
                  <text x="70%" y="60%" textAnchor="middle" dy=".3em" className="fill-on-surface text-xs font-bold">Eng</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="50%" cy="80%" r="25" className="fill-surface-container stroke-yellow-500 stroke-2 group-hover:fill-yellow-500/10 transition-colors" />
                  <text x="50%" y="80%" textAnchor="middle" dy=".3em" className="fill-on-surface text-xs font-bold">Ops</text>
                </g>
              </svg>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-high text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  <th className="p-4 font-normal">Identity</th>
                  <th className="p-4 font-normal">Role</th>
                  <th className="p-4 font-normal">Team</th>
                  <th className="p-4 font-normal">Active Nodes</th>
                  <th className="p-4 font-normal">Health Score</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(member => (
                  <tr key={member.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/40 transition-colors cursor-pointer group">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center text-[10px] font-bold text-on-surface border border-outline-variant/20">{member.name.split(' ').map(n=>n[0]).join('')}</div>
                      <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{member.name}</span>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant/80">{member.role}</td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-1 rounded bg-surface-container-low border border-outline-variant/20 text-on-surface-variant">{member.team}</span>
                    </td>
                    <td className="p-4 text-sm font-mono text-on-surface-variant">{member.nodes}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-outline-variant/20 rounded-full overflow-hidden w-16">
                          <div className={`h-full ${member.health > 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${member.health}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono text-on-surface-variant/60">{member.health}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setProfile(res.data);
        setName(res.data.name);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name cannot be empty');
    
    setIsUpdating(true);
    try {
      const res = await api.put('/auth/profile', { name });
      setProfile(res.data);
      toast.success('Profile updated successfully!');
      
      // Update local storage so changes reflect elsewhere instantly
      const stored = window.localStorage.getItem('decisionledger_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = res.data.name;
        window.localStorage.setItem('decisionledger_user', JSON.stringify(parsed));
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      toast.error(`Update failed: ${errMsg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <PageFrame title="Profile Info" subtitle="Review your identity, notification preferences, and workspace access." icon="account_circle">
        <div className="text-center py-12 text-on-surface-variant">Loading user profile...</div>
      </PageFrame>
    );
  }

  const displayName = profile?.name || user?.name || 'User';
  const emailAddress = profile?.email || user?.email || '';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <PageFrame title="Profile Info" subtitle="Review your identity, notification preferences, and workspace access." icon="account_circle">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="glass-card rounded-xl p-6 text-center flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/15 font-geist text-3xl font-bold text-primary">
            {initials}
          </div>
          <h2 className="mt-5 font-geist text-xl font-bold text-on-surface">{displayName}</h2>
          <p className="text-sm text-on-surface-variant">Identity Node Proposer</p>
          <p className="mt-4 text-sm text-primary font-mono">{emailAddress}</p>
        </section>

        <div className="space-y-6">
          <section className="glass-card rounded-xl p-6">
            <h2 className="font-geist text-lg font-bold text-on-surface mb-4">Edit Profile Settings</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={emailAddress}
                  disabled
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface-variant cursor-not-allowed font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="font-geist text-lg font-bold text-on-surface">Workspace Access</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Admin role', 'SSO enabled', 'Weekly digest', 'Decision owner'].map((item) => (
                <div key={item} className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined mr-2 align-middle text-primary">check_circle</span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageFrame>
  );
}

export function SettingsPage() {
  const { mode, setMode, color, setColor } = useTheme();

  return (
    <PageFrame title="Settings" subtitle="Configure workspace governance, notifications, security, and appearance." icon="settings">
      
      <div className="mb-6 rounded-xl border border-outline-variant/30 bg-surface-container-high p-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">palette</span>
          <h2 className="font-geist text-lg font-bold">Appearance</h2>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant mb-6">Customize the application theme and primary color palette.</p>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-3">Theme Mode</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => setMode('light')}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-semibold transition-all ${mode === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                Light
              </button>
              <button 
                onClick={() => setMode('dark')}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-semibold transition-all ${mode === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                Dark (True Black)
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-3">Primary Color</h3>
            <div className="flex gap-3">
              {[
                { id: 'default', bg: 'bg-[#005ac2]' },
                { id: 'green', bg: 'bg-[#15803d]' },
                { id: 'red', bg: 'bg-[#b91c1c]' },
                { id: 'brown', bg: 'bg-[#92400e]' },
                { id: 'violet', bg: 'bg-[#6d28d9]' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${c.bg} ${color === c.id ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                  aria-label={c.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ['approval', 'Voting policy', 'Require two approvers and 70% consensus for high-risk decisions.'],
          ['notifications', 'Notifications', 'Send daily summaries and instant alerts for blocked decisions.'],
          ['lock', 'Security', 'Enforce SSO, role-based access, and 180-day audit retention.'],
        ].map(([icon, title, copy]) => (
          <article key={title} className="glass-card rounded-xl p-6">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            <h2 className="mt-4 font-geist text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{copy}</p>
            <button className="btn-secondary mt-5 w-full">Configure</button>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}

export function LogoutPage() {
  const { logout } = useAuth();
  const didLogoutRef = useRef(false);

  useEffect(() => {
    if (didLogoutRef.current) return;
    didLogoutRef.current = true;
    logout();
    toast.success('Signed out successfully.');
  }, [logout]);

  return (
    <div className="min-h-screen bg-background text-on-surface canvas-bg">
      <PageFrame title="Logged Out" subtitle="Your local session has been cleared for this prototype." icon="logout">
      <div className="glass-card rounded-xl p-8 text-center">
        <h2 className="font-geist text-2xl font-bold">You are signed out</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
          Return to the auth page to sign in again or create another workspace.
        </p>
        <Link to="/auth" replace className="btn-primary mt-6 inline-flex items-center gap-2">
          Go to auth <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
      </PageFrame>
    </div>
  );
}
