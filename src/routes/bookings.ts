import express from 'express';
import { getMyBookings, createBooking } from '../controllers/bookings';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get logged in user bookings - protected route
router.get('/me', protect, getMyBookings);

// Create a new booking - protected route
router.post('/', protect, createBooking);

export default router; 