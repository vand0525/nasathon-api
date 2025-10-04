import OpenAI from 'openai';

export async function runChat(messages) {
	const client = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const res = await client.chat.completions.create({
		model: process.env.MODEL || 'gpt-4o-mini',
		messages,
	});

	return res.choices[0].message.content;
}
