import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

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

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
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

    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    // Generate token
    const token = generateToken(user._id.toString());

    await user.save();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
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