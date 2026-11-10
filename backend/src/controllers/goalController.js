import SavingsGoal from '../models/SavingsGoal.js';
import Notification from '../models/Notification.js';

// @desc    Get all savings goals with progress metrics
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user._id }).sort({ deadline: 1 });

    const enrichedGoals = goals.map((goal) => {
      const completionPercentage = Math.min(
        100,
        Math.round((goal.savedAmount / goal.targetAmount) * 100)
      );
      const remainingAmount = Math.max(0, goal.targetAmount - goal.savedAmount);

      const today = new Date();
      const targetDate = new Date(goal.deadline);
      const diffTime = targetDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        _id: goal._id,
        title: goal.title,
        targetAmount: goal.targetAmount,
        savedAmount: goal.savedAmount,
        remainingAmount,
        completionPercentage,
        deadline: goal.deadline,
        daysLeft,
        isOverdue: daysLeft < 0 && !goal.isCompleted,
        category: goal.category,
        color: goal.color,
        isCompleted: goal.isCompleted || goal.savedAmount >= goal.targetAmount,
        createdAt: goal.createdAt,
      };
    });

    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSaved = goals.reduce((acc, g) => acc + g.savedAmount, 0);

    res.json({
      success: true,
      count: goals.length,
      metrics: {
        totalTarget,
        totalSaved,
        overallProgress: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
      },
      goals: enrichedGoals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new savings goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount = 0, deadline, category, color } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, target amount, and deadline',
      });
    }

    const goal = await SavingsGoal.create({
      userId: req.user._id,
      title,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount),
      deadline: new Date(deadline),
      category: category || 'Emergency Fund',
      color: color || '#10B981',
      isCompleted: Number(savedAmount) >= Number(targetAmount),
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add deposit / contribution to a goal
// @route   POST /api/goals/:id/deposit
// @access  Private
export const depositToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const depositAmt = Number(amount);

    if (!depositAmt || depositAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid deposit amount' });
    }

    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.savedAmount += depositAmt;
    if (goal.savedAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      // Send celebration notification
      await Notification.create({
        userId: req.user._id,
        title: '🎉 Goal Achieved!',
        message: `Congratulations! You have reached your savings goal: "${goal.title}"!`,
        type: 'goal',
        actionLink: '/goals',
      });
    }

    await goal.save();

    res.json({
      success: true,
      message: `Successfully contributed ${depositAmt} to ${goal.title}`,
      goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a savings goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const { title, targetAmount, savedAmount, deadline, category, color, isCompleted } = req.body;

    if (title) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (savedAmount !== undefined) goal.savedAmount = Number(savedAmount);
    if (deadline) goal.deadline = new Date(deadline);
    if (category) goal.category = category;
    if (color) goal.color = color;
    if (isCompleted !== undefined) goal.isCompleted = Boolean(isCompleted);

    if (goal.savedAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();

    res.json({
      success: true,
      message: 'Goal updated successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Savings goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

