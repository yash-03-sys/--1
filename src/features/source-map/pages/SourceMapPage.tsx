import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Download, Info, Layers, ExternalLink, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/src/components/common/Navbar';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/utils/cn';
import { fetchDocument, generateSourceMap, searchWeb, type SearchResultRecord, type SourceMapNode, type SourceMapResponseRecord } from '@/src/lib/api';

const palette = ['#8b5cf6', '#a78bfa', '#c084fc', '#ddd6fe', '#60a5fa', '#34d399'];

function extractErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    if (response?.data?.detail) {
      return response.data.detail;
    }
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export default function SourceMapPage() {
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get('documentId'));
  const topic = searchParams.get('topic') || 'Research Topic';
  const [zoom, setZoom] = useState(1);
  const [mapData, setMapData] = useState<SourceMapResponseRecord | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultRecord[]>([]);
  const [documentTitle, setDocumentTitle] = useState<string>('Document');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(documentId)) {
      setError('A valid document is required to generate a source map.');
      setIsLoading(false);
      return;
    }

    let active = true;
    async function loadMap() {
      setIsLoading(true);
      setError(null);
      try {
        const [documentResponse, sourceMapResponse] = await Promise.all([
          fetchDocument(documentId),
          generateSourceMap({ topic, document_id: documentId }),
        ]);
        if (!active) return;
        setDocumentTitle(documentResponse.filename);
        setMapData(sourceMapResponse);
        setSelectedNodeId(sourceMapResponse.graph_data.nodes[0]?.id || null);
      } catch (loadError) {
        if (active) setError(extractErrorMessage(loadError));
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadMap();
    return () => {
      active = false;
    };
  }, [documentId, topic]);

  const nodes = useMemo(() => {
    if (!mapData) return [];
    const total = Math.max(mapData.graph_data.nodes.length, 1);
    return mapData.graph_data.nodes.map((node, index) => {
      const angle = (Math.PI * 2 * index) / total;
      const radius = index === 0 ? 0 : 28 + ((index % 3) * 10);
      return {
        ...node,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        size: index === 0 ? 110 : 78 - (index % 3) * 8,
        color: palette[index % palette.length],
      };
    });
  }, [mapData]);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  useEffect(() => {
    if (!selectedNode) {
      setSearchResults([]);
      return;
    }
    let active = true;
    setIsSearching(true);
    void searchWeb(selectedNode.label)
      .then((response) => {
        if (active) setSearchResults(response.results);
      })
      .catch((searchError) => {
        if (active) setError(extractErrorMessage(searchError));
      })
      .finally(() => {
        if (active) setIsSearching(false);
      });
    return () => {
      active = false;
    };
  }, [selectedNode]);

  if (isLoading) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>;
  }

  if (error || !mapData) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
        <Card padding="lg" className="max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-3">Source map unavailable</h1>
          <p className="text-gray-400 mb-6">{error || 'No map data was returned.'}</p>
          <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 pt-24 px-6 pb-6 flex gap-6 overflow-hidden">
        <Card padding="none" className="flex-1 relative overflow-hidden bg-bg-dark/50">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              {mapData.graph_data.links.map((connection, idx) => {
                const from = nodes.find((node) => node.id === connection.source);
                const to = nodes.find((node) => node.id === connection.target);
                if (!from || !to) return null;
                return (
                  <motion.line
                    key={`${connection.source}-${connection.target}-${idx}`}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="rgba(139, 92, 246, 0.22)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.3, delay: idx * 0.08 }}
                  />
                );
              })}
            </svg>

            {nodes.map((node) => (
              <motion.button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.08 * (Number(node.id.replace(/\D/g, '')) || 1) }}
                style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.size, height: node.size, backgroundColor: node.color, transform: 'translate(-50%, -50%)' }}
                className={cn('absolute rounded-full flex items-center justify-center text-center p-3 text-[10px] font-bold text-black transition-all hover:scale-110 shadow-lg', selectedNodeId === node.id ? 'ring-4 ring-white/20 scale-110 purple-glow' : 'opacity-85')}
              >
                {node.label}
              </motion.button>
            ))}
          </div>

          <div className="absolute top-6 left-6 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.24em] text-gray-500 mb-1">Source Map</div>
            <div className="font-bold">{mapData.topic}</div>
            <div className="text-xs text-gray-400 mt-1">{documentTitle}</div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 glass-panel rounded-2xl border-white/20">
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" onClick={() => setZoom((current) => Math.min(current + 0.15, 1.8))}><ZoomIn size={20} /></button>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" onClick={() => setZoom((current) => Math.max(current - 0.15, 0.7))}><ZoomOut size={20} /></button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" onClick={() => setZoom(1)}><RotateCcw size={20} /></button>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" onClick={() => setZoom(1.4)}><Maximize2 size={20} /></button>
          </div>
        </Card>

        <div className="w-96 space-y-6 overflow-y-auto custom-scrollbar">
          <Card padding="md">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3"><Info size={20} className="text-brand-purple" />Node Details</h3>
            {selectedNode ? (
              <motion.div key={selectedNode.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-brand-purple mb-2">{selectedNode.label}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{selectedNode.summary || `This topic is connected to ${mapData.topic}. Clicked nodes trigger web search results in the panel below.`}</p>
                </div>
                {selectedNode.references?.length ? <div className="space-y-3">{selectedNode.references.map((reference, index) => <div key={`${selectedNode.id}-ref-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 leading-relaxed">{reference}</div>)}</div> : null}
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedNode.label)}`, '_blank', 'noopener,noreferrer')}>
                  <Layers size={16} />
                  Search This Topic
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-12"><p className="text-gray-500 text-sm italic">Select a node to view detailed research insights.</p></div>
            )}
          </Card>

          <Card padding="md">
            <h3 className="text-lg font-bold mb-4">Topic Web Search</h3>
            <p className="text-xs text-gray-400 mb-5">Clicking a node runs a web search for that topic and fills these source cards.</p>
            {isSearching ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-purple" size={22} /></div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <a key={`${result.source_url}-${index}`} href={result.source_url} target="_blank" rel="noreferrer" className="block">
                    <Card padding="sm" className="border-white/5 hover:border-brand-purple/30">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-brand-purple">{result.title}</div>
                          <div className="text-xs text-gray-400 mt-2 line-clamp-3">{result.snippet}</div>
                        </div>
                        <ExternalLink size={14} className="text-gray-500 shrink-0" />
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </Card>

          <Card padding="md" className="bg-gradient-to-br from-brand-purple/20 to-transparent">
            <h3 className="text-lg font-bold mb-4">Export Map</h3>
            <p className="text-xs text-gray-400 mb-6">Download the current research map or jump back to the document workspace.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button size="sm" glow className="text-xs" onClick={() => window.print()}><Download size={14} />Print</Button>
              <Link to={`/workspace/${documentId}`}><Button variant="outline" size="sm" className="text-xs w-full"><Layers size={14} />Workspace</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
