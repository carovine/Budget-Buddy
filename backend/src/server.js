import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

//middleware
app.use(rateLimiter);
app.use(express.json());

const myport = process.env.PORT;

app.get("/health", (req, res) => {
  res.send("its working");
});

app.use("/api/transactions", transactionRoutes);

initDB().then(() => {
  app.listen(myport, () => {
    console.log(`server is up and running on port ${myport}`);
  });
});
