const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const axiosConfig = {};
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
  axiosConfig.proxy = false; // disable axios default proxy handling
  axiosConfig.httpsAgent = new (require('https').Agent)({
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
  });
}

// Helper to get trailers
async function getTrailer(movieId) {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: TMDB_API_KEY }
    });

    const trailers = response.data.results.filter(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    return trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : null;
  } catch (err) {
    return null;
  }
}

// Optional: Get all genres (cached at runtime)
let genreMap = {};

async function loadGenres(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: { api_key: TMDB_API_KEY, language: "en-US" },
        ...axiosConfig
      });
      genreMap = res.data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      console.log("✅ Genres loaded from TMDB.");
      return;
    } catch (err) {
      console.error(`Failed to load genres (attempt ${attempt}):`, err.message);
      console.error("Full error:", err);
      if (attempt === retries) {
        console.error("❌ Could not load genres after multiple attempts.");
      } else {
        await new Promise(res => setTimeout(res, 2000)); // wait 2s before retry
      }
    }
  }
}

// Call genre loader once on server start, but do not block server startup
loadGenres();

// Periodically retry loading genres every 10 minutes
setInterval(() => {
  loadGenres();
}, 10 * 60 * 1000); // 10 minutes

// Health check endpoint for TMDB connectivity
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
      ...axiosConfig
    });
    res.json({ success: true, genres: response.data.genres.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, details: err });
  }
});

router.get("/movies", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        page: 1
      }
    });

    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        const trailerUrl = await getTrailer(movie.id);

        return {
          id: movie.id,
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null, // fallback if no poster
          genre: movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", "),
          trailer: trailerUrl || "Trailer not available"
        };
      })
    );

    res.json(movies);
  } catch (error) {
    console.error("TMDB Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

module.exports = router;
