const Setting = require('../models/Setting');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Get current hotel settings (or create default if not found)
// @route   GET /api/settings
// @access  Public / Private
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({
      status: 'success',
      data: { settings }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hotel settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'System configuration saved successfully',
      data: { settings }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Admin personal profile/password
// @route   PUT /api/settings/profile
// @access  Private / Fallback
exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, newPassword, currentPassword } = req.body;
    
    // Find target user by JWT ID or email
    let user;
    if (req.user?._id || req.user?.id) {
      user = await User.findById(req.user._id || req.user.id).select('+password');
    }
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    }
    if (!user) {
      user = await User.findOne({ role: 'admin' }).select('+password');
    }

    if (!user) {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    // Check if new email already belongs to another user
    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'This email is already in use by another account' });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;

    // Handle Password Change
    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change to a new password' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password does not match our records' });
      }
      user.password = newPassword;
    }

    await user.save();

    // Generate fresh JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(200).json({
      status: 'success',
      message: 'Admin credentials updated successfully!',
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update credentials' });
  }
};
