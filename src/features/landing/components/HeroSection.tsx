import { motion } from 'motion/react';
import { ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-brand-purple/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-40 left-[10%] red-dot animate-pulse" />
      <div className="absolute top-60 right-[15%] red-dot animate-pulse delay-700" />
      
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-purple mb-8">
            <Zap size={14} /> AI-Powered Research Assistant
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Turn Documents Into <br />
            <span className="text-brand-purple">Intelligent Research</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Upload learning materials, ask questions, browse related information, and organize your knowledge in a premium workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" glow className="w-full sm:w-auto">
                Start Researching <ChevronRight size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
