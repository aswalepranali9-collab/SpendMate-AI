import React, { useState, useEffect } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { SpendingTrendChart } from '../components/charts/SpendingTrendChart';
import { GlassCard } from '../components/common/GlassCard';
import { formatCurrency } from '../utils/formatters';

export const Analytics = () => {
  const { user } = useAuth();
  const symbol = user?.currencySymbol || '₹';

  const [chartsData, setChartsData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [charts, dash] = await Promise.all([
          analyticsService.getCharts(),
          analyticsService.getDashboard(),
        ]);
        setChartsData(charts);
        setDashboardData(dash?.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalExpense = dashboardData?.totalExpense || 0;
  const totalIncome = dashboardData?.totalIncome || 0;
  const savingsRate = dashboardData?.savingsRate || 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Smart Financial Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual pattern recognition, category distributions, and spending trend curves
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Trend Engine Active
          </span>
        </div>
      </div>

      {/* Top 3 Metric Micro-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Net Savings Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-emerald-400">{savingsRate}%</h3>
            <span className="text-xs text-slate-400">of monthly income</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Target benchmark: 20%+ (50/30/20 standard)
          </p>
        </GlassCard>

        <GlassCard>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Current Health Grade
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-indigo-400">
              {dashboardData?.healthScore?.score || 80}/100
            </h3>
            <span className="text-xs font-bold text-slate-200">
              ({dashboardData?.healthScore?.grade || 'Good'})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Resilience score across 4 financial pillars
          </p>
        </GlassCard>

        <GlassCard>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Monthly Inflow / Outflow Ratio
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-cyan-400">
              {totalExpense > 0 ? (totalIncome / totalExpense).toFixed(2) : '1.0'}x
            </h3>
            <span className="text-xs text-slate-400">ratio multiplier</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalIncome > totalExpense ? 'Positive surplus surplus cash flow' : 'Deficit burn rate'}
          </p>
        </GlassCard>
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <IncomeExpenseChart data={chartsData?.monthlyComparison || []} symbol={symbol} />
        </div>
        <div className="lg:col-span-5">
          <CategoryPieChart data={chartsData?.categoryBreakdown || []} symbol={symbol} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SpendingTrendChart data={chartsData?.spendingTrend || []} symbol={symbol} />
        </div>

        {/* Top Spending Categories Breakdown Ranking Table */}
        <div className="lg:col-span-5">
          <GlassCard className="h-full">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Category Ranking</h3>
              <p className="text-[11px] text-slate-400">Ranked by highest capital allocation</p>
            </div>

            <div className="mt-4 space-y-3">
              {(chartsData?.categoryBreakdown || []).slice(0, 5).map((item, index) => {
                const pct = totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        #{index + 1} {item.name}
                      </span>
                      <span className="font-bold text-rose-400">
                        {formatCurrency(item.value, symbol)} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

