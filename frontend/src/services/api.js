import axios from 'axios';
import {
  MOCK_DEMO_USER,
  getMockDashboard,
  getMockCharts,
  getMockBudget,
  getMockGoals,
  getMockInsights,
  getMockNotifications,
  getStoredTransactions,
  saveStoredTransactions,
} from './mockDemoData';

/**
 * SpendMate AI Axios Client Configuration
 * Uses VITE_API_URL if configured (e.g. production hosting on Vercel/Render),
 * or defaults to '/api' which is proxied locally by Vite to http://localhost:5000.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spendmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Helper to handle demo mode simulated API responses
 */
const handleDemoFallback = (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  if (url.includes('/auth/me')) {
    return { data: { success: true, user: MOCK_DEMO_USER } };
  }
  if (url.includes('/auth/demo')) {
    return {
      data: {
        success: true,
        token: 'demo-token-spendmate-live-preview',
        user: MOCK_DEMO_USER,
      },
    };
  }
  if (url.includes('/analytics/dashboard')) {
    return { data: getMockDashboard() };
  }
  if (url.includes('/analytics/charts')) {
    return { data: getMockCharts() };
  }
  if (url.includes('/transactions')) {
    const txs = getStoredTransactions();
    if (method === 'get') {
      return { data: { success: true, count: txs.length, data: txs } };
    }
    if (method === 'post') {
      let body = {};
      try {
        body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
      } catch (e) {
        body = {};
      }
      const newTx = {
        _id: 'tx-' + Date.now(),
        type: body.type || 'expense',
        amount: Number(body.amount) || 0,
        category: body.category || 'Other',
        description: body.description || 'Transaction',
        date: body.date || new Date().toISOString(),
        paymentMethod: body.paymentMethod || 'UPI',
        createdAt: new Date().toISOString(),
      };
      const updated = [newTx, ...txs];
      saveStoredTransactions(updated);
      return { data: { success: true, data: newTx } };
    }
    if (method === 'delete') {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      const filtered = txs.filter((t) => t._id !== id);
      saveStoredTransactions(filtered);
      return { data: { success: true, message: 'Transaction deleted' } };
    }
  }
  if (url.includes('/budgets')) {
    return { data: getMockBudget() };
  }
  if (url.includes('/goals')) {
    return { data: getMockGoals() };
  }
  if (url.includes('/ai/insights')) {
    return { data: getMockInsights() };
  }
  if (url.includes('/ai/forecast')) {
    return {
      data: {
        success: true,
        data: {
          predictedExpense30Days: 61200,
          historicalDailyAverage: 1946,
          highRiskCategories: ['Food', 'Shopping'],
          confidence: 'High',
        },
      },
    };
  }
  if (url.includes('/ai/chat')) {
    let message = '';
    try {
      const parsed = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
      message = parsed.message || '';
    } catch (e) {
      // ignore
    }
    return {
      data: {
        success: true,
        reply: `Based on your recent financial trends, your monthly savings rate is healthy at 59.7%. Regarding "${message}": You currently have ₹11,600 unallocated in this month's budget. Channelling this toward your Emergency Fund will achieve your goal ahead of deadline!`,
      },
    };
  }
  if (url.includes('/notifications')) {
    return { data: getMockNotifications() };
  }

  return null;
};

// Intercept responses for auth expiration & demo mode fallback
api.interceptors.response.use(
  (response) => {
    // If backend returned HTML instead of JSON (due to SPA fallback rewrite on static host)
    if (
      typeof response.data === 'string' &&
      response.data.trim().startsWith('<!doctype html')
    ) {
      const fallback = handleDemoFallback(response.config);
      if (fallback) return fallback;
    }
    return response;
  },
  (error) => {
    const isDemoActive = localStorage.getItem('spendmate_demo_mode') === 'true';
    const isDemoEndpoint = error.config?.url?.includes('/auth/demo');
    const isMethodNotAllowedOrNotFound =
      error.response && (error.response.status === 404 || error.response.status === 405 || error.response.status === 503);
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK';

    // If in demo mode or testing demo endpoints and backend is unreachable, serve simulated response seamlessly
    if ((isDemoActive || isDemoEndpoint) && (isMethodNotAllowedOrNotFound || isNetworkError)) {
      const fallback = handleDemoFallback(error.config);
      if (fallback) return Promise.resolve(fallback);
    }

    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('spendmate_token');
        localStorage.removeItem('spendmate_user');
        localStorage.removeItem('spendmate_demo_mode');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
