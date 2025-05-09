import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Create a colored method output
  let method = req.method;
  let methodColor = '';
  
  switch (method) {
    case 'GET':
      methodColor = '\x1b[32m'; // Green
      break;
    case 'POST':
      methodColor = '\x1b[34m'; // Blue
      break;
    case 'PUT':
    case 'PATCH':
      methodColor = '\x1b[33m'; // Yellow
      break;
    case 'DELETE':
      methodColor = '\x1b[31m'; // Red
      break;
    default:
      methodColor = '\x1b[0m'; // Default
  }
  
  // Log request when it's received
  console.log(`\x1b[36m[${new Date().toISOString()}]\x1b[0m ${methodColor}${method}\x1b[0m: ${req.originalUrl}`);
  
  // Store original send method
  const originalSend = res.send;
  
  // Override send method to intercept responses
  res.send = function(body) {
    const duration = Date.now() - start;
    let statusColor = '';
    
    // Color status code based on type
    if (res.statusCode >= 500) {
      statusColor = '\x1b[31m'; // Red
    } else if (res.statusCode >= 400) {
      statusColor = '\x1b[33m'; // Yellow
    } else if (res.statusCode >= 300) {
      statusColor = '\x1b[36m'; // Cyan
    } else if (res.statusCode >= 200) {
      statusColor = '\x1b[32m'; // Green
    }
    
    console.log(`\x1b[36m[${new Date().toISOString()}]\x1b[0m ${methodColor}${method}\x1b[0m: ${req.originalUrl} ${statusColor}${res.statusCode}\x1b[0m - ${duration}ms`);
    
    // Call original send
    return originalSend.call(this, body);
  };
  
  next();
}; 