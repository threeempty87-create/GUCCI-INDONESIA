import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStylistResponse = async (
  promptText: string,
  imageBase64?: string,
  mimeType?: string
): Promise<string> => {
  try {
    // Using gemini-2.5-flash for both text-only and multimodal (text + image) tasks
    // as it is efficient and capable of vision tasks.
    const model = 'gemini-2.5-flash';

    const parts: any[] = [{ text: promptText }];

    if (imageBase64 && mimeType) {
      parts.unshift({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: "You are a knowledgeable and sophisticated Gucci Client Advisor. Your tone is professional, warm, and elevated—luxury retail standard. You assist clients with styling advice, product details, and pairing recommendations from the Gucci collection. Keep responses concise (under 100 words) but helpful. If the user uploads an image, analyze it for fashion context (color, style, occasion) and suggest matching Gucci items. Use Indonesian or English depending on the user's language.",
      }
    });

    return response.text || "Mohon maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, sistem Advisor sedang sibuk. Mohon coba beberapa saat lagi.";
  }
};