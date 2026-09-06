const mongoose = require('mongoose');
const dns = require('dns');

// Fix for SRV DNS lookup issues on MongoDB Atlas
if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    // Ignore if not supported in environment
  }
}

const connectDB = async () => {
  // Re-use existing connection in serverless lambdas
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Warning: ${error.message}`);
    // Keep server running smoothly without crashing nodemon
  }
};

module.exports = connectDB;
