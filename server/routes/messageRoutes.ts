import express, { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { auth } from '../middleware/auth';

const router = express.Router();

type AuthRequest = Request & { user?: { userId: string } };

// Send a message
/**
 * @route POST /
 * @desc Send a message to a chat
 * @access Private
 */
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({ message: 'Invalid data passed into request' });
    }

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
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages for a chat (paginated)
/**
 * @route GET /:chatId
 * @desc Get all messages for a chat (paginated)
 * @access Private
 */
router.get('/:chatId', auth, async (req: AuthRequest, res: Response) => {
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
/**
 * @route PUT /read
 * @desc Mark a message as read
 * @access Private
 */
router.put('/read', auth, async (req: AuthRequest, res: Response) => {
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
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or remove a reaction to a message
/**
 * @route PATCH /:messageId/reactions
 * @desc Add or remove a reaction to a message
 * @access Private
 */
router.patch('/:messageId/reactions', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { emoji } = req.body;
    const userId = req.user?.userId;
    if (!emoji || !userId) {
      return res.status(400).json({ message: 'Emoji and user required' });
    }
    // Check if user already reacted with this emoji
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
});

export const messageRoutes = router;