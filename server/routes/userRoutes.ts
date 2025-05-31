import express, { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';
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
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Received registration request:', { name, email, role });

    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          role: !role ? 'Role is required' : null
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
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
  } catch (error: any) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        details: validationErrors
      });
    }

    res.status(500).json({ 
      message: 'Server error during registration',
      details: error.message
    });
  }
});

// Login user
/**
 * @route POST /login
 * @desc Login user and return JWT
 * @access Public
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.warn('Login failed: user not found for email', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn('Login failed: password mismatch for email', email);
      return res.status(400).json({ message: 'Invalid credentials' });
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
  } catch (error: any) {
    console.error('Login error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    res.status(500).json({ message: 'Server error during login', details: error?.message });
  }
});

// Get user profile
/**
 * @route GET /profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
/**
 * @route PUT /profile
 * @desc Update current user's profile
 * @access Private
 */
router.put('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, avatar, status } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (typeof status === 'string') user.status = status;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout user
/**
 * @route POST /logout
 * @desc Logout user (client should clear token)
 * @access Private
 */
router.post('/logout', auth, async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password - Send OTP
/**
 * @route POST /forgot-password
 * @desc Send OTP to user's university email
 * @access Public
 */
router.post('/forgot-password', forgotPasswordLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'If this email is registered, you will receive an OTP.' });
    const user = await User.findOne({ email });
    // Always return generic message for security
    if (!user || user.role !== 'student') {
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
  } catch (error: any) {
    console.error('Forgot-password error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    return res.status(500).json({ message: 'Failed to process request.' });
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
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return res.status(400).json({ message: 'All fields are required' });
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }
    const user = await User.findOne({ email });
    // Always return generic error for security
    if (!user) return res.status(400).json({ message: 'Invalid OTP or email.' });
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) return res.status(400).json({ message: 'Invalid OTP or email.' });
    user.password = password;
    await user.save();
    await redisClient.del(`otp:${email}`);
    res.json({ message: 'Password reset successful' });
  } catch (error: any) {
    console.error('Reset-password error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    res.status(500).json({ message: 'Failed to reset password.' });
  }
});

export const userRoutes = router;