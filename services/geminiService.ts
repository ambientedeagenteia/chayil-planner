import { GoogleGenAI } from "@google/genai";

export const getBusinessAdvice = async (context: string) => {
  // Fix: Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Using gemini-3-pro-preview for complex reasoning tasks like coaching
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Como coach de negócios para mulheres empreendedoras, analise este cenário e dê 3 dicas práticas e motivadoras: ${context}`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "Desculpe, tive um problema ao me conectar com minha sabedoria digital. Tente novamente em breve!";
  }
};

export const generateContentIdeas = async (niche: string) => {
  // Fix: Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Using gemini-3-flash-preview for basic creative brainstorming tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere 5 ideias de conteúdo criativo para uma empreendedora no nicho de ${niche}. Retorne em formato de lista com bullet points.`,
      config: {
        temperature: 0.9,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating ideas:", error);
    return "Não consegui gerar ideias agora. Que tal olhar suas referências salvas?";
  }
};