
import React, { useState } from 'react';
import { Search, Globe, ExternalLink, TrendingUp, Users, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { conductMarketResearch } from '../services/geminiService';
import { GroundingSource } from '../types';

const MarketIntel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ analysis: string, sources: GroundingSource[] } | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const result = await conductMarketResearch(query);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow space-y-2">
          <h2 className="text-2xl font-bold gradient-text">Market Intel</h2>
          <p className="text-gray-400 text-sm">Ground your startup decisions in real-time web data.</p>
          <div className="relative">
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="E.g. AI-powered sustainable fashion marketplace in SE Asia"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading || !query}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Research'}
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 glass rounded-2xl" />
          <div className="h-64 glass rounded-2xl md:col-span-2" />
        </div>
      )}

      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-400" /> Verified Sources
              </h3>
              <div className="space-y-3">
                {data.sources.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg group transition-all"
                  >
                    <div className="mt-1"><ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400" /></div>
                    <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors">{s.title}</p>
                        <p className="text-xs text-gray-500 truncate">{new URL(s.uri).hostname}</p>
                    </div>
                  </a>
                ))}
                {data.sources.length === 0 && (
                    <div className="flex items-center gap-2 text-gray-500 p-4 border border-dashed border-white/10 rounded-xl">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">No external citations found.</span>
                    </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" /> Key Trends
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Sparkles className="w-4 h-4" /></div>
                  <p className="text-sm font-medium">Hyper-personalization through Generative AI</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Users className="w-4 h-4" /></div>
                  <p className="text-sm font-medium">Rising demand for localized SE Asia solutions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 glass rounded-2xl p-8 overflow-y-auto max-h-[600px] border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <TrendingUp className="w-6 h-6 text-blue-400" /> Research Synthesis
            </h3>
            <div className="prose prose-invert max-w-none prose-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {data.analysis}
            </div>
          </div>
        </div>
      )}

      {!data && !loading && (
        <div className="h-96 glass rounded-2xl flex flex-col items-center justify-center space-y-4 opacity-50 border border-dashed border-white/20">
          < Globe className="w-16 h-16 text-blue-500/50" />
          <div className="text-center">
            <p className="text-xl font-medium">Global Market Knowledge Base</p>
            <p className="text-sm">Search to access live grounding on competitors, pricing, and TAM.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntel;
