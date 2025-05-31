import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { chatRoutes } from './routes/chatRoutes';
import { messageRoutes } from './routes/messageRoutes';
import circularRoutes from './routes/circularRoutes';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unichat', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/v1/', apiLimiter);
app.use('/api/v1/users', (req, res, next) => {
  try {
    return userRoutes(req, res, next);
  } catch (err: any) {
    console.error('Error in /api/v1/users route:', err);
    res.status(500).json({ message: 'Internal server error', error: err?.message || err });
  }
});
app.use('/api/v1/chats', (req, res, next) => {
  try {
    return chatRoutes(req, res, next);
  } catch (err: any) {
    console.error('Error in /api/v1/chats route:', err);
    res.status(500).json({ message: 'Internal server error', error: err?.message || err });
  }
});
app.use('/api/v1/messages', (req, res, next) => {
  try {
    return messageRoutes(req, res, next);
  } catch (err: any) {
    console.error('Error in /api/v1/messages route:', err);
    res.status(500).json({ message: 'Internal server error', error: err?.message || err });
  }
});
app.use('/api/v1/circulars', (req, res, next) => {
  try {
    return circularRoutes(req, res, next);
  } catch (err: any) {
    console.error('Error in /api/v1/circulars route:', err);
    res.status(500).json({ message: 'Internal server error', error: err?.message || err });
  }
});

// Remove old /api/ routes if present

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});