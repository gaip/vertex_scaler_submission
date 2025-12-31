
import { VertexAI, GoogleSearchRetrieval } from '@google-cloud/vertexai';

const getAI = () => {
  return new VertexAI({
    project: process.env.REACT_APP_VERTEX_AI_PROJECT_ID || '',
    location: process.env.REACT_APP_VERTEX_AI_LOCATION || 'us-central1',
  });
};

const getGenerativeModel = (modelName: string, tools?: any[]) => {
    const vertex_ai = getAI();
    return vertex_ai.getGenerativeModel({
        model: modelName,
        tools: tools
    });
}

export const conductMarketResearch = async (query: string) => {
  const generativeModel = getGenerativeModel('gemini-1.5-flash-preview-0409', [new GoogleSearchRetrieval()]);

  const result = await generativeModel.generateContent(`Conduct a deep competitive analysis and market size estimation for the following startup idea: ${query}. Focus on current trends (2024-2025).`);
  const response = await result.response;
  const text = response.candidates[0].content.parts[0].text;
  const sources = response.candidates[0].groundingMetadata.groundingAttributions.map((attribution: any) => ({
      title: attribution.web.title,
      uri: attribution.web.uri
  }));


  return {
    analysis: text,
    sources: sources
  };
};

export const generateStartupStrategy = async (idea: string) => {
  const generativeModel = getGenerativeModel('gemini-1.5-pro-preview-0409');

  const result = await generativeModel.generateContent(`Generate a detailed Lean Canvas, GTM strategy, and potential pitfalls for: ${idea}`);
  const response = await result.response;
  return response.candidates[0].content.parts[0].text;
};

export const generateBrandAsset = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  const generativeModel = getGenerativeModel('imagen-3.0-generate-image');

  const result = await generativeModel.generateContent(`Professional startup logo or product mockup: ${prompt}. High-end tech aesthetic, clean, modern.`);
  const response = await result.response;
  const image = response.candidates[0].content.parts[0].fileData;
  return `data:${image.mimeType};base64,${image.data}`;
};
