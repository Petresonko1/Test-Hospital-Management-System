
import { GoogleGenAI, Type } from "@google/genai";
import { Patient } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMedicalInsights = async (patient: Patient) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this patient's data and provide medical insights, potential next steps, and dietary recommendations:
      Name: ${patient.name}
      Age: ${patient.age}
      Condition: ${patient.condition}
      Current Status: ${patient.status}
      History: ${JSON.stringify(patient.history)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            dietPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "risks", "recommendations", "dietPlan"]
        }
      }
    });

    // Directly access .text property
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return null;
  }
};

export const getSymptomsAnalysis = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Acting as a medical assistant, provide a preliminary analysis for these symptoms: ${symptoms}. 
      Disclaimer: This is not a diagnosis. Suggest possible departments for consultation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            suggestedDepartments: { type: Type.ARRAY, items: { type: Type.STRING } },
            urgencyLevel: { type: Type.STRING, description: "Low, Medium, or Emergency" }
          },
          required: ["analysis", "suggestedDepartments", "urgencyLevel"]
        }
      }
    });

    // Directly access .text property
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    return null;
  }
};
