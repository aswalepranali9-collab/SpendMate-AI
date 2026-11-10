import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Award, HelpCircle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const FinancialHealthScore = ({ healthScore }) => {
  if (!healthScore) return null;

  const { score = 75, grade = 'Good', badgeColor = '#3B82F6', summary = '', breakdown = {} } = healthScore;

  // Calculate circle stroke circumference
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Financial Health Score</h3>
              <p className="text-[11px] text-slate-400">AI-computed financial resilience index</p>
            </div>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${badgeColor}20`,
              color: badgeColor,
              border: `1px solid ${badgeColor}40`,
            }}
          >
            {grade}
          </span>
        </div>

        {/* Circular Gauge and Score Overview */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="56"
                cy="56"
                r={radius}
                stroke={badgeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white">{score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-200">
              Status: <span style={{ color: badgeColor }}>{grade} Financial Condition</span>
            </h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{summary}</p>
          </div>
        </div>

        {/* 4 Health Pillars Breakdown */}
        <div className="mt-5 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Core Stability Pillars
          </div>

          {/* Pillar 1: Savings Rate */}
          {breakdown.savingsRate && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Savings Rate ({breakdown.savingsRate.percentage}%)</span>
                <span className="font-semibold text-slate-200">
                  {breakdown.savingsRate.score} / {breakdown.savingsRate.maxScore} pts
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.savingsRate.score / breakdown.savingsRate.maxScore) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Pillar 2: Budget Discipline */}
          {breakdown.budgetDiscipline && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">
                  Budget Discipline ({breakdown.budgetDiscipline.utilization}% spent)
                </span>
                <span className="font-semibold text-slate-200">
                  {breakdown.budgetDiscipline.score} / {breakdown.budgetDiscipline.maxScore} pts
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.budgetDiscipline.score / breakdown.budgetDiscipline.maxScore) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Pillar 3: Discretionary Control */}
          {breakdown.discretionaryControl && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">
                  Discretionary Spend ({breakdown.discretionaryControl.ratio}% of budget)
                </span>
                <span className="font-semibold text-slate-200">
                  {breakdown.discretionaryControl.score} / {breakdown.discretionaryControl.maxScore} pts
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(breakdown.discretionaryControl.score / breakdown.discretionaryControl.maxScore) * 100}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-cyan-500 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Pillar 4: Goals Momentum */}
          {breakdown.goalsMomentum && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">
                  Goal Completion ({breakdown.goalsMomentum.avgCompletion}%)
                </span>
                <span className="font-semibold text-slate-200">
                  {breakdown.goalsMomentum.score} / {breakdown.goalsMomentum.maxScore} pts
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.goalsMomentum.score / breakdown.goalsMomentum.maxScore) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

