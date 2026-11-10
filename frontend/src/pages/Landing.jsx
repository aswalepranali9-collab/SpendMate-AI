import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Wallet,
  Target,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            SpendMate<span className="text-indigo-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button
                onClick={handleDemoAccess}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-indigo-300 border border-indigo-500/30 transition"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Live Demo
              </button>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Next-Gen AI Wealth & Spending Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Master Your Money with{' '}
            <span className="gradient-text-indigo">AI Intelligence</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Track income, eliminate budget leaks, smash your savings targets, and get personalized
            algorithmic financial advisory in real-time. Built for modern professionals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDemoAccess}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <span>Explore Instant Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-sm font-bold border border-slate-700/80 transition"
            >
              Create Free Account
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant preloaded demo
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bank-grade encryption
            </span>
          </div>
        </motion.div>

        {/* Dashboard Preview Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 rounded-3xl p-3 bg-slate-800/40 border border-slate-700/60 shadow-2xl backdrop-blur-2xl"
        >
          <div className="rounded-2xl bg-[#0F172A] p-6 text-left border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-semibold text-slate-400">
                  SpendMate AI Live Analytics Console
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-400 font-bold">
                Health Score: 85/100 (Optimal)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Income</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">₹1,49,700</p>
                <span className="text-[10px] text-slate-500">+12% vs last month</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Expenses</span>
                <p className="text-xl font-bold text-rose-400 mt-1">₹68,546</p>
                <span className="text-[10px] text-slate-500">Pacing at 68% of budget</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Savings</span>
                <p className="text-xl font-bold text-indigo-400 mt-1">₹81,154</p>
                <span className="text-[10px] text-emerald-400 font-bold">54% Savings Rate 🚀</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Full Financial Control Suite</h2>
          <p className="mt-2 text-sm text-slate-400">
            Engineered with modern algorithms to give you institutional-grade visibility into your personal cash flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#121927]/90 border border-slate-800 hover:border-indigo-500/40 transition">
            <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-400 w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">AI Financial Advisor</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Detects spending anomalies, lifestyle creep, benchmark adherence (50/30/20), and suggests precise monthly savings moves.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121927]/90 border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Financial Health Score</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Real-time 0-100 resilience rating calculated from your savings rate, budget utilization, discretionary control, and goal pacing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121927]/90 border border-slate-800 hover:border-cyan-500/40 transition">
            <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 w-fit">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Savings Goals Tracker</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Set milestones for Emergency funds, Travel, or Gadgets. Track target deadlines and celebrate achievements with confetti.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SpendMate AI — Production-Grade Fintech Tracker. Designed for High Performance.</p>
      </footer>
    </div>
  );
};

