import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import { formatCurrency } from '../utils/formatters';

const CATEGORIES = [
  'Overall',
  'Food',
  'Shopping',
  'Travel',
  'Bills',
  'Healthcare',
  'Education',
  'Entertainment',
  'EMI',
  'Other',
];

export const Budgets = () => {
  const { user } = useAuth();
  const symbol = user?.currencySymbol || '₹';

  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('Overall');
  const [modalAmount, setModalAmount] = useState('');
  const [modalThreshold, setModalThreshold] = useState(80);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetService.getBudgets(selectedMonth);
      setBudgetData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!modalAmount || Number(modalAmount) <= 0) return;

    try {
      await budgetService.createOrUpdateBudget({
        month: selectedMonth,
        category: modalCategory,
        budgetAmount: Number(modalAmount),
        alertThreshold: Number(modalThreshold),
      });
      setIsModalOpen(false);
      setModalAmount('');
      fetchBudgets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Remove this budget limit?')) {
      try {
        await budgetService.deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const overall = budgetData?.budgets?.find((b) => b.category === 'Overall');
  const categoryBudgets = budgetData?.budgets?.filter((b) => b.category !== 'Overall') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Budget Planner & Utilization
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforce spending limits and configure automated overspending alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
          />

          <button
            onClick={() => {
              setModalCategory('Overall');
              setModalAmount('');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Overall Budget Hero Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                <Wallet className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-white">
                Overall Monthly Budget ({selectedMonth})
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Total cap across all categories combined for the selected billing month
            </p>

            <div className="mt-4 flex items-baseline gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Spent</span>
                <p className="text-2xl font-black text-white">
                  {formatCurrency(budgetData?.totalSpent || 0, symbol)}
                </p>
              </div>
              <span className="text-slate-600 text-xl font-light">/</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Allocated Cap</span>
                <p className="text-xl font-bold text-indigo-400">
                  {formatCurrency(budgetData?.totalBudget || 0, symbol)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                (budgetData?.overallUtilization || 0) >= 100
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : (budgetData?.overallUtilization || 0) >= 80
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {(budgetData?.overallUtilization || 0) >= 100 ? (
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Overbudget
                </span>
              ) : (budgetData?.overallUtilization || 0) >= 80 ? (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Warning (80%+)
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Within Limits
                </span>
              )}
            </span>

            <p className="text-xs text-slate-400 mt-2">
              Remaining Safe Spend:{' '}
              <strong className="text-emerald-400 font-bold">
                {formatCurrency(budgetData?.remainingBudget || 0, symbol)}
              </strong>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-300">
            <span>Utilization: {budgetData?.overallUtilization || 0}%</span>
            <span>100% Limit</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (budgetData?.overallUtilization || 0) >= 100
                  ? 'bg-rose-500'
                  : (budgetData?.overallUtilization || 0) >= 80
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, budgetData?.overallUtilization || 0)}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Category Spending Limits
          </h3>
          <span className="text-xs text-slate-400">
            {categoryBudgets.length} category caps active
          </span>
        </div>

        {categoryBudgets.length === 0 ? (
          <GlassCard className="text-center py-10">
            <p className="text-xs text-slate-400 mb-3">
              No category-specific budgets set for this month yet.
            </p>
            <button
              onClick={() => {
                setModalCategory('Food');
                setModalAmount('');
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold border border-slate-700 transition"
            >
              + Add Category Budget (e.g. Food, Shopping)
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBudgets.map((b) => (
              <GlassCard key={b._id} className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
                      {b.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-3">
                      {formatCurrency(b.spentAmount, symbol)}{' '}
                      <span className="text-xs text-slate-500 font-normal">
                        / {formatCurrency(b.budgetAmount, symbol)}
                      </span>
                    </h4>
                  </div>

                  <button
                    onClick={() => handleDeleteBudget(b._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    title="Delete Budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{b.utilization}% spent</span>
                    <span>Remaining: {formatCurrency(b.remaining, symbol)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        b.utilization >= 100
                          ? 'bg-rose-500'
                          : b.utilization >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, b.utilization)}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Set Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Monthly Budget Limit"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Month</label>
            <input
              type="month"
              required
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
            <select
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'Overall' ? 'Overall Monthly Budget (All categories)' : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Budget Cap Amount ({symbol})
            </label>
            <input
              type="number"
              min="1"
              required
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-base font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Warning Alert Threshold ({modalThreshold}%)
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={modalThreshold}
              onChange={(e) => setModalThreshold(e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              SpendMate AI triggers automated warning notification when spending crosses {modalThreshold}%
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30"
          >
            Save Budget Limit
          </button>
        </form>
      </Modal>
    </div>
  );
};
