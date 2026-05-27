import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-8 h-8 rounded bg-brand-electric flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            DL
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-white">
            Decision<span className="text-brand-electric">Ledger</span>
          </span>
        </Link>
        
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-brand-text-muted hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/5">
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
