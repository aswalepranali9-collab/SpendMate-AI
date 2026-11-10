import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ChevronRight, Tag, Calendar } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const RecentTransactions = ({ transactions = [], symbol = '₹', onDelete }) => {
  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <p className="text-[11px] text-slate-400">Latest income and expense activities</p>
          </div>
          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-800/60">
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No transactions recorded yet. Click "+ Add Transaction" to start!
            </div>
          ) : (
            transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx._id}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isIncome
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className="text-slate-500">{tx.paymentMethod || 'UPI'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, symbol)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </GlassCard>
  );
};

