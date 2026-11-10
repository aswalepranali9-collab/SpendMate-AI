import express from 'express';
import { body } from 'express-validator';
import {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBudgets)
  .post(
    [
      body('month').matches(/^\d{4}-\d{2}$/).withMessage('Month must be in YYYY-MM format'),
      body('budgetAmount').isFloat({ min: 1 }).withMessage('Budget amount must be positive'),
    ],
    validate,
    createOrUpdateBudget
  );

router.delete('/:id', deleteBudget);

export default router;

