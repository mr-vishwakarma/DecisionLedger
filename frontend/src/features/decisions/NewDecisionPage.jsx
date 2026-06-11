import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function NewDecisionPage() {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tags, setTags] = useState(['Architecture', 'Q4-Roadmap']);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!title || !context) {
      toast.error('Title and context are required.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Sending POST /decisions with axios...');
      const res = await api.post('/decisions', {
        title,
        context,
        reasoning,
        optionsConsidered: [alternatives].filter(Boolean),
        priority,
        tags,
        category: 'Strategy'
      });

      console.log('Decision created successfully:', res.data);
      toast.success('Decision created successfully!');
      navigate('/decisions');
    } catch (error) {
      console.error('Error during decision creation:', error);
      const errMsg = error.response?.data?.message || error.message;
      toast.error(`Failed to publish decision: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-on-surface font-geist mb-2">Decision Parameters</h1>
          <p className="text-sm text-on-surface-variant max-w-xl">
            Define the architectural or operational change. Be precise with reasoning to ensure stakeholder alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Decision Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Transition to Distributed Event Bus architecture"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Context & Description</label>
                <div className="bg-surface-container border border-outline-variant/40 rounded-lg overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-outline-variant/20">
                    {['format_bold', 'format_italic', 'format_list_bulleted', 'link'].map((icon) => (
                      <button key={icon} className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[16px]">{icon}</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe the current problem space..."
                    className="w-full bg-transparent px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-y min-h-[120px]"
                    rows={5}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Considered Alternatives</label>
                <textarea
                  value={alternatives}
                  onChange={(e) => setAlternatives(e.target.value)}
                  placeholder="What other options were rejected?"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-y min-h-[160px]"
                  rows={7}
                />
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Deadline</label>
                <input
                  type="date"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Core Reasoning</label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Why is this the best path forward?"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-y min-h-[100px]"
                rows={4}
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Tags</label>
              <div className="flex flex-wrap items-center gap-2 bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                {tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20">
                    {tag}
                    <button onClick={() => removeTag(i)} className="hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag..."
                  className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant/40 min-w-[80px] flex-1"
                />
              </div>
            </div>

            
            <div className="flex items-center gap-3 pt-4">
              <button className="btn-secondary">Save Draft</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Decision'}
              </button>
            </div>
          </div>

          
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">Live Preview</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                  <div className="w-2 h-2 rounded-full bg-error"></div>
                </div>
              </div>

              <div className="space-y-4">
                <span className={`badge ${priority === 'High' || priority === 'Critical' ? 'badge-high' : priority === 'Low' ? 'badge-low' : 'badge-medium'}`}>
                  {priority}
                </span>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-on-surface font-geist">{title || 'Untitled Decision'}</h3>
                  <span className="text-xs text-on-surface-variant">Just now</span>
                </div>

                {(context || !title) && (
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-outline-variant/15">
                    <p className="text-sm text-on-surface-variant italic leading-relaxed">
                      {context || 'A brief snapshot of the context will appear here as you type...'}
                    </p>
                  </div>
                )}

                {reasoning && (
                  <div>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Key Reasoning</span>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{reasoning}</p>
                  </div>
                )}

                {!reasoning && (
                  <div>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Key Reasoning</span>
                    <p className="text-sm text-on-surface-variant mt-1">Strategic justification for this ledger entry...</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-[11px] text-on-surface-variant">Deadline</span>
                    <p className="text-sm font-medium text-on-surface">Not set</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-on-surface-variant">Author</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">{user?.name?.substring(0, 2).toUpperCase() || 'JD'}</div>
                      <span className="text-sm font-medium text-on-surface">{user?.name || 'John Doe'}</span>
                    </div>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button className="w-full btn-primary mt-2 text-center justify-center">
                  Open for Vote
                </button>

                <div className="flex items-start gap-2 pt-2 border-t border-outline-variant/15 mt-2">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    This is a live representation of how the decision will be displayed in the global activity stream and team dashboards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
