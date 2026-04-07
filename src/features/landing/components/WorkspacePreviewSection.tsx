import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/src/components/ui/Card';

export const WorkspacePreviewSection = () => {
  return (
    <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Ultimate <br /><span className="text-brand-purple">Research Workspace</span></h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Experience a split-screen interface designed for deep focus. On one side, chat with your documents and browse the web. On the other, build structured research notes that save automatically.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "AI Chat + Browser-style research",
                "Integrated source citations",
                "Real-time autosaving notes",
                "Visual topic mapping"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <CheckCircle2 size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-brand-purple font-bold hover:gap-3 transition-all">
              Explore the Workspace <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="relative">
            <Card variant="glass" padding="none" className="p-2 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
              <div className="flex bg-bg-dark/50 rounded-2xl aspect-[4/3] border border-white/5 overflow-hidden">
                <div className="w-1/2 border-r border-white/5 p-4 space-y-4">
                  <div className="h-8 w-full bg-white/5 rounded-lg flex items-center px-3 gap-2">
                    <Search size={12} className="text-gray-500" />
                    <div className="h-2 w-24 bg-white/10 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 w-full bg-brand-purple/10 rounded-xl border border-brand-purple/20 p-3">
                      <div className="h-2 w-12 bg-brand-purple/40 rounded-full mb-2" />
                      <div className="h-2 w-full bg-white/10 rounded-full mb-1" />
                      <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-16 w-full bg-white/5 rounded-xl p-3">
                      <div className="h-2 w-12 bg-white/20 rounded-full mb-2" />
                      <div className="h-2 w-full bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 p-6 space-y-4">
                  <div className="h-4 w-32 bg-white/20 rounded-full mb-6" />
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-4/5 bg-white/10 rounded-full" />
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-purple/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-purple/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
