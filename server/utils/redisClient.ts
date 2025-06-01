import dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';

console.log('Connecting to Redis with config:', {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD ? '******' : null,
});

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('Redis client connected');
    }
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();

export default redisClient;
