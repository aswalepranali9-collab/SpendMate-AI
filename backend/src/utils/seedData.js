import mongoose from 'mongoose';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import Notification from '../models/Notification.js';

export const seedSampleUserData = async (userId) => {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Helper date generators relative to today
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  // 1. Transactions
  const sampleTransactions = [
    // Incomes
    {
      userId,
      type: 'income',
      amount: 115000,
      category: 'Salary',
      description: 'Monthly Tech Lead Salary credit',
      date: daysAgo(6),
      paymentMethod: 'Bank Transfer',
    },
    {
      userId,
      type: 'income',
      amount: 28500,
      category: 'Freelancing',
      description: 'Fintech Mobile UI Design milestone payout',
      date: daysAgo(14),
      paymentMethod: 'Bank Transfer',
    },
    {
      userId,
      type: 'income',
      amount: 6200,
      category: 'Investments',
      description: 'Q3 Mutual Fund dividend distribution',
      date: daysAgo(21),
      paymentMethod: 'Net Banking',
    },
    // Expenses
    {
      userId,
      type: 'expense',
      amount: 28000,
      category: 'Bills',
      description: 'Luxury Apartment Rent & Society Maintenance',
      date: daysAgo(5),
      paymentMethod: 'Net Banking',
    },
    {
      userId,
      type: 'expense',
      amount: 4250,
      category: 'Bills',
      description: 'High-speed Fiber Broadband & Power Bill',
      date: daysAgo(8),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 1450,
      category: 'Food',
      description: 'Weekend Italian dinner at Olive Bistro',
      date: daysAgo(1),
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: 820,
      category: 'Food',
      description: 'Swiggy Gourmet bowl & smoothie delivery',
      date: daysAgo(2),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 3200,
      category: 'Food',
      description: 'Weekly organic groceries from Nature Basket',
      date: daysAgo(4),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 680,
      category: 'Food',
      description: 'Blue Tokai Specialty Coffee & Croissant',
      date: daysAgo(7),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 8499,
      category: 'Shopping',
      description: 'Sony WH-1000XM5 ANC Headphones (Amazon Sale)',
      date: daysAgo(9),
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: 3200,
      category: 'Shopping',
      description: 'Zara linen shirts & tailored trousers',
      date: daysAgo(16),
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: 1850,
      category: 'Travel',
      description: 'Uber Premier ride to Airport Terminal 2',
      date: daysAgo(3),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 2500,
      category: 'Travel',
      description: 'Monthly shell petrol refuel for car',
      date: daysAgo(11),
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: 1200,
      category: 'Healthcare',
      description: 'Annual dental checkup and polishing',
      date: daysAgo(13),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 699,
      category: 'Entertainment',
      description: 'Netflix 4K Premium Monthly Subscription',
      date: daysAgo(10),
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: 1199,
      category: 'Entertainment',
      description: 'IMAX Oppenheimer tickets with friends',
      date: daysAgo(17),
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: 3499,
      category: 'Education',
      description: 'Advanced Cloud Architecture Certification Exam',
      date: daysAgo(19),
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: 7500,
      category: 'EMI',
      description: 'MacBook Pro Zero-Cost EMI Instalment',
      date: daysAgo(6),
      paymentMethod: 'Net Banking',
    },
  ];

  await Transaction.deleteMany({ userId });
  await Transaction.insertMany(sampleTransactions);

  // 2. Budgets
  await Budget.deleteMany({ userId });
  await Budget.create([
    {
      userId,
      month: currentMonthStr,
      category: 'Overall',
      budgetAmount: 70000,
      spentAmount: 65147,
      alertThreshold: 80,
    },
    {
      userId,
      month: currentMonthStr,
      category: 'Food',
      budgetAmount: 12000,
      spentAmount: 6150,
      alertThreshold: 80,
    },
    {
      userId,
      month: currentMonthStr,
      category: 'Shopping',
      budgetAmount: 15000,
      spentAmount: 11699,
      alertThreshold: 80,
    },
  ]);

  // 3. Savings Goals
  await SavingsGoal.deleteMany({ userId });
  await SavingsGoal.create([
    {
      userId,
      title: '6-Month Emergency Shield',
      targetAmount: 350000,
      savedAmount: 245000,
      deadline: new Date(now.getFullYear(), now.getMonth() + 4, 15),
      category: 'Emergency Fund',
      color: '#10B981', // Emerald
      isCompleted: false,
    },
    {
      userId,
      title: 'Tokyo Spring Vacation 2027',
      targetAmount: 200000,
      savedAmount: 140000,
      deadline: new Date(now.getFullYear() + 1, 3, 20),
      category: 'Vacation',
      color: '#3B82F6', // Blue
      isCompleted: false,
    },
    {
      userId,
      title: 'M3 Max Studio Workstation',
      targetAmount: 280000,
      savedAmount: 280000,
      deadline: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      category: 'Gadget',
      color: '#8B5CF6', // Purple
      isCompleted: true,
    },
  ]);

  // 4. Notifications
  await Notification.deleteMany({ userId });
  await Notification.create([
    {
      userId,
      title: '💡 AI Saving Opportunity',
      message: 'Your dining expenses dropped 14% compared to last week! You saved ₹2,300.',
      type: 'tip',
      read: false,
      actionLink: '/ai-advisor',
    },
    {
      userId,
      title: '🎯 Milestone Reached',
      message: 'You have completed 70% of your Tokyo Spring Vacation savings goal!',
      type: 'goal',
      read: false,
      actionLink: '/goals',
    },
    {
      userId,
      title: '📊 Monthly Report Ready',
      message: 'Your October Financial Health Score was 84/100 (Good). Review your report.',
      type: 'report',
      read: true,
      actionLink: '/reports',
    },
  ]);

  console.log(`✅ Sample data successfully seeded for user ${userId}`);
};

// Standalone seed script execution
const runStandaloneSeed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendmate_ai';
  await mongoose.connect(uri);

  let demoUser = await User.findOne({ email: 'alex.morgan@spendmate.ai' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'alex.morgan@spendmate.ai',
      password: 'Password123!',
      currency: 'INR',
      currencySymbol: '₹',
      monthlyBudget: 70000,
      occupation: 'Tech Lead & Designer',
    });
  }

  await seedSampleUserData(demoUser._id);
  console.log('🎉 Standalone seeding completed successfully!');
  process.exit(0);
};

if (process.argv[1]?.endsWith('seedData.js')) {
  runStandaloneSeed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

