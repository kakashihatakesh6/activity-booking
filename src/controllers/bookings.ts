import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking';

// Helper function to check database connection
const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database connection unavailable'
      });
      return;
    }

    const bookings = await Booking.find({ user: req.user!._id })
      .populate({
        path: 'activity',
        select: 'title description location date time'
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 