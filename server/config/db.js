const mongoose = require('mongoose');

// Fix deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/connectify';
    
    console.log('Connecting to MongoDB...');
    
    // In production, we need a valid MongoDB connection
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
      console.error('No MongoDB URI provided in production environment.');
      process.exit(1); // Exit with error if no MongoDB URI in production
    }
    
    // In development without a real MongoDB connection, we can mock the connection
    if (process.env.NODE_ENV === 'development' && !process.env.MONGO_URI) {
      console.log('No MongoDB URI provided. Running in mock DB mode.');
      return;
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    
    // In production, fail if DB connection fails
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting due to MongoDB connection error in production');
      process.exit(1);
    } else {
      // For development purposes, allow app to continue even if DB connection fails
      console.log('Continuing without database connection for development purposes');
    }
  }
};

module.exports = connectDB;
