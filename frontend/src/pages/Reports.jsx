import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { transactionService } from '../services/transactionService';
import { GlassCard } from '../components/common/GlassCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportUtils';

export const Reports = () => {
  const { user } = useAuth();
  const symbol = user?.currencySymbol || '₹';

  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getReport(selectedMonth);
      if (res?.report) setReport(res.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const handleExportCSV = async () => {
    try {
      const [year, m] = selectedMonth.split('-');
      const startOfMonth = new Date(year, m - 1, 1).toISOString();
      const endOfMonth = new Date(year, m, 0, 23, 59, 59).toISOString();

      const data = await transactionService.getTransactions({
        startDate: startOfMonth,
        endDate: endOfMonth,
        limit: 500,
      });

      if (data?.transactions) {
        exportTransactionsToCSV(data.transactions, `spendmate_report_${selectedMonth}.csv`);
      }
    } catch (err) {
      alert('Failed to export transactions CSV');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Print/Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Monthly Financial Statement & Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official monthly cash flow audit, breakdown, and exportable ledger
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
          />

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Printable Report Container */}
      <div id="printable-report" className="space-y-6">
        {/* Report Banner */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                SpendMate AI Automated Statement
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Executive Cash Flow Summary — {selectedMonth}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Account Holder: <strong className="text-slate-200">{user?.name}</strong> • Currency: {user?.currency || 'INR'} ({symbol})
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 block">Generated on</span>
              <span className="text-xs font-bold text-slate-300">
                {formatDate(report?.generatedAt || new Date())}
              </span>
            </div>
          </div>

          {/* 4 Summary Stat Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Income</span>
              <p className="text-xl font-black text-emerald-400 mt-1">
                {formatCurrency(report?.totalIncome || 0, symbol)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Expenses</span>
              <p className="text-xl font-black text-rose-400 mt-1">
                {formatCurrency(report?.totalExpense || 0, symbol)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Net Surplus / Deficit</span>
              <p
                className={`text-xl font-black mt-1 ${
                  (report?.netSavings || 0) >= 0 ? 'text-indigo-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(report?.netSavings || 0, symbol)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Savings Rate</span>
              <p className="text-xl font-black text-cyan-400 mt-1">
                {report?.savingsRate || 0}%
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Key Outflow Highlights
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Transactions Audited:</span>
                <span className="font-bold text-white">{report?.transactionCount || 0}</span>
              </div>

              {report?.largestExpense && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Single Largest Expense:</span>
                  <span className="font-bold text-rose-400">
                    {formatCurrency(report.largestExpense.amount, symbol)} ({report.largestExpense.description})
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Average Daily Outflow:</span>
                <span className="font-bold text-white">
                  {formatCurrency(report?.forecast?.dailyBurnRate || 0, symbol)} / day
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Budget Performance
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Monthly Budget Cap:</span>
                <span className="font-bold text-white">
                  {formatCurrency(report?.budget?.allocated || user?.monthlyBudget || 0, symbol)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Actual Outflow:</span>
                <span className="font-bold text-rose-400">
                  {formatCurrency(report?.totalExpense || 0, symbol)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Variance:</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(
                    Math.max(0, (report?.budget?.allocated || user?.monthlyBudget || 0) - (report?.totalExpense || 0)),
                    symbol
                  )}{' '}
                  surplus buffer
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Detailed Category Ranking Breakdown Table */}
        <GlassCard>
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Category Allocation Breakdown</h3>
            <span className="text-xs text-slate-400">Audited distribution</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-right">Expenditure</th>
                  <th className="py-2.5 text-right">% of Total</th>
                  <th className="py-2.5 text-right">Allocation Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {(report?.categoryRanking || []).map((cat) => (
                  <tr key={cat.name} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-white">{cat.name}</td>
                    <td className="py-2.5 text-right font-semibold text-rose-400">
                      {formatCurrency(cat.amount, symbol)}
                    </td>
                    <td className="py-2.5 text-right font-medium">{cat.share}%</td>
                    <td className="py-2.5 text-right w-44">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden ml-auto">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${cat.share}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

