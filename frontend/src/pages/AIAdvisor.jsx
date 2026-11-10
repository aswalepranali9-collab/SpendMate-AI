import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
  Zap,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { AdvisorCard } from '../components/ai/AdvisorCard';
import { GlassCard } from '../components/common/GlassCard';
import { formatCurrency } from '../utils/formatters';

const PRESET_PROMPTS = [
  'How can I cut expenses by 15% this month?',
  'Can I afford a ₹50,000 purchase right now?',
  'Am I saving enough for an emergency buffer?',
  'What is my single biggest spending leak?',
];

export const AIAdvisor = () => {
  const { user } = useAuth();
  const symbol = user?.currencySymbol || '₹';

  const [insights, setInsights] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm your SpendMate AI Financial Copilot. I've audited your live ledger, cash inflows, and active savings goals. Ask me anything about discretionary leaks, upcoming purchases, or 50/30/20 compliance!`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const data = await aiService.getInsights();
      if (data) {
        setInsights(data.insights || []);
        setForecast(data.forecast || null);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isAsking) return;

    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const res = await aiService.askAdvisor(query);
      const assistantMessage = {
        role: 'assistant',
        content: res.answer || "I've analyzed your cash flow and recommend maintaining a 20% savings buffer.",
        source: res.source,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue analyzing your accounts. Please try again.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Background ambient aurora lighting */}
      <div className="aurora-orb-2 top-[-50px] right-[-100px] opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Finance Advisor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live Copilot Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Algorithmic wealth audits, spending leak detection, and contextual AI guidance
          </p>
        </div>

        <button
          onClick={fetchAIData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-indigo-300 border border-indigo-500/30 shadow-md transition active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Re-run AI Audit</span>
        </button>
      </div>

      {/* 30-Day Predictive Expense Forecast Card (Gradient Border) */}
      {forecast && (
        <div className="gradient-border-card">
          <div className="gradient-border-card-inner p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Predictive 30-Day Outflow Projection Model
                </span>
                <h2 className="text-2xl font-black text-white mt-1 tracking-tight">
                  Forecasted Outflow: {formatCurrency(forecast.forecastAmount, symbol)}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Based on your historical daily burn velocity of{' '}
                  <strong className="text-slate-200">{formatCurrency(forecast.dailyBurnRate, symbol)}/day</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-900 text-slate-300 border border-slate-700/80">
                  Confidence: {forecast.confidence}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Trend: {forecast.trend}
                </span>
              </div>
            </div>

            {forecast.categoryForecast?.length > 0 && (
              <div className="mt-5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Projected Category Allocation (Next 30 Days)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {forecast.categoryForecast.slice(0, 4).map((c) => (
                    <div
                      key={c.category}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs hover:border-indigo-500/30 transition shadow-sm"
                    >
                      <span className="text-slate-400 text-[11px] font-semibold block truncate">
                        {c.category}
                      </span>
                      <span className="text-base font-black text-white block mt-1">
                        {formatCurrency(c.projectedAmount, symbol)}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-bold">{c.projectedShare}% allocation</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main 2-Column: Left (Advisor Insights Feed) & Right (Interactive Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Insights Recommendations List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Automated Audit Findings ({insights.length})
            </h3>
          </div>

          {insights.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-slate-400">
                Record a few transactions to generate your first AI financial signals.
              </p>
            </GlassCard>
          ) : (
            insights.map((item, index) => (
              <AdvisorCard key={index} insight={item} />
            ))
          )}
        </div>

        {/* Right: Interactive AI Copilot Chat */}
        <div className="lg:col-span-5 flex flex-col h-[600px]">
          <GlassCard className="h-full flex flex-col p-4 border-indigo-500/25 shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80 shrink-0">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  SpendMate Copilot
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">Contextual query engine on your live ledger</p>
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div className="py-2.5 flex flex-wrap gap-1.5 shrink-0 border-b border-slate-800/60">
              {PRESET_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-indigo-300 border border-slate-700/80 transition text-left font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-br-xs'
                        : 'bg-slate-900/95 border border-slate-800/80 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAsking && (
                <div className="flex gap-2.5 items-center text-xs text-indigo-400 animate-pulse p-2">
                  <Bot className="w-4 h-4" />
                  <span>Computing contextual recommendation...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-2.5 border-t border-slate-800 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about your budget, affordances, or savings..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={isAsking || !inputQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white disabled:opacity-50 transition shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
