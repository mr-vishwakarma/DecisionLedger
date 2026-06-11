import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: "Is DecisionLedger secure enough for sovereign data?", a: "Yes. We use military-grade AES-256 encryption at rest and TLS 1.3 in transit. Enterprise tiers include single-tenant infrastructure options and local key management." },
  { q: "Can we integrate this with our existing HR and Auth tools?", a: "Absolutely. We support SAML SSO, active directory sync, and SCIM provisioning out of the box." },
  { q: "What happens if we want to export our data?", a: "Your data is yours. You can export the entire cryptographic ledger history via API or bulk JSON export at any time." },
  { q: "How long does it take to deploy across a 1,000+ person org?", a: "Most enterprise deployments reach 80% adoption within 14 days due to our slack/teams integration which captures decisions where they already happen." }
];

export default function InformationConversionSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full flex flex-col items-center">
      
      
      <section className="w-full flex flex-col items-center justify-center relative bg-[#020202] px-margin-page py-32 border-b border-white/5">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-16">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block">16 / Intelligence Queries</span>
            <h2 className="font-display text-5xl tracking-tighter text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white/90 text-sm">{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-sm text-white/60 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#050505] px-margin-page py-32">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-green-500 mb-6 block">17 / Developer Experience</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-6">Built for Engineers</h2>
            <p className="font-body text-sm text-white/60 mb-8 max-w-md">
              Everything in the UI is available via our REST API. Build custom governance bots, automate ledger entries from your CI/CD pipeline, or extract analytics.
            </p>

            <div className="bg-[#020202] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex gap-2 p-3 border-b border-white/10 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="p-6 font-mono text-xs text-white/70 leading-loose">
                <span className="text-purple-400">const</span> ledger = <span className="text-blue-400">new</span> DecisionLedger(API_KEY);<br/>
                <br/>
                <span className="text-white/40">// Record a new strategic architecture decision</span><br/>
                <span className="text-purple-400">await</span> ledger.decisions.<span className="text-yellow-200">create</span>({'{'}<br/>
                &nbsp;&nbsp;title: <span className="text-green-400">"Migrate to GraphQL"</span>,<br/>
                &nbsp;&nbsp;context: <span className="text-green-400">"REST endpoints failing under load"</span>,<br/>
                &nbsp;&nbsp;quorumRequired: <span className="text-orange-400">true</span>,<br/>
                &nbsp;&nbsp;reviewers: [<span className="text-green-400">"eng-lead"</span>, <span className="text-green-400">"cto"</span>]<br/>
                {'}'});
              </div>
            </div>
          </div>

          
          <div className="flex flex-col justify-center">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-blue-500 mb-6 block">18 / The Future</span>
            <h2 className="font-display text-4xl tracking-tighter text-white mb-12">The Sovereign Vision</h2>

            <div className="relative border-l border-white/20 pl-8 space-y-12 ml-4">
              <div className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-widest">Current Generation</div>
                <div className="text-lg text-white font-bold mb-2">Enterprise Decision Graph</div>
                <div className="text-sm text-white/50">Full organizational memory capture and governance routing.</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-white/20"></div>
                <div className="text-xs font-bold text-white/40 mb-1 uppercase tracking-widest">Q4 2026</div>
                <div className="text-lg text-white/80 font-bold mb-2">Autonomous Resolution Agents</div>
                <div className="text-sm text-white/40">AI agents that can automatically resolve low-risk operational decisions based on historical parameters.</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-white/10"></div>
                <div className="text-xs font-bold text-white/30 mb-1 uppercase tracking-widest">2028+</div>
                <div className="text-lg text-white/50 font-bold mb-2">Simulated Sovereign Entities</div>
                <div className="text-sm text-white/30">Fully self-governing algorithmic corporate structures guided by the ledger.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="w-full flex flex-col items-center justify-center relative bg-blue-900/10 px-margin-page py-32 border-t border-blue-500/20">
        <div className="max-w-4xl w-full text-center relative z-10">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-blue-400 mb-6 block">Initialization</span>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-white mb-8">Deploy Your Intelligence Infrastructure.</h2>
          <p className="font-body text-md text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop losing context. Stop repeating mistakes. Secure your organizational memory in an immutable ledger today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="/login" className="bg-white text-black px-12 py-5 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">electric_bolt</span>
              Create Free Workspace
            </a>
            <a href="mailto:enterprise@decisionledger.io" className="bg-transparent border border-white/30 text-white px-12 py-5 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">apartment</span>
              Contact Enterprise Sales
            </a>
          </div>
          
          <div className="mt-12 text-[10px] uppercase tracking-widest text-white/30">
            No credit card required for standard workspaces. SOC2 compliant.
          </div>
        </div>
      </section>

    </div>
  );
}
