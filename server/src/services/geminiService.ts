import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEnv } from "../config/env";
import { HttpError } from "../errors/httpError";
import type { ToneAnalysis } from "@readyrepo/shared";

export function formatToneContextForPrompt(tone: ToneAnalysis | null | undefined) {
  if (!tone) return "Tone analysis unavailable.";
  const keywords = tone.culturalSignals.keywords.join(", ") || "none";
  return `Tone ${tone.tone} (confidence ${tone.confidence}), Cultural Keywords: ${keywords}, Sentiment: ${tone.sentiment.score}`;
}

export async function generateTextWithGemini(params: {
  prompt: string;
  temperature?: number;
}): Promise<string> {
  const env = getEnv();
  if (!env.GEMINI_API_KEY) {
    throw new HttpError({
      statusCode: 503,
      publicMessage: "AI service is not configured.",
      internalMessage: "Missing GEMINI_API_KEY"
    });
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: {
      temperature: params.temperature ?? 0.4
    }
  });

  const result = await model.generateContent(params.prompt);
  const text = result.response.text();
  return text?.trim() ?? "";
}

