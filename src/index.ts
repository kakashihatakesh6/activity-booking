import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db';
import { errorHandler } from './middleware/error';
import { requestLogger } from './middleware/logger';

// Route imports
import authRoutes from './routes/auth';
import activityRoutes from './routes/activities';
import bookingRoutes from './routes/bookings';

// Load env vars
dotenv.config();

const app: Application = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Request logger middleware - add before routes
app.use(requestLogger);

// Basic health check route that doesn't require DB
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running',
    dbConnected: mongoose.connection.readyState === 1
  });
});

// Connect to database (async)
connectDB()
  .then((connected) => {
    if (!connected) {
      console.log('Warning: Running without database connection. Some features will be limited.');
    }
  })
  .catch(err => {
    console.error('Fatal database connection error:', err);
  });

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`\x1b[36m[SERVER]\x1b[0m API is available at \x1b[32mhttp://localhost:${PORT}/api\x1b[0m`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  // Don't crash the server, just log the error
  console.error('Unhandled Rejection:', err);
});
