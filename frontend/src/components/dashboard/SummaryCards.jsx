import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const SummaryCards = ({ data, symbol = '₹' }) => {
  const {
    totalIncome = 0,
    totalExpense = 0,
    currentBalance = 0,
    monthSavings = 0,
    savingsRate = 0,
    monthIncome = 0,
    monthExpense = 0,
  } = data || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Income */}
      <StatCard
        title="Total Income"
        amount={totalIncome}
        symbol={symbol}
        subtitle={`This month: ${symbol}${monthIncome.toLocaleString()}`}
        trend="+12% MoM"
        trendType="up"
        icon={TrendingUp}
        variant="emerald"
      />

      {/* Total Expenses */}
      <StatCard
        title="Total Expenses"
        amount={totalExpense}
        symbol={symbol}
        subtitle={`This month: ${symbol}${monthExpense.toLocaleString()}`}
        trend={monthExpense > monthIncome ? 'High Burn' : 'On track'}
        trendType={monthExpense > monthIncome ? 'down' : 'up'}
        icon={TrendingDown}
        variant="rose"
      />

      {/* Current Net Balance */}
      <StatCard
        title="Net Balance"
        amount={currentBalance}
        symbol={symbol}
        subtitle="Cash Flow Available"
        trend="Liquid Assets"
        trendType="up"
        icon={Wallet}
        variant="indigo"
      />

      {/* Monthly Savings */}
      <StatCard
        title="Monthly Savings"
        amount={monthSavings}
        symbol={symbol}
        subtitle={`Savings Rate: ${savingsRate}%`}
        trend={`${savingsRate}% Rate`}
        trendType={savingsRate >= 20 ? 'up' : 'down'}
        icon={PiggyBank}
        variant="cyan"
      />
    </div>
  );
};

