import { motion } from 'motion/react';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Share2, 
  Download,
  Info,
  Layers
} from 'lucide-react';
import { Navbar } from '@/src/components/common/Navbar';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/src/utils/cn';

const nodes = [
  { id: 1, label: "Quantum Computing", x: 50, y: 50, size: 100, color: "#8b5cf6" },
  { id: 2, label: "Superposition", x: 30, y: 30, size: 70, color: "#a78bfa" },
  { id: 3, label: "Entanglement", x: 70, y: 35, size: 70, color: "#a78bfa" },
  { id: 4, label: "Quantum Gates", x: 50, y: 80, size: 80, color: "#c084fc" },
  { id: 5, label: "Qubits", x: 20, y: 60, size: 60, color: "#ddd6fe" },
  { id: 6, label: "Error Correction", x: 80, y: 70, size: 60, color: "#ddd6fe" },
];

const connections = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 4, to: 6 },
  { from: 3, to: 6 },
];

export default function SourceMapPage() {
  const [selectedNode, setSelectedNode] = useState<number | null>(1);

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 pt-24 px-6 pb-6 flex gap-6 overflow-hidden">
        {/* Map Canvas Area */}
        <Card padding="none" className="flex-1 relative overflow-hidden bg-bg-dark/50">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* Interactive Graph (Mockup) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              {connections.map((conn, idx) => {
                const from = nodes.find(n => n.id === conn.from)!;
                const to = nodes.find(n => n.id === conn.to)!;
                return (
                  <motion.line
                    key={idx}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                  />
                );
              })}
            </svg>

            {nodes.map((node) => (
              <motion.button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: node.id * 0.1 }}
                style={{ 
                  left: `${node.x}%`, 
                  top: `${node.y}%`, 
                  width: node.size, 
                  height: node.size,
                  backgroundColor: node.color,
                  transform: 'translate(-50%, -50%)'
                }}
                className={cn(
                  "absolute rounded-full flex items-center justify-center text-center p-2 text-[10px] font-bold text-black transition-all hover:scale-110",
                  selectedNode === node.id ? "ring-4 ring-white/20 scale-110 purple-glow" : "opacity-80"
                )}
              >
                {node.label}
              </motion.button>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 glass-panel rounded-2xl border-white/20">
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"><ZoomIn size={20} /></button>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"><ZoomOut size={20} /></button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"><Maximize2 size={20} /></button>
          </div>
        </Card>

        {/* Info Sidebar */}
        <div className="w-80 space-y-6 overflow-y-auto custom-scrollbar">
          <Card padding="md">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Info size={20} className="text-brand-purple" />
              Node Details
            </h3>
            {selectedNode ? (
              <motion.div
                key={selectedNode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-2xl font-bold text-brand-purple mb-2">
                    {nodes.find(n => n.id === selectedNode)?.label}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    This concept is central to the uploaded document. It appears 14 times and is linked to 4 other major topics.
                  </p>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Layers size={16} /> View in Document
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm italic">Select a node to view detailed research insights.</p>
              </div>
            )}
          </Card>

          <Card padding="md" className="bg-gradient-to-br from-brand-purple/20 to-transparent">
            <h3 className="text-lg font-bold mb-4">Export Map</h3>
            <p className="text-xs text-gray-400 mb-6">
              Download your knowledge graph as a high-resolution image or interactive HTML.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button size="sm" glow className="text-xs">
                <Download size={14} /> PNG
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Download size={14} /> SVG
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
