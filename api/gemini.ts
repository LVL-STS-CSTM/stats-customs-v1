
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

async function isAuthenticated(req: Request): Promise<boolean> {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const expectedToken = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
        return token === expectedToken;
    }
    return false;
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ message: 'Server configuration error: Missing API Key.' }), { status: 500 });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const body = await req.json();
        const { type, payload } = body;

        if (type === 'description' || type === 'review') {
            if (!(await isAuthenticated(req))) {
                return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
            }
        }

        if (type === 'description') {
            const { productName, category } = payload;
            const prompt = `Generate a compelling, short marketing description for a product.
            Product Name: ${productName}
            Category: ${category}
            The description should be about 2-3 sentences long. No markdown.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            return new Response(JSON.stringify({ text: response.text?.trim() || "Quality technical apparel." }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (type === 'review') {
            const { keywords } = payload;
            const prompt = `Generate a realistic customer review based on keywords: "${keywords}". JSON format.`;

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            author: { type: Type.STRING },
                            quote: { type: Type.STRING },
                        },
                        required: ["author", "quote"],
                    },
                },
            });
            
            return new Response(response.text, { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        
        } else if (type === 'advisor') {
            // Fix: Added advisor logic to handle chat history and product context
            const { messages, allProducts } = payload;
            
            // Provide specific product context to the model
            const productContext = allProducts.map((p: any) => 
                `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Group: ${p.categoryGroup}, Price: ${p.price ? `$${p.price}` : 'N/A'}, Description: ${p.description}`
            ).join('\n---\n');

            const systemInstruction = `You are a helpful AI Product Advisor for Level Customs, a Filipino custom apparel brand. 
            Your goal is to help users find the right products from our catalogue.
            
            Product Catalogue:
            ${productContext}
            
            Always be professional, encouraging, and informative. If asked about something not in the catalogue, politely guide them back to our offerings. 
            Keep responses concise and helpful. Use plain text only, no markdown.`;

            // Transform messages to Gemini SDK format
            const contents = messages.slice(1).map((m: any) => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            return new Response(JSON.stringify({ text: response.text || "I'm sorry, I couldn't process that request right now." }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else {
            return new Response(JSON.stringify({ message: 'Invalid generation type.' }), { status: 400 });
        }

    } catch (error: any) {
        console.error("Gemini API error:", error);
        return new Response(JSON.stringify({ message: 'AI Service Error', error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
