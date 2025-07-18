const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Movie = require("../models/Movie");

dotenv.config();

const sampleMovies = [
  {
    title: "Inception",
    description: "A mind-bending thriller by Christopher Nolan.",
    genre: "Sci-Fi",
    duration: 148,
    image: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg",
  },
  {
    title: "The Dark Knight",
    description: "Batman faces off against the Joker in Gotham City.",
    genre: "Action",
    duration: 152,
    image: "https://m.media-amazon.com/images/I/51k0qa6zTPL._AC_.jpg",
  },
  {
    title: "Interstellar",
    description: "A journey through space and time to save humanity.",
    genre: "Sci-Fi",
    duration: 169,
    image: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SY679_.jpg",
  },
  {
    title: "Avengers: Endgame",
    description: "The epic conclusion to the Infinity Saga.",
    genre: "Superhero",
    duration: 181,
    image: "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg",
  },
  {
    title: "Titanic",
    description: "A tragic love story aboard the ill-fated ship.",
    genre: "Romance",
    duration: 195,
    image: "https://m.media-amazon.com/images/I/81F+z5kGUIL._AC_SY679_.jpg",
  },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("✅ Connected to MongoDB Atlas");

  await Movie.deleteMany({});
  await Movie.insertMany(sampleMovies);

  console.log("✅ Sample movies with images inserted");
  process.exit();
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
  process.exit(1);
});
