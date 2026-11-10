import express from 'express';
import {
  getDashboardSummary,
  getChartAnalytics,
  getMonthlyReport,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardSummary);
router.get('/charts', getChartAnalytics);
router.get('/report', getMonthlyReport);

export default router;

