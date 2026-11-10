import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, symbol = '₹' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-[#121927] border border-slate-700/90 p-3 shadow-xl text-xs">
        <p className="font-semibold text-slate-400 mb-0.5">Date: {label}</p>
        <p className="text-sm font-bold text-rose-400">
          Spent: {formatCurrency(payload[0].value, symbol)}
        </p>
      </div>
    );
  }
  return null;
};

export const SpendingTrendChart = ({ data = [], symbol = '₹' }) => {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Daily Spending Curve</h3>
          <p className="text-[11px] text-slate-400">Day-by-day outflow tracking</p>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No daily activity in this timeframe
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${symbol}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={<CustomTooltip symbol={symbol} />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#F43F5E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
};

