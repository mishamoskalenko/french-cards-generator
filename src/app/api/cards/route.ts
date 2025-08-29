import { NextResponse } from "next/server";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
// });

export async function POST(req: Request) {
    try {
        const { count, theme, language } = await req.json();
        // const completion = await openai.chat.completions.create({
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            // model: "openai/gpt-4o",
            messages: [
                {
                    role: "user",
                    content:
                        `
                    Generate ${count} French words with ${language} translations on the topic of ${theme}. Return ONLY valid JSON array, like this:[
        { "french": "bonjour", "${language}": "word in ${language}" }, ...] Do NOT add any explanations, text, or markdown (no json, no comments).
                    `,
                },
            ],
        });
        const text = completion.choices[0]?.message?.content || "[]";
        return NextResponse.json(JSON.parse(text));
    }
    catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}