import React, { useEffect, useState, useCallback } from 'react';
import { GlassCard } from './GlassCard';
import { CloudRain, Wind, Car, Train, RefreshCw, AlertTriangle } from 'lucide-react';
import { LondonData } from '../types';
import { fetchLondonData } from '../utils/londonData';

export const LondonIntelligenceWidget: React.FC = () => {
  const [data, setData] = useState<LondonData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Memoized fetch function
  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchLondonData();
      setData(result);
      setLastUpdated(new Date());
      setIsError(false);
    } catch (err) {
      console.error("[LondonIntelligence] Widget Update Error", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Fetch & Interval Setup
  useEffect(() => {
    getData();
    
    const REFRESH_INTERVAL_MS = 60000; // 60 Seconds
    const interval = setInterval(getData, REFRESH_INTERVAL_MS);
    
    return () => clearInterval(interval);
  }, [getData]);

  // Loading State (Initial only)
  if (!data && isLoading) return (
      <GlassCard intensity="medium" className="h-full flex flex-col items-center justify-center font-mono text-xs text-cyan-500 gap-3 border-cyan-500/30">
          <RefreshCw className="animate-spin" size={24} />
          <span className="animate-pulse tracking-widest">ESTABLISHING UPLINK...</span>
      </GlassCard>
  );

  // Error State (Persistent)
  if (isError && !data) return (
    <GlassCard intensity="medium" className="h-full flex flex-col items-center justify-center font-mono text-xs text-red-500 gap-3 border-red-500/30">
        <AlertTriangle size={24} />
        <span className="tracking-widest">SIGNAL LOST</span>
    </GlassCard>
  );

  // Render Data (Even if refreshing in background)
  return (
    <GlassCard intensity="medium" className="p-0 flex flex-col h-full border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h3 className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-emerald-500'} ${isLoading ? 'animate-ping' : ''}`} />
           London Live Intelligence
        </h3>
        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-mono">
           {isLoading && <RefreshCw size={10} className="animate-spin text-cyan-500" />}
           <span>{lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 grid grid-cols-3 divide-x divide-white/5 bg-black/20">
        
        {/* Weather / Rain */}
        <div className="p-2 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group">
          <CloudRain size={20} className="text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
          <div className="text-xl font-mono text-white leading-none">
            {data?.weather.rainMm}<span className="text-[10px] text-gray-500 ml-0.5">mm</span>
          </div>
          <div className="text-[8px] text-gray-400 uppercase tracking-wide truncate w-full px-1 mt-1">
             {data?.weather.condition}
          </div>
        </div>

        {/* AQI */}
        <div className="p-2 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group">
          <Wind size={20} className="text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-center gap-1">
             <span className="text-xl font-mono text-white leading-none">{data?.aqi.value}</span>
             <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                data?.aqi.status === 'Good' ? 'bg-emerald-900/50 text-emerald-400' : 
                data?.aqi.status === 'Fair' ? 'bg-yellow-900/50 text-yellow-400' : 
                'bg-red-900/50 text-red-400'
             }`}>
                {data?.aqi.status}
             </span>
          </div>
          <div className="text-[8px] text-gray-400 uppercase tracking-wide mt-1">Air Quality</div>
        </div>

        {/* Traffic */}
        <div className="p-2 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors relative overflow-hidden group">
          <Car size={20} className={`${(data?.traffic.congestionLevel || 0) > 60 ? 'text-yellow-500' : 'text-cyan-400'} mb-1 group-hover:scale-110 transition-transform`} />
          
          <div className="text-xl font-mono text-white leading-none">
             {data?.traffic.congestionLevel}<span className="text-[10px] text-gray-500">%</span>
          </div>
          <div className="text-[8px] text-gray-400 uppercase tracking-wide mt-1">Congestion</div>

          {/* Tube Status Overlay (Visible on Hover) */}
          <div className="absolute inset-0 bg-[#0A0A0B]/95 backdrop-blur-sm flex flex-col justify-center px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
             <div className="text-[8px] font-mono text-gray-500 mb-1 flex items-center gap-1 justify-center border-b border-white/10 pb-1">
                <Train size={8}/> TFL STATUS
             </div>
             <div className="space-y-1">
                {data?.traffic.tubeStatus.slice(0, 3).map((t, i) => (
                  <div key={i} className="flex justify-between items-center w-full">
                    <span className="text-[8px] text-gray-300 font-bold truncate max-w-[40px]">{t.line}</span>
                    <span className={`text-[8px] uppercase tracking-tighter ${
                        t.status.includes('Good') ? 'text-emerald-500' : 'text-yellow-500'
                    }`}>
                        {t.status.includes('Good') ? 'OK' : 'DELAY'}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </GlassCard>
  );
};