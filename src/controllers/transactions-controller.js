import { sql } from '../config/db.js';

export async function getTransactionsByUserId(req, res) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // if (isNaN(amount) || amount <= 0) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Amount must be a positive number' });
    // }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'Transaction ID must be a number' });
  }

  try {
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getTransactionSummaryByUserId(req, res) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expensesResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error('Error fetching transactions summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
