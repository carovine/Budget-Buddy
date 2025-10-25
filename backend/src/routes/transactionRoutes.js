import express from "express";
import {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

// getting all the transaction of a user
router.get("/:userId", getTransactionsByUserId);

// getting the balance, income and expense of a user
router.get("/summary/:userId", getSummaryByUserId);

// posting a transaction
router.post("/", createTransaction);

// deleting a transation using transation id
router.delete("/:id", deleteTransaction);

export default router;
