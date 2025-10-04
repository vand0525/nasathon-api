import express from 'express';
import {searchArticles} from '../services/searchService.js';

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const context = req.body; 
    const results = await searchArticles(context);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;