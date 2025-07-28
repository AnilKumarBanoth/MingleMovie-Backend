require("dotenv").config(); // <-- Add this line FIRST
const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual routes
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Correct export for Vercel serverless
module.exports.handler = serverless(app);
