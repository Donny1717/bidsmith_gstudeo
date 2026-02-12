import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';

interface LandingProps {
  onInitialize: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onInitialize }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center z-10">
      {/* Cinematic Background - London at Night */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105"
        style={{ 
            // Using a high-quality placeholder that resembles a dark city skyline
            backgroundImage: 'url("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=3870&auto=format&fit=crop")',
            filter: 'brightness(0.4) contrast(1.2) saturate(0.8)'
        }}
      />
      
      {/* Volumetric Fog / Mist Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-[#001f3f]/30 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A0A0B_100%)] z-0 pointer-events-none opacity-80" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        
        {/* Animated Brand Mark */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-emerald-500/80 border border-emerald-500/30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <ShieldCheck size={14} />
            <span className="text-xs font-mono tracking-[0.2em] uppercase">BidSmith Secure Gateway</span>
          </div>
        </motion.div>

        {/* 3D Typography */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-cinzel text-4xl md:text-7xl lg:text-8xl font-black tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] via-[#fceabb] to-[#a67c00] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          style={{
            textShadow: '0px 0px 40px rgba(80, 200, 120, 0.2)'
          }}
        >
          ARCHITECTING
          <br />
          <span className="block mt-2 md:mt-4 text-white/90 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            LONDON’S FUTURE
          </span>
        </motion.h1>

        {/* Decorative Circuit Lines */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "60%", opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent mt-12 mb-12"
        />

        {/* The Button (Vault Trigger) */}
        <motion.button
          onClick={onInitialize}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-[#1a1a1c] border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 transition-all duration-500 ease-out overflow-hidden rounded-sm"
        >
          {/* Internal Glow on Hover */}
          <div className={`absolute inset-0 bg-cyan-900/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          
          <span className="relative z-10 font-mono tracking-[0.2em] text-sm md:text-base uppercase flex items-center gap-3">
            Initialize Sequence
            <ChevronRight 
              size={18} 
              className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
            />
          </span>

          {/* Mechanical Corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-500 group-hover:border-cyan-500 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-500 group-hover:border-cyan-500 transition-colors" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-8 font-mono text-[10px] text-gray-400 tracking-widest"
        >
          SYSTEM V.4.0.2 // SECURE CONNECTION REQUIRED
        </motion.p>
      </div>
    </div>
  );
};