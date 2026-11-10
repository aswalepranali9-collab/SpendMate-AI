import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  gradientBorder = false,
  glow = null, // 'indigo' | 'emerald' | 'rose' | 'cyan'
  onClick,
}) => {
  const glowClasses = {
    indigo: 'hover:shadow-glow-indigo border-indigo-500/30 hover:border-indigo-500/50',
    emerald: 'hover:shadow-glow-emerald border-emerald-500/30 hover:border-emerald-500/50',
    rose: 'hover:shadow-glow-rose border-rose-500/30 hover:border-rose-500/50',
    cyan: 'hover:shadow-glow-cyan border-cyan-500/30 hover:border-cyan-500/50',
  };

  if (gradientBorder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
        onClick={onClick}
        className={`gradient-border-card group ${className}`}
      >
        <div className="gradient-border-card-inner p-5 sm:p-6 relative overflow-hidden backdrop-blur-2xl">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`relative rounded-2xl bg-[#0D121F]/80 backdrop-blur-2xl border border-slate-800/80 p-5 sm:p-6 shadow-xl shadow-black/40 ${
        hoverEffect ? 'glass-panel-hover cursor-pointer' : ''
      } ${glow ? glowClasses[glow] : ''} ${className}`}
      style={{
        boxShadow:
          '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      }}
    >
      {children}
    </motion.div>
  );
};
