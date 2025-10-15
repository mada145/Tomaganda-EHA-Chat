import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you might want to handle this more gracefully,
    // but for this context, throwing an error is sufficient.
    throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const queryPdfContent = async (
    contextGeneral: string,
    contextPortSaid: string,
    question: string,
    systemInstructions: string
): Promise<string> => {
    const model = 'gemini-2.5-flash';

    // The user's direct query and the context documents form the main content.
    const userContent = `
        CONTEXT_GENERAL:
        ---
        ${contextGeneral}
        ---

        CONTEXT_PORTSAID:
        ---
        ${contextPortSaid}
        ---

        QUESTION: ${question}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            // Separate the system instruction from the main content for a more robust request.
            config: {
                systemInstruction: systemInstructions.trim(),
            },
            // The main content is the user's query with the provided context.
            contents: userContent,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Provide a more specific user-friendly error message
        return "An error occurred while communicating with the AI. The request may be too large or there could be a temporary network issue. Please simplify your question or try again later.";
    }
};
