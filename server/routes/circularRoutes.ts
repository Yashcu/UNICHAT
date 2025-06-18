import express, { Request, Response, NextFunction } from 'express';
import redisClient from '../utils/redisClient';
import { Circular } from '../models/Circular';

const router = express.Router();

// Example: Get all circulars with Redis caching
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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
    next(err);
  }
});

export default router;
