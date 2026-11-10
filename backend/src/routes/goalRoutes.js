import express from 'express';
import { body } from 'express-validator';
import {
  getGoals,
  createGoal,
  depositToGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getGoals)
  .post(
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('targetAmount').isFloat({ min: 1 }).withMessage('Target amount must be at least 1'),
      body('deadline').notEmpty().withMessage('Deadline is required'),
    ],
    validate,
    createGoal
  );

router.post('/:id/deposit', depositToGoal);

router
  .route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

export default router;

