import express from 'express';
import { body } from 'express-validator';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  suggestCategory,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(
    [
      body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
      body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
      body('description').trim().notEmpty().withMessage('Description is required'),
    ],
    validate,
    createTransaction
  );

router.post('/suggest-category', suggestCategory);

router
  .route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;

