import { GoogleGenAI } from "@google/genai";
import { Game } from "../types";
import { MOCK_GAMES } from "../constants";

// Initialize Gemini Client
// IMPORTANT: Using the recommended initialization pattern
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// System instruction to guide the AI's persona
const SYSTEM_INSTRUCTION = `
あなたは「OasysPark」の専属AIコンシェルジュです。
Oasysチェーンのエコシステム、ゲーム、トークン、NFTについて専門的な知識を持っています。
以下の情報を元に、ユーザーの質問に親切かつ簡潔に答えてください。
回答は常に日本語で行ってください。

【利用可能なゲームデータ】
${JSON.stringify(MOCK_GAMES.map(g => ({ title: g.title, category: g.category, desc: g.description, tags: g.tags })))}

あなたの役割：
1. ユーザーの好みに合わせたゲームの推奨。
2. Oasysチェーンの特徴（ガス代無料、高速処理など）の説明。
3. Web3初心者へのウォレットやNFTの解説。

トーン＆マナー：
- フランクだが丁寧。
- ゲーマー向けのかっこいい口調（例：「了解しました」「こちらの装備（ゲーム）がおすすめです」など）。
- 絵文字を適度に使用。
`;

export const getGeminiResponse = async (userPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "APIキーが設定されていません。環境変数をご確認ください。";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "申し訳ありません。現在応答できません。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AIサービスへの接続中にエラーが発生しました。しばらく待ってから再試行してください。";
  }
};
