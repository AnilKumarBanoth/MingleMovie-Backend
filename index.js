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

// ✅ CORS for both local + deployed frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
   
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ API Routes
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/movies", movies);
app.use("/api/bookings", bookings);
app.use("/api/auth", auth);

// ✅ MongoDB connect & start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
