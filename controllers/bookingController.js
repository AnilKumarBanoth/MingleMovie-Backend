const Booking = require("../models/Booking");

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { movieId, userId, seats } = req.body;

    const booking = new Booking({
      movieId,
      userId,
      seats
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};

// GET /api/bookings/user/:userId
const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate("movieId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

module.exports = {
  createBooking,
  getBookingsByUser
};
