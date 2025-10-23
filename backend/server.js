import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

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

app.post("/api/transactions", async (req, res) => {
  try {
    
  } catch (error) {

  }
});

initDB().then(() => {
  app.listen(myport, () => {
    console.log(`server is up and running on port ${myport}`);
  });
});
