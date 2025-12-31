
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const conductMarketResearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Conduct a deep competitive analysis and market size estimation for the following startup idea: ${query}. Focus on current trends (2024-2025).`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => chunk.web)
    .filter((web: any) => web)
    .map((web: any) => ({ title: web.title, uri: web.uri })) || [];

  return {
    analysis: response.text,
    sources
  };
};

export const generateStartupStrategy = async (idea: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a detailed Lean Canvas, GTM strategy, and potential pitfalls for: ${idea}`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 },
      maxOutputTokens: 4000
    }
  });
  return response.text;
};

export const generateBrandAsset = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `Professional startup logo or product mockup: ${prompt}. High-end tech aesthetic, clean, modern.` }],
    },
    config: {
      imageConfig: { aspectRatio }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
