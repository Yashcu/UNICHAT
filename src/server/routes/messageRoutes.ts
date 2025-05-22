import express from 'express';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { auth } from '../middleware/auth';

const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
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

// Get all messages for a chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'username avatar email')
      .populate('chat')
      .populate('readBy', 'username avatar email');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/read', auth, async (req, res) => {
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

export const messageRoutes = router; 