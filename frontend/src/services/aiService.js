import api from './api';

export const aiService = {
  async getInsights() {
    const res = await api.get('/ai/insights');
    return res.data;
  },

  async getForecast() {
    const res = await api.get('/ai/forecast');
    return res.data;
  },

  async askAdvisor(question) {
    const res = await api.post('/ai/ask', { question });
    return res.data;
  },
};

