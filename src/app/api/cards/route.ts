import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Mistral } from "@mistralai/mistralai";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || "" });

export async function POST(req: Request) {
    try {
        const { count, theme, language, storage } = await req.json();
        const provider = ( process.env.LLM_PROVIDER || "mistral").toLowerCase();
        const exclude: string[] = Array.isArray(storage) ? storage.slice(-200) : [];
        const exclusionList = JSON.stringify(exclude);
        const prompt = `Generate ${count} French words with ${language} translations on the topic of ${theme}. Do NOT include any word from the following exclusion list (French, case- and accent-insensitive match): ${exclusionList}. Return ONLY valid JSON array, like this:[{ "french": "bonjour", "translated": "word in ${language}" }, ...] Do NOT add any explanations, text, or markdown (no json, no comments).`;

        if (provider === "mistral") {
            const chatResponse = await mistral.chat.complete({
                model: "mistral-medium-2508",
                messages: [
                    { role: "user", content: prompt }
                ],
                responseFormat: { type: 'json_object' },
            });
            const raw = chatResponse.choices[0]?.message?.content;
            const text: string = typeof raw === "string" ? raw : "[]";
            return NextResponse.json(JSON.parse(text));
        }
        else {
            const completion = await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",
                messages: [
                    { role: "user", content: prompt }
                ],
            });
            const text = completion.choices[0]?.message?.content || "[]";
            return NextResponse.json(JSON.parse(text));
        }
    }
    catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}