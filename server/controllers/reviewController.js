const mongoose = require('mongoose');
const Review = require('../models/Review');
const Room = require('../models/Room');

// @desc    Get all reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
exports.getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Handle non-ObjectId room IDs (e.g. fallback rooms) gracefully without throwing CastError 500
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: { reviews: [] }
      });
    }

    const reviews = await Review.find({ room: roomId }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Authenticated User)
exports.createReview = async (req, res) => {
  try {
    const { room, review, rating } = req.body;

    if (!room || !mongoose.Types.ObjectId.isValid(room)) {
      return res.status(400).json({ message: 'Invalid room ID provided.' });
    }

    // Check if room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Create review (user ID is injected from auth protect middleware)
    const newReview = await Review.create({
      room,
      user: req.user._id,
      review,
      rating: Number(rating)
    });

    // Populate user details for immediate display
    await newReview.populate({
      path: 'user',
      select: 'name email role'
    });

    res.status(201).json({
      status: 'success',
      data: { review: newReview }
    });
  } catch (error) {
    // Check if duplicate key error (user already reviewed this room)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this room.' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Author or Admin/Manager)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author or is admin/manager
    const isAuthor = review.user._id.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'manager'].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin overview)
// @route   GET /api/reviews
// @access  Private (Admin/Manager)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
