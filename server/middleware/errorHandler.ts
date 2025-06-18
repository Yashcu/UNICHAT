import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean; // To distinguish between operational and programmer errors
  status?: 'fail' | 'error'; // Added status property based on usage
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'; // 'fail' for 4xx, 'error' for 5xx

  console.error('ERROR 💥', err); // Log the error for the developer

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // Programming or other unknown error: don't leak error details
  } else {
    // For non-production, send more details
    if (process.env.NODE_ENV !== 'production') {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
      });
    } else {
      // Generic message for production
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
};

export default errorHandler;
