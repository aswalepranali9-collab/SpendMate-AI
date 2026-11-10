import api from './api';

export const analyticsService = {
  async getDashboard() {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  async getCharts() {
    const res = await api.get('/analytics/charts');
    return res.data;
  },

  async getReport(month) {
    const res = await api.get('/analytics/report', { params: { month } });
    return res.data;
  },
};

