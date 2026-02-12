import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { X, Activity, Server, Share2, Download } from 'lucide-react';
import { SystemNode, MarketMetric } from '../types';

interface TechDetailModalProps {
  item: SystemNode | MarketMetric | null;
  onClose: () => void;
}

export const TechDetailModal: React.FC<TechDetailModalProps> = ({ item, onClose }) => {
  const [decodedText, setDecodedText] = useState("");
  const [hexStream, setHexStream] = useState<string[]>([]);
  
  // Typewriter effect for header
  useEffect(() => {
    if (item) {
      setDecodedText("");
      const text = "ESTABLISHING SECURE CONNECTION...";
      let i = 0;
      const interval = setInterval(() => {
        setDecodedText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [item]);

  // Hex Stream Animation
  useEffect(() => {
    if (item) {
       const interval = setInterval(() => {
          const hex = Array(12).fill(0).map(() => Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')).join(' ');
          setHexStream(prev => [hex, ...prev].slice(0, 5));
       }, 200);
       return () => clearInterval(interval);
    }
  }, [item]);

  if (!item) return null;

  const isNode = 'latency' in item;
  const title = isNode ? (item as SystemNode).name : (item as MarketMetric).ticker;
  const primaryValue = isNode ? `${(item as SystemNode).load}% LOAD` : (item as MarketMetric).value.toLocaleString();
  const secondaryValue = isNode ? `${(item as SystemNode).latency}ms LATENCY` : `${(item as MarketMetric).change}%`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          layoutId={`item-${isNode ? (item as SystemNode).id : (item as MarketMetric).ticker}`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl"
        >
          <GlassCard intensity="high" className="border-t-2 border-t-cyan-500 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-cyan-400 mb-1 tracking-widest">{decodedText}</span>
                <h2 className="font-cinzel text-2xl text-white flex items-center gap-3">
                  {isNode ? <Server className="text-emerald-500" /> : <Activity className="text-cyan-500" />}
                  {title}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Visuals */}
              <div className="space-y-6">
                <div className="h-40 w-full bg-black/40 border border-white/10 rounded relative overflow-hidden group">
                  {/* Simulated Graph */}
                  <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 gap-1 opacity-60">
                     {[...Array(20)].map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: "10%" }}
                          animate={{ height: `${20 + Math.random() * 60}%` }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                          className={`w-full rounded-t-sm ${isNode ? 'bg-emerald-500/50' : 'bg-cyan-500/50'}`}
                        />
                     ))}
                  </div>
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-400">REAL-TIME METRICS</div>
                  
                  {/* Scanline */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/20 shadow-[0_0_15px_white] animate-scan-vertical" />
                </div>

                <div className="flex justify-between gap-2">
                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-[10px] font-mono tracking-wider transition-colors hover:text-cyan-400">
                      <Download size={12} /> EXTRACT LOGS
                   </button>
                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-[10px] font-mono tracking-wider transition-colors hover:text-emerald-400">
                      <Share2 size={12} /> SECURE SHARE
                   </button>
                </div>
              </div>

              {/* Right Column: Stats */}
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                   <div className="p-4 bg-black/40 border-l-2 border-emerald-500 hover:bg-white/5 transition-colors">
                      <div className="text-[10px] text-gray-500 font-mono uppercase">Current Status</div>
                      <div className="text-xl text-white font-bold tracking-wide">{isNode ? (item as SystemNode).status.toUpperCase() : (item as MarketMetric).trend.toUpperCase()}</div>
                   </div>
                   
                   <div className="p-4 bg-black/40 border-l-2 border-cyan-500 hover:bg-white/5 transition-colors">
                      <div className="text-[10px] text-gray-500 font-mono uppercase">Primary Metric</div>
                      <div className="text-3xl text-cyan-400 font-mono">{primaryValue}</div>
                   </div>

                   <div className="p-4 bg-black/40 border-l-2 border-gray-500 hover:bg-white/5 transition-colors">
                      <div className="text-[10px] text-gray-500 font-mono uppercase">Secondary Metric</div>
                      <div className={`text-xl font-mono ${(item as any).change < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {secondaryValue}
                      </div>
                   </div>
                </div>

                {/* Animated Hex Stream */}
                <div className="mt-4 font-mono text-[10px] text-emerald-900/80 overflow-hidden h-12 leading-tight opacity-70 select-none relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                   {hexStream.map((line, i) => (
                       <div key={i} className="whitespace-nowrap">{line}</div>
                   ))}
                </div>
              </div>
            </div>

            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-pulse" />
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};