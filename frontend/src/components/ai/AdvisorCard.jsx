import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Lightbulb,
  Sparkles,
  TrendingUp,
  CreditCard,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export const AdvisorCard = ({ insight, onActionClick }) => {
  const {
    type = 'tip',
    category = 'General',
    insight: text,
    recommendation,
    scoreImpact = 0,
  } = insight;

  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500/20 text-rose-300',
      title: 'Spending Leak Alert',
    },
    tip: {
      icon: Lightbulb,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300',
      title: 'AI Optimization Tip',
    },
    celebration: {
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300',
      title: 'Milestone Achievement',
    },
    forecast: {
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300',
      title: 'Predictive Forecast',
    },
    budget: {
      icon: CreditCard,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      badge: 'bg-indigo-500/20 text-indigo-300',
      title: 'Budget Intelligence',
    },
  };

  const config = typeConfig[type] || typeConfig.tip;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl bg-[#121927]/90 backdrop-blur-xl border ${config.border} p-5 shadow-lg shadow-black/20 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${config.bg} ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {config.title}
            </h4>
            <span className="text-[10px] text-slate-400">Category: {category}</span>
          </div>
        </div>

        {scoreImpact !== 0 && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              scoreImpact > 0
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {scoreImpact > 0 ? `+${scoreImpact}` : scoreImpact} Health Score
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-slate-200 leading-relaxed">{text}</p>
      </div>

      {recommendation && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Prescribed Action:
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">{recommendation}</p>
        </div>
      )}
    </motion.div>
  );
};

