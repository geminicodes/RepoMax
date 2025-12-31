"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToneContextForPrompt = formatToneContextForPrompt;
exports.generateTextWithGemini = generateTextWithGemini;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const httpError_1 = require("../errors/httpError");
function formatToneContextForPrompt(tone) {
    if (!tone)
        return "Tone analysis unavailable.";
    const keywords = tone.culturalSignals.keywords.join(", ") || "none";
    return `Tone ${tone.tone} (confidence ${tone.confidence}), Cultural Keywords: ${keywords}, Sentiment: ${tone.sentiment.score}`;
}
async function generateTextWithGemini(params) {
    const env = (0, env_1.getEnv)();
    if (!env.GEMINI_API_KEY) {
        throw new httpError_1.HttpError({
            statusCode: 503,
            publicMessage: "AI service is not configured.",
            internalMessage: "Missing GEMINI_API_KEY"
        });
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(env.GEMINI_API_KEY);
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
//# sourceMappingURL=geminiService.js.map