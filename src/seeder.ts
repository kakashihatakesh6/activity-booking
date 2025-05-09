import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User';
import Activity from './models/Activity';
import Booking from './models/Booking';

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async (): Promise<boolean> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/activity-booking';
    
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set.');
      return false;
    }
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000 // Longer timeout for seeding
    });
    
    console.log('MongoDB Connected');
    return true;
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

// Sample activities data
const activities = [
  {
    title: 'Hiking Adventure',
    description: 'Enjoy a scenic hike through beautiful trails and breathtaking views.',
    location: 'Mountain Trail Park',
    date: new Date('2023-12-15'),
    time: '09:00 AM'
  },
  {
    title: 'Yoga Class',
    description: 'Relax and rejuvenate with our expert-led yoga sessions suitable for all levels.',
    location: 'Wellness Center',
    date: new Date('2023-12-16'),
    time: '10:30 AM'
  },
  {
    title: 'Cooking Workshop',
    description: 'Learn to prepare delicious meals with our professional chef.',
    location: 'Culinary Institute',
    date: new Date('2023-12-17'),
    time: '06:00 PM'
  },
  {
    title: 'Photography Tour',
    description: 'Capture the beauty of nature with tips from professional photographers.',
    location: 'City Gardens',
    date: new Date('2023-12-18'),
    time: '02:00 PM'
  },
  {
    title: 'Wine Tasting',
    description: 'Sample a variety of exquisite wines and learn about wine pairing.',
    location: 'Vineyard Estate',
    date: new Date('2023-12-19'),
    time: '07:00 PM'
  }
];

// Import data
const importData = async (): Promise<void> => {
  try {
    const connected = await connectDB();
    
    if (!connected) {
      console.error('Database connection failed. Cannot import data.');
      process.exit(1);
    }
    
    // Clear existing data
    await Activity.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    
    // Import activities
    await Activity.insertMany(activities);
    
    console.log('Data Imported!');
    process.exit(0);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const deleteData = async (): Promise<void> => {
  try {
    const connected = await connectDB();
    
    if (!connected) {
      console.error('Database connection failed. Cannot delete data.');
      process.exit(1);
    }
    
    // Clear existing data
    await Activity.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    
    console.log('Data Destroyed!');
    process.exit(0);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Process command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide proper command: -i (import) or -d (delete)');
  process.exit(1);
} 