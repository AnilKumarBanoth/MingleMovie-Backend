import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String, // poster image
  teaser: String,  // teaser video URL (short preview)
  trailer: String, // full trailer URL (YouTube, mp4, etc.)
  genre: String,
  category: String,
  duration: Number,
  releaseYear: Number,
  rating: Number
});

export default mongoose.model('Movie', movieSchema);





