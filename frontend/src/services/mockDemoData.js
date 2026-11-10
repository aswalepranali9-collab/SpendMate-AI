/**
 * SpendMate AI - Standalone Client-Side Mock Data Engine
 * Ensures 100% operational demo functionality on static preview environments (Vercel)
 * without requiring account registration or external database dependencies.
 */

export const MOCK_DEMO_USER = {
  id: 'demo-user-alex-morgan',
  name: 'Alex Morgan',
  email: 'alex.morgan@spendmate.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  currency: 'INR',
  currencySymbol: '₹',
  monthlyBudget: 70000,
  occupation: 'Senior Product Designer',
  isDemo: true,
  createdAt: '2026-01-15T10:00:00.000Z',
};

const INITIAL_TRANSACTIONS = [
  {
    _id: 'tx-001',
    type: 'income',
    amount: 125000,
    category: 'Salary',
    description: 'Tech Lead Monthly Salary',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Bank Transfer',
    tags: ['salary', 'primary'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-002',
    type: 'income',
    amount: 20000,
    category: 'Freelancing',
    description: 'Fintech Design Advisory Consulting',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    tags: ['freelance', 'consulting'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-003',
    type: 'expense',
    amount: 24000,
    category: 'Bills',
    description: 'Apartment Rent & Society Maintenance',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Bank Transfer',
    tags: ['housing', 'bills'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-004',
    type: 'expense',
    amount: 8500,
    category: 'Food',
    description: 'Organic Groceries & Weekly Pantry Stock',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Credit Card',
    tags: ['groceries', 'food'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-005',
    type: 'expense',
    amount: 4200,
    category: 'Travel',
    description: 'Fuel & Metro Smart Card Recharge',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    tags: ['commute'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-006',
    type: 'expense',
    amount: 6500,
    category: 'Shopping',
    description: 'Desk Accessories & Mechanical Keyboard',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Credit Card',
    tags: ['electronics'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-007',
    type: 'expense',
    amount: 3200,
    category: 'Entertainment',
    description: 'Streaming Subscriptions & IMAX Weekend',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Debit Card',
    tags: ['entertainment'],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'tx-008',
    type: 'expense',
    amount: 12000,
    category: 'Other',
    description: 'Mutual Fund SIP & Index Allocation',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Bank Transfer',
    tags: ['investments'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getStoredTransactions = () => {
  try {
    const raw = localStorage.getItem('spendmate_demo_txs');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  localStorage.setItem('spendmate_demo_txs', JSON.stringify(INITIAL_TRANSACTIONS));
  return INITIAL_TRANSACTIONS;
};

export const saveStoredTransactions = (txs) => {
  try {
    localStorage.setItem('spendmate_demo_txs', JSON.stringify(txs));
  } catch (e) {
    // ignore
  }
};

export const getMockDashboard = () => {
  const txs = getStoredTransactions();
  const income = txs.filter((t) => t.type === 'income').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const expense = txs.filter((t) => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const balance = income - expense;
  const savings = Math.max(0, balance);
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

  return {
    success: true,
    data: {
      totalIncome: income,
      totalExpenses: expense,
      balance,
      monthlySavings: savings,
      savingsRate: Number(savingsRate),
      financialHealthScore: 84,
      healthGrade: 'A',
      healthStatus: 'Excellent',
      healthPillars: {
        savingsRate: { score: 90, label: 'Savings Velocity', status: 'Optimal' },
        budgetDiscipline: { score: 85, label: 'Budget Discipline', status: 'Healthy' },
        debtToIncome: { score: 80, label: 'Debt/Obligation Ratio', status: 'Low' },
        emergencyFund: { score: 82, label: 'Emergency Readiness', status: 'Stable' },
      },
      recentTransactions: txs.slice(0, 5),
    },
  };
};

export const getMockCharts = () => {
  return {
    success: true,
    monthlyExpenseChart: [
      { month: 'Nov', income: 110000, expense: 52000, savings: 58000 },
      { month: 'Dec', income: 115000, expense: 61000, savings: 54000 },
      { month: 'Jan', income: 130000, expense: 54000, savings: 76000 },
      { month: 'Feb', income: 125000, expense: 49000, savings: 76000 },
      { month: 'Mar', income: 140000, expense: 55000, savings: 85000 },
      { month: 'Apr', income: 145000, expense: 58400, savings: 86600 },
    ],
    categoryBreakdown: [
      { name: 'Bills', value: 24000, percentage: 41, color: '#6366F1' },
      { name: 'Other (SIP)', value: 12000, percentage: 21, color: '#10B981' },
      { name: 'Food', value: 8500, percentage: 15, color: '#F59E0B' },
      { name: 'Shopping', value: 6500, percentage: 11, color: '#EC4899' },
      { name: 'Travel', value: 4200, percentage: 7, color: '#06B6D4' },
      { name: 'Entertainment', value: 3200, percentage: 5, color: '#8B5CF6' },
    ],
  };
};

export const getMockBudget = () => {
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  return {
    success: true,
    data: {
      _id: 'budget-current-month',
      month: currentMonth,
      budgetAmount: 70000,
      spentAmount: 58400,
      remainingAmount: 11600,
      utilizationPercentage: 83.4,
      isOverBudget: false,
      categories: [
        { category: 'Bills', allocated: 26000, spent: 24000 },
        { category: 'Food', allocated: 12000, spent: 8500 },
        { category: 'Shopping', allocated: 10000, spent: 6500 },
        { category: 'Travel', allocated: 6000, spent: 4200 },
        { category: 'Entertainment', allocated: 5000, spent: 3200 },
        { category: 'Other', allocated: 11000, spent: 12000 },
      ],
    },
  };
};

export const getMockGoals = () => {
  return {
    success: true,
    data: [
      {
        _id: 'goal-001',
        title: 'Emergency Safety Cushion',
        targetAmount: 200000,
        savedAmount: 150000,
        progressPercentage: 75,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Emergency',
        color: '#06B6D4',
      },
      {
        _id: 'goal-002',
        title: 'Tokyo & Kyoto Vacation',
        targetAmount: 120000,
        savedAmount: 85000,
        progressPercentage: 70.8,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Travel',
        color: '#6366F1',
      },
      {
        _id: 'goal-003',
        title: 'EV Long-Range Down Payment',
        targetAmount: 500000,
        savedAmount: 240000,
        progressPercentage: 48,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Vehicle',
        color: '#10B981',
      },
    ],
  };
};

export const getMockInsights = () => {
  return {
    success: true,
    data: [
      {
        _id: 'ins-001',
        type: 'opportunity',
        title: 'High Savings Velocity',
        insight:
          'Your savings rate is currently at 59.7% of total monthly inflows, outperforming the benchmark 50/30/20 guideline.',
        recommendation:
          'Consider channeling ₹15,000 from current liquid surplus into high-yield debt or index funds to beat inflation.',
        category: 'Savings',
        confidenceScore: 94,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'ins-002',
        type: 'warning',
        title: 'Food & Dining Trend Elevation',
        insight:
          'Food expenses grew by 18% over the past 30 days, primarily from mid-week dining deliveries.',
        recommendation:
          'Capping restaurant deliveries to 2 days/week could reclaim approx ₹3,200 monthly toward your Tokyo travel fund.',
        category: 'Food',
        confidenceScore: 88,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'ins-003',
        type: 'tip',
        title: 'Emergency Cushion Target Imminent',
        insight:
          'You are within 75% of your ₹2,00,000 Emergency Safety goal with only 3 months remaining.',
        recommendation:
          'At your current monthly trajectory of ₹16,600 allocation, you will hit this target 18 days ahead of schedule.',
        category: 'Goals',
        confidenceScore: 92,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
};

export const getMockNotifications = () => {
  return {
    success: true,
    data: [
      {
        _id: 'notif-001',
        type: 'budget',
        title: 'Monthly Budget Milestone',
        message: 'Your overall monthly budget has reached 83.4% utilization with 10 days remaining.',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'notif-002',
        type: 'goal',
        title: 'Savings Goal Update',
        message: 'Congratulations! Tokyo Vacation fund crossed 70% completion.',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
};
