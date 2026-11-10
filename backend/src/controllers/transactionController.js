import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Notification from '../models/Notification.js';
import { smartCategorize } from '../utils/aiEngine.js';

// Helper to recalculate budget spent amount for a specific month
const updateBudgetSpent = async (userId, date) => {
  try {
    const txDate = new Date(date);
    const monthStr = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;

    const startOfMonth = new Date(txDate.getFullYear(), txDate.getMonth(), 1);
    const endOfMonth = new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalSpent = expenses.length > 0 ? expenses[0].total : 0;

    // Update overall budget for that month
    const budget = await Budget.findOne({ userId, month: monthStr, category: 'Overall' });
    if (budget) {
      budget.spentAmount = totalSpent;
      await budget.save();

      // Check alert thresholds
      const utilization = (totalSpent / budget.budgetAmount) * 100;
      if (utilization >= 100) {
        await Notification.create({
          userId,
          title: '🚨 Budget Exceeded!',
          message: `You have spent ₹${totalSpent.toLocaleString()} which exceeds your ₹${budget.budgetAmount.toLocaleString()} monthly budget!`,
          type: 'budget',
          actionLink: '/budgets',
        });
      } else if (utilization >= budget.alertThreshold) {
        await Notification.create({
          userId,
          title: '⚠️ Budget Warning',
          message: `You've utilized ${Math.round(utilization)}% of your monthly budget. Watch your expenses!`,
          type: 'budget',
          actionLink: '/budgets',
        });
      }
    }
  } catch (err) {
    console.error('Error updating budget spent amount:', err.message);
  }
};

// @desc    Get all transactions with search, filter, sort & pagination
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = { userId: req.user._id };

    // Search by description
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Filter by type (income/expense)
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    const sort = {};
    const sortField = ['date', 'amount', 'category'].includes(sortBy) ? sortBy : 'date';
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Calculate aggregated summary for the filtered transactions
    const summaryAgg = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summaryAgg.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    res.json({
      success: true,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
      },
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new transaction (Income or Expense)
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    let { type, amount, category, description, date, paymentMethod, isRecurring } = req.body;

    if (!type || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, amount, and description',
      });
    }

    // Smart categorization fallback if category is not provided or set to 'Other'
    if (!category || category === 'Other') {
      const suggested = smartCategorize(description);
      if (suggested && suggested !== 'Other') {
        category = suggested;
      } else {
        category = category || (type === 'income' ? 'Salary' : 'Food');
      }
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: Number(amount),
      category,
      description,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI',
      isRecurring: Boolean(isRecurring),
    });

    // Update budget if expense
    if (type === 'expense') {
      await updateBudgetSpent(req.user._id, transaction.date);
    }

    res.status(201).json({
      success: true,
      message: `${type === 'income' ? 'Income' : 'Expense'} recorded successfully`,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const { type, amount, category, description, date, paymentMethod, isRecurring } = req.body;

    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = new Date(date);
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (isRecurring !== undefined) transaction.isRecurring = Boolean(isRecurring);

    const updated = await transaction.save();

    // Recalculate budget spent
    await updateBudgetSpent(req.user._id, updated.date);

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Recalculate budget spent
    if (transaction.type === 'expense') {
      await updateBudgetSpent(req.user._id, transaction.date);
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Smart Category Suggestion from Note
// @route   POST /api/transactions/suggest-category
// @access  Private
export const suggestCategory = async (req, res) => {
  try {
    const { description } = req.body;
    const category = smartCategorize(description);
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

