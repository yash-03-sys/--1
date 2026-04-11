import { motion } from 'motion/react';
import { Layout, MessageSquare, Layers, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

function UploadIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function EditIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export const ProductPreviewSection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Card padding="lg" className="md:p-16 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 blur-[120px] rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Premium <br /><span className="text-brand-purple">Product Showcase</span></h2>
              <p className="text-gray-400 text-lg mb-10">
                A comprehensive suite of tools designed for the modern researcher. Experience the future of document intelligence.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Upload Panel", icon: <UploadIcon size={16} /> },
                  { label: "Chat Panel", icon: <MessageSquare size={16} /> },
                  { label: "Source Cards", icon: <Layers size={16} /> },
                  { label: "Notes Editor", icon: <EditIcon size={16} /> },
                  { label: "Source Map", icon: <Share2 size={16} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium">
                    <div className="text-brand-purple">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card variant="glass" padding="sm" className="border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="bg-bg-dark/80 rounded-2xl aspect-square flex items-center justify-center border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent" />
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-brand-purple/20 flex items-center justify-center purple-glow">
                      <Layout className="text-brand-purple" size={40} />
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold mb-1">Workspace Ready</div>
                      <div className="text-sm text-gray-500">Document: Quantum_Research.pdf</div>
                    </div>
                    <Link to="/dashboard">
                      <Button glow size="md">
                        Open Workspace
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
