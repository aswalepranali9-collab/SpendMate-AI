/**
 * Calculates a comprehensive Financial Health Score (0 - 100)
 * based on savings rate, budget discipline, discretionary spending ratio, and goal progress.
 */
export const calculateFinancialHealthScore = ({
  totalIncome,
  totalExpense,
  budgetAmount,
  totalSpentInBudget,
  goals = [],
  discretionaryExpenses = 0,
}) => {
  let score = 0;
  const breakdown = {};

  // 1. Savings Rate Pillar (Max 35 points)
  let savingsRate = 0;
  if (totalIncome > 0) {
    savingsRate = Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100);
  }

  let savingsScore = 0;
  if (savingsRate >= 35) {
    savingsScore = 35;
  } else if (savingsRate >= 20) {
    savingsScore = 26;
  } else if (savingsRate >= 10) {
    savingsScore = 18;
  } else if (savingsRate > 0) {
    savingsScore = 10;
  } else {
    savingsScore = 0; // Overspending or zero income
  }
  score += savingsScore;
  breakdown.savingsRate = {
    percentage: Math.round(savingsRate),
    score: savingsScore,
    maxScore: 35,
    status: savingsRate >= 20 ? 'Optimal' : savingsRate > 0 ? 'Moderate' : 'Critical',
  };

  // 2. Budget Discipline Pillar (Max 25 points)
  let budgetScore = 15; // default if no budget set
  let budgetUtilization = 0;

  if (budgetAmount > 0) {
    budgetUtilization = (totalSpentInBudget / budgetAmount) * 100;
    if (budgetUtilization <= 75) {
      budgetScore = 25;
    } else if (budgetUtilization <= 90) {
      budgetScore = 20;
    } else if (budgetUtilization <= 100) {
      budgetScore = 15;
    } else if (budgetUtilization <= 115) {
      budgetScore = 8;
    } else {
      budgetScore = 0;
    }
  }
  score += budgetScore;
  breakdown.budgetDiscipline = {
    utilization: Math.round(budgetUtilization),
    score: budgetScore,
    maxScore: 25,
    status: budgetScore >= 20 ? 'Excellent' : budgetScore >= 12 ? 'Fair' : 'Overbudget',
  };

  // 3. Discretionary Spending Control (Max 20 points)
  // Essential vs Non-essential: Entertainment, Shopping
  let discretionaryRatio = 0;
  let discretionaryScore = 15;

  if (totalExpense > 0) {
    discretionaryRatio = (discretionaryExpenses / totalExpense) * 100;
    if (discretionaryRatio <= 25) {
      discretionaryScore = 20;
    } else if (discretionaryRatio <= 40) {
      discretionaryScore = 15;
    } else if (discretionaryRatio <= 55) {
      discretionaryScore = 10;
    } else {
      discretionaryScore = 4;
    }
  }
  score += discretionaryScore;
  breakdown.discretionaryControl = {
    ratio: Math.round(discretionaryRatio),
    score: discretionaryScore,
    maxScore: 20,
    status: discretionaryRatio <= 30 ? 'Controlled' : 'High Lifestyle Creep',
  };

  // 4. Savings Goals Progress (Max 20 points)
  let goalsScore = 10;
  let avgGoalCompletion = 0;

  if (goals.length > 0) {
    const totalCompletion = goals.reduce((acc, goal) => {
      const pct = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
      return acc + Math.min(100, pct);
    }, 0);
    avgGoalCompletion = totalCompletion / goals.length;

    if (avgGoalCompletion >= 70) {
      goalsScore = 20;
    } else if (avgGoalCompletion >= 40) {
      goalsScore = 15;
    } else if (avgGoalCompletion >= 15) {
      goalsScore = 10;
    } else {
      goalsScore = 5;
    }
  }
  score += goalsScore;
  breakdown.goalsMomentum = {
    avgCompletion: Math.round(avgGoalCompletion),
    activeGoalsCount: goals.length,
    score: goalsScore,
    maxScore: 20,
    status: avgGoalCompletion >= 50 ? 'Strong' : 'In Progress',
  };

  // Final Grade and Title
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  let grade = 'Fair';
  let badgeColor = '#F59E0B'; // Amber
  let summary = 'Your finances are steady, but there are key opportunities to boost your savings rate.';

  if (finalScore >= 85) {
    grade = 'Excellent';
    badgeColor = '#10B981'; // Emerald
    summary = 'Superb financial discipline! You have robust savings, controlled expenses, and high goal momentum.';
  } else if (finalScore >= 70) {
    grade = 'Good';
    badgeColor = '#3B82F6'; // Blue
    summary = 'Solid financial balance. Keep controlling discretionary spending to hit top tier.';
  } else if (finalScore >= 50) {
    grade = 'Fair';
    badgeColor = '#F59E0B'; // Amber
    summary = 'Moderate financial stability. Review your top expense categories to curb leaks.';
  } else {
    grade = 'Needs Attention';
    badgeColor = '#EF4444'; // Red
    summary = 'High burn rate or low savings buffer detected. Immediate budget recalibration advised.';
  }

  return {
    score: finalScore,
    grade,
    badgeColor,
    summary,
    breakdown,
  };
};

