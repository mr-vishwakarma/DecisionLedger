import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function DecisionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [decision, setDecision] = useState(null);
  const [votes, setVotes] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finalConclusion, setFinalConclusion] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const fetchDecision = async () => {
    try {
      const res = await api.get(`/decisions/${id}`);
      const data = res.data;
      setDecision(data.decision);
      setVotes(data.votes);
      
      if (user) {
        const myVote = data.votes.find(v => v.voter._id === user._id || v.voter === user._id);
        if (myVote) setUserVote(myVote.choice);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load decision details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecision();
  }, [id, user]);

  const handleVote = async (choice) => {
    if (decision.status !== 'Pending') return toast.error('Voting is closed');
    if (userVote) return toast.error('You have already voted');
    
    try {
      await api.post(`/decisions/${id}/vote`, { choice, reasoning: '' });
      toast.success('Vote recorded securely');
      fetchDecision(); // refresh data
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      toast.error(errMsg);
    }
  };

  const handleFinalize = async (status) => {
    if (!finalConclusion && status === 'Finalized') {
      return toast.error('Please provide a final conclusion');
    }
    
    try {
      await api.post(`/decisions/${id}/finalize`, { status, finalConclusion });
      toast.success(`Decision ${status} successfully and committed to ledger`);
      fetchDecision();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      toast.error(errMsg);
    }
  };

  const handleVerifyBlockchain = async () => {
    setVerifying(true);
    setVerifyResult(null);
    setShowVerifyModal(true);
    try {
      const res = await api.get(`/decisions/${id}/verify-blockchain`);
      setVerifyResult(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to run blockchain verification check');
      setShowVerifyModal(false);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant">Loading decision data securely...</div>;
  if (!decision) return <div className="p-8 text-center text-error">Decision not found</div>;

  const totalVotes = votes.length;
  const agreeVotes = votes.filter(v => v.choice === 'Agree').length;
  const disagreeVotes = votes.filter(v => v.choice === 'Disagree').length;
  
  const agreePercentage = totalVotes ? Math.round((agreeVotes / totalVotes) * 100) : 0;
  const disagreePercentage = totalVotes ? Math.round((disagreeVotes / totalVotes) * 100) : 0;
  
  const isProposer = user && decision.proposedBy && (decision.proposedBy._id === user._id);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
          <Link to="/decisions" replace className="hover:text-primary transition-colors">Decisions</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-medium">{decision.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`badge ${decision.status === 'Pending' ? 'badge-pending' : decision.status === 'Finalized' ? 'badge-approved' : 'badge-rejected'}`}>
                  {decision.status}
                </span>
                <span className="text-xs text-on-surface-variant">{new Date(decision.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl font-bold text-on-surface font-geist mb-4">{decision.title}</h1>
              <p className="text-on-surface-variant leading-relaxed">{decision.context}</p>
            </div>

            {decision.reasoning && (
              <div className="glass-card rounded-xl p-6">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Core Reasoning</span>
                <p className="text-on-surface-variant leading-relaxed mt-2">{decision.reasoning}</p>
              </div>
            )}

            {/* Discarded Alternatives */}
            {decision.optionsConsidered && decision.optionsConsidered.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-on-surface font-geist mb-4">Considered Alternatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decision.optionsConsidered.map((alt, i) => (
                    <div key={i} className="glass-card rounded-xl p-5 opacity-70">
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-rejected text-[9px]">Discarded</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{alt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {decision.status !== 'Pending' && decision.finalConclusion && (
              <div className="glass-card rounded-xl p-6 border-l-4 border-l-green-500">
                <h3 className="text-base font-semibold text-on-surface font-geist mb-2">Final Conclusion</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{decision.finalConclusion}</p>
                {decision.ledgerHash && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Ledger Hash (SHA-256)</span>
                      <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded break-all">{decision.ledgerHash}</code>
                    </div>
                    <div className="flex items-center gap-3">
                      {decision.blockchainAnchored ? (
                        <button
                          onClick={handleVerifyBlockchain}
                          className="flex items-center gap-1.5 text-xs text-green-500 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full hover:bg-green-500/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">verified</span>
                          Verify On-Chain Audit Trail
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant italic">
                          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                          Anchoring to Blockchain...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Finalization Form for Proposer */}
            {decision.status === 'Pending' && isProposer && (
              <div className="glass-card rounded-xl p-6 border border-primary/30">
                <h3 className="text-base font-semibold text-on-surface font-geist mb-2">Finalize Decision</h3>
                <p className="text-xs text-on-surface-variant mb-4">As the proposer, you can finalize or reject this decision. This will cryptographically lock the decision and all votes into the ledger.</p>
                
                <textarea
                  value={finalConclusion}
                  onChange={(e) => setFinalConclusion(e.target.value)}
                  placeholder="Summarize the final conclusion..."
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 mb-4 min-h-[80px]"
                />
                
                <div className="flex items-center gap-3">
                  <button onClick={() => handleFinalize('Finalized')} className="btn-primary flex-1">Finalize & Approve</button>
                  <button onClick={() => handleFinalize('Rejected')} className="btn-secondary text-error border-error/50 hover:bg-error/10">Reject</button>
                </div>
              </div>
            )}
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Consensus Widget */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-on-surface font-geist">Consensus</h3>
                <span className={`text-xs font-semibold ${totalVotes > 0 ? 'text-green-600 dark:text-green-400' : 'text-on-surface-variant'}`}>
                  {totalVotes > 0 ? `${totalVotes} Votes` : 'No votes yet'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Agree</span>
                    <span className="text-xs font-semibold text-on-surface">{agreePercentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agreePercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Disagree</span>
                    <span className="text-xs font-semibold text-on-surface">{disagreePercentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${disagreePercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-error rounded-full"
                    />
                  </div>
                </div>
              </div>

              {decision.status === 'Pending' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVote('Agree')}
                    disabled={userVote}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      userVote === 'Agree'
                        ? 'bg-primary text-background'
                        : 'border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50'
                    }`}
                  >
                    {userVote === 'Agree' ? 'Agreed' : 'Agree'}
                  </button>
                  <button
                    onClick={() => handleVote('Disagree')}
                    disabled={userVote}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      userVote === 'Disagree'
                        ? 'bg-error text-white'
                        : 'border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-50'
                    }`}
                  >
                    {userVote === 'Disagree' ? 'Disagreed' : 'Disagree'}
                  </button>
                </div>
              )}
            </div>

            {/* Author */}
            <div className="glass-card rounded-xl p-5">
              <h4 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Proposed By</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {decision.proposedBy?.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{decision.proposedBy?.name || 'Unknown User'}</p>
                  <p className="text-xs text-on-surface-variant">{decision.proposedBy?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Votes Log */}
            {votes.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-base font-semibold text-on-surface font-geist mb-5">Voter Log</h3>
                <div className="space-y-4">
                  {votes.map((v, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[9px] font-bold text-on-surface-variant">
                          {v.voter?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <span className="text-xs font-medium text-on-surface">{v.voter?.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${v.choice === 'Agree' ? 'text-primary' : 'text-error'}`}>
                        {v.choice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </motion.div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-xl w-full rounded-2xl p-6 space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                On-Chain Verification Auditing
              </h3>
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {verifying ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-on-surface-variant font-medium">Querying Polygon blockchain nodes...</p>
              </div>
            ) : verifyResult ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 bg-green-500/10 text-green-500 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                  <div>
                    <h4 className="font-bold">Cryptographically Verified</h4>
                    <p className="text-xs opacity-90">This decision is mathematically proven to be untampered since it was finalized.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Local Database Hash</span>
                    <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded break-all block">{verifyResult.localHash}</code>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">On-Chain Registered Hash</span>
                    <code className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded break-all block">{verifyResult.onChainHash}</code>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Polygon Transaction Hash</span>
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${verifyResult.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all block flex items-center gap-1"
                    >
                      {verifyResult.txHash}
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                  {verifyResult.timestamp && (
                    <div>
                      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">Anchoring Timestamp</span>
                      <span className="text-on-surface text-xs">{new Date(verifyResult.timestamp).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-error space-y-2">
                <span className="material-symbols-outlined text-3xl">error</span>
                <p>Failed to verify audit logs on-chain.</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-outline-variant/20">
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="btn-secondary"
              >
                Close Audit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
