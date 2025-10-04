import OpenAI from 'openai';

import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({}, { strict: false });
const Article = mongoose.model('Article', ArticleSchema);

async function searchArticles(context) {
	const client = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
	try {
		const completion = await client.chat.completions.create({
			model: process.env.MODEL || 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: 'You are an assistant that generates imaginary scientific articles.',
				},
				{
					role: 'user',
					content: `Based on this chat context, create a JSON object that represents the *perfect article*:
          
          Chat Context:
          ${JSON.stringify(context, null, 2)}`,
				},
			],
			temperature: 0.7,
			response_format: {
				type: 'json_schema',
				json_schema: {
					name: 'article_schema',
					schema: {
						type: 'object',
						properties: {
							title: { type: 'string' },
							abstract: { type: 'string' },
							tl_dr: { type: 'string' },
						},
						required: ['title', 'abstract', 'tl_dr'],
						additionalProperties: false,
					},
				},
			},
		});

		const article = JSON.parse(completion.choices[0].message.content);
		const basis = `${article.title}\n\n${article.abstract}\n\n${article.tl_dr}`;
		const embeddingResp = await client.embeddings.create({
			model: process.env.EMBEDDER || 'text-embedding-3-small',
			input: basis,
		});

		const embedding = embeddingResp.data[0].embedding;

		const results = await Article.aggregate([
			{
				$vectorSearch: {
					index: 'vector_index',
					path: 'embedding',
					queryVector: embedding,
					numCandidates: 100,
					limit: 5,
				},
			},
			{
				$project: {
					pmid: 1,
					doi: 1,
					title: 1,
					abstract: 1,
					journal: 1,
					year: 1,
					authors: 1,
					tl_dr: 1,
					tags: 1,
					key_terms: 1,
					quotes: 1,
					score: { $meta: 'vectorSearchScore' },
				},
			},
		]);

		return {results};
	} catch (err) {
		console.error('Error generating article:', err);
		return { error: 'LLM generation failed' };
	}
}

export { searchArticles };
