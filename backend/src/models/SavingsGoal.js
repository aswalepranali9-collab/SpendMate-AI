import mongoose from 'mongoose';

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter a goal title'],
      trim: true,
      maxlength: [60, 'Title cannot exceed 60 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please enter a target amount'],
      min: [1, 'Target amount must be at least 1'],
    },
    savedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify a target completion date'],
    },
    category: {
      type: String,
      enum: ['Emergency Fund', 'Vacation', 'Gadget', 'Vehicle', 'Real Estate', 'Wedding', 'Education', 'Investment', 'Other'],
      default: 'Emergency Fund',
    },
    color: {
      type: String,
      default: '#10B981', // Emerald green
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.index({ userId: 1, deadline: 1 });

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);
export default SavingsGoal;

