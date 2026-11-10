import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import { calculateFinancialHealthScore } from '../utils/healthScore.js';
import { predictNextMonthExpenses } from '../utils/aiEngine.js';

// @desc    Get complete dashboard summary metrics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Current Month range
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // All-time totals
    const allTimeAgg = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    allTimeAgg.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    // Current month totals
    const monthAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let monthIncome = 0;
    let monthExpense = 0;
    monthAgg.forEach((item) => {
      if (item._id === 'income') monthIncome = item.total;
      if (item._id === 'expense') monthExpense = item.total;
    });

    const monthSavings = monthIncome - monthExpense;
    const savingsRate = monthIncome > 0 ? Math.max(0, Math.round((monthSavings / monthIncome) * 100)) : 0;

    // Discretionary spend for current month
    const discretionaryAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          category: { $in: ['Shopping', 'Entertainment', 'Travel'] },
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const discretionaryExpenses = discretionaryAgg.length > 0 ? discretionaryAgg[0].total : 0;

    // Active goals
    const goals = await SavingsGoal.find({ userId });

    // Budget
    const budget = await Budget.findOne({ userId, month: currentMonthStr, category: 'Overall' });
    const budgetAmount = budget ? budget.budgetAmount : req.user.monthlyBudget || 0;

    // Financial Health Score
    const healthScoreData = calculateFinancialHealthScore({
      totalIncome: monthIncome || totalIncome,
      totalExpense: monthExpense || totalExpense,
      budgetAmount,
      totalSpentInBudget: monthExpense,
      goals,
      discretionaryExpenses,
    });

    // Recent 5 transactions
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(6);

    // Top spending categories this month
    const topCategoriesAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
      { $limit: 5 },
    ]);

    const topCategories = topCategoriesAgg.map((c) => ({
      category: c._id,
      amount: c.amount,
      percentage: monthExpense > 0 ? Math.round((c.amount / monthExpense) * 100) : 0,
    }));

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        currentBalance: totalIncome - totalExpense,
        monthIncome,
        monthExpense,
        monthSavings,
        savingsRate,
        budget: {
          allocated: budgetAmount,
          spent: monthExpense,
          remaining: Math.max(0, budgetAmount - monthExpense),
          utilization: budgetAmount > 0 ? Math.round((monthExpense / budgetAmount) * 100) : 0,
        },
        healthScore: healthScoreData,
        topCategories,
        recentTransactions,
        goalsCount: goals.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly chart data & spending trend analysis
// @route   GET /api/analytics/charts
// @access  Private
export const getChartAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Monthly Income vs Expense over past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyHistory = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format months array
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyDataMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlyDataMap[key] = {
        name: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`,
        income: 0,
        expense: 0,
        savings: 0,
      };
    }

    monthlyHistory.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (monthlyDataMap[key]) {
        if (item._id.type === 'income') {
          monthlyDataMap[key].income = item.total;
        } else {
          monthlyDataMap[key].expense = item.total;
        }
        monthlyDataMap[key].savings = monthlyDataMap[key].income - monthlyDataMap[key].expense;
      }
    });

    const monthlyComparison = Object.values(monthlyDataMap);

    // 2. Category-wise Pie Chart (Current Month or All-Time)
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
        },
      },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { value: -1 } },
    ]);

    const categoryData = categoryBreakdown.map((item) => ({
      name: item._id,
      value: item.value,
      count: item.count,
    }));

    // 3. Daily spending trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySpending = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const spendingTrend = dailySpending.map((d) => ({
      date: d._id.slice(5), // "MM-DD"
      amount: d.total,
    }));

    res.json({
      success: true,
      monthlyComparison,
      categoryBreakdown: categoryData,
      spendingTrend,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed Monthly Financial Report
// @route   GET /api/analytics/report
// @access  Private
export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const month = req.query.month || currentMonthStr;

    const [year, m] = month.split('-').map(Number);
    const startOfMonth = new Date(year, m - 1, 1);
    const endOfMonth = new Date(year, m, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: -1 });

    let income = 0;
    let expense = 0;
    const categoryTotals = {};

    transactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const categoryRanking = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        share: expense > 0 ? Math.round((amount / expense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const largestExpense = transactions
      .filter((t) => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0] || null;

    const budget = await Budget.findOne({ userId, month, category: 'Overall' });
    const forecast = predictNextMonthExpenses(transactions);

    res.json({
      success: true,
      report: {
        month,
        totalIncome: income,
        totalExpense: expense,
        netSavings: income - expense,
        savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
        transactionCount: transactions.length,
        largestExpense,
        categoryRanking,
        budget: budget ? { allocated: budget.budgetAmount, spent: expense } : null,
        forecast,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

