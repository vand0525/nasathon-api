import express from 'express';
import { runChat } from '../services/llmService.js';
import { searchArticles } from '../services/searchService.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
	try {
		const { messages } = req.body;
		if (!messages) {
			return res.status(400).json({ error: 'messages are required...' });
		}
		const completion = await runChat(messages);
		res.json(completion);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Chat failed' });
	}
});

router.post('/search', async (req, res) => {
	try {
		const context = req.body;
		const results = await searchArticles(context);
		res.json(results);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Search failed' });
	}
});

export default router;
