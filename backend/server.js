import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

const myport = process.env.PORT;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("db init success");
  } catch (error) {
    console.error("db init failed:", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("its working");
});

// getting all the transaction of a user
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// getting the balance, income and expense of a user
app.get("/api/transactions/summary/:userId", async (req, res) => {
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
});

// posting a transaction
app.post("/api/transactions", async (req, res) => {
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
});

// deleting a transation using transation id
app.delete("/api/transactions/:id", async (req, res) => {
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
});

initDB().then(() => {
  app.listen(myport, () => {
    console.log(`server is up and running on port ${myport}`);
  });
});
