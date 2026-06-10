import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';

export default function CompanyNameModal() {
  const { showCompanyModal, updateCompanyName, user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error('Please enter a valid company or organization name');
      return;
    }

    setIsLoading(true);
    try {
      await updateCompanyName(companyName.trim());
      toast.success('Organization profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update organization name');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showCompanyModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white font-sans"
          >
            {/* Background ambient lighting */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-3xl text-white">domain</span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-xl font-bold font-display tracking-tight mb-2">Welcome to DecisionLedger!</h2>
              <p className="text-sm text-neutral-400 mb-6">
                Let's customize your experience. Please enter your workspace, company, or organization name below.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full text-left space-y-4">
                <div>
                  <label htmlFor="company-name" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Company / Organization Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    disabled={isLoading}
                    placeholder="e.g. Acme Corp or Research Lab"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !companyName.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 mt-2"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Complete Onboarding</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
