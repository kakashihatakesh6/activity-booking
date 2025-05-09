import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Booking from '../models/Booking';

// Helper function to check database connection
const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database connection unavailable'
      });
      return;
    }

    const activities = await Activity.find();

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error: any) {
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
    // Check database connection
    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database connection unavailable'
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

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
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
    // Check database connection
    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database connection unavailable'
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

    // Check if user has already booked this activity
    const existingBooking = await Booking.findOne({
      user: req.user!._id,
      activity: req.params.id
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        error: 'You have already booked this activity'
      });
      return;
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user!._id,
      activity: req.params.id
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 