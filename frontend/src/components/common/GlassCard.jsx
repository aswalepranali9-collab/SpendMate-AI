import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  glow = null, // 'indigo' | 'emerald' | 'rose'
  onClick,
}) => {
  const glowClasses = {
    indigo: 'hover:shadow-glow-indigo border-indigo-500/20',
    emerald: 'hover:shadow-glow-emerald border-emerald-500/20',
    rose: 'hover:shadow-glow-rose border-rose-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative rounded-2xl bg-[#121927]/80 dark:bg-[#121927]/80 light:bg-white/90 backdrop-blur-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 p-5 ${
        hoverEffect ? 'glass-card-hover cursor-pointer' : ''
      } ${glow ? glowClasses[glow] : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

