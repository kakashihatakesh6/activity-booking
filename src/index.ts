import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/error';
import { requestLogger } from './middleware/logger';
import fs from 'fs';
import path from 'path';

// Load env vars
dotenv.config();
import connectDB from './config/db';

// Route imports
import authRoutes from './routes/auth';
import activityRoutes from './routes/activities';
import bookingRoutes from './routes/bookings';

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

// Root route with attractive response
app.get('/', (req: Request, res: Response) => {
  try {
    // Read the welcome HTML file
    let html = fs.readFileSync(path.join(__dirname, 'views/welcome.html'), 'utf8');
    
    // Replace the serverTime placeholder with the actual time
    html = html.replace('{{serverTime}}', new Date().toLocaleString());
    
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving welcome page:', error);
    res.status(200).send('Activity Booking API - Server is running');
  }
});

// Create a middleware to check DB connection for all routes that need it
const checkDbConnection = (req: Request, res: Response, next: Function) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database connection unavailable. Please try again later.'
    });
  }
  next();
};

// Connect to database (async)
connectDB()
  .then((connected) => {
    if (connected) {
      console.log('Database connection established - all routes available');
    } else {
      console.log('Warning: Running without database connection. Some features will be limited.');
      // You might want to disable certain routes or add more error handling here
    }
    
    // Mount routers with DB connection check
    app.use('/api/auth', checkDbConnection, authRoutes);
    app.use('/api/activities', checkDbConnection, activityRoutes);
    app.use('/api/bookings', checkDbConnection, bookingRoutes);
    
    // Start server after DB connection attempt
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`\x1b[36m[SERVER]\x1b[0m API is available at \x1b[32mhttp://localhost:${PORT}/api\x1b[0m`);
    });
  })
  .catch(err => {
    console.error('Fatal database connection error:', err);
  });

// Error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  // Don't crash the server, just log the error
  console.error('Unhandled Rejection:', err);
});
