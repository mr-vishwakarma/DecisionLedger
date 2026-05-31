import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import FluidCanvas from '../../components/FluidCanvas';
import ProblemCostSection from './sections/ProblemCostSection';
import JourneyExplorationSection from './sections/JourneyExplorationSection';
import NarrativeGovernanceSection from './sections/NarrativeGovernanceSection';
import IntelligenceEcosystemSection from './sections/IntelligenceEcosystemSection';
import InformationConversionSection from './sections/InformationConversionSection';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const engineeredRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { mode, setMode } = useTheme();

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ─── Lenis Smooth Scrolling ───
    const lenis = new Lenis();
    
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ─── Custom Follower Cursor ───
    const cursor = cursorRef.current;
    
    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      });
    };
    window.addEventListener('mousemove', onMouseMove);

    const interactives = document.querySelectorAll('button, a, Link');
    const onMouseEnterInteractive = () => {
      gsap.to(cursor, { scale: 3, opacity: 0.3 });
    };
    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, opacity: 1 });
    };

    interactives.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    // ─── Hero Text Entry Animations ───
    gsap.from('.reveal-item', {
      y: 40,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.08
    });

    // ─── Scroll Reveal Observer for static elements ───
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // ─── Removed Horizontal Scroll Pinning (Replaced by modular sections) ───

    // ─── Cleanup ───
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
      lenis.destroy();
      observer.disconnect();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleAnchorScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-surface font-body min-h-screen text-on-surface relative">
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface p-8 rounded-lg shadow-2xl max-w-md w-full border border-outline-variant/20 relative"
            >
              <h2 className="text-2xl font-display mb-6 text-on-surface">Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-body uppercase tracking-widest text-on-surface-variant mb-3">Appearance</h3>
                  <button
                    onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors"
                  >
                    <span className="font-body text-on-surface font-medium">Theme</span>
                    <span className="font-body text-sm flex items-center gap-2 text-on-surface">
                      {mode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-primary text-on-primary px-6 py-2 font-body text-xs uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Cursor */}
      <div className="custom-cursor hidden md:block" ref={cursorRef} id="cursor"></div>

      {/* WebGL Canvas */}
      <FluidCanvas />

      {/* Glass Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="flex justify-between items-center w-full px-margin-page py-6 max-w-screen-2xl mx-auto">
          <div className="font-display text-2xl tracking-tighter text-primary font-medium">
            <Link to="/">DecisionLedger</Link>
          </div>
          <div className="hidden md:flex gap-12 items-center">
            <Link
              className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity"
              to="/features"
            >
              Features
            </Link>
            <Link
              className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity"
              to="/documentation"
            >
              Documentation
            </Link>
            <Link
              className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity"
              to="/community"
            >
              Community
            </Link>
            <Link
              className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity"
              to="/pricing"
            >
              Pricing
            </Link>
            <button
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity flex items-center gap-2"
            >
              {mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity">Login</Link>
              <button onClick={() => setShowSettings(true)} className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity">Settings</button>
              <Link to="/logout" className="font-body text-xs uppercase tracking-widest text-on-surface hover:opacity-50 transition-opacity">Logout</Link>
            </div>
            <Link
              to="/auth"
              className="bg-primary text-on-primary px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary transition-all inline-block"
            >
              Secure Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Decorative Circle SVG Mask */}
        <svg className="hero-mask-svg" viewBox="0 0 100 100">
          <circle className="text-on-surface" cx="50" cy="50" fill="none" opacity="0.3" r="48" stroke="currentColor" stroke-width="0.1"></circle>
        </svg>

        <div className="relative z-20 text-center px-6 max-w-5xl">
          <div className="mb-8">
            <span className="inline-block font-body text-xs uppercase tracking-[0.4em] opacity-60 reveal-item">
              Enterprise Decision Engine v2.4
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-[90px] leading-[0.85] tracking-tight text-on-surface mb-8">
            <span className="inline-block reveal-item">NEVER LOSE</span><br />
            <span className="inline-block reveal-item">IMPORTANT</span><br />
            <span className="inline-block reveal-item">DECISIONS AGAIN</span>
          </h1>

          <p className="font-body text-md md:text-lg text-on-surface/75 max-w-2xl mx-auto mb-12 leading-relaxed">
            <span className="inline-block reveal-item">
              The best framework for decision-making teams. Capture every decision, track approvals, record full context, and voting history in a permanent, immutable ledger.
            </span>
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12 items-center">
            <Link
              to="/login"
              className="bg-primary text-on-primary px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary transition-all inline-block reveal-item"
            >
              Create Workspace
            </Link>
            <Link
              to="/demo"
              className="border border-primary text-primary px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all inline-block reveal-item"
            >
              Watch Demo
            </Link>
            <Link
              to="/systems"
              className="bg-black text-white border border-white/20 px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all inline-block reveal-item flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">science</span>
              Command Center
            </Link>
          </div>

          {/* Social Proof / Metrics */}
          <div className="flex justify-center gap-16 text-on-surface/60 text-xs uppercase tracking-widest border-t border-black/5 pt-8 max-w-md mx-auto">
            <div className="reveal-item">
              <span className="font-display text-2xl font-semibold block text-on-surface mb-1">10k+</span>
              Decisions Made
            </div>
            <div className="reveal-item">
              <span className="font-display text-2xl font-semibold block text-on-surface mb-1">500+</span>
              Active Teams
            </div>
          </div>

          <div className="mt-12">
            <a
              className="inline-block font-body text-xs uppercase tracking-[0.5em] text-on-surface border-b border-on-surface/40 pb-2 hover:border-on-surface transition-all cursor-pointer reveal-item"
              href="#engineered"
              onClick={(e) => handleAnchorScroll(e, '#engineered')}
            >
              Explore Archive
            </a>
          </div>
        </div>
      </section>

      {/* ─── MODULAR CINEMATIC SECTIONS ─── */}
      <ProblemCostSection />
      <JourneyExplorationSection />
      <NarrativeGovernanceSection />
      <IntelligenceEcosystemSection />
      <InformationConversionSection />

      {/* Connect With Us Section */}
      <section className="content-section bg-surface py-stack-xl border-t border-black/5" id="connect">
        <div className="max-w-screen-2xl mx-auto px-margin-page flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Info & Details */}
          <div className="w-full lg:w-1/2 scroll-reveal">
            <span className="font-body text-xs uppercase tracking-widest opacity-50 mb-6 block">Get in Touch</span>
            <div className="flex items-start gap-4 mb-8">
              <h2 className="font-display text-6xl md:text-7xl font-bold leading-[0.9] text-on-surface">
                Connect<br />with us.
              </h2>
              <div className="w-[3px] h-24 bg-black shrink-0 mt-1"></div>
            </div>
            
            <p className="font-body text-md text-on-surface/70 leading-relaxed mb-12 max-w-md">
              Want to join, volunteer, complain, or send a meme? We read everything. We reply to most things.
            </p>
            
            {/* Info Table */}
            <div className="space-y-1">
              {[
                ['EMAIL', 'support@decisionledger.io'],
                ['PRESS', 'support@decisionledger.io'],
                ['HEADQUARTERS', 'Wherever the wifi works.'],
                ['FOUNDED', '2024 · A movement by the people'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-4 border-b border-black/10 text-xs tracking-wider">
                  <span className="font-body opacity-50 uppercase">{label}</span>
                  <span className="font-body text-on-surface font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Brutalist Form */}
          <div className="w-full lg:w-1/2 scroll-reveal" style={{ transitionDelay: '200ms' }}>
            <div className="bg-[#ebe7e6] border-2 border-black shadow-[6px_6px_0px_#000000] p-8 md:p-10 rounded-sm">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-[10px] uppercase tracking-widest font-bold opacity-60">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Decision Warrior"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="border border-black bg-transparent px-4 py-3 text-xs placeholder-on-surface/40 focus:outline-none w-full"
                    />
                  </div>
                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-[10px] uppercase tracking-widest font-bold opacity-60">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="border border-black bg-transparent px-4 py-3 text-xs placeholder-on-surface/40 focus:outline-none w-full"
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-[10px] uppercase tracking-widest font-bold opacity-60">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleFormChange}
                    className="border border-black bg-transparent px-4 py-3 text-xs placeholder-on-surface/40 focus:outline-none w-full"
                  />
                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-[10px] uppercase tracking-widest font-bold opacity-60">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleFormChange}
                    className="border border-black bg-transparent px-4 py-3 text-xs placeholder-on-surface/40 focus:outline-none w-full resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-neutral-800 transition-all font-body text-xs uppercase tracking-widest py-4 font-semibold flex items-center justify-center gap-2"
                >
                  {formSubmitted ? 'Message Sent ✓' : 'SEND MESSAGE →'}
                </button>
              </form>
              <p className="text-center font-body text-[10px] opacity-55 italic mt-4">
                We read everything. We reply to most things. No spam, ever.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="content-section py-stack-lg border-t border-black/5 bg-surface relative z-10">
        <div className="max-w-screen-2xl mx-auto px-margin-page flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="font-display text-2xl font-medium mb-2 text-primary">DecisionLedger</div>
            <p className="font-body text-[10px] uppercase tracking-widest opacity-50">
              The best framework for transparent decision tracking and institutional knowledge.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center">
            <Link className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-all font-semibold" to="/features">Features</Link>
            <Link className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-all font-semibold" to="/pricing">Pricing</Link>
            <Link className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-all font-semibold" to="/documentation">Documentation</Link>
            <Link className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-all font-semibold" to="/community">Community</Link>
          </div>

          <div className="text-[9px] uppercase tracking-widest opacity-40 text-center md:text-right">
            © 2024 Institutional Intelligence for Global Sovereignty
          </div>
        </div>
      </footer>
    </div>
  );
}
