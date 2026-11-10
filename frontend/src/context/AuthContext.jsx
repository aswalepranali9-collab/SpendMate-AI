import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('spendmate_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('spendmate_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const data = await authService.getProfile();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('spendmate_user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          if (localStorage.getItem('spendmate_demo_mode') !== 'true') {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('spendmate_token', data.token);
      localStorage.setItem('spendmate_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('spendmate_token', data.token);
      localStorage.setItem('spendmate_user', JSON.stringify(data.user));
    }
    return data;
  };

  const demoLogin = async () => {
    localStorage.setItem('spendmate_demo_mode', 'true');
    try {
      const data = await authService.demoLogin();
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('spendmate_token', data.token);
        localStorage.setItem('spendmate_user', JSON.stringify(data.user));
        return data;
      }
    } catch (err) {
      console.warn('Backend /auth/demo returned error; engaging local demo session fallback:', err);
    }

    // Direct fallback guarantee for 1-click preview
    const demoToken = 'demo-token-spendmate-live-preview';
    const demoUser = {
      id: 'demo-user-alex-morgan',
      name: 'Alex Morgan',
      email: 'alex.morgan@spendmate.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      currency: 'INR',
      currencySymbol: '₹',
      monthlyBudget: 70000,
      occupation: 'Senior Product Designer',
      isDemo: true,
    };
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem('spendmate_token', demoToken);
    localStorage.setItem('spendmate_user', JSON.stringify(demoUser));
    return { success: true, token: demoToken, user: demoUser };
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('spendmate_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('spendmate_token');
    localStorage.removeItem('spendmate_user');
    localStorage.removeItem('spendmate_demo_mode');
    localStorage.removeItem('spendmate_demo_txs');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        demoLogin,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

