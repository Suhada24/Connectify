require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || '*' 
    : 'http://localhost:3000'
}));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/upload', require('./routes/upload'));

// Create HTTP server
const server = http.createServer(app);

// Only set up Socket.io if not running on Vercel
if (process.env.VERCEL_ENV !== 'production') {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL || '*' 
        : 'http://localhost:3000',
      methods: ["GET", "POST"]
    }
  });

  // Socket.io: Real-time messaging
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Optionally, join a room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    // Listen for message events
    socket.on('sendMessage', (data) => {
      // data: { roomId, message }
      io.to(data.roomId).emit('receiveMessage', data.message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
  
  // Set static folder
  if (!process.env.VERCEL_ENV) { // Only serve static files if not on Vercel (Vercel handles this)
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Any route that is not an API route should redirect to index.html
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
  }
}

// Start server
const PORT = process.env.PORT || 5000;

// Export for Vercel serverless function
if (process.env.VERCEL_ENV) {
  module.exports = app;
} else {
  server.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
}
