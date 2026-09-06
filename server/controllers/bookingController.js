const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Guest/User)
exports.createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut } = req.body;

    // 1. Verify the room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // 2. Validate dates
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
      return res.status(400).json({ message: 'Invalid check-in and check-out dates.' });
    }

    const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const calculatedBase = nights * roomExists.price;
    const verifiedAmount = calculatedBase + Math.round(calculatedBase * 0.15);

    // 3. Prevent overlapping bookings (Basic check)
    const overlappingBookings = await Booking.find({
      room,
      status: { $ne: 'Cancelled' },
      $or: [
        { checkIn: { $lt: checkOut, $gte: checkIn } },
        { checkOut: { $gt: checkIn, $lte: checkOut } },
        { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for these dates' });
    }

    // 4. Create the booking with server-verified total
    const booking = await Booking.create({
      user: req.user.id,
      room,
      checkIn,
      checkOut,
      totalAmount: verifiedAmount,
      status: 'Confirmed'
    });

    // 4. Create dynamic Notification for Admin
    try {
      await Notification.create({
        title: 'New Reservation Confirmed',
        message: `${roomExists.name} (Room #${roomExists.roomNumber}) booked for $${totalAmount} USD.`,
        type: 'booking',
        metadata: { bookingId: booking._id, roomId: room, totalAmount }
      });
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
    }

    res.status(201).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Guest/User)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin/Manager only)
// @route   GET /api/bookings
// @access  Private (Admin/Manager)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber name type price images')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin/Staff only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin/Manager/Receptionist)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    ).populate('room', 'roomNumber name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Dynamic Notification
    try {
      await Notification.create({
        title: `Reservation Status: ${status}`,
        message: `Booking for ${booking.room?.name || 'Room'} (#${booking._id.toString().slice(-6)}) changed to ${status}.`,
        type: 'booking',
        metadata: { bookingId: booking._id, status }
      });
    } catch (e) {}

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel booking (User or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room', 'roomNumber name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Dynamic Notification
    try {
      await Notification.create({
        title: 'Reservation Cancelled',
        message: `Booking #${booking._id.toString().slice(-6)} for ${booking.room?.name || 'Room'} was cancelled.`,
        type: 'booking'
      });
    } catch (e) {}

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete booking permanently (Admin/Manager only)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin/Manager)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
