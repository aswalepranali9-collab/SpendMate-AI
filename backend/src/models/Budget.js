import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true, // Format: "YYYY-MM"
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
    category: {
      type: String,
      default: 'Overall',
      trim: true,
    },
    budgetAmount: {
      type: Number,
      required: [true, 'Please specify the budget amount'],
      min: [1, 'Budget amount must be positive'],
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert percentage (e.g. 80%)
      min: 1,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// One budget per user, month, and category
budgetSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;

