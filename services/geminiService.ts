
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeDocumentImage(base64Data: string, mimeType: string): Promise<string> {
  const prompt = `
    You are a meticulous document analysis expert. The user has provided an image of a document, which is in Thai.
    Your task is to:
    1.  Carefully examine the document in the image.
    2.  Identify the type of document (e.g., invoice, financial report, inventory list, etc.).
    3.  Provide a concise summary of the document's main purpose and content.
    4.  If the document contains a table, extract the data and present it in a clean, easy-to-read markdown table format.
    5.  Extract any other key information, such as totals, company names, dates, or transaction IDs.
    
    Present your analysis in a clear, structured manner.
  `;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing document image:", error);
    throw new Error("Failed to analyze the document. The AI model might be busy or the image could not be processed. Please try again.");
  }
}