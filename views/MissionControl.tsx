import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { HoloPanel } from '../components/HoloPanel';
import { CinematicBackground } from '../components/CinematicBackground';
import { TechDetailModal } from '../components/TechDetailModal';
import { LondonIntelligenceWidget } from '../components/LondonIntelligenceWidget';
import { BidPaymentModal } from '../components/BidPaymentModal';
import { SystemNode, MarketMetric } from '../types';
import { Command, Lock, User, Key, Globe, Radio, Briefcase } from 'lucide-react';

const MOCK_NODES: SystemNode[] = [
  { id: '1', name: 'Canary Wharf_Main', status: 'active', latency: 12, load: 45 },
  { id: '2', name: 'The_Shard_Relay', status: 'active', latency: 8, load: 78 },
  { id: '3', name: 'Gherkin_Backup', status: 'warning', latency: 124, load: 92 },
  { id: '4', name: 'Heathrow_Link_A', status: 'active', latency: 22, load: 34 },
  { id: '5', name: 'Westminster_Secure', status: 'active', latency: 5, load: 12 },
  { id: '6', name: 'Grid_North_London', status: 'offline', latency: 0, load: 0 },
];

const MOCK_MARKET: MarketMetric[] = [
  { ticker: 'UK_INFRA', value: 4250.32, change: 1.2, trend: 'up' },
  { ticker: 'STL_BEAM', value: 890.15, change: -0.4, trend: 'down' },
  { ticker: 'CON_TECH', value: 125.44, change: 3.8, trend: 'up' },
  { ticker: 'LND_PROP', value: 5600.00, change: 0.1, trend: 'up' },
  { ticker: 'GLB_MAT', value: 332.10, change: -1.5, trend: 'down' },
];

export const MissionControl: React.FC = () => {
  const [nodes, setNodes] = useState(MOCK_NODES);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SystemNode | MarketMetric | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        load: node.status === 'offline' ? 0 : Math.min(100, Math.max(0, node.load + (Math.random() * 10 - 5))),
        latency: node.status === 'offline' ? 0 : Math.max(1, node.latency + Math.floor(Math.random() * 10 - 5))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col font-sans">
        {/* Dynamic Background */}
        <CinematicBackground isFocusMode={isFocusMode} />
        
        {/* Modals */}
        {selectedItem && (
          <TechDetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
        
        {isPaymentOpen && (
            <BidPaymentModal onClose={() => setIsPaymentOpen(false)} />
        )}

        {/* Top Header Bar */}
        <header className="relative z-20 h-14 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-6 shadow-lg">
            <div className="flex items-center gap-4">
                <div className="font-cinzel font-bold text-xl text-white tracking-widest">
                    <span className="text-emerald-500">BID</span>SMITH
                </div>
                <div className="h-4 w-[1px] bg-white/20 mx-2" />
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/80">
                    <Radio size={12} className="animate-pulse" />
                    LIVE_FEED_ESTABLISHED
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-mono">LOCATION</span>
                    <span className="text-xs font-mono text-gray-300">LONDON, UK (51.5072° N)</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-emerald-500/50 flex items-center justify-center bg-emerald-900/20 text-emerald-400">
                   <Globe size={16} />
                </div>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Panel - Node Status */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hidden lg:block lg:col-span-3 h-full flex flex-col gap-6"
            >
                <div className="flex-1 min-h-0">
                    <HoloPanel 
                      title="SYSTEM NODES" 
                      type="nodes" 
                      data={nodes} 
                      onHoverStart={() => setIsFocusMode(true)}
                      onHoverEnd={() => setIsFocusMode(false)}
                      onItemClick={setSelectedItem}
                    />
                </div>
                {/* Task 3: London Live Intelligence Widget */}
                <div className="h-48">
                    <LondonIntelligenceWidget />
                </div>
            </motion.div>

            {/* Center Panel - Login / Main Interface */}
            <div className="col-span-1 lg:col-span-6 flex items-center justify-center h-full relative">
                 {/* Floating Particles/Orb Effect behind login */}
                 <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

                 <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="w-full max-w-md"
                 >
                    <GlassCard className="p-8 md:p-12 relative" intensity="high">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                        
                        <div className="text-center mb-10">
                            <h2 className="font-cinzel text-2xl text-white mb-2">Identify Access</h2>
                            <p className="font-mono text-xs text-gray-400">ENTER CREDENTIALS FOR LEVEL 5 ACCESS</p>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider ml-1">Agent ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                        <User size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all font-mono"
                                        placeholder="BS-8842-X"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider ml-1">Security Key</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                        <Key size={16} />
                                    </div>
                                    <input 
                                        type="password" 
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all font-mono"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-400 py-3 rounded-sm font-mono text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(80,200,120,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group">
                                <Lock size={14} className="group-hover:scale-110 transition-transform" />
                                Establish Link
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t border-white/5">
                             <button 
                                onClick={() => setIsPaymentOpen(true)}
                                className="w-full flex items-center justify-between p-3 rounded border border-cyan-500/30 bg-cyan-900/10 hover:bg-cyan-900/20 transition-all group"
                             >
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] text-cyan-400 font-mono">ACTIVE TENDER</span>
                                    <span className="text-sm font-bold text-white group-hover:text-cyan-300">Phase II: SkyGarden Uplink</span>
                                </div>
                                <div className="px-3 py-1 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider">
                                    Place Bid
                                </div>
                             </button>
                        </div>
                    </GlassCard>
                 </motion.div>
            </div>

            {/* Right Panel - Market Data */}
            <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hidden lg:block lg:col-span-3 h-full"
            >
                <HoloPanel 
                  title="MARKET TELEMETRY" 
                  type="market" 
                  data={MOCK_MARKET} 
                  onHoverStart={() => setIsFocusMode(true)}
                  onHoverEnd={() => setIsFocusMode(false)}
                  onItemClick={setSelectedItem}
                />
                
                <div className="mt-4 h-1/3">
                    <GlassCard intensity="low" className="h-full p-4 flex flex-col justify-between border-emerald-500/20 hover:bg-black/40 transition-colors duration-300">
                         <div className="flex items-center gap-2 mb-2">
                            <Command size={14} className="text-emerald-500" />
                            <h3 className="font-mono text-xs text-emerald-400">AI ASSISTANT</h3>
                         </div>
                         <div className="flex-1 border border-dashed border-white/10 rounded bg-black/20 p-3 font-mono text-[10px] text-gray-400 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                            <p>> Initializing Neural Net...</p>
                            <p>> Connecting to Gemini-3-Flash...</p>
                            <p className="text-emerald-500/80">> Ready for infrastructure analysis.</p>
                            <span className="animate-pulse">_</span>
                         </div>
                         <button className="mt-3 w-full border border-white/10 hover:bg-white/5 py-2 text-[10px] font-mono text-gray-300 transition-colors">
                            OPEN TERMINAL
                         </button>
                    </GlassCard>
                </div>
            </motion.div>

        </main>
    </div>
  );
};