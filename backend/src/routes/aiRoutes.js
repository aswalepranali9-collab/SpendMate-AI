import express from 'express';
import { body } from 'express-validator';
import {
  getAIInsights,
  getForecast,
  askAIAdvisor,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/insights', getAIInsights);
router.get('/forecast', getForecast);
router.post(
  '/ask',
  [body('question').trim().notEmpty().withMessage('Question cannot be empty')],
  validate,
  askAIAdvisor
);

export default router;

