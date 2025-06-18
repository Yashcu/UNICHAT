// import { Request } from 'express'; // Removed unused import

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export {}; // Ensure this file is treated as a module
