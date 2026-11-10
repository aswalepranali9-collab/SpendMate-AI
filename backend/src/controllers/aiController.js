import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import FinancialInsight from '../models/FinancialInsight.js';
import { generateFinancialInsights, predictNextMonthExpenses } from '../utils/aiEngine.js';

// @desc    Generate or retrieve latest AI Financial Insights & Recommendations
// @route   GET /api/ai/insights
// @access  Private
export const getAIInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user context
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(200);

    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const budget = await Budget.findOne({ userId, month: monthStr, category: 'Overall' });
    const goals = await SavingsGoal.find({ userId });

    // Generate intelligent insights
    const analysis = await generateFinancialInsights({
      transactions,
      budget,
      goals,
      user: req.user,
    });

    // Optionally persist top insights to FinancialInsight collection
    if (analysis.insights.length > 0) {
      const insightDocs = analysis.insights.slice(0, 5).map((item) => ({
        userId,
        insight: item.insight,
        recommendation: item.recommendation,
        type: item.type,
        category: item.category,
        scoreImpact: item.scoreImpact,
        month: monthStr,
      }));

      // Non-blocking async insert
      FinancialInsight.insertMany(insightDocs).catch(() => {});
    }

    res.json({
      success: true,
      insights: analysis.insights,
      forecast: analysis.forecast,
      metrics: analysis.metrics,
      generatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get future expense forecast & savings prediction
// @route   GET /api/ai/forecast
// @access  Private
export const getForecast = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    const forecast = predictNextMonthExpenses(transactions);

    res.json({
      success: true,
      forecast,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Interactive AI Advisor Chat / Question Answering
// @route   POST /api/ai/ask
// @access  Private
export const askAIAdvisor = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Please enter a question' });
    }

    const userId = req.user._id;
    const symbol = req.user.currencySymbol || '₹';

    // Fetch current user financial context
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(100);
    const goals = await SavingsGoal.find({ userId });

    let income = 0;
    let expense = 0;
    const catMap = {};

    transactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else {
        expense += t.amount;
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });

    const netSavings = income - expense;
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCats[0] ? sortedCats[0] : ['None', 0];

    // If Gemini key is present, answer via live LLM with context
    if (process.env.GEMINI_API_KEY) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const prompt = `You are SpendMate AI, a friendly, encouraging, and highly analytical financial advisor.
User Financial Profile:
- Total Income: ${symbol}${income}
- Total Expense: ${symbol}${expense}
- Net Balance: ${symbol}${netSavings}
- Top Category: ${topCat[0]} (${symbol}${topCat[1]})
- Active Savings Goals: ${goals.map((g) => `${g.title} (${symbol}${g.savedAmount}/${symbol}${g.targetAmount})`).join(', ') || 'None'}

User Question: "${question}"

Provide a concise, practical, 2-3 paragraph answer with bullet points highlighting exact numbers and actionable recommendations.`;

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return res.json({ success: true, answer: reply, source: 'gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini chat fallback:', err.message);
      }
    }

    // Heuristic Contextual Intelligent Advisor Fallback
    const qLower = question.toLowerCase();
    let answer = '';

    if (qLower.includes('cut') || qLower.includes('save') || qLower.includes('reduce')) {
      answer = `Based on your recent transactions, your single largest expense area is **${topCat[0]}**, totaling **${symbol}${topCat[1].toLocaleString()}** (${expense > 0 ? Math.round((topCat[1] / expense) * 100) : 0}% of all expenses).

**Actionable Steps:**
1. **Target 15% Reduction**: Aim to trim ${topCat[0]} by just 15%, which will instantly free up **${symbol}${Math.round(topCat[1] * 0.15).toLocaleString()}** this month.
2. **Review Discretionary Outflows**: Examine minor shopping and entertainment purchases from the past 2 weeks.
3. **Automate Savings**: Set a scheduled sweep into your savings goals right after salary credits.`;
    } else if (qLower.includes('afford') || qLower.includes('buy') || qLower.includes('purchase')) {
      const matchNumber = question.match(/\d+[\d,]*/);
      const targetCost = matchNumber ? parseInt(matchNumber[0].replace(/,/g, ''), 10) : 10000;

      if (netSavings >= targetCost * 1.5) {
        answer = `Yes! With your current balance and positive cash flow of **${symbol}${netSavings.toLocaleString()}**, you can comfortably afford this purchase without compromising your cash reserves.

**Recommendation:** Ensure you keep an emergency buffer of at least 3 months' expenses (${symbol}${Math.round((expense / 2) * 3).toLocaleString()}) untouched.`;
      } else {
        answer = `Caution recommended. This purchase of **${symbol}${targetCost.toLocaleString()}** represents a significant portion of your net savings (**${symbol}${netSavings.toLocaleString()}**).

**Recommendation:** Instead of an outright splurge, create a dedicated Savings Goal in SpendMate AI titled for this item and contribute **${symbol}${Math.round(targetCost / 3).toLocaleString()}** per month over the next 3 months.`;
      }
    } else if (qLower.includes('emergency') || qLower.includes('buffer')) {
      const recommendedEmergency = Math.round(expense * 3);
      answer = `A standard prudent safety net requires **3 to 6 months of living expenses**.

- Your average monthly spend: **${symbol}${expense.toLocaleString()}**
- Recommended 3-Month Emergency Fund: **${symbol}${recommendedEmergency.toLocaleString()}**
- Status: ${netSavings >= recommendedEmergency ? '✅ You are safely covered!' : `⚠️ You have a gap of approximately ${symbol}${Math.max(0, recommendedEmergency - netSavings).toLocaleString()}.`}`;
    } else {
      answer = `Here is your current financial snapshot:
- **Net Balance**: ${symbol}${netSavings.toLocaleString()}
- **Top Outflow**: ${topCat[0]} (${symbol}${topCat[1].toLocaleString()})
- **Active Goals**: ${goals.length} target(s)

To improve your financial momentum, focus on maintaining a savings rate of at least 20% and reviewing your weekly variable expenses.`;
    }

    res.json({
      success: true,
      answer,
      source: 'smart-heuristic',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

