/**
 * SpendMate AI Financial Intelligence Engine
 * Provides spending habit analytics, forecast modeling, category detection,
 * and intelligent personalized financial recommendations.
 */

// Keyword lexicon for smart automatic categorization
const CATEGORY_KEYWORDS = {
  Food: ['swiggy', 'zomato', 'restaurant', 'cafe', 'starbucks', 'mcdonalds', 'kfc', 'groceries', 'supermarket', 'dinner', 'lunch', 'breakfast', 'coffee', 'pizza', 'burger', 'tea', 'vegetables', 'blinkit', 'zepto', 'instamart'],
  Shopping: ['amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'clothes', 'shoes', 'electronics', 'mall', 'store', 'apparel', 'fashion'],
  Travel: ['uber', 'ola', 'rapido', 'flight', 'indigo', 'air india', 'train', 'irctc', 'metro', 'bus', 'fuel', 'petrol', 'diesel', 'taxi', 'toll', 'parking'],
  Bills: ['electricity', 'water', 'gas', 'wifi', 'broadband', 'airtel', 'jio', 'phone bill', 'utility', 'recharge', 'maintenance', 'rent'],
  Healthcare: ['doctor', 'hospital', 'pharmacy', 'medicine', 'apollo', 'clinic', 'dentist', 'health', 'insurance', 'lab', 'checkup'],
  Education: ['course', 'udemy', 'coursera', 'books', 'tuition', 'school', 'college', 'exam', 'certification', 'training'],
  Entertainment: ['netflix', 'spotify', 'prime', 'cinema', 'pvr', 'movie', 'concert', 'gaming', 'steam', 'hotstar', 'theatre', 'club'],
  EMI: ['loan', 'emi', 'home loan', 'car loan', 'credit card payment', 'mortgage', 'finance'],
  Salary: ['salary', 'payroll', 'wages', 'stipend', 'bonus'],
  Freelancing: ['freelance', 'client', 'upwork', 'fiverr', 'contract', 'gig', 'consulting'],
  Investments: ['dividend', 'mutual fund', 'stocks', 'zerodha', 'groww', 'crypto', 'interest', 'fd', 'fixed deposit'],
  Business: ['revenue', 'sales', 'invoice', 'client payment', 'merchant', 'profit'],
};

/**
 * Smart automatic expense/income categorizer
 */
export const smartCategorize = (description) => {
  if (!description) return 'Other';
  const text = description.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        return category;
      }
    }
  }
  return 'Other';
};

/**
 * Predict next month's total spending and category breakdown based on historical trends
 */
export const predictNextMonthExpenses = (transactions = []) => {
  const expenseTx = transactions.filter((t) => t.type === 'expense');
  if (expenseTx.length === 0) {
    return {
      forecastAmount: 0,
      confidence: 'low',
      categoryForecast: [],
      trend: 'stable',
    };
  }

  // Group by category
  const categoryTotals = {};
  let totalSpent = 0;

  expenseTx.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    totalSpent += Number(t.amount);
  });

  // Calculate day span
  const dates = expenseTx.map((t) => new Date(t.date).getTime()).sort();
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];
  const daySpan = Math.max(1, Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24)));

  const dailyBurnRate = totalSpent / Math.max(daySpan, 7);
  const forecastedMonthly = Math.round(dailyBurnRate * 30);

  const categoryForecast = Object.entries(categoryTotals)
    .map(([cat, amt]) => ({
      category: cat,
      historicalTotal: amt,
      projectedShare: Math.round((amt / totalSpent) * 100),
      projectedAmount: Math.round((amt / totalSpent) * forecastedMonthly),
    }))
    .sort((a, b) => b.projectedAmount - a.projectedAmount);

  return {
    forecastAmount: forecastedMonthly,
    dailyBurnRate: Math.round(dailyBurnRate),
    confidence: daySpan >= 30 ? 'high' : daySpan >= 14 ? 'medium' : 'preliminary',
    categoryForecast,
    trend: forecastedMonthly > totalSpent ? 'increasing' : 'stable',
  };
};

/**
 * Core AI Advisory Engine: Computes detailed recommendations, spending anomalies,
 * 50/30/20 compliance, and savings potentials.
 */
export const generateFinancialInsights = async ({
  transactions = [],
  budget = null,
  goals = [],
  user = {},
}) => {
  const insights = [];
  const symbol = user?.currencySymbol || '₹';

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // 1. Group expenses by Category
  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];

  // 2. Anomaly & Top Expense Insights
  if (topCategory && totalExpense > 0) {
    const topPct = Math.round((topCategory[1] / totalExpense) * 100);
    if (topPct >= 35) {
      insights.push({
        type: 'warning',
        category: topCategory[0],
        insight: `High concentration detected in ${topCategory[0]} accounting for ${topPct}% of your total expenses (${symbol}${topCategory[1].toLocaleString()}).`,
        recommendation: `Consider capping your ${topCategory[0]} expense at ${symbol}${Math.round(topCategory[1] * 0.8).toLocaleString()} next month to unlock ${symbol}${Math.round(topCategory[1] * 0.2).toLocaleString()} in direct savings.`,
        scoreImpact: -5,
      });
    }
  }

  // 3. Food & Dining specific advice (Common fintech insight)
  const foodSpend = categoryMap['Food'] || 0;
  if (foodSpend > 0 && totalExpense > 0) {
    const foodPct = Math.round((foodSpend / totalExpense) * 100);
    if (foodPct > 20) {
      insights.push({
        type: 'tip',
        category: 'Food',
        insight: `Your food and dining expenses represent ${foodPct}% (${symbol}${foodSpend.toLocaleString()}) of your spending.`,
        recommendation: `Batch meal prepping and limiting takeaway deliveries to 2 days/week could save an estimated ${symbol}${Math.round(foodSpend * 0.25).toLocaleString()} each month.`,
        scoreImpact: 3,
      });
    }
  }

  // 4. Budget Utilization Insight
  if (budget && budget.budgetAmount > 0) {
    const utilization = (totalExpense / budget.budgetAmount) * 100;
    if (utilization > 100) {
      const overBy = totalExpense - budget.budgetAmount;
      insights.push({
        type: 'budget',
        category: 'Budget',
        insight: `You have exceeded your monthly budget by ${symbol}${overBy.toLocaleString()} (${Math.round(utilization)}% spent).`,
        recommendation: 'Pause non-essential shopping and leisure outings for the remainder of the billing cycle to avoid compounding debt.',
        scoreImpact: -10,
      });
    } else if (utilization >= 80) {
      const remaining = budget.budgetAmount - totalExpense;
      insights.push({
        type: 'warning',
        category: 'Budget',
        insight: `You've utilized ${Math.round(utilization)}% of your monthly budget. Remaining safe allowance: ${symbol}${remaining.toLocaleString()}.`,
        recommendation: 'Switch to cash or debit cards for everyday micro-purchases to prevent accidental overspending.',
        scoreImpact: -2,
      });
    } else {
      insights.push({
        type: 'celebration',
        category: 'Budget',
        insight: `Outstanding budget discipline! You are pacing comfortably at ${Math.round(utilization)}% of your allocated budget.`,
        recommendation: `Surplus funds (${symbol}${(budget.budgetAmount - totalExpense).toLocaleString()}) can be transferred toward your highest-priority savings goal.`,
        scoreImpact: 5,
      });
    }
  }

  // 5. 50/30/20 Rule Benchmark Analysis
  const needsCategories = ['Bills', 'Healthcare', 'EMI', 'Education', 'Food'];
  const wantsCategories = ['Shopping', 'Travel', 'Entertainment', 'Other'];

  const needsTotal = expenses
    .filter((t) => needsCategories.includes(t.category))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const wantsTotal = expenses
    .filter((t) => wantsCategories.includes(t.category))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (totalIncome > 0) {
    const needsPct = Math.round((needsTotal / totalIncome) * 100);
    const wantsPct = Math.round((wantsTotal / totalIncome) * 100);
    const savingsPct = Math.round(savingsRate);

    if (wantsPct > 35) {
      insights.push({
        type: 'warning',
        category: 'Lifestyle',
        insight: `50/30/20 Rule Deviation: Wants & Lifestyle expenses are currently at ${wantsPct}% (recommended standard is 30% max).`,
        recommendation: `Trimming subscription services and shopping by ${wantsPct - 30}% will bring your cash flow back to optimal financial health.`,
        scoreImpact: -4,
      });
    }

    if (savingsPct >= 20) {
      insights.push({
        type: 'celebration',
        category: 'Savings',
        insight: `Your monthly savings rate is ${savingsPct}%, successfully beating the gold standard 20% benchmark!`,
        recommendation: 'Consider allocating a portion of these surplus funds into index funds or high-yield deposits.',
        scoreImpact: 8,
      });
    } else if (savingsPct < 10 && savingsPct >= 0) {
      insights.push({
        type: 'tip',
        category: 'Savings',
        insight: `Your current savings rate is ${savingsPct}%, leaving little margin for unexpected emergencies.`,
        recommendation: `Try the "Pay Yourself First" method: automatically transfer 10% (${symbol}${Math.round(totalIncome * 0.1).toLocaleString()}) on salary credit day.`,
        scoreImpact: -3,
      });
    }
  }

  // 6. Savings Goals Momentum Insight
  if (goals.length > 0) {
    const pendingGoals = goals.filter((g) => !g.isCompleted && g.targetAmount > g.savedAmount);
    if (pendingGoals.length > 0) {
      const topGoal = pendingGoals[0];
      const gap = topGoal.targetAmount - topGoal.savedAmount;
      const daysLeft = Math.max(1, Math.ceil((new Date(topGoal.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
      const requiredDaily = Math.round(gap / daysLeft);

      insights.push({
        type: 'tip',
        category: 'Goal',
        insight: `Goal "${topGoal.title}" has ${symbol}${gap.toLocaleString()} remaining with ${daysLeft} days until the deadline.`,
        recommendation: `Saving ${symbol}${requiredDaily.toLocaleString()}/day or ${symbol}${requiredDaily * 7}/week will guarantee on-time completion!`,
        scoreImpact: 4,
      });
    }
  }

  // 7. Future Expense Forecast
  const forecast = predictNextMonthExpenses(transactions);
  if (forecast.forecastAmount > 0) {
    insights.push({
      type: 'forecast',
      category: 'Forecast',
      insight: `AI Forecast: At your current burn rate of ${symbol}${forecast.dailyBurnRate}/day, projected spending for the next 30 days is ${symbol}${forecast.forecastAmount.toLocaleString()}.`,
      recommendation: `Maintaining your daily average below ${symbol}${Math.round(forecast.dailyBurnRate * 0.9)} will save ${symbol}${Math.round(forecast.forecastAmount * 0.1).toLocaleString()} over the next month.`,
      scoreImpact: 2,
    });
  }

  // Optional: If Gemini API Key is configured in environment, invoke Gemini to enrich summary
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiSummary = await generateGeminiAdvisory({
        totalIncome,
        totalExpense,
        symbol,
        topCategory,
        insights,
      });
      if (geminiSummary) {
        insights.unshift({
          type: 'tip',
          category: 'AI Advisory',
          insight: 'Personalized AI Summary: ' + geminiSummary.summary,
          recommendation: geminiSummary.recommendation,
          scoreImpact: 5,
        });
      }
    } catch (e) {
      console.warn('Gemini enrichment skipped (fallback active):', e.message);
    }
  }

  return {
    insights,
    forecast,
    metrics: {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate: Math.round(savingsRate),
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    },
  };
};

/**
 * Call Gemini Live API if key is present
 */
const generateGeminiAdvisory = async ({ totalIncome, totalExpense, symbol, topCategory, insights }) => {
  // Graceful Gemini API call implementation
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const prompt = `You are SpendMate AI, a world-class personal finance expert.
Analyze this user's monthly financial summary:
- Total Income: ${symbol}${totalIncome}
- Total Expense: ${symbol}${totalExpense}
- Top Expense Category: ${topCategory ? `${topCategory[0]} (${symbol}${topCategory[1]})` : 'N/A'}
- Existing rule signals: ${JSON.stringify(insights.map((i) => i.insight))}

Respond in valid JSON only with keys "summary" (max 2 sentences) and "recommendation" (max 2 sentences actionable advice).`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return null;
};

