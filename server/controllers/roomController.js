const Room = require('../models/Room');
const Notification = require('../models/Notification');

// @desc    Get all rooms (with optional filters)
// @route   GET /api/rooms
// @access  Public
exports.getAllRooms = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let query = Room.find(queryObj);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const rooms = await query;

    res.status(200).json({
      status: 'success',
      results: rooms.length,
      data: { rooms }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { room }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin/Manager)
exports.createRoom = async (req, res) => {
  try {
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    const roomData = {
      ...req.body,
      images: imagePaths.length > 0 ? imagePaths : undefined
    };

    if (typeof req.body.amenities === 'string') {
      roomData.amenities = req.body.amenities.split(',').map(item => item.trim());
    }

    const newRoom = await Room.create(roomData);

    // Dynamic Notification
    try {
      await Notification.create({
        title: 'New Room Added to Inventory',
        message: `${newRoom.name} (Room #${newRoom.roomNumber}, ${newRoom.type}) added at $${newRoom.price}/night.`,
        type: 'room'
      });
    } catch (e) {}

    res.status(201).json({
      status: 'success',
      data: { room: newRoom }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin/Manager)
exports.updateRoom = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = imagePaths;
    }

    if (typeof req.body.amenities === 'string') {
      updateData.amenities = req.body.amenities.split(',').map(item => item.trim());
    }

    const oldRoom = await Room.findById(req.params.id);
    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if status changed
    if (updateData.status && oldRoom && oldRoom.status !== updateData.status) {
      try {
        await Notification.create({
          title: 'Room Status Changed',
          message: `Room #${room.roomNumber} (${room.name}) status updated to "${updateData.status}".`,
          type: 'room'
        });
      } catch (e) {}
    }

    res.status(200).json({
      status: 'success',
      data: { room }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    try {
      await Notification.create({
        title: 'Room Removed from Inventory',
        message: `Room #${room.roomNumber} (${room.name}) was removed.`,
        type: 'room'
      });
    } catch (e) {}

    res.status(200).json({
      status: 'success',
      message: 'Room deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
