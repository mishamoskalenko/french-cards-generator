import { NextResponse } from "next/server";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { count, theme, language, storage } = await req.json();
        const exclude: string[] = Array.isArray(storage) ? storage.slice(-200) : [];
        const exclusionList = JSON.stringify(exclude);
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content:
                        `Generate ${count} French words with ${language} translations on the topic of ${theme}. Do NOT include any word from the following exclusion list (French, case- and accent-insensitive match): ${exclusionList}. Return ONLY valid JSON array, like this:[
                        { "french": "bonjour", "${language}": "word in ${language}" }, ...] Do NOT add any explanations, text, or markdown (no json, no comments).`,
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