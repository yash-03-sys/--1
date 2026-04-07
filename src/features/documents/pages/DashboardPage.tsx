import { motion } from 'motion/react';
import { Upload, FileText, Clock, Plus, Search, MoreVertical, Trash2, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/src/components/common/Navbar';
import { Footer } from '@/src/components/common/Footer';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useState } from 'react';

const recentDocs = [
  { id: 1, name: "Quantum Computing Basics.pdf", date: "2 hours ago", size: "1.2 MB", status: "Processed" },
  { id: 2, name: "Global Economic Trends 2024.docx", date: "Yesterday", size: "850 KB", status: "Processed" },
  { id: 3, name: "Neural Networks Architecture.pdf", date: "3 days ago", size: "4.5 MB", status: "Processed" },
  { id: 4, name: "Sustainable Energy Solutions.pdf", date: "1 week ago", size: "2.1 MB", status: "Processed" }
];

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-bg-dark pt-28 px-6 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Workspace</h1>
            <p className="text-gray-400">Manage your documents and research projects.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search documents..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors"
                />
             </div>
             <Button variant="primary" size="sm" className="p-3">
                <Plus size={24} />
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card 
              whileHover={{ scale: 1.01 }}
              padding="lg"
              className="border-dashed border-2 border-white/10 hover:border-brand-purple/50 cursor-pointer group relative overflow-hidden"
              onClick={handleUpload}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-brand-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform purple-glow">
                  <Upload className="text-brand-purple" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Upload Research Material</h2>
                <p className="text-gray-400 max-sm mx-auto mb-8">
                  Drag and drop your PDF, DOCX, or TXT files here to start your intelligent research.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">PDF</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">DOCX</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">TXT</span>
                </div>
              </div>

              {isUploading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-bg-dark/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 z-20"
                >
                  <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-between items-end">
                       <div>
                          <h3 className="text-xl font-bold mb-1">Uploading...</h3>
                          <p className="text-sm text-gray-400">Processing document structure</p>
                       </div>
                       <span className="text-brand-purple font-bold text-2xl">{uploadProgress}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-brand-purple purple-glow"
                         initial={{ width: 0 }}
                         animate={{ width: `${uploadProgress}%` }}
                       />
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>

            <Card padding="none" className="overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Clock size={20} className="text-brand-purple" />
                  Recent Documents
                </h2>
                <button className="text-sm text-brand-purple hover:underline font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                      <th className="px-8 py-4 font-medium">Name</th>
                      <th className="px-8 py-4 font-medium">Date</th>
                      <th className="px-8 py-4 font-medium">Size</th>
                      <th className="px-8 py-4 font-medium">Status</th>
                      <th className="px-8 py-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocs.map((doc) => (
                      <tr key={doc.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <td className="px-8 py-5">
                          <Link to="/workspace" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                              <FileText size={20} />
                            </div>
                            <span className="font-medium group-hover:text-brand-purple transition-colors">{doc.name}</span>
                          </Link>
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-400">{doc.date}</td>
                        <td className="px-8 py-5 text-sm text-gray-400 font-mono">{doc.size}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-gray-500 hover:text-white transition-colors">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card padding="md">
              <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">New Project</div>
                    <div className="text-xs text-gray-500">Create a blank workspace</div>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Shared with Me</div>
                    <div className="text-xs text-gray-500">Collaborate on research</div>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Trash</div>
                    <div className="text-xs text-gray-500">Recently deleted items</div>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
