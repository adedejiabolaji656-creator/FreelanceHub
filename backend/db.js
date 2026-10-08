const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance_marketplace',
      { serverSelectionTimeoutMS: 20000 }
    ).catch(err => {
      console.error('MongoDB connection error:', err.message);
      try {
        const util = require('util');
        console.error('MongoDB detail:', util.inspect(err.reason, { depth: 3, colors: false }).slice(0, 4000));
      } catch (_) { /* ignore */ }
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
};

module.exports = connectDB;