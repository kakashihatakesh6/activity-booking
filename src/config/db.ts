import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const connectDB = async (): Promise<boolean> => {
  try {
    const mongoUri = "mongodb+srv://sages:sages@sages.p1zye6m.mongodb.net/activity-booking"
    // const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/activity-booking';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
  
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit the process, just log the error and return false
    return false;
  }
};

export default connectDB; 