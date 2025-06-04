import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rate-limiter.js';
import transactionRoute from './routes/transactions.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // built-in middleware for parsing JSON bodies
app.use(rateLimiter); // custom middleware for rate limiting

const PORT = process.env.PORT || 5001;

app.use('/api/transactions', transactionRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
