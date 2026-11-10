import api from './api';

export const transactionService = {
  async getTransactions(params = {}) {
    const res = await api.get('/transactions', { params });
    return res.data;
  },

  async getTransactionById(id) {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },

  async createTransaction(transactionData) {
    const res = await api.post('/transactions', transactionData);
    return res.data;
  },

  async updateTransaction(id, transactionData) {
    const res = await api.put(`/transactions/${id}`, transactionData);
    return res.data;
  },

  async deleteTransaction(id) {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },

  async suggestCategory(description) {
    const res = await api.post('/transactions/suggest-category', { description });
    return res.data;
  },
};

