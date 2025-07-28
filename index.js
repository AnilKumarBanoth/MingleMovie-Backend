const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const movies = require("./routes/movies");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const tmdbRoutes = require("./routes/tmdb");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app" // Replace with your frontend Vercel URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/tmdb", tmdbRoutes);
app.use("/api/movies", movies);
app.use("/api/bookings", bookings);
app.use("/api/auth", auth);

// ✅ Connect MongoDB only once
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// ✅ Export app instead of listen()
module.exports = app;
