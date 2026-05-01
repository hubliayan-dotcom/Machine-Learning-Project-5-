import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  sentiment: Sentiment;
  confidence: number;
  explanation: string;
  key_phrases: string[];
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the sentiment of the following social media text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            enum: ['positive', 'negative', 'neutral'],
            description: "The emotional tone of the text."
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score between 0 and 1."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation of why this sentiment was chosen."
          },
          key_phrases: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key words or phrases that influenced the sentiment."
          }
        },
        required: ["sentiment", "confidence", "explanation", "key_phrases"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as SentimentResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    // Fallback
    return {
      sentiment: 'neutral',
      confidence: 0,
      explanation: "Analysis failed due to response format.",
      key_phrases: []
    };
  }
}

export async function analyzeBatchSentiment(texts: string[]): Promise<SentimentResult[]> {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  // To save tokens and calls, we can batch them in one prompt if not too many
  // But for reliability in a student project demo, we'll do them in parallel with a limit
  // Or just a single call with an array schema.
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the sentiment of these ${texts.length} social media texts: ${JSON.stringify(texts)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            key_phrases: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["sentiment", "confidence", "explanation", "key_phrases"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]') as SentimentResult[];
  } catch (e) {
    console.error("Batch parsing failed");
    return texts.map(() => ({
      sentiment: 'neutral',
      confidence: 0.5,
      explanation: "Batch analysis error",
      key_phrases: []
    }));
  }
}
