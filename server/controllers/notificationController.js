const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (Admin / Staff)
exports.getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    
    // If empty, populate initial operational notifications
    if (notifications.length === 0) {
      await Notification.create([
        {
          title: 'System Operational',
          message: 'LuxuryStay Hotel Management System is live and connected to MongoDB.',
          type: 'system',
          isRead: true
        },
        {
          title: 'Stripe Gateway Online',
          message: 'Payment processing is ready for instant reservation checkouts.',
          type: 'booking',
          isRead: false
        }
      ]);
      notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    }

    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.status(200).json({
      status: 'success',
      unreadCount,
      data: { notifications }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch notifications' });
  }
};

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, metadata } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      metadata: metadata || {}
    });

    res.status(201).json({
      status: 'success',
      data: { notification }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: 'after' }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { notification }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear / Delete all notifications
// @route   DELETE /api/notifications
// @access  Private (Admin)
exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});

    res.status(200).json({
      status: 'success',
      message: 'All notifications cleared successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
