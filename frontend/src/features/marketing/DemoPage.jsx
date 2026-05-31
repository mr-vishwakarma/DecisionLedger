import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DemoPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative overflow-x-hidden">
      <div className="noise-overlay"></div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-nav border-b border-outline/5 bg-surface/20 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link to="/" className="font-display text-2xl tracking-tighter text-primary font-medium">
            DecisionLedger
          </Link>
          <Link to="/auth" className="bg-primary text-on-primary px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary transition-all">
            Secure Portal
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1000px] px-6 py-16 lg:py-24 relative z-10 flex flex-col items-center">
        <span className="font-body text-xs uppercase tracking-[0.4em] opacity-60 mb-6 text-center">
          Overview & Walkthrough
        </span>
        <h1 className="font-display text-5xl md:text-7xl tracking-tighter mb-8 text-center leading-tight">
          DecisionLedger Demo
        </h1>
        <p className="font-body text-md md:text-lg text-on-surface/70 max-w-xl text-center mb-16 leading-relaxed">
          See how sovereign organizations capture decision context, handle stakeholder weighted voting, and generate cryptographic audit trails in real-time.
        </p>

        {/* Video Placeholder Container (Brutalist Style) */}
        <div className="w-full aspect-video bg-[#ebe7e6] border-2 border-black shadow-[8px_8px_0px_#000000] flex flex-col items-center justify-center p-8 text-center mb-16 rounded-sm">
          <span className="material-symbols-outlined text-6xl mb-6 animate-pulse text-primary">play_circle</span>
          <h2 className="font-display text-3xl mb-4 font-semibold text-primary">Video Walkthrough Coming Soon</h2>
          <p className="font-body text-sm text-on-surface-variant max-w-md mb-8">
            We are currently recording our platform demo, covering workspace settings, active ledgers, audit logs, and security protocols.
          </p>

          {/* Inline Subscribe form */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
            <input
              type="email"
              placeholder="Enter your email for early access"
              className="border border-black bg-surface px-4 py-3 font-body text-xs focus:outline-none w-full sm:flex-1 placeholder-on-surface/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-black text-white hover:bg-neutral-800 transition-all font-body text-xs uppercase tracking-wider px-6 py-3 font-semibold whitespace-nowrap"
            >
              {subscribed ? 'Notified ✓' : 'Notify Me →'}
            </button>
          </form>
          {subscribed && (
            <p className="text-[11px] text-green-700 font-semibold mt-3">
              Thank you! We will notify you once the demo video is live.
            </p>
          )}
        </div>

        <Link
          to="/"
          className="font-body text-xs uppercase tracking-[0.3em] text-on-surface border-b border-on-surface/40 pb-1.5 hover:border-on-surface transition-all"
        >
          ← Return to Dashboard
        </Link>
      </main>
    </div>
  );
}
