const serverless = require("serverless-http");
const express = require("express");
const app = express();

// middlewares
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from Vercel Serverless!");
});

// Export the handler
module.exports.handler = serverless(app);
