const mongoose = require('mongoose');
const dns = require('dns');

// Disable long 10-second Mongoose query buffering when disconnected
mongoose.set('bufferCommands', false);

// Fix for SRV DNS lookup issues on MongoDB Atlas
if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    // Ignore if not supported in environment
  }
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Warning: ${error.message}`);
  }
};

module.exports = connectDB;
