import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDownLeft, ArrowUpRight, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { transactionService } from '../../services/transactionService';

const INCOME_CATEGORIES = ['Salary', 'Freelancing', 'Business', 'Investments', 'Other'];
const EXPENSE_CATEGORIES = [
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

export const QuickAddModal = ({ isOpen, onClose, onSuccess, symbol = '₹' }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setType('expense');
      setCategory('Food');
      setPaymentMethod('UPI');
      setDate(new Date().toISOString().split('T')[0]);
      setIsRecurring(false);
      setAiSuggestion(null);
      setError('');
    }
  }, [isOpen]);

  // Real-time category suggestion based on description
  useEffect(() => {
    if (description.trim().length >= 3) {
      const timer = setTimeout(async () => {
        try {
          const res = await transactionService.suggestCategory(description);
          if (res?.category && res.category !== 'Other') {
            setAiSuggestion(res.category);
          }
        } catch {
          // ignore
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAiSuggestion(null);
    }
  }, [description]);

  const handleApplySuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description or note');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await transactionService.createTransaction({
        type,
        amount: Number(amount),
        category,
        description,
        paymentMethod,
        date,
        isRecurring,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const activeCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Type Toggle: Expense / Income */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" /> Income
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
              {symbol}
            </span>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-lg font-bold placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description / Note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Description / Note</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Swiggy Italian dinner, Freelance invoice, Rent"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />

          {/* AI Category Pill if detected */}
          {aiSuggestion && aiSuggestion !== category && (
            <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
              <span className="flex items-center gap-1.5 text-[11px] text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                AI Suggests: <strong className="text-white">{aiSuggestion}</strong>
              </span>
              <button
                type="button"
                onClick={handleApplySuggestion}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded"
              >
                <Check className="w-3 h-3" /> Apply
              </button>
            </div>
          )}
        </div>

        {/* Category & Payment Method Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              {activeCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
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

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Transaction Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Recurring Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isRecurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
          />
          <label htmlFor="isRecurring" className="text-xs text-slate-300">
            Recurring monthly transaction (e.g. rent, salary, subscription)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition active:scale-98 ${
              type === 'expense'
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-600/30'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-600/30'
            }`}
          >
            {loading ? 'Recording...' : `Record ${type === 'expense' ? 'Expense' : 'Income'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

