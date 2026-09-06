const mongoose = require('mongoose');
const Room = require('./Room');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review text cannot be empty'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating between 1 and 5']
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Review must belong to a room']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews: 1 review per user per room
reviewSchema.index({ room: 1, user: 1 }, { unique: true });

// Auto-populate user info
reviewSchema.pre(/^find/, function() {
  this.populate({
    path: 'user',
    select: 'name email role'
  });
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function(roomId) {
  const stats = await this.aggregate([
    {
      $match: { room: roomId }
    },
    {
      $group: {
        _id: '$room',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Room.findByIdAndUpdate(roomId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await Room.findByIdAndUpdate(roomId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// Post-save hook to recalculate rating
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRatings(this.room);
});

// Post-delete / findOneAndDelete hook to recalculate rating
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.room);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
