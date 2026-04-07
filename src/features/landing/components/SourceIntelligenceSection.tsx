import { motion } from 'motion/react';
import { Layers, FileText, Globe, Youtube, ExternalLink, Share2 } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export const SourceIntelligenceSection = () => {
  return (
    <section className="py-24 px-6 bg-white/[0.01] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Source Intelligence</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Trust and depth through transparent citations and visual mapping.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card padding="md" className="border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Layers size={18} className="text-brand-purple" /> Cited Sources
            </h3>
            <div className="space-y-4">
              {[
                { title: "Quantum Mechanics Intro", type: "PDF Page 14", icon: <FileText size={14} /> },
                { title: "IBM Quantum Blog", type: "Web Link", icon: <Globe size={14} /> },
                { title: "Superposition Explained", type: "YouTube", icon: <Youtube size={14} /> }
              ].map((source, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="text-brand-purple">{source.icon}</div>
                    <div>
                      <div className="text-xs font-bold">{source.title}</div>
                      <div className="text-[10px] text-gray-500">{source.type}</div>
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-gray-600" />
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md" className="lg:col-span-2 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <div className="red-dot animate-pulse" />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Share2 size={18} className="text-brand-purple" /> Topic Mapping
            </h3>
            <div className="relative h-48 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="relative z-10 flex gap-12">
                 <div className="w-16 h-16 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-[10px] font-bold purple-glow">Quantum</div>
                 <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold mt-8">Qubits</div>
                 <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold -mt-4">Gates</div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                 <line x1="50%" y1="50%" x2="40%" y2="70%" stroke="#8b5cf6" strokeWidth="1" />
                 <line x1="50%" y1="50%" x2="60%" y2="30%" stroke="#8b5cf6" strokeWidth="1" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mt-6 text-center">
              Visualize connections between concepts and sources for deeper understanding.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
