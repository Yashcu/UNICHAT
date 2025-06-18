import express, { Request, Response, NextFunction } from 'express';
import { Chat } from '../models/Chat';
import { auth } from '../middleware/auth';

const router = express.Router();

type AuthRequest = Request & { user?: { userId: string } };

// Create a new chat
/**
 * @route POST /
 * @desc Create a new one-on-one chat
 * @access Private
 */
router.post('/', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'UserId param not sent with request' });
    }

    // Check if chat already exists
    const chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    })
      .populate('users', '-password')
      .populate('latestMessage');

    if (chat.length > 0) {
      return res.json(chat[0]);
    }

    // Create new chat
    const newChat = new Chat({
      chatName: 'sender',
      isGroupChat: false,
      users: [currentUserId, userId]
    });

    const savedChat = await newChat.save();
    const fullChat = await Chat.findOne({ _id: savedChat._id }).populate('users', '-password');

    res.status(201).json(fullChat);
  } catch (error) {
    next(error);
  }
});

// Get all chats for a user
/**
 * @route GET /
 * @desc Get all chats for the current user
 * @access Private
 */
router.get('/', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user?.userId } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    next(error);
  }
});

// Create group chat
/**
 * @route POST /group
 * @desc Create a new group chat
 * @access Private
 */
router.post('/group', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const parsedUsers = JSON.parse(users);
    if (parsedUsers.length < 2) {
      return res.status(400).json({ message: 'More than 2 users are required to form a group chat' });
    }

    parsedUsers.push(req.user?.userId);

    const groupChat = new Chat({
      name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user?.userId
    });

    const savedGroupChat = await groupChat.save();
    const fullGroupChat = await Chat.findOne({ _id: savedGroupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    next(error);
  }
});

// Rename group chat
/**
 * @route PUT /rename
 * @desc Rename a group chat
 * @access Private
 */
router.put('/rename', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name: chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(updatedChat);
  } catch (error) {
    next(error);
  }
});

// Add user to group
/**
 * @route PUT /groupadd
 * @desc Add a user to a group chat
 * @access Private
 */
router.put('/groupadd', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(added);
  } catch (error) {
    next(error);
  }
});

// Remove user from group
/**
 * @route PUT /groupremove
 * @desc Remove a user from a group chat
 * @access Private
 */
router.put('/groupremove', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(removed);
  } catch (error) {
    next(error);
  }
});

export const chatRoutes = router;