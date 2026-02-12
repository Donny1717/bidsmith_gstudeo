import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium' 
}) => {
  const bgOpacity = {
    low: 'bg-black/20',
    medium: 'bg-black/40',
    high: 'bg-black/60',
  };

  const borderOpacity = {
    low: 'border-white/5',
    medium: 'border-white/10',
    high: 'border-white/20',
  };

  return (
    <div className={`
      relative backdrop-blur-md 
      ${bgOpacity[intensity]} 
      border ${borderOpacity[intensity]}
      shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      rounded-sm
      overflow-hidden
      ${className}
    `}>
      {/* Glossy overlay reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Tech corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

      {children}
    </div>
  );
};