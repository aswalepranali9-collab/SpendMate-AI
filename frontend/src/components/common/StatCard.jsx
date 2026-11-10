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
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      text: 'text-emerald-400',
    },
    rose: {
      bg: 'from-rose-500/10 to-rose-500/5',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/15 text-rose-400',
      text: 'text-rose-400',
    },
    indigo: {
      bg: 'from-indigo-500/10 to-indigo-500/5',
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/15 text-indigo-400',
      text: 'text-indigo-400',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      text: 'text-cyan-400',
    },
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.bg} bg-[#121927]/90 backdrop-blur-xl border ${style.border} p-5 shadow-lg shadow-black/20`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-bold tracking-tight text-white">
          {formatCurrency(amount, symbol)}
        </h3>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{subtitle}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full ${
              trendType === 'up'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-rose-500/15 text-rose-400'
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

