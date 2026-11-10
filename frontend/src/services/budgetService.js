import api from './api';

export const budgetService = {
  async getBudgets(month) {
    const res = await api.get('/budgets', { params: { month } });
    return res.data;
  },

  async createOrUpdateBudget(budgetData) {
    const res = await api.post('/budgets', budgetData);
    return res.data;
  },

  async deleteBudget(id) {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },
};

