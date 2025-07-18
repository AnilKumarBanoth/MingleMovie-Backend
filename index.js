// index.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('win-ca');


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const movies = require("./routes/movies");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const tmdbRoutes = require("./routes/tmdb");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Parse JSON body
app.use(express.json());

// ✅ Route mounts
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/movies", movies);        // e.g. /api/movies/:id
app.use("/api/bookings", bookings);    // e.g. /api/bookings
app.use("/api/auth", auth);            // e.g. /api/auth/login

// ✅ MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ MongoDB error:", err.message);
});
