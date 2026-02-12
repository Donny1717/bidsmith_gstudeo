import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CinematicBackgroundProps {
  isFocusMode?: boolean; // True if user is hovering a panel
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({ isFocusMode = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 80 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const moveX = useTransform(springX, [0, 1], [-30, 30]);
  const moveY = useTransform(springY, [0, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = e.clientX / window.innerWidth;
      const normalizedY = e.clientY / window.innerHeight;
      x.set(normalizedX);
      y.set(normalizedY);
      setMousePosition({ x: normalizedX, y: normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505] z-0">
      {/* 1. Base City Layer with Parallax */}
      <motion.div 
        className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
        style={{ 
          x: moveX,
          y: moveY,
          backgroundImage: 'url("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=3870&auto=format&fit=crop")',
          filter: isFocusMode ? 'brightness(0.2) blur(6px) saturate(0.4) contrast(1.2)' : 'brightness(0.4) blur(0px) saturate(0.8) contrast(1.1)',
          scale: 1.15
        }}
      />

      {/* 2. Simulated Highway Traffic (Moving Lights) */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-30 pointer-events-none overflow-hidden mix-blend-screen">
          {/* White lights (Headlights) */}
          <motion.div 
             className="absolute bottom-10 left-[-20%] w-[150%] h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-md"
             animate={{ x: ["0%", "-50%"] }}
             transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          />
          {/* Red lights (Taillights) */}
          <motion.div 
             className="absolute bottom-14 left-[-20%] w-[150%] h-4 bg-gradient-to-r from-transparent via-red-500/40 to-transparent blur-xl"
             animate={{ x: ["-50%", "0%"] }}
             transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          />
      </div>

      {/* 3. Atmospheric Volumetric Fog (Animation) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen">
         <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-emerald-900/10 animate-pulse" />
         <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px]"
            animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
         />
      </div>

      {/* 4. Floating Particles (Drones/City Dust) */}
      <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_4px_cyan]"
               initial={{ 
                   x: Math.random() * window.innerWidth, 
                   y: Math.random() * window.innerHeight,
                   opacity: Math.random() * 0.5 + 0.2
               }}
               animate={{ 
                   y: [null, Math.random() * -100],
                   x: [null, (Math.random() - 0.5) * 50],
                   opacity: [null, 0]
               }}
               transition={{ 
                   duration: Math.random() * 10 + 10, 
                   repeat: Infinity, 
                   ease: "linear" 
               }}
             />
          ))}
      </div>

      {/* 5. Dynamic Searchlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-plus-lighter">
        <motion.div 
          className="absolute bottom-[-10%] left-[25%] w-[60px] h-[150vh] origin-bottom bg-gradient-to-t from-cyan-200/5 via-cyan-400/5 to-transparent blur-lg"
          animate={{ rotate: [-25, -15, -25] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[35%] w-[40px] h-[150vh] origin-bottom bg-gradient-to-t from-emerald-200/5 via-emerald-400/5 to-transparent blur-lg"
          animate={{ rotate: [15, 35, 15] }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* 6. Vignette & Grain Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#0A0A0B_100%)] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] pointer-events-none z-20 mix-blend-overlay" />
    </div>
  );
};