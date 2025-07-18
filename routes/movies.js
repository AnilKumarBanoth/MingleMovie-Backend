const express = require("express");
const { getAllMovies, getMovieById, getFeaturedMovies, getMovieVideos, getTrendingMovies } = require("../controllers/movieController");

const router = express.Router();

router.get("/trending", getTrendingMovies);
router.get("/featured", getFeaturedMovies);
router.get("/:id/videos", getMovieVideos);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

module.exports = router;
