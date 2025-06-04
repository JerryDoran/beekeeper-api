import express from 'express';

import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  getTransactionSummaryByUserId,
} from '../controllers/transactions-controller.js';

const router = express.Router();

// All middleware functions run before the route handlers
// This is where you can add authentication, logging, etc.
// For example, you can add a rate limiter here if needed
// The rate limiter is already applied in server.js

router.get('/:userId', getTransactionsByUserId);

router.post('/', createTransaction);

router.delete('/:id', deleteTransaction);

router.get('/summary/:userId', getTransactionSummaryByUserId);

export default router;
