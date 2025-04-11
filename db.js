const mongoose = require('mongoose');
const config = require('./config');

// Database connection function with retry logic and proper error handling
const connectDB = async (retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const url = `mongodb+srv://${config.db_username}:${config.db_password}@${config.db_host}/?retryWrites=true&w=majority&appName=Cluster0`;
      const conn = await mongoose.connect(url,
        {
          serverSelectionTimeoutMS: 40000, // Timeout after 40s instead of 30s
        }
      );

      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully');
      });

      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;

    } catch (error) {
      if (i === retries - 1) {
        console.error(`Failed to connect to MongoDB after ${retries} attempts`);
      }
      console.warn(`Connection attempt ${i + 1} failed. Retrying in ${delay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
