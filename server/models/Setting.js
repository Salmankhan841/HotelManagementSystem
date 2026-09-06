const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    default: 'LuxuryStay Hotel & Resort'
  },
  contactEmail: {
    type: String,
    default: 'concierge@luxurystay.com'
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  hotelAddress: {
    type: String,
    default: '123 Luxury Avenue, Beverly Hills, CA 90210'
  },
  checkInTime: {
    type: String,
    default: '15:00'
  },
  checkOutTime: {
    type: String,
    default: '11:00'
  },
  currency: {
    type: String,
    default: 'USD ($)'
  },
  taxRate: {
    type: Number,
    default: 15
  },
  serviceFee: {
    type: Number,
    default: 10
  },
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 48 hours prior to arrival date.'
  },
  enableInstantBooking: {
    type: Boolean,
    default: true
  },
  enableReviewAutoApprove: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
