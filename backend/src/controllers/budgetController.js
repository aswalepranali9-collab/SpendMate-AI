import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all budgets for current or specified month
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const month = req.query.month || currentMonthStr;

    // Get all budgets for the month
    const budgets = await Budget.find({ userId: req.user._id, month });

    // Calculate current actual spending for each category
    const [year, m] = month.split('-').map(Number);
    const startOfMonth = new Date(year, m - 1, 1);
    const endOfMonth = new Date(year, m, 0, 23, 59, 59, 999);

    const expenseBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spentMap = {};
    let totalSpentMonth = 0;
    expenseBreakdown.forEach((item) => {
      spentMap[item._id] = item.total;
      totalSpentMonth += item.total;
    });

    // Format budgets with live spent data and utilization
    const enrichedBudgets = budgets.map((b) => {
      const liveSpent = b.category === 'Overall' ? totalSpentMonth : spentMap[b.category] || 0;
      const remaining = Math.max(0, b.budgetAmount - liveSpent);
      const utilization = Math.round((liveSpent / b.budgetAmount) * 100);

      return {
        _id: b._id,
        month: b.month,
        category: b.category,
        budgetAmount: b.budgetAmount,
        spentAmount: liveSpent,
        remaining,
        utilization,
        isExceeded: liveSpent > b.budgetAmount,
        alertThreshold: b.alertThreshold,
      };
    });

    // Find overall budget if exists
    const overallBudget = enrichedBudgets.find((b) => b.category === 'Overall');

    res.json({
      success: true,
      month,
      totalBudget: overallBudget ? overallBudget.budgetAmount : req.user.monthlyBudget || 0,
      totalSpent: totalSpentMonth,
      remainingBudget: overallBudget
        ? Math.max(0, overallBudget.budgetAmount - totalSpentMonth)
        : Math.max(0, (req.user.monthlyBudget || 0) - totalSpentMonth),
      overallUtilization: overallBudget
        ? Math.round((totalSpentMonth / overallBudget.budgetAmount) * 100)
        : req.user.monthlyBudget > 0
        ? Math.round((totalSpentMonth / req.user.monthlyBudget) * 100)
        : 0,
      budgets: enrichedBudgets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update monthly budget
// @route   POST /api/budgets
// @access  Private
export const createOrUpdateBudget = async (req, res) => {
  try {
    const { month, category = 'Overall', budgetAmount, alertThreshold = 80 } = req.body;

    if (!month || !budgetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month and budget amount',
      });
    }

    // Calculate current spent amount for this category in the month
    const [year, m] = month.split('-').map(Number);
    const startOfMonth = new Date(year, m - 1, 1);
    const endOfMonth = new Date(year, m, 0, 23, 59, 59, 999);

    const matchQuery = {
      userId: req.user._id,
      type: 'expense',
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };

    if (category !== 'Overall') {
      matchQuery.category = category;
    }

    const expenses = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const spentAmount = expenses.length > 0 ? expenses[0].total : 0;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month, category },
      {
        budgetAmount: Number(budgetAmount),
        spentAmount,
        alertThreshold: Number(alertThreshold),
      },
      { new: true, upsert: true, runValidators: true }
    );

    // If overall budget, also update user's profile monthlyBudget
    if (category === 'Overall') {
      req.user.monthlyBudget = Number(budgetAmount);
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Budget set successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

