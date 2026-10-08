require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const createApp = require('./app');
const connectDB = require('./db');

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const app = createApp(io);

server.on('request', app);

// Socket.io
require('./utils/socket')(io);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();