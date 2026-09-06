const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User']
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Booking must belong to a Room']
  },
  checkIn: {
    type: Date,
    required: [true, 'Please provide a check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Please provide a check-out date']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Booking must have a total amount']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'Stripe'
  },
  transactionId: {
    type: String
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Middleware to populate user and room details whenever a query is made
bookingSchema.pre(/^find/, function() {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'room',
    select: 'name roomNumber type images'
  });
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
