import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Wallet,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { FinancialHealthScore } from '../components/dashboard/FinancialHealthScore';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { SpendingTrendChart } from '../components/charts/SpendingTrendChart';
import { QuickAddModal } from '../components/dashboard/QuickAddModal';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const symbol = user?.currencySymbol || '₹';

  const loadData = async () => {
    try {
      setLoading(true);
      const [dash, charts] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getCharts(),
      ]);

      if (dash?.data) setDashboardData(dash.data);
      if (charts) setChartsData(charts);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Investor'}!
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3 h-3 text-cyan-400" /> AI Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {todayStr} • {user?.occupation || 'Financially Mindful'}
          </p>
        </div>

        <button
          onClick={() => setQuickAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <SummaryCards data={dashboardData} symbol={symbol} />

      {/* Budget Pace Warning Pill if high utilization */}
      {dashboardData?.budget?.utilization >= 80 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Budget Watch:</strong> You have utilized {dashboardData.budget.utilization}% of
              your {symbol}
              {dashboardData.budget.allocated.toLocaleString()} monthly allowance. Remaining safe spend: {symbol}
              {dashboardData.budget.remaining.toLocaleString()}.
            </span>
          </div>
          <Link
            to="/budgets"
            className="hidden sm:inline-flex items-center gap-1 font-bold text-amber-400 hover:underline"
          >
            Review Budgets <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-7 space-y-6">
          <IncomeExpenseChart data={chartsData?.monthlyComparison || []} symbol={symbol} />
          <SpendingTrendChart data={chartsData?.spendingTrend || []} symbol={symbol} />
        </div>

        {/* Right Column (Health Score & Recent Transactions) */}
        <div className="lg:col-span-5 space-y-6">
          <FinancialHealthScore healthScore={dashboardData?.healthScore} />
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            symbol={symbol}
          />
        </div>
      </div>

      {/* Top Spending Categories Quick Pills */}
      {dashboardData?.topCategories?.length > 0 && (
        <div className="rounded-2xl bg-[#121927]/80 border border-slate-800 p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Top Outflow Areas This Month
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {dashboardData.topCategories.map((c) => (
              <div
                key={c.category}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs flex items-center gap-2"
              >
                <span className="font-semibold text-slate-200">{c.category}</span>
                <span className="font-bold text-rose-400">{formatCurrency(c.amount, symbol)}</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {c.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Advisor Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-cyan-900/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">SpendMate AI Financial Copilot</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Personalized savings opportunities and expense forecasts ready for your review.
            </p>
          </div>
        </div>

        <Link
          to="/ai-advisor"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition"
        >
          <span>Ask AI Advisor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSuccess={loadData}
        symbol={symbol}
      />
    </div>
  );
};

