import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you might want to handle this more gracefully,
    // but for this context, throwing an error is sufficient.
    throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const queryPdfContent = async (context: string, question: string, customInstructions: string): Promise<string> => {
    const model = 'gemini-2.5-flash';

    const finalPrompt = `
        ${customInstructions.trim()}

        CONTEXT:
        ---
        ${context}
        ---

        QUESTION: ${question}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: finalPrompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Provide a user-friendly error message
        return "An error occurred while communicating with the AI. Please check the console for details and try again later.";
    }
};