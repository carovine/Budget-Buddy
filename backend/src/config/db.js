import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

// creates a sql connection using the db url from the .env file
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
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
