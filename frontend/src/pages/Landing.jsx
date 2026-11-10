import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Lock,
  Cpu,
  BarChart3,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('advisor');
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoAccess = async () => {
    try {
      setDemoLoading(true);
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  const featureTabs = [
    { id: 'advisor', label: 'AI Copilot & Advisor', icon: Sparkles },
    { id: 'health', label: 'Financial Health Score', icon: ShieldCheck },
    { id: 'budget', label: 'Budget Utilization', icon: Wallet },
    { id: 'goals', label: 'Savings Milestones', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Background Animated Aurora Lighting */}
      <div className="aurora-orb-1 top-[-100px] left-[15%]" />
      <div className="aurora-orb-2 top-[300px] right-[10%]" />
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

      {/* Modern SaaS Navigation */}
      <nav className="relative z-30 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-xl shadow-indigo-500/30 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              SpendMate<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.0
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <button
                onClick={handleDemoAccess}
                disabled={demoLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-indigo-300 border border-indigo-500/30 shadow-lg shadow-black/40 transition active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{demoLoading ? 'Launching...' : 'Instant Demo'}</span>
              </button>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Pulsating Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-xl shadow-lg shadow-indigo-500/10"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Next-Gen Financial Intelligence</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-bold">Dual-Engine AI Audit</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
        >
          Your Personal Finances,{' '}
          <span className="gradient-text-hero block sm:inline">
            Supercharged by AI
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          Real-time expense tracking, algorithmic health scoring, predictive 30-day burn rate models,
          and interactive financial copilot advice — wrapped in a modern, ultra-responsive glassmorphic interface.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleDemoAccess}
            disabled={demoLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-extrabold shadow-2xl shadow-indigo-600/40 flex items-center justify-center gap-2.5 transition transform active:scale-95 ring-1 ring-white/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{demoLoading ? 'Starting Session...' : 'Explore Live Interactive Demo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-sm font-bold border border-slate-700/80 transition shadow-lg shadow-black/50"
          >
            Create Free Account
          </Link>
        </motion.div>

        {/* Value Proposition Micro Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Preloaded Alex Morgan demo
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero-setup local memory mode
          </span>
        </motion.div>

        {/* 3D-Perspective Hero Dashboard Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          {/* Radiant Edge Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-cyan-500/30 blur-xl opacity-75" />

          {/* Main Glass Shell */}
          <div className="relative rounded-3xl bg-[#0B0F19]/90 border border-slate-700/80 p-4 sm:p-7 shadow-2xl backdrop-blur-2xl text-left">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/90" />
                <span className="h-3 w-3 rounded-full bg-amber-500/90" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
                <span className="ml-2 text-xs font-semibold text-slate-400">
                  spendmate.ai/dashboard — Alex Morgan (Executive Tier)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Health: 100/100 (Optimal)
                </span>
              </div>
            </div>

            {/* Dashboard Quick Metric Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/25">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Income
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-2">₹1,49,700</p>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% MoM growth
                </span>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/25">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Expenses
                  </span>
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-2">₹68,546</p>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                  68% of monthly budget cap
                </span>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent border border-indigo-500/25">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Monthly Savings
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-indigo-400 mt-2">₹81,154</p>
                <span className="text-[11px] font-bold text-cyan-400 mt-1 block">
                  54% Savings Rate 🚀 (Top Tier)
                </span>
              </div>
            </div>

            {/* AI Advisor Insight Floating Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-cyan-300 shrink-0">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>AI Copilot Recommendation</span>
                    <span className="text-[10px] text-cyan-400 font-semibold">• Dining Optimization</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Batch meal prep on weekdays can unlock an estimated ₹4,200/month for your Tokyo Vacation Goal.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDemoAccess}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition"
              >
                Apply in Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Feature Deep Dive (Tabbed Showcase) */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
            Institutional-Grade Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Financial Clarity
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Switch between core intelligence pillars to experience how SpendMate AI transforms raw numbers into actionable growth.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Showcase Cards */}
        <AnimatePresence mode="wait">
          {activeTab === 'advisor' && (
            <motion.div
              key="advisor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-indigo-500/30 backdrop-blur-2xl flex flex-col justify-between">
                <div>
                  <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 w-fit mb-4">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Algorithmic Financial Advisor</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Continuously scans your ledger to detect spending leaks, 50/30/20 budget standard deviations,
                    and high single-category concentration (&gt;35% outflow).
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
                  <span>Interactive Q&A on Live Ledger</span> • <span>Gemini 1.5 Flash Enabled</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-slate-800 backdrop-blur-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Sample Live Copilot Response
                </span>
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 text-slate-300">
                  <p className="font-bold text-white">"Can I afford a ₹60,000 laptop purchase this week?"</p>
                  <p className="leading-relaxed text-indigo-300">
                    💡 SpendMate AI: With your current liquid surplus of ₹81,154 and emergency reserves safe at ₹2,45,000,
                    you can comfortably proceed. Consider allocating from your Gadgets Goal to preserve cash flow.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-emerald-500/30 backdrop-blur-2xl flex flex-col justify-between">
                <div>
                  <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 w-fit mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">4-Pillar Resilience Index</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Evaluates savings rate (35 pts), budget discipline (25 pts), discretionary spending control (20 pts),
                    and savings goals progress (20 pts) for a comprehensive 0–100 score.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-semibold">
                  100/100 Optimal Score achieved on sample account
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-slate-800 backdrop-blur-2xl space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Health Breakdown Preview
                </span>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Savings Rate (54%)</span>
                    <span className="font-bold text-emerald-400">35 / 35 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Budget Discipline (68% spent)</span>
                    <span className="font-bold text-indigo-400">25 / 25 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-indigo-500/30 backdrop-blur-2xl">
                <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 w-fit mb-4">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Adaptive Budget Planner</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Set combined monthly caps or category-specific thresholds. SpendMate AI triggers automated notifications
                  at customizable thresholds before you overspend.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-slate-800 backdrop-blur-2xl flex flex-col justify-center">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white">Food & Dining Cap</span>
                    <span className="text-emerald-400 font-bold">51% Utilized</span>
                  </div>
                  <p className="text-[11px] text-slate-400">₹6,150 spent of ₹12,000 monthly allowance</p>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-emerald-400 rounded-full w-[51%]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-cyan-500/30 backdrop-blur-2xl">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 w-fit mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Savings Targets with Confetti</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Track multi-year milestones with deadline countdowns, target deposit calculators, and celebratory
                  confetti particle bursts upon reaching completion.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D121F]/90 border border-slate-800 backdrop-blur-2xl flex flex-col justify-center">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">Tokyo Spring Vacation</span>
                    <span className="text-cyan-400 font-bold">70% Reached</span>
                  </div>
                  <p className="text-[11px] text-slate-400">₹1,40,000 of ₹2,00,000 target</p>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-cyan-400 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bento Grid: Architecture & Technical Highlights */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
            Developer Portfolio Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built with Modern Engineering Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento 1 */}
          <div className="p-6 rounded-3xl bg-[#0D121F]/80 border border-slate-800/80 hover:border-indigo-500/40 transition">
            <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 w-fit mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Full-Stack MERN Architecture</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Express controllers, Mongoose compound indexing, JWT auth middleware, and validation with express-validator.
            </p>
          </div>

          {/* Bento 2 */}
          <div className="p-6 rounded-3xl bg-[#0D121F]/80 border border-slate-800/80 hover:border-emerald-500/40 transition">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 w-fit mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Recharts Visuals</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Responsive bar charts, proportional donut category graphs, and daily spending velocity area charts.
            </p>
          </div>

          {/* Bento 3 */}
          <div className="p-6 rounded-3xl bg-[#0D121F]/80 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 w-fit mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Leak Local Fallback</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Dual-database support connects directly to MongoDB Atlas or runs in-memory for instant zero-configuration demo.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Sticky CTA Banner */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#0E1526] to-cyan-950/60 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to experience modern wealth management?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Launch the live interactive demo preloaded with complete multi-month analytics and AI insights.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDemoAccess}
                disabled={demoLoading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition transform active:scale-95"
              >
                {demoLoading ? 'Launching Demo...' : 'Launch Instant Demo Now'}
              </button>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SpendMate AI — Modern SaaS Personal Wealth Tracker. Engineered for Portfolios.</p>
      </footer>
    </div>
  );
};
