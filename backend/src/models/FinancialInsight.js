import mongoose from 'mongoose';

const financialInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    insight: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['warning', 'tip', 'celebration', 'forecast', 'budget'],
      default: 'tip',
    },
    category: {
      type: String,
      default: 'General',
    },
    scoreImpact: {
      type: Number,
      default: 0,
    },
    month: {
      type: String, // e.g. "2026-11"
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

financialInsightSchema.index({ userId: 1, generatedAt: -1 });

const FinancialInsight = mongoose.model('FinancialInsight', financialInsightSchema);
export default FinancialInsight;

