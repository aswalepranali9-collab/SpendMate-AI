import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../backend/src/config/db.js';
import { notFound, errorHandler } from '../backend/src/middleware/errorMiddleware.js';
import authRoutes from '../backend/src/routes/authRoutes.js';
import transactionRoutes from '../backend/src/routes/transactionRoutes.js';
import budgetRoutes from '../backend/src/routes/budgetRoutes.js';
import goalRoutes from '../backend/src/routes/goalRoutes.js';
import analyticsRoutes from '../backend/src/routes/analyticsRoutes.js';
import aiRoutes from '../backend/src/routes/aiRoutes.js';
import notificationRoutes from '../backend/src/routes/notificationRoutes.js';

dotenv.config();

// Singleton app — reuse across serverless invocations
let app;
let dbInitialized = false;

const createApp = () => {
  const a = express();
  a.use(cors({ origin: '*', credentials: true }));
  a.use(express.json());
  a.use(express.urlencoded({ extended: true }));

  a.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'SpendMate AI Backend',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  a.use('/api/auth', authRoutes);
  a.use('/api/transactions', transactionRoutes);
  a.use('/api/budgets', budgetRoutes);
  a.use('/api/goals', goalRoutes);
  a.use('/api/analytics', analyticsRoutes);
  a.use('/api/ai', aiRoutes);
  a.use('/api/notifications', notificationRoutes);

  a.use(notFound);
  a.use(errorHandler);
  return a;
};

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (err) {
      console.error('DB connection error:', err.message);
    }
  }
  if (!app) {
    app = createApp();
  }
  return app(req, res);
}
