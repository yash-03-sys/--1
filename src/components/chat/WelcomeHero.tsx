import { motion } from 'motion/react';
import { Sparkles, Zap, Brain, Search } from 'lucide-react';

export const WelcomeHero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight text-text-primary">
          Good afternoon, <span className="italic text-brand-primary">Yash</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-lg mx-auto font-light leading-relaxed">
          Your premium research assistant is ready to help you explore, understand, and create.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <SuggestionButton icon={Sparkles} label="Summarize recent paper" />
        <SuggestionButton icon={Search} label="Analyze market trends" />
        <SuggestionButton icon={Brain} label="Brainstorm project ideas" />
        <SuggestionButton icon={Zap} label="Quick web search" />
      </motion.div>
    </div>
  );
};

const SuggestionButton = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <button className="pill-button flex items-center gap-2 group">
    <Icon size={14} className="text-brand-primary group-hover:text-white transition-colors" />
    <span>{label}</span>
  </button>
);
