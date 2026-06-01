import { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../auth/useAuth';

const nodes = [
  ['8%', '16%'], ['18%', '9%'], ['31%', '14%'], ['45%', '8%'], ['60%', '17%'],
  ['14%', '31%'], ['29%', '27%'], ['43%', '34%'], ['56%', '29%'], ['70%', '36%'],
  ['22%', '50%'], ['38%', '48%'], ['54%', '57%'], ['67%', '50%'], ['78%', '64%'],
];

const NetworkArt = memo(function NetworkArt() {
  const artRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: artRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.8, 0.35]);
  const lineSegments = useMemo(
    () =>
      nodes.flatMap(([x1, y1], i) =>
        nodes.slice(i + 1, i + 5).map(([x2, y2], j) => ({ id: `${i}-${j}`, x1, y1, x2, y2 }))
      ),
    []
  );

  return (
    <div ref={artRef} className="absolute inset-0 overflow-hidden">
      <motion.svg
        style={{ y, opacity }}
        className="absolute left-0 top-0 h-[280px] w-[560px] text-primary/20"
        viewBox="0 0 560 280"
        fill="none"
      >
        {lineSegments.map((line) => (
          <line key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="currentColor" strokeWidth="1" />
        ))}
        {nodes.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 4 === 0 ? 4 : 2.5} fill="currentColor" />
        ))}
      </motion.svg>
      <motion.div style={{ y }} className="absolute bottom-10 right-16 h-80 w-80 rounded-full border border-primary/10 bg-primary/5 blur-2xl" />
    </div>
  );
});

export default function AuthPage() {
  const location = useLocation();
  const [mode, setMode] = useState(() => (location.pathname === '/register' ? 'signup' : 'login'));
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const navigate = useNavigate();
  const { loginUser, registerUser, googleLoginUser, githubLoginUser } = useAuth();
  const isSignup = mode === 'signup';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      const from = location.state?.from?.startsWith('/') ? location.state.from : '/dashboard';
      githubLoginUser(code).then(() => {
        toast.success('Signed in with GitHub successfully.');
        navigate(from === '/auth' || from === '/login' || from === '/register' ? '/dashboard' : from, { replace: true });
      }).catch(error => {
        toast.error(error.message || 'GitHub Auth failed');
        navigate('/login', { replace: true });
      });
    }
  }, [location.search, githubLoginUser, location.state, navigate]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    const name = nameRef.current?.value?.trim() || email.split('@')[0];
    const from = location.state?.from?.startsWith('/') ? location.state.from : '/dashboard';

    try {
      if (isSignup) {
        await registerUser(name, email, password);
        toast.success('Workspace created and verification email sent. Please check your inbox.');
      } else {
        await loginUser(email, password);
        toast.success('Signed in successfully.');
      }
      navigate(from === '/auth' || from === '/login' || from === '/register' ? '/dashboard' : from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    }
  }, [isSignup, location.state, loginUser, registerUser, navigate]);

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      const from = location.state?.from?.startsWith('/') ? location.state.from : '/dashboard';
      await googleLoginUser(credentialResponse.credential);
      toast.success('Signed in with Google successfully.');
      navigate(from === '/auth' || from === '/login' || from === '/register' ? '/dashboard' : from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Google Auth failed');
    }
  }, [googleLoginUser, location.state, navigate]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter canvas-bg">
      <div className="grid min-h-screen lg:grid-cols-[1.04fr_1fr]">
        <section className="relative hidden border-r border-outline-variant/30 bg-surface-container-lowest lg:flex">
          <NetworkArt />
          <div className="relative z-10 flex min-h-screen flex-col justify-center px-16 xl:px-20">
            <Link to="/" replace className="mb-14 flex items-center gap-4">
              <img src="/logo.jpg" alt="DecisionLedger" className="h-14 w-14 rounded-xl object-cover shadow-[0_0_24px_rgba(173,198,255,0.2)]" />
              <span className="font-geist text-2xl font-bold tracking-tight text-on-surface">DecisionLedger</span>
            </Link>
            <h1 className="font-geist max-w-xl text-5xl font-extrabold leading-[1.08] tracking-normal text-on-surface xl:text-6xl">
              Your organization's <span className="text-primary">collective memory.</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-8 text-on-surface-variant">
              Capture, trace, and audit high-stakes decisions with blockchain-backed transparency and neural intelligence.
            </p>
            <div className="mt-20 space-y-4 text-primary">
              {[
                ['verified_user', 'Enterprise-Grade Security'],
                ['analytics', 'Predictive Impact Analysis'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-4 font-geist text-sm font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="main-content" className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[560px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" replace className="flex items-center gap-3">
                <img src="/logo.jpg" alt="DecisionLedger" className="h-10 w-10 rounded-lg object-cover" />
                <span className="font-geist text-lg font-bold">DecisionLedger</span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="glass-card rounded-xl p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-10"
            >
              <div className="mb-8 flex rounded-lg border border-outline-variant/30 bg-surface-container-low p-1">
                {[
                  ['login', 'Sign in'],
                  ['signup', 'Sign up'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
                      mode === value ? 'bg-primary text-background' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <h2 className="font-geist text-3xl font-bold text-on-surface">
                {isSignup ? 'Create your workspace' : 'Welcome back'}
              </h2>
              <p className="mt-2 text-on-surface-variant">
                {isSignup ? 'Start a command center for your team decisions.' : 'Access your command center'}
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                {isSignup && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-on-surface-variant">Your Name</label>
                    <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-4 py-3.5 focus-within:border-primary">
                      <span className="material-symbols-outlined text-outline">person</span>
                      <input ref={nameRef} className="w-full bg-transparent text-on-surface outline-none placeholder:text-outline" placeholder="Sarah Kim" required={isSignup} />
                    </div>
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-on-surface-variant">Work Email</label>
                  <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-4 py-3.5 focus-within:border-primary">
                    <span className="material-symbols-outlined text-outline">mail</span>
                    <input ref={emailRef} type="email" className="w-full bg-transparent text-on-surface outline-none placeholder:text-outline" placeholder="name@company.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-on-surface-variant">Password</label>
                  <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-4 py-3.5 focus-within:border-primary">
                    <span className="material-symbols-outlined text-outline">lock</span>
                    <input ref={passwordRef} type="password" required className="w-full bg-transparent text-on-surface outline-none placeholder:text-outline" placeholder="Password" />
                  </div>
                </div>
                {!isSignup && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-on-surface-variant">
                      <input type="checkbox" className="h-5 w-5 rounded border-outline-variant bg-surface-container accent-primary" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => toast.info('Password recovery flow will be connected to email service.')} className="font-semibold text-primary hover:underline">Forgot password?</button>
                  </div>
                )}
                <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-base">
                  {isSignup ? 'Create Workspace' : 'Sign In to Dashboard'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <div className="my-9 flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                <div className="h-px flex-1 bg-outline-variant/70" />
                Or continue with
                <div className="h-px flex-1 bg-outline-variant/70" />
              </div>

              <div className="flex justify-center mb-3">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Login Failed')}
                  theme="outline"
                  size="large"
                  text={isSignup ? "signup_with" : "signin_with"}
                  width="100%"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-1">
                <button type="button" onClick={() => {
                  window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=user:email`);
                }} className="btn-secondary flex items-center justify-center gap-3 py-3">
                  <span className="material-symbols-outlined text-lg">code</span>
                  GitHub
                </button>
              </div>
            </motion.div>

            <p className="mt-8 text-center text-on-surface-variant">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setMode(isSignup ? 'login' : 'signup')} className="font-semibold text-primary hover:underline">
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
