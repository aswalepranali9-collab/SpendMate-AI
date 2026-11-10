import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const StatCard = ({
  title,
  amount,
  symbol = '₹',
  subtitle,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  variant = 'indigo', // 'emerald' | 'rose' | 'indigo' | 'cyan'
}) => {
  const variantStyles = {
    emerald: {
      glow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/25 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
      accent: 'text-emerald-400',
      glowShadow: 'hover:shadow-glow-emerald',
    },
    rose: {
      glow: 'from-rose-500/20 via-rose-500/5 to-transparent',
      border: 'border-rose-500/25 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
      accent: 'text-rose-400',
      glowShadow: 'hover:shadow-glow-rose',
    },
    indigo: {
      glow: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      border: 'border-indigo-500/25 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30',
      accent: 'text-indigo-400',
      glowShadow: 'hover:shadow-glow-indigo',
    },
    cyan: {
      glow: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      border: 'border-cyan-500/25 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30',
      accent: 'text-cyan-400',
      glowShadow: 'hover:shadow-glow-cyan',
    },
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-[#0D121F]/85 backdrop-blur-2xl border ${style.border} ${style.glowShadow} p-5 sm:p-6 transition-all duration-300 shadow-xl shadow-black/40`}
      style={{
        boxShadow:
          '0 12px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Corner Ambient Radial Gradient */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${style.glow} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${style.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {formatCurrency(amount, symbol)}
        </h3>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 relative z-10">
        <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{subtitle}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
              trendType === 'up'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
            }`}
          >
            {trendType === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};
