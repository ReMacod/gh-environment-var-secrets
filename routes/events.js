import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import db from '../data/database.js';

const router = Router();

const eventsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for event routes
});

router.get('/', async (req, res) => {
  const allEvents = await db.collection('events').find().toArray();
  res.json({ events: allEvents });
});

router.post('/', eventsRateLimiter, async (req, res) => {
  const eventData = req.body;
  const result = await db.collection('events').insertOne({ ...eventData });
  res.status(201).json({
    message: 'Event created.',
    event: { ...eventData, id: result.insertedId },
  });
});

export default router;
