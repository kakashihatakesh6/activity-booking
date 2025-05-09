import express from 'express';
import { getActivities, getActivity, bookActivity, createActivity } from '../controllers/activities';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get all activities
router.get('/', getActivities);

// Get single activity
router.get('/:id', getActivity);

// Create a new activity - protected route
router.post('/', protect, createActivity);

// Book an activity - protected route
router.post('/:id/book', protect, bookActivity);

export default router; 