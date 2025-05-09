import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Helper function to check database connection
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

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  try {
    // First check database connection
    const db = checkDatabaseConnection();
    if (!db.connected) {
      res.status(503).json({
        success: false,
        error: `Database connection unavailable (Status: ${db.status}). Authentication cannot be performed.`
      });
      return;
    }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Not authorized to access this route. No authentication token provided.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as jwt.JwtPayload;
      
      if (!decoded || !decoded.id) {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid token format or missing user ID in token' 
        });
        return;
      }

      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid user ID format in token' 
        });
        return;
      }

      console.log(`Authenticating user with ID: ${decoded.id}`);

      // Get user from the token
      const user = await User.findById(decoded.id);
      
      if (!user) {
        res.status(401).json({ 
          success: false, 
          error: 'User not found. Token may be invalid or user may have been deleted.' 
        });
        return;
      }

      console.log(`User ${user._id} successfully authenticated`);
      
      // Add user to request
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token. Please log in again.' 
      });
      return;
    }
  } catch (error: any) {
    console.error('Authentication middleware error:', error);
    
    // Check if this is a MongoDB-specific error
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(503).json({
        success: false,
        error: 'Database operation failed during authentication. Please try again later.'
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Authentication system error. Please try again later.' 
    });
  }
}; 