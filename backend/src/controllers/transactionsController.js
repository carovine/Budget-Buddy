import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    console.log("Transaction created:", transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    } else {
      const result =
        await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

      if (result.length === 0) {
        res.status(404).json({ message: "not found" });
      } else {
        res.status(200).json({ message: "transaction deleted successfully" });
      }
    }
  } catch (error) {
    console.log("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId};`;

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0;`;

    const expenceResult =
      await sql`SELECT COALESCE(SUM(amount),0) as expence FROM transactions WHERE user_id = ${userId} AND amount < 0;`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expence: expenceResult[0].expence,
    });
  } catch (error) {
    console.log("Error getting summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
