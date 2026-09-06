const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Please provide valid name, email, and password.' });
    }

    email = email.toLowerCase().trim();

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Security Hardening: Strictly force 'guest' role on public registration
    // Admin/Manager/Staff roles can only be provisioned by authenticated Administrators
    const user = await User.create({
      name: name.trim(),
      email,
      password,
      role: 'guest',
      isActive: true
    });

    // Generate token
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Strict type check to prevent NoSQL object query injection
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Please provide a valid email and password.' });
    }

    email = email.toLowerCase().trim();

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact hotel management.' });
    }

    // Generate token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with booking metrics (Admin)
// @route   GET /api/auth/users
// @access  Private (Admin/Manager)
exports.getAllUsers = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const users = await User.find().sort('-createdAt').lean();

    // Attach booking stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookings = await Booking.find({ user: u._id });
        const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        return {
          ...u,
          totalBookings: bookings.length,
          totalSpent
        };
      })
    );

    res.status(200).json({
      status: 'success',
      results: usersWithStats.length,
      data: { users: usersWithStats }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new Staff member (Admin)
// @route   POST /api/auth/staff
// @access  Private (Admin)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const staff = await User.create({
      name,
      email,
      password: password || 'LuxuryStay2026!',
      role: role || 'staff',
      phone: phone || '',
      department: department || 'Operations',
      isActive: true
    });

    res.status(201).json({
      status: 'success',
      message: 'Staff member added successfully',
      data: {
        user: {
          _id: staff._id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          phone: staff.phone,
          department: staff.department,
          createdAt: staff.createdAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a user account (Admin)
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting your own logged in account
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own active admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role & profile (Admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role, department, phone, isActive } = req.body;
    
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
