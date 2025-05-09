import { Request, Response } from 'express';
import mongoose from 'mongoose';
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

// @desc    Get logged in user bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
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

    console.log(`Retrieving bookings for user ${req.user._id}`);

    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'activity',
        select: 'title description location date time'
      });

    // Verify data was retrieved
    if (!bookings) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve bookings from database'
      });
      return;
    }

    console.log(`Retrieved ${bookings.length} bookings for user ${req.user._id}`);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    console.error('Error retrieving bookings:', error);
    
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

// @desc    Create a new booking directly
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: Request, res: Response): Promise<void> => {
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

    const { activity } = req.body;

    // Validate required fields
    if (!activity) {
      res.status(400).json({
        success: false,
        error: 'Please provide activity ID'
      });
      return;
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(activity)) {
      res.status(400).json({
        success: false,
        error: 'Invalid activity ID format'
      });
      return;
    }

    // Check if user has already booked this activity
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      activity
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        error: 'You have already booked this activity'
      });
      return;
    }

    console.log(`Creating booking for user ${req.user._id} and activity ${activity}`);

    // Create booking with explicit date
    const booking = await Booking.create({
      user: req.user._id,
      activity,
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

    // Populate activity details
    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'activity',
      select: 'title description location date time'
    });

    console.log(`Booking ${savedBooking._id} verified in database`);

    res.status(201).json({
      success: true,
      data: populatedBooking
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