const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Genre Cache
let genreMap = {};
const loadGenres = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" }
    });
    genreMap = res.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (err) {
    console.error("❌ Failed to load genres:", err.message);
  }
};
loadGenres();

// Trailer Helper
const getTrailer = async (movieId) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: TMDB_API_KEY }
    });
    const trailers = res.data.results.filter(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );
    return trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : null;
  } catch {
    return null;
  }
};

// Controller: Get All Movies
const getAllMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 }
    });

    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        const trailer = await getTrailer(movie.id);
        return {
          id: movie.id,
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          genre: movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", "),
          trailer: trailer || "Trailer not available"
        };
      })
    );

    res.json(movies);
  } catch (error) {
    console.error("🔥 Error fetching movies:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// Controller: Get Movie by ID
const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" }
    });

    const trailer = await getTrailer(id);

    const movie = {
      id: response.data.id,
      title: response.data.title,
      name: response.data.title, // for compatibility
      description: response.data.overview,
      overview: response.data.overview, // for compatibility
      genre: response.data.genres.map((g) => g.name).join(", "),
      duration: response.data.runtime,
      releaseDate: response.data.release_date,
      image: response.data.poster_path
        ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image",
      trailer: trailer || null
    };

    res.json(movie);
  } catch (err) {
    console.error("🔥 Error fetching movie details:", err.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};

// Controller: Get Featured Movies (for demo, just return the first 5 popular)
const getFeaturedMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 }
    });

    const movies = await Promise.all(
      response.data.results.slice(0, 5).map(async (movie) => {
        const trailer = await getTrailer(movie.id);
        return {
          id: movie.id,
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          genre: movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", "),
          trailer: trailer || "Trailer not available"
        };
      })
    );

    res.json(movies);
  } catch (error) {
    console.error("🔥 Error fetching featured movies:", error.message);
    res.status(500).json({ error: "Failed to fetch featured movies" });
  }
};

// Controller: Get Videos for a Movie
const getMovieVideos = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
      params: { api_key: TMDB_API_KEY }
    });
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie videos" });
  }
};

// Controller: Get Trending Movies
const getTrendingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" }
    });
    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        const trailer = await getTrailer(movie.id);
        return {
          id: movie.id,
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          genre: movie.genre_ids && genreMap
            ? movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ")
            : "Unknown",
          trailer: trailer || null
        };
      })
    );
    res.json(movies);
  } catch (error) {
    console.error("🔥 Error fetching trending movies:", error.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getFeaturedMovies,
  getMovieVideos,
  getTrendingMovies
};
