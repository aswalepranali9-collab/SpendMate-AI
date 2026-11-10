import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#F43F5E', // Rose
  '#14B8A6', // Teal
];

const CustomTooltip = ({ active, payload, symbol = '₹' }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl bg-[#121927] border border-slate-700/90 p-3 shadow-xl text-xs">
        <p className="font-bold text-white mb-0.5">{data.name}</p>
        <p className="text-indigo-400 font-bold">{formatCurrency(data.value, symbol)}</p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart = ({ data = [], symbol = '₹' }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Expense Distribution</h3>
          <p className="text-[11px] text-slate-400">Category-wise spending breakdown</p>
        </div>
        <span className="text-xs font-bold text-slate-300">
          Total: {formatCurrency(total, symbol)}
        </span>
      </div>

      <div className="mt-4 h-64 w-full flex items-center justify-center">
        {data.length === 0 ? (
          <div className="text-xs text-slate-400">No expense records available for distribution</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip symbol={symbol} />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    stroke="#121927"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value) => (
                  <span className="text-[11px] text-slate-300 font-medium">{value}</span>
                )}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
};

