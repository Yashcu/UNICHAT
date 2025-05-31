import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';
const redisUrl = `redis://${redisHost}:${redisPort}`;
const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err: unknown) => {
  console.error('Redis Client Error', err);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;
