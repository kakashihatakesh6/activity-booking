import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Booking from '../models/Booking';

// Helper function to check database connection with detailed status
const checkDatabaseConnection = (): { connected: boolean; status: string } => {
  const readyState = mongoose.connection.readyState;
  
  switch (readyState) {
    case 0:
      return { connected: false, status: 'Disconnected' };
    case 1:
      return { connected: true, status: 'Connected' };
    case 2:
      return { connected: false, status: 'Connecting' };
    case 3:
      return { connected: false, status: 'Disconnecting' };
    default:
      return { connected: false, status: 'Unknown' };
  }
};

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection with detailed status
    const db = checkDatabaseConnection();
    if (!db.connected) {
      res.status(503).json({
        success: false,
        error: `Database connection unavailable (Status: ${db.status}). Please try again later.`
      });
      return;
    }

    const activities = await Activity.find();

    // Verify data was retrieved
    if (!activities) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve activities from database'
      });
      return;
    }

    console.log(`Retrieved ${activities.length} activities from database`);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error: any) {
    console.error('Error retrieving activities:', error);
    
    // Check if this is a MongoDB-specific error
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(503).json({
        success: false,
        error: 'Database operation failed. Please try again later.'
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
export const getActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection with detailed status
    const db = checkDatabaseConnection();
    if (!db.connected) {
      res.status(503).json({
        success: false,
        error: `Database connection unavailable (Status: ${db.status}). Please try again later.`
      });
      return;
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid activity ID format'
      });
      return;
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
      return;
    }

    console.log(`Retrieved activity ${activity._id} from database`);

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    console.error('Error retrieving activity:', error);
    
    // Check if this is a MongoDB-specific error
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(503).json({
        success: false,
        error: 'Database operation failed. Please try again later.'
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Book an activity
// @route   POST /api/activities/:id/book
// @access  Private
export const bookActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection with detailed status
    const db = checkDatabaseConnection();
    if (!db.connected) {
      res.status(503).json({
        success: false,
        error: `Database connection unavailable (Status: ${db.status}). Please try again later.`
      });
      return;
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid activity ID format'
      });
      return;
    }

    // Ensure user is available in req object
    if (!req.user || !req.user._id) {
      res.status(401).json({
        success: false,
        error: 'User authentication failed'
      });
      return;
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
      return;
    }

    console.log(`Found activity ${activity._id} for booking`);

    // Check if user has already booked this activity
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      activity: req.params.id
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        error: 'You have already booked this activity'
      });
      return;
    }

    console.log(`Creating booking for user ${req.user._id} and activity ${activity._id}`);

    // Create booking with explicit date
    const booking = await Booking.create({
      user: req.user._id,
      activity: req.params.id,
      bookingDate: new Date()
    });

    // Verify booking was saved
    if (!booking) {
      res.status(500).json({
        success: false,
        error: 'Failed to save booking to database'
      });
      return;
    }

    console.log(`Booking created successfully: ${booking._id}`);

    // Retrieve the saved booking to confirm it exists in the database
    const savedBooking = await Booking.findById(booking._id);
    
    if (!savedBooking) {
      res.status(500).json({
        success: false,
        error: 'Booking was created but could not be verified in the database'
      });
      return;
    }

    console.log(`Booking ${savedBooking._id} verified in database`);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    
    // Check if this is a MongoDB-specific error
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(503).json({
        success: false,
        error: 'Database operation failed. Please try again later.'
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create a new activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection with detailed status
    const db = checkDatabaseConnection();
    if (!db.connected) {
      res.status(503).json({
        success: false,
        error: `Database connection unavailable (Status: ${db.status}). Please try again later.`
      });
      return;
    }

    // Ensure user is available in req object
    if (!req.user || !req.user._id) {
      res.status(401).json({
        success: false,
        error: 'User authentication failed'
      });
      return;
    }

    const { title, description, location, date, time } = req.body;

    // Validate required fields
    if (!title || !description || !location || !date || !time) {
      res.status(400).json({
        success: false,
        error: 'Please provide all required fields: title, description, location, date, time'
      });
      return;
    }

    // Validate date format
    let activityDate;
    try {
      activityDate = new Date(date);
      // Check if date is valid
      if (isNaN(activityDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid date format. Please use YYYY-MM-DD format.'
      });
      return;
    }

    console.log(`Creating new activity: ${title}`);

    // Create activity
    const activity = await Activity.create({
      title,
      description,
      location,
      date: activityDate,
      time
    });

    // Verify activity was saved
    if (!activity) {
      res.status(500).json({
        success: false,
        error: 'Failed to save activity to database'
      });
      return;
    }

    console.log(`Activity created successfully: ${activity._id}`);

    // Retrieve the saved activity to confirm it exists in the database
    const savedActivity = await Activity.findById(activity._id);
    
    if (!savedActivity) {
      res.status(500).json({
        success: false,
        error: 'Activity was created but could not be verified in the database'
      });
      return;
    }

    console.log(`Activity ${savedActivity._id} verified in database`);

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    console.error('Error creating activity:', error);
    
    // Check if this is a MongoDB-specific error
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(503).json({
        success: false,
        error: 'Database operation failed. Please try again later.'
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 