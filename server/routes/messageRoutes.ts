import express, { Request, Response, NextFunction } from 'express';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { auth } from '../middleware/auth';
import AppError from '../utils/AppError';
import { body, validationResult } from 'express-validator'; // Import express-validator components

const router = express.Router();

type AuthRequest = Request & { user?: { userId: string } };

// Send a message
/**
 * @route POST /
 * @desc Send a message to a chat
 * @access Private
 */
const sendMessageValidationRules = [
  body('content').notEmpty().withMessage('Message content cannot be empty.').trim().escape(),
  body('chatId').notEmpty().withMessage('Chat ID cannot be empty.').isMongoId().withMessage('Invalid Chat ID format.')
];

router.post('/', auth, sendMessageValidationRules, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg).join(' ');
      return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }

    const { content, chatId } = req.body;

    // Manual validation removed as express-validator handles it
    // if (!content || !chatId) {
    //   return next(new AppError('Invalid data passed into request. Content and chatId are required.', 400));
    // }

    const newMessage = new Message({
      sender: req.user?.userId,
      content,
      chat: chatId,
      readBy: [req.user?.userId]
    });

    let message = await newMessage.save();
    message = await message.populate('sender', 'username avatar');
    message = await message.populate({
      path: 'chat',
      populate: {
        path: 'users',
        select: 'username avatar email'
      }
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    next(error);
  }
});

// Get all messages for a chat (paginated)
/**
 * @route GET /:chatId
 * @desc Get all messages for a chat (paginated)
 * @access Private
 */
router.get('/:chatId', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30;
    const skip = parseInt(req.query.skip as string) || 0;
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username avatar email')
      .populate('chat')
      .populate('readBy', 'username avatar email');

    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// Mark message as read
/**
 * @route PUT /read
 * @desc Mark a message as read
 * @access Private
 */
router.put('/read', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: req.user?.userId } },
      { new: true }
    )
      .populate('sender', 'username avatar email')
      .populate('chat')
      .populate('readBy', 'username avatar email');

    if (!message) {
      return next(new AppError('Message not found with that ID.', 404));
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
});

// Add or remove a reaction to a message
/**
 * @route PATCH /:messageId/reactions
 * @desc Add or remove a reaction to a message
 * @access Private
 */
router.patch('/:messageId/reactions', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { emoji } = req.body;
    const userId = req.user?.userId;
    if (!emoji || !userId) {
      return next(new AppError('Emoji and userId are required for reactions.', 400));
    }
    // Check if user already reacted with this emoji
    const message = await Message.findById(req.params.messageId);
    if (!message) return next(new AppError('Message not found with that ID.', 404));
    const existing = message.reactions?.find(r => r.userId.toString() === userId && r.emoji === emoji);
    let updated;
    if (existing) {
      // Remove reaction
      updated = await Message.findByIdAndUpdate(
        req.params.messageId,
        { $pull: { reactions: { userId, emoji } } },
        { new: true }
      );
    } else {
      // Add reaction
      updated = await Message.findByIdAndUpdate(
        req.params.messageId,
        { $push: { reactions: { userId, emoji } } },
        { new: true }
      );
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export const messageRoutes = router;