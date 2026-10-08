const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const createApp = (io) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // MongoDB Connection
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance_marketplace')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Attach io to requests (undefined on serverless)
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/jobs', require('./routes/jobs'));
  app.use('/api/proposals', require('./routes/proposals'));
  app.use('/api/messages', require('./routes/messages'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/reviews', require('./routes/reviews'));

  // Error handler
  app.use(require('./middleware/errorHandler'));

  return app;
};

module.exports = createApp;