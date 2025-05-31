import express, { Request, Response } from 'express';
import redisClient from '../utils/redisClient';
import { Circular } from '../models/Circular';

const router = express.Router();

// Example: Get all circulars with Redis caching
router.get('/', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'circulars:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // Fetch from DB
    const circulars = await Circular.find().sort({ postedAt: -1 }).lean();
    await redisClient.set(cacheKey, JSON.stringify(circulars), { EX: 60 }); // 1 min cache
    res.json(circulars);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
