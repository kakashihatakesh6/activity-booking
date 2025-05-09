import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Maximum number of connection attempts
const MAX_RETRIES = 3;
// Delay between retries in milliseconds
const RETRY_DELAY = 3000;

const connectDB = async (retryCount = 0): Promise<boolean> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/activity-booking';

    console.log(`Attempting MongoDB connection to ${mongoUri}...`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
  
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection monitoring
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      setTimeout(() => connectDB(), 5000);
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    return true;
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection (${retryCount + 1}/${MAX_RETRIES}) after ${RETRY_DELAY}ms...`);
      // Wait for specified delay
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      // Try to connect again with incremented retry count
      return connectDB(retryCount + 1);
    }
    
    console.error('Failed to connect to MongoDB after multiple attempts');
    // Don't exit the process, just log the error and return false
    return false;
  }
};

export default connectDB; 