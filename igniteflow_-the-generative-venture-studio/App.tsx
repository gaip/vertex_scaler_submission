
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Mic2, 
  Palette, 
  BookOpen, 
  Settings,
  ChevronRight,
  Sparkles,
  Zap,
  Github,
  Award
} from 'lucide-react';
import { AppView } from './types';
import PitchLab from './components/PitchLab';
import MarketIntel from './components/MarketIntel';
import BrandStudio from './components/BrandStudio';
import StrategyRoom from './components/StrategyRoom';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const NavItem: React.FC<{ view: AppView, icon: React.ReactNode, label: string }> = ({ view, icon, label }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        currentView === view 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`${currentView === view ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      {currentView === view && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 flex flex-col bg-[#030712] relative z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">IgniteFlow</h1>
          </div>

          <nav className="space-y-2">
            <NavItem view={AppView.DASHBOARD} icon={<LayoutDashboard className="w-5 h-5" />} label="Founder Central" />
            <NavItem view={AppView.MARKET_INTEL} icon={<LineChart className="w-5 h-5" />} label="Market Intel" />
            <NavItem view={AppView.PITCH_LAB} icon={<Mic2 className="w-5 h-5" />} label="Pitch Lab" />
            <NavItem view={AppView.BRAND_STUDIO} icon={<Palette className="w-5 h-5" />} label="Brand Studio" />
            <NavItem view={AppView.STRATEGY_ROOM} icon={<BookOpen className="w-5 h-5" />} label="Strategy Room" />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="glass rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-500">Contest Ready</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Build your GFS Startup School entry with enterprise-grade AI modules.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
             <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate">Founder #4021</p>
                <p className="text-[10px] text-gray-500">Tier: Scaler Pro</p>
             </div>
             <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto relative bg-[#030712]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 p-10 max-w-7xl mx-auto">
          {currentView === AppView.DASHBOARD && (
            <div className="space-y-10">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Accelerator Dashboard</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-white">Welcome, Founder.</h2>
                  <p className="text-gray-400 text-lg">Your journey from idea to IPO starts with IgniteFlow.</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all">View Roadmap</button>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">Submit to GFS</button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border-t-2 border-blue-500 group cursor-pointer hover:scale-[1.02] transition-all">
                  <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4 group-hover:bg-blue-500 transition-colors">
                    <LineChart className="w-6 h-6 text-blue-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Market Analysis</h3>
                  <p className="text-sm text-gray-400">92% Validation Score</p>
                  <div className="mt-4 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[92%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl border-t-2 border-purple-500 group cursor-pointer hover:scale-[1.02] transition-all">
                  <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4 group-hover:bg-purple-500 transition-colors">
                    <Palette className="w-6 h-6 text-purple-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Brand Identity</h3>
                  <p className="text-sm text-gray-400">Identity Kit Generated</p>
                  <div className="flex -space-x-2 mt-4">
                    {[1,2,3,4].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/${i*10}/100/100`} className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] border-2 border-gray-900">+5</div>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl border-t-2 border-green-500 group cursor-pointer hover:scale-[1.02] transition-all">
                  <div className="p-3 bg-green-500/10 rounded-xl w-fit mb-4 group-hover:bg-green-500 transition-colors">
                    <Mic2 className="w-6 h-6 text-green-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pitch Readiness</h3>
                  <p className="text-sm text-gray-400">Level 4: "Fundable"</p>
                  <div className="flex gap-1 mt-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-2 w-8 rounded-full ${i <= 4 ? 'bg-green-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                    {[
                      { action: 'Pitch Session', time: '2 hours ago', meta: 'Feedback: Strengthen ROI section', icon: <Mic2 className="w-4 h-4" />, color: 'text-green-400' },
                      { action: 'Market Research', time: '5 hours ago', meta: 'Found 4 direct competitors in India', icon: <LineChart className="w-4 h-4" />, color: 'text-blue-400' },
                      { action: 'Logo Generation', time: 'Yesterday', meta: 'V3 High Fidelity Assets Ready', icon: <Palette className="w-4 h-4" />, color: 'text-purple-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-lg bg-white/5 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white">{item.action}</p>
                          <p className="text-xs text-gray-500 mb-1">{item.time}</p>
                          <p className="text-sm text-gray-400">{item.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <Github className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Dev Integration</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Launch Engine</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Auto-generate boilerplates for your MVP based on your pitch deck and market research.
                  </p>
                  <div className="bg-[#0c111c] rounded-xl p-4 font-mono text-xs text-blue-300 border border-white/5 mb-6">
                    <p className="opacity-50">// INITIALIZING STACK...</p>
                    <p>npx igniteflow-mvp create "NeoBank-Z"</p>
                    <p className="text-green-400">✔ Architecture: Next.js + Gemini Node SDK</p>
                    <p className="text-green-400">✔ DB: PostgreSQL Edge</p>
                    <p className="text-green-400">✔ Ready to deploy to Vercel</p>
                  </div>
                  <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">Initialize Repository</button>
                </div>
              </div>
            </div>
          )}

          {currentView === AppView.MARKET_INTEL && <MarketIntel />}
          {currentView === AppView.PITCH_LAB && <PitchLab />}
          {currentView === AppView.BRAND_STUDIO && <BrandStudio />}
          {currentView === AppView.STRATEGY_ROOM && <StrategyRoom />}
        </div>
      </main>
    </div>
  );
};

export default App;
