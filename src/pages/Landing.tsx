import { motion } from 'motion/react';
import { 
  ChevronRight, 
  FileText, 
  Search, 
  BookOpen, 
  Share2, 
  Zap, 
  Shield, 
  Globe, 
  MessageSquare, 
  Layers, 
  Save, 
  Palette, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Youtube,
  Layout,
  GraduationCap,
  Beaker,
  Code2,
  Briefcase,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

const smartFeatures = [
  {
    icon: <UploadIcon className="text-brand-purple" />,
    title: "Intelligent Upload",
    description: "Upload PDFs with real-time processing percentage and structure analysis."
  },
  {
    icon: <MessageSquare className="text-brand-purple" />,
    title: "Document Chat",
    description: "Ask complex questions directly to your documents and get instant, cited answers."
  },
  {
    icon: <Globe className="text-brand-purple" />,
    title: "Web Research",
    description: "Browser-style integrated search to find related information across the entire web."
  },
  {
    icon: <Layers className="text-brand-purple" />,
    title: "Source Citations",
    description: "Automatic page references and source citations for every AI-generated insight."
  },
  {
    icon: <Save className="text-brand-purple" />,
    title: "Autosave Notes",
    description: "Your research notes are saved in real-time as you explore and write."
  },
  {
    icon: <Share2 className="text-brand-purple" />,
    title: "Source Mapping",
    description: "Visualize topic connections and source relationships in an interactive graph."
  },
  {
    icon: <Palette className="text-brand-purple" />,
    title: "Theme Customization",
    description: "Choose from premium themes like Deep Black, Slate Grey, or Midnight Purple."
  },
  {
    icon: <Clock className="text-brand-purple" />,
    title: "Research Sessions",
    description: "Save and resume your research sessions exactly where you left off."
  }
];

const useCases = [
  {
    icon: <GraduationCap size={24} />,
    title: "Students",
    description: "Master complex subjects by turning lecture notes and textbooks into interactive study guides."
  },
  {
    icon: <Beaker size={24} />,
    title: "Researchers",
    description: "Analyze vast amounts of material, find connections, and map out source intelligence effortlessly."
  },
  {
    icon: <Code2 size={24} />,
    title: "Developers",
    description: "Navigate technical documentation and API references with an AI that understands context."
  },
  {
    icon: <Briefcase size={24} />,
    title: "Professionals",
    description: "Organize reports, analyze market data, and build structured research for business decisions."
  },
  {
    icon: <Users size={24} />,
    title: "Teams",
    description: "Collaborate on shared research projects with structured knowledge maps and synced notes."
  }
];

function UploadIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-dark overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
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
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 purple-glow"
              >
                Start Researching <ChevronRight size={20} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold border border-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">A seamless 4-step workflow to master any document.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent -translate-y-12" />
            
            {[
              { step: "01", title: "Upload Document", desc: "Drag and drop your PDF or research material." },
              { step: "02", title: "AI Analysis", desc: "Our AI understands content and structure instantly." },
              { step: "03", title: "Deep Research", desc: "Ask questions and browse related web sources." },
              { step: "04", title: "Map & Save", desc: "Explore source maps and save your research notes." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-xl mb-6 purple-glow">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Workspace Showcase */}
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
              <div className="glass-panel rounded-3xl p-2 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]">
                <div className="flex bg-bg-dark/50 rounded-2xl aspect-[4/3] border border-white/5 overflow-hidden">
                  {/* Mock Workspace Left */}
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
                  {/* Mock Workspace Right */}
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
              </div>
              {/* Floating Accents */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-purple/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-purple/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Smart Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Smart Features</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to master any subject, powered by advanced AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {smartFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-panel p-8 rounded-3xl border-white/5 hover:border-brand-purple/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Source Intelligence Section */}
      <section className="py-24 px-6 bg-white/[0.01] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Source Intelligence</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Trust and depth through transparent citations and visual mapping.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cited Sources Card */}
            <div className="glass-panel p-8 rounded-[32px] border-white/5">
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
            </div>

            {/* Source Map Visualization Card */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <div className="red-dot animate-pulse" />
              </div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Share2 size={18} className="text-brand-purple" /> Topic Mapping
              </h3>
              <div className="relative h-48 flex items-center justify-center">
                {/* Mock Graph */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Every Researcher</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From students to professionals, ::-1 adapts to your research needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {useCases.map((useCase, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="glass-panel p-6 rounded-3xl border-white/5 text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-4 text-brand-purple">
                  {useCase.icon}
                </div>
                <h3 className="font-bold mb-2">{useCase.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Showcase */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-[48px] p-8 md:p-16 border-white/5 relative overflow-hidden">
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
                <div className="glass-panel rounded-3xl p-4 border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
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
                      <Link to="/dashboard" className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold text-sm purple-glow">
                        Open Workspace
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-panel rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/10 blur-[100px] rounded-full" />
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">Ready to elevate your <br /> <span className="text-brand-purple">research game?</span></h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of researchers, students, and professionals who are already using ::-1 to unlock the full potential of their documents.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-purple/90 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 purple-glow relative z-10"
          >
            Get Started for Free <ChevronRight size={24} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EditIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

