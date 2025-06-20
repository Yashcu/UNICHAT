// Custom error class to create operational errors
class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // All errors created with this class are operational

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
