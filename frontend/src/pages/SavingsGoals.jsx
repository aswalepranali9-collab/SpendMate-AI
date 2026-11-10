import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Target,
  PlusCircle,
  Coins,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { goalService } from '../services/goalService';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';

const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Gadget',
  'Vehicle',
  'Real Estate',
  'Wedding',
  'Education',
  'Investment',
  'Other',
];

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

export const SavingsGoals = () => {
  const { user } = useAuth();
  const symbol = user?.currencySymbol || '₹';

  const [goals, setGoals] = useState([]);
  const [metrics, setMetrics] = useState({ totalTarget: 0, totalSaved: 0, overallProgress: 0 });
  const [loading, setLoading] = useState(true);

  // Create Goal Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Emergency Fund');
  const [color, setColor] = useState('#10B981');

  // Deposit Modal
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await goalService.getGoals();
      if (data) {
        setGoals(data.goals || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount || !deadline) return;

    try {
      await goalService.createGoal({
        title,
        targetAmount: Number(targetAmount),
        savedAmount: Number(savedAmount) || 0,
        deadline,
        category,
        color,
      });

      setCreateModalOpen(false);
      setTitle('');
      setTargetAmount('');
      setSavedAmount('0');
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleOpenDeposit = (goal) => {
    setActiveGoal(goal);
    setDepositAmount('');
    setDepositModalOpen(true);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;

    try {
      const res = await goalService.depositToGoal(activeGoal._id, Number(depositAmount));
      setDepositModalOpen(false);

      // Trigger Confetti if newly completed!
      if (res.goal?.isCompleted || activeGoal.savedAmount + Number(depositAmount) >= activeGoal.targetAmount) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deposit');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Delete this savings goal?')) {
      try {
        await goalService.deleteGoal(id);
        fetchGoals();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Savings Goals & Milestones
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build wealth deliberately with deadline-tracked financial targets
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/15 text-indigo-400">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Saved Portfolio
              </span>
              <p className="text-2xl font-black text-white mt-0.5">
                {formatCurrency(metrics.totalSaved, symbol)}{' '}
                <span className="text-sm font-normal text-slate-400">
                  of {formatCurrency(metrics.totalTarget, symbol)} Target
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-slate-400">Overall Progress</span>
              <p className="text-xl font-black text-emerald-400">
                {metrics.overallProgress}%
              </p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-xs text-slate-400">Active Goals</span>
              <p className="text-xl font-black text-indigo-400">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, metrics.overallProgress)}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const isFinished = goal.isCompleted || goal.savedAmount >= goal.targetAmount;
          return (
            <GlassCard key={goal._id} className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">
                        {goal.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-lg font-black text-white">
                      {formatCurrency(goal.savedAmount, symbol)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: {formatCurrency(goal.targetAmount, symbol)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${goal.completionPercentage}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold" style={{ color: goal.color }}>
                      {goal.completionPercentage}% Achieved
                    </span>
                    <span>Remaining: {formatCurrency(goal.remainingAmount, symbol)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formatDate(goal.deadline)}
                  </span>
                  <span
                    className={`font-semibold ${
                      isFinished
                        ? 'text-emerald-400'
                        : goal.isOverdue
                        ? 'text-rose-400'
                        : 'text-indigo-300'
                    }`}
                  >
                    {isFinished ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Complete
                      </span>
                    ) : (
                      `${goal.daysLeft} days left`
                    )}
                  </span>
                </div>
              </div>

              {/* Deposit Button */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => handleOpenDeposit(goal)}
                  disabled={isFinished}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isFinished
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 active:scale-98'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  {isFinished ? 'Goal Achieved 🎉' : 'Contribute / Deposit'}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Set New Savings Target"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Goal Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 6-Month Emergency Fund, Japan Trip, MacBook M3"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Target Amount ({symbol})
              </label>
              <input
                type="number"
                min="1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="200000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Already Saved ({symbol})
              </label>
              <input
                type="number"
                min="0"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Date</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Color Accent</label>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition transform ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30"
          >
            Create Goal
          </button>
        </form>
      </Modal>

      {/* Deposit Modal */}
      {activeGoal && (
        <Modal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          title={`Deposit Funds: ${activeGoal.title}`}
        >
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Current Progress:</span>
                <span className="font-bold text-white">
                  {formatCurrency(activeGoal.savedAmount, symbol)} /{' '}
                  {formatCurrency(activeGoal.targetAmount, symbol)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 mt-1">
                <span>Remaining:</span>
                <span className="font-bold text-indigo-400">
                  {formatCurrency(activeGoal.remainingAmount, symbol)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Deposit Amount ({symbol})
              </label>
              <input
                type="number"
                min="1"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-base font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/30"
            >
              Confirm Deposit
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
