import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Mail } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-brand-purple/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-40 left-[10%] red-dot animate-pulse" />
      <div className="absolute top-60 right-[15%] red-dot animate-pulse delay-700" />
      <div className="absolute bottom-20 left-[20%] red-dot animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-[40px] p-10 md:p-12 text-center relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-3 group mb-10">
          <div className="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-2xl purple-glow group-hover:scale-110 transition-transform">
            ::
          </div>
          <span className="text-3xl font-bold tracking-tighter" aria-label="Colon Colon Minus One">
            ::-1
          </span>
        </Link>

        <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
        <p className="text-gray-400 mb-10">Sign in to access your research workspace and intelligent insights.</p>

        <div className="flex flex-col gap-4">
          <button className="w-full bg-white text-black hover:bg-gray-100 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            Continue with Google
          </button>
          
          <button className="w-full bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
            <Mail size={20} />
            Continue with Email
          </button>
        </div>

        <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck size={16} className="text-brand-purple" />
          <span>Secure, encrypted authentication</span>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Don't have an account? <Link to="/login" className="text-brand-purple hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
}
