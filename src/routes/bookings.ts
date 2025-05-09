import express from 'express';
import { getMyBookings } from '../controllers/bookings';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get logged in user bookings - protected route
router.get('/me', protect, getMyBookings);

export default router; 