import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow development frontend & production deployment
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoint (supports both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SpendMate AI Backend Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: req.app.get('dbReady') ? 'connected' : 'ready',
  });
});

// Mount API Routes (mount on both /api/path and /path for Vercel Serverless & local dev)
const routeConfigs = [
  { path: '/auth', router: authRoutes },
  { path: '/transactions', router: transactionRoutes },
  { path: '/budgets', router: budgetRoutes },
  { path: '/goals', router: goalRoutes },
  { path: '/analytics', router: analyticsRoutes },
  { path: '/ai', router: aiRoutes },
  { path: '/notifications', router: notificationRoutes },
];

routeConfigs.forEach(({ path, router }) => {
  app.use(`/api${path}`, router);
  app.use(path, router);
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start the HTTP listener when NOT running inside Vercel serverless functions
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 SpendMate AI Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;

