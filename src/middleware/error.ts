import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Validation error handler middleware
export const validationErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

// Error response interface
interface ErrorResponse extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
}

// Error handler middleware
export const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev with colorized output
  console.error('\x1b[31m[ERROR]\x1b[0m', `${req.method}: ${req.originalUrl}`);
  console.error('\x1b[31m[ERROR]\x1b[0m', `${err.name || 'Error'}: ${err.message}`);
  
  if (err.stack) {
    console.error('\x1b[33m[STACK]\x1b[0m', err.stack.split('\n').slice(1).join('\n'));
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    res.status(404).json({ success: false, error: message });
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    res.status(400).json({ success: false, error: message });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err).map((val: any) => val.message).join(', ');
    res.status(400).json({ success: false, error: message });
    return;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
}; 