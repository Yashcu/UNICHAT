import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/**
 * POST /api/assistant
 * Uses Puter.js API (no key required) to generate a response from GPT-4o
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ response: 'No prompt provided.' });
  }

  try {
    // Use Puter.js public API endpoint
    const puterRes = await fetch('https://api.puter.com/v2/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await puterRes.json();
    const aiMessage = data?.response || 'No response.';
    res.json({ response: aiMessage });
  } catch (err) {
    const error = err as Error; // Keep existing error casting
    next(error); // Pass the error to the centralized handler
  }
});

export default router;
