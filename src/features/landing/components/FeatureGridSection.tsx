import { motion } from 'motion/react';
import { MessageSquare, Globe, Layers, Save, Share2, Palette, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/src/components/ui/Card';

const smartFeatures = [
  {
    icon: <UploadIcon className="text-brand-purple" />,
    title: "Intelligent Upload",
    description: "Upload PDFs with real-time processing percentage and structure analysis.",
    to: "/dashboard",
  },
  {
    icon: <MessageSquare className="text-brand-purple" />,
    title: "Document Chat",
    description: "Ask complex questions directly to your documents and get instant, cited answers.",
    to: "/dashboard",
  },
  {
    icon: <Globe className="text-brand-purple" />,
    title: "Web Research",
    description: "Browser-style integrated search to find related information across the entire web.",
    to: "/dashboard",
  },
  {
    icon: <Layers className="text-brand-purple" />,
    title: "Source Citations",
    description: "Automatic page references and source citations for every AI-generated insight.",
    to: "/dashboard",
  },
  {
    icon: <Save className="text-brand-purple" />,
    title: "Autosave Notes",
    description: "Your research notes are saved in real-time as you explore and write.",
    to: "/dashboard",
  },
  {
    icon: <Share2 className="text-brand-purple" />,
    title: "Source Mapping",
    description: "Visualize topic connections and source relationships in an interactive graph.",
    to: "/dashboard",
  },
  {
    icon: <Palette className="text-brand-purple" />,
    title: "Theme Customization",
    description: "Choose from premium themes like Deep Black, Slate Grey, or Midnight Purple.",
    to: "/settings",
  },
  {
    icon: <Clock className="text-brand-purple" />,
    title: "Research Sessions",
    description: "Save and resume your research sessions exactly where you left off.",
    to: "/dashboard",
  }
];

function UploadIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

export const FeatureGridSection = () => {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Smart Features</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to master any subject, powered by advanced AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {smartFeatures.map((feature, idx) => (
            <Link key={idx} to={feature.to} className="block">
              <Card
                whileHover={{ y: -5 }}
                className="group hover:border-brand-purple/30 cursor-pointer h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
