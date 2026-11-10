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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { AdvisorCard } from '../components/ai/AdvisorCard';
import { GlassCard } from '../components/common/GlassCard';
import { formatCurrency } from '../utils/formatters';

const PRESET_PROMPTS = [
  'How can I cut my expenses this month?',
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
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm your SpendMate AI Financial Copilot. I've analyzed your live transactions, cash flows, and savings targets. Ask me anything about your money, discretionary leaks, or upcoming purchases!`,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AI Finance Advisor
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Live AI Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic wealth audits, spending leak detection, and interactive financial guidance
          </p>
        </div>

        <button
          onClick={fetchAIData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 border border-indigo-500/30 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Re-run AI Audit
        </button>
      </div>

      {/* 30-Day Predictive Expense Forecast Card */}
      {forecast && (
        <GlassCard className="p-6 bg-gradient-to-br from-indigo-950/40 via-[#121927] to-cyan-950/30 border-indigo-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                AI 30-Day Expense Projection Model
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Projected Outflow: {formatCurrency(forecast.forecastAmount, symbol)}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Based on your daily burn rate of{' '}
                <strong className="text-slate-200">{formatCurrency(forecast.dailyBurnRate, symbol)}/day</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                Confidence: {forecast.confidence}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Trend: {forecast.trend}
              </span>
            </div>
          </div>

          {forecast.categoryForecast?.length > 0 && (
            <div className="mt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Projected Category Breakdown (Next 30 Days)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {forecast.categoryForecast.slice(0, 4).map((c) => (
                  <div key={c.category} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] font-medium block truncate">
                      {c.category}
                    </span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {formatCurrency(c.projectedAmount, symbol)}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-semibold">{c.projectedShare}% share</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Main 2-Column: Left (Advisor Insights Feed) & Right (Interactive Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Insights Recommendations List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Automated Financial Audit Insights ({insights.length})
            </h3>
          </div>

          {insights.length === 0 ? (
            <GlassCard className="text-center py-10">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-slate-400">
                Add more transactions to generate comprehensive AI spending signals.
              </p>
            </GlassCard>
          ) : (
            insights.map((item, index) => (
              <AdvisorCard key={index} insight={item} />
            ))
          )}
        </div>

        {/* Right: Interactive AI Copilot Chat */}
        <div className="lg:col-span-5 flex flex-col h-[580px]">
          <GlassCard className="h-full flex flex-col p-4 border-indigo-500/20">
            {/* Chat Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 shrink-0">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">SpendMate Advisor Chat</h4>
                <p className="text-[10px] text-slate-400">Contextual query engine on your ledger</p>
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div className="py-2 flex flex-wrap gap-1.5 shrink-0 border-b border-slate-800/60">
              {PRESET_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-indigo-300 border border-slate-700/80 transition text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/40">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAsking && (
                <div className="flex gap-2.5 items-center text-xs text-indigo-400 animate-pulse">
                  <Bot className="w-4 h-4" />
                  <span>SpendMate AI is computing recommendations...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-2 border-t border-slate-800 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about your budget, affordances, or savings..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isAsking || !inputQuery.trim()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition"
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

