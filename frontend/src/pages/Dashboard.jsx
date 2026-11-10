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
  Zap,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 relative"
    >
      {/* Background ambient lighting */}
      <div className="aurora-orb-1 top-[-80px] right-[-100px] opacity-40 pointer-events-none" />

      {/* Top Greeting Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Investor'}!
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              AI Sentinel Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {todayStr} • {user?.occupation || 'Senior Tech Lead'}
          </p>
        </div>

        <button
          onClick={() => setQuickAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-xl shadow-indigo-600/30 transition transform active:scale-95 ring-1 ring-white/10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Transaction</span>
        </button>
      </motion.div>

      {/* 4 Summary Stat Cards */}
      <motion.div variants={itemVariants}>
        <SummaryCards data={dashboardData} symbol={symbol} />
      </motion.div>

      {/* Budget Pace Warning Pill if high utilization */}
      {dashboardData?.budget?.utilization >= 80 && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <span>
              <strong>Budget Watchdog:</strong> You have utilized {dashboardData.budget.utilization}% of
              your {symbol}
              {dashboardData.budget.allocated.toLocaleString()} monthly allowance. Remaining safe spend: {symbol}
              {dashboardData.budget.remaining.toLocaleString()}.
            </span>
          </div>
          <Link
            to="/budgets"
            className="hidden sm:inline-flex items-center gap-1 font-bold text-amber-400 hover:underline shrink-0"
          >
            Review Limits <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Charts) */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
          <IncomeExpenseChart data={chartsData?.monthlyComparison || []} symbol={symbol} />
          <SpendingTrendChart data={chartsData?.spendingTrend || []} symbol={symbol} />
        </motion.div>

        {/* Right Column (Health Score & Recent Transactions) */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <FinancialHealthScore healthScore={dashboardData?.healthScore} />
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            symbol={symbol}
          />
        </motion.div>
      </div>

      {/* Top Spending Categories Quick Pills */}
      {dashboardData?.topCategories?.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-[#0D121F]/80 border border-slate-800/80 p-4 backdrop-blur-xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Primary Outflow Areas This Month
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {dashboardData.topCategories.map((c) => (
              <div
                key={c.category}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs flex items-center gap-2 shadow-sm"
              >
                <span className="font-bold text-slate-200">{c.category}</span>
                <span className="font-extrabold text-rose-400">{formatCurrency(c.amount, symbol)}</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-semibold">
                  {c.percentage}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Advisor Hero Banner with Gradient Border */}
      <motion.div variants={itemVariants} className="gradient-border-card">
        <div className="gradient-border-card-inner p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-cyan-300 ring-1 ring-cyan-500/30">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                SpendMate AI Financial Copilot
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Ready
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Personalized savings opportunities and predictive 30-day expense forecast computed for your ledger.
              </p>
            </div>
          </div>

          <Link
            to="/ai-advisor"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 shrink-0"
          >
            <span>Ask AI Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSuccess={loadData}
        symbol={symbol}
      />
    </motion.div>
  );
};
