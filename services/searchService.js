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

		const imaginedArticle = JSON.parse(completion.choices[0].message.content);
		const basis = `${imaginedArticle.title}\n\n${imaginedArticle.abstract}\n\n${imaginedArticle.tl_dr}`;
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

		const getRerankPrompt = (rank, article) => `
This article was ranked ${rank} of 5 in a vector similarity search:

${JSON.stringify(article)}

The basis for the search was generated from this:
${JSON.stringify(imaginedArticle)}

Return a 1-2 sentence explanation for why it was chosen, and how it is relevant.
`;

		const enriched = await Promise.all(
			results.map(async (doc, i) => {
				const prompt = getRerankPrompt(i + 1, doc, imaginedArticle);
				const completion = await client.chat.completions.create({
					model: process.env.MODEL || 'gpt-4o-mini',
					messages: [{ role: 'user', content: prompt }],
					temperature: 0.3,
				});

				const reason = completion.choices[0].message.content.trim();
				return { ...doc, rank: i + 1, reason };
			})
		);

		return enriched.map(a => a.title);
	} catch (err) {
		console.error('Error generating article:', err);
		return { error: 'LLM generation failed' };
	}
}

export { searchArticles };

