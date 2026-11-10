import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  PlusCircle,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  X,
  Tag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/exportUtils';
import { QuickAddModal } from '../components/dashboard/QuickAddModal';
import { Modal } from '../components/common/Modal';

const ALL_CATEGORIES = [
  'All',
  'Salary',
  'Freelancing',
  'Business',
  'Investments',
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

export const Transactions = () => {
  const { user } = useAuth();
  const symbol = user?.currencySymbol || '₹';

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All'); // 'All' | 'income' | 'expense'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        sortBy,
        sortOrder,
        limit: 100,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (type !== 'All') params.type = type;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await transactionService.getTransactions(params);
      if (data) {
        setTransactions(data.transactions || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [category, type, sortBy, sortOrder, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        fetchTransactions();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleEditClick = (tx) => {
    setEditingTx({
      ...tx,
      date: new Date(tx.date).toISOString().split('T')[0],
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await transactionService.updateTransaction(editingTx._id, editingTx);
      setEditModalOpen(false);
      setEditingTx(null);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions, `spendmate_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, audit, and export your cash flow entries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setQuickAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
            Filtered Incomes
          </span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            +{formatCurrency(summary.totalIncome, symbol)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
            Filtered Expenses
          </span>
          <p className="text-xl font-bold text-rose-400 mt-1">
            -{formatCurrency(summary.totalExpense, symbol)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
          <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
            Filtered Net Balance
          </span>
          <p className="text-xl font-bold text-indigo-300 mt-1">
            {formatCurrency(summary.netBalance, symbol)}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#121927]/90 border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by description, note, or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
            {['All', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${
                  type === t
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'income' ? 'Incomes' : t === 'expense' ? 'Expenses' : 'All Types'}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs"
            />
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split('-');
              setSortBy(f);
              setSortOrder(o);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none"
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>

          {(search || category !== 'All' || type !== 'All' || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 text-xs ml-auto"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#121927]/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Transaction</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No transactions match the selected criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx._id} className="hover:bg-slate-800/40 transition">
                      {/* Description & Type Icon */}
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
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
                          <p className="font-bold text-white line-clamp-1">{tx.description}</p>
                          {tx.isRecurring && (
                            <span className="text-[10px] text-indigo-400 font-semibold">
                              • Recurring monthly
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px] border border-slate-700/60">
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      {/* Payment Method */}
                      <td className="px-5 py-3.5 text-slate-400">
                        {tx.paymentMethod || 'UPI'}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 text-right font-black text-sm whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount, symbol)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSuccess={fetchTransactions}
        symbol={symbol}
      />

      {/* Edit Modal */}
      {editingTx && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Transaction"
        >
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Amount</label>
              <input
                type="number"
                step="any"
                required
                value={editingTx.amount}
                onChange={(e) => setEditingTx({ ...editingTx, amount: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
              <input
                type="text"
                required
                value={editingTx.description}
                onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={editingTx.category}
                  onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  {ALL_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Payment Method</label>
                <select
                  value={editingTx.paymentMethod || 'UPI'}
                  onChange={(e) => setEditingTx({ ...editingTx, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={editingTx.date}
                onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
