
import React, { useState } from 'react';
import { Image as ImageIcon, Wand2, Download, Copy, Loader2, Sparkles, Video, Play } from 'lucide-react';
import { generateBrandAsset } from '../services/geminiService';

const BrandStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [assets, setAssets] = useState<string[]>([]);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'done'>('idle');

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    try {
      const url = await generateBrandAsset(prompt);
      if (url) setAssets(prev => [url, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const simulateVideo = () => {
    setVideoStatus('generating');
    setTimeout(() => setVideoStatus('done'), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow space-y-2">
          <h2 className="text-2xl font-bold gradient-text">Brand Studio</h2>
          <p className="text-gray-400 text-sm">Visualize your startup vision instantly.</p>
          <div className="relative">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your brand aesthetic (e.g. minimalist fintech, eco-friendly logistics, cyberpunk gaming)"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
            <button 
                onClick={handleGenerate}
                disabled={generating || !prompt}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                Generate Identity
            </button>
             <button 
                onClick={simulateVideo}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
                <Video className="w-5 h-5" />
                Veo Promo (Demo)
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generating && (
            <div className="glass rounded-2xl aspect-square flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Wand2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-blue-400 font-medium">Crafting pixels...</p>
            </div>
        )}
        
        {assets.map((asset, i) => (
          <div key={i} className="group glass rounded-2xl overflow-hidden relative border border-white/10 hover:border-blue-500/50 transition-all">
            <img src={asset} alt="Generated asset" className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"><Download className="w-5 h-5" /></button>
               <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"><Copy className="w-5 h-5" /></button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30">Gemini 2.5 Flash Image</span>
            </div>
          </div>
        ))}

        {videoStatus !== 'idle' && (
            <div className="glass rounded-2xl aspect-square overflow-hidden relative border-2 border-purple-500/30 flex items-center justify-center bg-purple-500/5">
                {videoStatus === 'generating' ? (
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
                        <p className="text-purple-400 font-bold animate-pulse uppercase tracking-widest text-xs">Generating Veo Cinema Video</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full group">
                        <img src="https://picsum.photos/seed/veo/1080/1080" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
                            <Play className="w-16 h-16 fill-white text-white drop-shadow-2xl" />
                        </div>
                        <div className="absolute top-4 left-4">
                             <span className="px-3 py-1 bg-purple-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">Veo 3.1 Preview</span>
                        </div>
                    </div>
                )}
            </div>
        )}

        {assets.length === 0 && !generating && videoStatus === 'idle' && (
            <div className="md:col-span-3 h-80 flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-4">
                <Sparkles className="w-16 h-16" />
                <p>Your branding portfolio will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BrandStudio;
