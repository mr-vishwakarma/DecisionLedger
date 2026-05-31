import { memo, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const pageData = {
  features: {
    eyebrow: 'Platform capabilities',
    title: 'Decision infrastructure for teams that need memory, accountability, and speed.',
    copy: 'Create a durable record for strategic choices, approvals, tradeoffs, objections, votes, and outcomes.',
    icon: 'auto_graph',
    cards: [
      ['timeline', 'Immutable context trails', 'Every note, vote, file, and state change is captured in chronological context.'],
      ['how_to_vote', 'Structured voting', 'Use quorum, weighted stakeholders, approvals, abstentions, and dissent tracking.'],
      ['manage_search', 'Searchable memory', 'Find the reasoning behind old decisions by owner, tag, team, risk, or artifact.'],
      ['shield_lock', 'Audit-ready records', 'Keep executive, compliance, and governance records aligned in one source.'],
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Plans for teams growing from first workspace to enterprise governance.',
    copy: 'Start lightweight, then add advanced analytics, security, and audit workflows as decision volume grows.',
    icon: 'payments',
    cards: [
      ['Personal', '$0/mo', '5 members, 25 decisions, timeline history, basic voting.'],
      ['Professional', '$29/user', 'Unlimited decisions, advanced analytics, integrations, priority support.'],
      ['Enterprise', 'Custom', 'SSO, audit APIs, data residency, dedicated success, SLA coverage.'],
    ],
  },
  documentation: {
    eyebrow: 'Documentation',
    title: 'Guides, APIs, and playbooks for deploying DecisionLedger with confidence.',
    copy: 'Use the docs hub to onboard teams, create decision workflows, connect integrations, and understand governance patterns.',
    icon: 'article',
    cards: [
      ['rocket_launch', 'Getting started', 'Create a workspace, invite members, and publish your first decision record.'],
      ['schema', 'Decision model', 'Understand owners, stakeholders, voting states, risk tiers, and final outcomes.'],
      ['api', 'API reference', 'Sync decisions, users, votes, webhooks, comments, and audit events.'],
      ['admin_panel_settings', 'Security guide', 'Configure roles, retention, SSO, approval policies, and export controls.'],
    ],
  },
  community: {
    eyebrow: 'Community',
    title: 'Learn with operators, founders, PMs, and governance teams building better decision habits.',
    copy: 'Share templates, vote patterns, postmortems, and operating rhythms with other DecisionLedger teams.',
    icon: 'forum',
    cards: [
      ['groups', 'Operator forum', 'Discuss team rituals, decision review cadence, and async voting practices.'],
      ['event', 'Live sessions', 'Live workshops on decision quality, audit trails, and leadership alignment.'],
      ['extension', 'Templates', 'Reusable templates for strategy, hiring, incident response, and spend approval.'],
      ['emoji_events', 'Showcases', 'See how high-performing teams preserve institutional memory.'],
    ],
  },
};

const navKeys = Object.keys(pageData);

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] },
  }),
};

const MarketingShell = memo(function MarketingShell({ type }) {
  const data = pageData[type];
  const pricing = type === 'pricing';
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const cards = useMemo(() => data.cards, [data.cards]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter canvas-bg">
      <header className="sticky top-0 z-50 border-b border-outline-variant/20 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link to="/" replace className="flex items-center gap-3">
            <img src="/logo.jpg" alt="DecisionLedger" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-geist font-bold">DecisionLedger</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navKeys.map((key) => (
              <Link key={key} to={`/${key}`} replace className={`text-sm font-semibold capitalize ${key === type ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                {key}
              </Link>
            ))}
          </div>
          <Link to="/auth" replace className="btn-primary">Create Workspace</Link>
        </nav>
      </header>

      <main id="main-content" className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
        <section ref={heroRef} className="grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-end">
          <motion.div style={{ y: heroY }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <span className="material-symbols-outlined text-sm">{data.icon}</span>
              {data.eyebrow}
            </div>
            <h1 className="font-geist text-4xl font-extrabold leading-tight tracking-normal lg:text-6xl">{data.title}</h1>
          </motion.div>
          <motion.div style={{ y: panelY }} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-card rounded-xl p-6">
            <p className="text-lg leading-8 text-on-surface-variant">{data.copy}</p>
            <Link to="/auth" replace className="btn-secondary mt-6 inline-flex items-center gap-2">
              Start now <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </motion.div>
        </section>

        <motion.section
          ref={cardsRef}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
          className={`mt-14 grid gap-4 ${pricing ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
        >
          {cards.map(([icon, title, copy], index) => (
            <motion.article
              key={title}
              custom={index}
              variants={cardVariants}
              className={`glass-card rounded-xl p-7 ${pricing && index === 1 ? 'border-primary/50' : ''}`}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <h2 className="font-geist text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{copy}</p>
            </motion.article>
          ))}
        </motion.section>
      </main>
    </div>
  );
});

export function FeaturesPage() {
  return <MarketingShell type="features" />;
}

export function PricingPage() {
  return <MarketingShell type="pricing" />;
}

export function DocumentationPage() {
  return <MarketingShell type="documentation" />;
}

export function CommunityPage() {
  return <MarketingShell type="community" />;
}
