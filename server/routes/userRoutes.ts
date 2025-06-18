import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';
import AppError from '../utils/AppError'; // Import AppError
import nodemailer from 'nodemailer';
import redisClient from '../utils/redisClient';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Helper type for routes that need req.user
// (This is optional, but helps TypeScript know req.user exists)
type AuthRequest = Request & { user?: { userId: string } };

// Rate limiter for forgot-password endpoint (5 requests per hour per IP)
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    message: 'Too many password reset requests from this IP, please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register a new user
/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Received registration request:', { name, email, role });

    // Validate required fields
    if (!name || !email || !password || !role) {
      return next(new AppError('All fields are required: name, email, password, role.', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User with this email already exists.', 400));
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role
    });

    console.log('Attempting to save new user:', { name, email, role });
    await user.save();
    console.log('User saved successfully');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
/**
 * @route POST /login
 * @desc Login user and return JWT
 * @access Public
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    const error = err as Error;
    console.error('Login error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    next(error);
  }
});

// Get user profile
/**
 * @route GET /profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/profile', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return next(new AppError('User not found.', 404));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
/**
 * @route PUT /profile
 * @desc Update current user's profile
 * @access Private
 */
router.put('/profile', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, bio, avatar, status } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (typeof status === 'string') user.status = status;

    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Logout user
/**
 * @route POST /logout
 * @desc Logout user (client should clear token)
 * @access Private
 */
router.post('/logout', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Server-side logout actions if any (e.g., blacklist token)
    // For simple JWT, client clears token.
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// Forgot Password - Send OTP
/**
 * @route POST /forgot-password
 * @desc Send OTP to user's university email
 * @access Public
 */
router.post('/forgot-password', forgotPasswordLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required.', 400));
    const user = await User.findOne({ email });
    // Always return generic message for security
    if (!user || user.role !== 'student') { // For operational errors we want to show, this is fine
      return res.status(200).json({ message: 'If this email is registered, you will receive an OTP.' });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in Redis for 10 min
    await redisClient.set(`otp:${email}`, otp, { EX: 600 });
    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Unichat Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    });
    return res.status(200).json({ message: 'If this email is registered, you will receive an OTP.' });
  } catch (err) {
    const error = err as Error;
    console.error('Forgot-password error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    next(error);
  }
});

// Password strength validation helper
function isStrongPassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

// Reset Password with OTP
/**
 * @route POST /reset-password
 * @desc Reset password using OTP
 * @access Public
 */
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return next(new AppError('All fields are required: email, otp, password.', 400));
    if (!isStrongPassword(password)) {
      return next(new AppError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.', 400));
    }
    const user = await User.findOne({ email });
    // For security, keep generic messages for invalid OTP/email, but use AppError for flow
    if (!user) return next(new AppError('Invalid OTP or email.', 400));
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) return next(new AppError('Invalid OTP or email.', 400));
    user.password = password;
    await user.save();
    await redisClient.del(`otp:${email}`);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    const error = err as Error;
    console.error('Reset-password error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    next(error);
  }
});

export const userRoutes = router;