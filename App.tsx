import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landing } from './views/Landing';
import { MissionControl } from './views/MissionControl';
import { AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);

  const handleInitialize = () => {
    setAppState(AppState.TRANSITION);
    // Simulate the transition time for the vault doors to close/open
    setTimeout(() => {
      setAppState(AppState.MISSION_CONTROL);
    }, 2500); // Wait for the "Close" animation to finish before mounting Mission Control
  };

  return (
    <div className="w-full h-screen bg-[#0A0A0B] text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        
        {/* State 1: Landing Page */}
        {appState === AppState.LANDING && (
          <motion.div
            key="landing"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            <Landing onInitialize={handleInitialize} />
          </motion.div>
        )}

        {/* State 2: Mission Control (Revealed after transition) */}
        {appState === AppState.MISSION_CONTROL && (
          <motion.div
            key="mission-control"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <MissionControl />
          </motion.div>
        )}

      </AnimatePresence>

      {/* The "Vault Door" Transition Overlay */}
      {/* This overlay exists outside AnimatePresence to coordinate the split screen effect */}
      <div className="absolute inset-0 pointer-events-none z-50 flex">
        {/* Left Door */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={appState === AppState.TRANSITION ? { x: "0%" } : appState === AppState.MISSION_CONTROL ? { x: "-100%" } : { x: "-100%" }}
          transition={{ duration: 1.2, ease: "circIn" }}
          className="w-1/2 h-full bg-[#0F0F11] border-r-4 border-cyan-900/50 relative flex items-center justify-end overflow-hidden"
        >
          {/* Mechanical Details on Door */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-64 border-2 border-dashed border-gray-800 opacity-20 mr-8" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        </motion.div>

        {/* Right Door */}
        <motion.div
          initial={{ x: "100%" }}
          animate={appState === AppState.TRANSITION ? { x: "0%" } : appState === AppState.MISSION_CONTROL ? { x: "100%" } : { x: "100%" }}
          transition={{ duration: 1.2, ease: "circIn" }}
          className="w-1/2 h-full bg-[#0F0F11] border-l-4 border-cyan-900/50 relative flex items-center justify-start overflow-hidden"
        >
             {/* Mechanical Details on Door */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-64 border-2 border-dashed border-gray-800 opacity-20 ml-8" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        </motion.div>
        
        {/* Center Lock Mechanism (Appears when doors close) */}
        <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={appState === AppState.TRANSITION ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-50 flex items-center justify-center"
        >
            <div className="w-full h-full rounded-full border-4 border-cyan-500/50 bg-black flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.4)]">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-500/50 animate-spin-slow flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
            </div>
        </motion.div>
      </div>

    </div>
  );
}

export default App;