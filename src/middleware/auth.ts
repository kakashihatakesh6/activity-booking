import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as jwt.JwtPayload;

    // Get user from the token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
}; 