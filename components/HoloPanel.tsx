import React from 'react';
import { GlassCard } from './GlassCard';
import { Activity, Server, ChevronRight } from 'lucide-react';
import { SystemNode, MarketMetric } from '../types';
import { motion } from 'framer-motion';

interface HoloPanelProps {
  title: string;
  type: 'nodes' | 'market';
  data: SystemNode[] | MarketMetric[];
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onItemClick?: (item: SystemNode | MarketMetric) => void;
}

export const HoloPanel: React.FC<HoloPanelProps> = ({ 
  title, 
  type, 
  data, 
  onHoverStart, 
  onHoverEnd,
  onItemClick 
}) => {
  return (
    <GlassCard className="h-full flex flex-col border-cyan-500/20 group/panel overflow-hidden" intensity="low">
      {/* Background Holographic Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
            backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}
      />
      
      {/* Continuous Vertical Scanline */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
            className="w-full h-1 bg-cyan-400/10 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
            animate={{ y: ['0%', '1000%'] }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <h3 className="font-mono text-xs text-cyan-400 tracking-widest uppercase flex items-center gap-2">
          {type === 'nodes' ? <Server size={14} /> : <Activity size={14} />}
          {title}
        </h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </div>
      </div>
      
      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent z-10">
        {type === 'nodes' && (data as SystemNode[]).map((node, i) => (
          <motion.div
            layoutId={`item-${node.id}`}
            key={node.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 5, backgroundColor: 'rgba(0, 229, 255, 0.03)' }}
            onClick={() => onItemClick && onItemClick(node)}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            className="relative flex items-center justify-between p-3 rounded border border-transparent hover:border-cyan-500/30 cursor-pointer transition-all duration-200 group/item"
          >
            {/* Hover Bracket Left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-1 border-l-2 border-cyan-500 opacity-0 group-hover/item:opacity-100 group-hover/item:h-3/4 transition-all duration-300" />

            <div className="flex items-center gap-3 relative z-10">
              <div className={`relative w-2 h-2 rounded-full ${
                node.status === 'active' ? 'bg-emerald-500' : 
                node.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {node.status === 'active' && <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />}
              </div>
              <span className="text-gray-400 group-hover/item:text-cyan-100 font-medium tracking-tight transition-colors">
                {node.name}
              </span>
            </div>

            <div className="text-right relative z-10">
              <div className="text-[10px] text-gray-600 mb-1 group-hover/item:text-cyan-400 font-bold">{node.latency}ms</div>
              <div className="w-24 h-1 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${node.load > 80 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-cyan-500 shadow-[0_0_8px_cyan]'}`} 
                  style={{ width: `${node.load}%` }} 
                />
              </div>
            </div>
            
            {/* Hover Chevron */}
            <ChevronRight className="absolute right-2 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-cyan-500" size={14} />

          </motion.div>
        ))}

        {type === 'market' && (data as MarketMetric[]).map((metric, i) => (
          <motion.div
            layoutId={`item-${metric.ticker}`}
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: -5, backgroundColor: 'rgba(80, 200, 120, 0.03)' }}
            onClick={() => onItemClick && onItemClick(metric)}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            className="relative flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:border-b-transparent hover:rounded hover:border border-emerald-500/30 cursor-pointer transition-all duration-200 group/item"
          >
             {/* Hover Bracket Right */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-1 border-r-2 border-emerald-500 opacity-0 group-hover/item:opacity-100 group-hover/item:h-3/4 transition-all duration-300" />

            <div className="flex flex-col">
              <span className="text-gray-400 font-bold group-hover/item:text-emerald-300 transition-colors">{metric.ticker}</span>
              <span className={`text-[10px] flex items-center gap-1 ${metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {metric.trend === 'up' ? '▲' : '▼'} {Math.abs(metric.change)}%
              </span>
            </div>
            
            <div className="text-right">
                <span className="text-cyan-100/70 font-mono group-hover/item:text-white group-hover/item:shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all">
                    {metric.value.toLocaleString()}
                </span>
                <div className="h-[1px] w-full mt-2 bg-white/5 overflow-hidden">
                     {/* Animated Sparkline Bar */}
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.random() * 100}%` }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-emerald-500/80 blur-[0.5px]"
                     />
                </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-2 border-t border-white/5 bg-black/40 text-[10px] text-gray-600 font-mono flex justify-between z-10">
        <span className="animate-pulse text-emerald-500/50">● LIVE LINK</span>
        <span>SHA-256</span>
      </div>
    </GlassCard>
  );
};