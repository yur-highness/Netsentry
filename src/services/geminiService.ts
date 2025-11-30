import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import type{ AnalysisResult, GeoData, DNSRecord } from '../types';

let aiClient: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

export const analyzeNetworkData = async (
  target: string,
  geoData: GeoData | null,
  dnsRecords: DNSRecord[] | null,
  scanLogs: string
): Promise<AnalysisResult> => {
  const ai = getAiClient();
  if (!ai) {
    return {
      riskScore: 0,
      summary: "API Key missing. Cannot perform AI analysis.",
      recommendations: ["Configure API Key"],
      threatLevel: 'Low'
    };
  }

  const prompt = `
    Analyze the following network intelligence data for target: ${target}.
    
    Geo Intelligence: ${JSON.stringify(geoData)}
    DNS Records: ${JSON.stringify(dnsRecords)}
    Additional Logs/Context: ${scanLogs}

    Provide a JSON response assessing the security posture, identifying potential risks (e.g., exposed services, risky ISP, misconfigured DNS), and assigning a risk score (0-100).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            threatLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("AI Analysis Failed", error);
    return {
      riskScore: 0,
      summary: "AI Analysis failed due to an error.",
      recommendations: ["Check network connection", "Verify API quota"],
      threatLevel: 'Low'
    };
  }
};

export const generateTraceAnalysis = async (hops: any[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI unavailable.";

  const prompt = `
    Analyze this simulated or real network traceroute path:
    ${JSON.stringify(hops)}

    Identify potential bottlenecks, routing anomalies, packet loss, jitter, or high-latency hops. Keep it brief and technical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (e) {
    return "Analysis failed.";
  }
};

export const sendChatToAI = async (message: string, context: string = ''): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "AI capabilities are unavailable. Check API Key.";

    if (!chatSession) {
        chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are NetSentry AI, an expert Senior Network Engineer and Cybersecurity Analyst. 
                You provide technical, concise, and accurate responses about network diagnostics, IP routing, DNS, and security protocols.
                If the user provides logs or JSON data, analyze it for anomalies.
                Keep responses professional and suited for a terminal/console interface.`,
            }
        });
    }

    try {
        const fullMessage = context ? `Context: ${context}\n\nUser Question: ${message}` : message;
        const response: GenerateContentResponse = await chatSession.sendMessage({ message: fullMessage });
        return response.text || "No response received.";
    } catch (e) {
        console.error("Chat Error", e);
        return "Error processing request. Please try again.";
    }
}

export const generateNetworkConfig = async (vendor: string, requirements: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "AI unavailable.";

    const prompt = `
      Act as a Senior Network Engineer. Generate a configuration snippet for a ${vendor} device.
      
      Requirements:
      ${requirements}

      Provide ONLY the configuration code block. Do not add conversational text. Add comments inside the code explaining complex lines.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "# Error generating config";
    } catch (e) {
      return "# Failed to generate configuration";
    }
};
