import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        
        // We take the last message as the prompt, but we can pass history in a real app
        const latestMessage = messages[messages.length - 1].content;
        
        const systemInstruction = `
        You are the ImpexTech AI Sales Consultant. 
        You help Nigerian customers choose between imported used gadgets from Canada.
        Your tone should be helpful, professional, and directly address their needs.
        If they ask for pricing or comparisons (like iPad Air M1 vs M2), provide practical advice 
        and remind them that all our products are Canada-sourced, IMEI verified, and have a 7-day guarantee.
        Keep answers relatively concise.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: latestMessage,
            config: {
                systemInstruction,
            }
        });

        return NextResponse.json({ reply: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: 'Sorry, I am having trouble connecting to my brain right now.' }, 
            { status: 500 }
        );
    }
}
