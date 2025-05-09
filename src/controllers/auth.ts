import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

// Helper function to check database connection
const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
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
    // Check database connection
    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database connection unavailable'
      });
      return;
    }

    const { name, email, phone, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token
    });
  } catch (error: any) {
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
    // Check database connection
    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database connection unavailable'
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
      token
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 