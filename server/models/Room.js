const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'A room must have a room number'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'A room must have a name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'A room must have a type (e.g., Deluxe, Suite)'],
    enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Presidential']
  },
  price: {
    type: Number,
    required: [true, 'A room must have a price per night']
  },
  capacity: {
    type: Number,
    required: [true, 'A room must have a guest capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Inspection', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  amenities: {
    type: [String],
    default: ['Wifi', 'Tv']
  },
  description: {
    type: String,
    trim: true
  },
  images: {
    type: [String], // Array of image URLs or file paths
    default: []
  },
  floor: {
    type: Number
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
