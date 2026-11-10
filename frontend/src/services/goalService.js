import api from './api';

export const goalService = {
  async getGoals() {
    const res = await api.get('/goals');
    return res.data;
  },

  async createGoal(goalData) {
    const res = await api.post('/goals', goalData);
    return res.data;
  },

  async depositToGoal(id, amount) {
    const res = await api.post(`/goals/${id}/deposit`, { amount });
    return res.data;
  },

  async updateGoal(id, goalData) {
    const res = await api.put(`/goals/${id}`, goalData);
    return res.data;
  },

  async deleteGoal(id) {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
  },
};

