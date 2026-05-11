import { Router, type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel(
  { model: "gemini-2.0-flash" },
  { baseUrl }
);

// POST /api/ai/hashtag
router.post("/hashtag", async (req: Request, res: Response) => {
  try {
    const { brideName, groomName, weddingDate } = req.body;
    if (!brideName || !groomName) {
      res.status(400).json({ error: "brideName and groomName are required" });
      return;
    }
    const prompt = `Generate 5 creative, romantic Indian wedding hashtags for ${brideName} and ${groomName} wedding${weddingDate ? ` on ${weddingDate}` : ""}. Make them catchy, unique, and shareable on Instagram. Return ONLY a JSON array of 5 strings like: ["#PriyaWedArjun", ...]`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const hashtags = JSON.parse(jsonStr);
    res.json({ hashtags });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/story
router.post("/story", async (req: Request, res: Response) => {
  try {
    const { brideName, groomName, howTheyMet, style } = req.body;
    if (!brideName || !groomName) {
      res.status(400).json({ error: "brideName and groomName are required" });
      return;
    }
    const prompt = `Write an emotional, cinematic 3-paragraph love story for ${brideName} and ${groomName}. Style: ${style || "romantic Bollywood"}. How they met: ${howTheyMet || "a chance encounter"}. Make it beautiful, poetic, and heartfelt — like a movie script narration. Max 200 words.`;
    const result = await model.generateContent(prompt);
    const story = result.response.text().trim();
    res.json({ story });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/translate
router.post("/translate", async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, coupleNames } = req.body;
    if (!text || !targetLanguage) {
      res.status(400).json({ error: "text and targetLanguage are required" });
      return;
    }
    const prompt = `Translate this Indian wedding invitation text to ${targetLanguage}. Keep names in original script. Text: ${text}${coupleNames ? ` (Couple names: ${coupleNames})` : ""}`;
    const result = await model.generateContent(prompt);
    const translation = result.response.text().trim();
    res.json({ translation });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/quiz
router.post("/quiz", async (req: Request, res: Response) => {
  try {
    const { brideName, groomName, howTheyMet, proposalStory } = req.body;
    if (!brideName || !groomName) {
      res.status(400).json({ error: "brideName and groomName are required" });
      return;
    }
    const prompt = `Generate 5 fun questions about the couple ${brideName} and ${groomName} for a wedding quiz. Context: How they met: ${howTheyMet || "unknown"}, Proposal: ${proposalStory || "unknown"}. Return ONLY a JSON array of objects with this structure: [{"question": string, "options": string[], "answer": number}] The "answer" should be the index (0-3) of the correct option.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(jsonStr);
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/vows — AI Wedding Vow / Speech Writer
router.post("/vows", async (req: Request, res: Response) => {
  try {
    const { brideName, groomName, writerName, role, tone, keywords } = req.body;
    if (!brideName || !groomName) {
      res.status(400).json({ error: "brideName and groomName are required" });
      return;
    }
    const roleText = role === "bride" ? brideName : role === "groom" ? groomName : writerName || "someone special";
    const prompt = `Write beautiful, heartfelt wedding vows from ${roleText} to ${role === "bride" ? groomName : role === "groom" ? brideName : `${brideName} & ${groomName}`}. Tone: ${tone || "romantic and emotional"}. Include these themes: ${keywords || "love, commitment, forever, journey"}. Make it personal, poetic, and memorable. Around 150-200 words. Format as flowing paragraphs.`;
    const result = await model.generateContent(prompt);
    const vows = result.response.text().trim();
    res.json({ vows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/speech — Wedding Toast / Speech Writer
router.post("/speech", async (req: Request, res: Response) => {
  try {
    const { brideName, groomName, speakerName, speakerRole, tone, memories } = req.body;
    if (!brideName || !groomName) {
      res.status(400).json({ error: "brideName and groomName are required" });
      return;
    }
    const prompt = `Write a wedding speech/toast for ${speakerName || "the best man/maid of honour"} (role: ${speakerRole || "friend"}) for the wedding of ${brideName} and ${groomName}. Tone: ${tone || "warm, funny, and heartfelt"}. Shared memories to include: ${memories || "years of friendship, adventures, support"}. Include: an opening joke or warm opener, personal anecdotes, heartfelt wishes, and a toast. Around 250-300 words. Make it memorable and moving.`;
    const result = await model.generateContent(prompt);
    const speech = result.response.text().trim();
    res.json({ speech });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/caption — Photo Caption Generator
router.post("/caption", async (req: Request, res: Response) => {
  try {
    const { brideName, groomName, photoType } = req.body;
    const prompts: Record<string, string> = {
      couple: `Write a short, romantic Instagram-style caption (max 15 words) for a couple's wedding photo of ${brideName || "the bride"} and ${groomName || "the groom"}. Make it poetic and heartfelt.`,
      preWedding: `Write a short, dreamy caption (max 15 words) for a pre-wedding shoot photo. Romantic and elegant.`,
      family: `Write a warm, loving caption (max 12 words) for a family photo at an Indian wedding. Include words about blessings and togetherness.`,
    };
    const prompt = prompts[photoType] || prompts.couple;
    const result = await model.generateContent(prompt);
    const caption = result.response.text().trim().replace(/^["']|["']$/g, "");
    res.json({ caption });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/seating — Seating arrangement suggestions
router.post("/seating", async (req: Request, res: Response) => {
  try {
    const { guestCount, tableCount, guestNames } = req.body;
    const prompt = `Suggest seating arrangement for ${guestCount || 50} wedding guests across ${tableCount || 5} tables. Guest list: ${(guestNames || []).join(", ") || "various guests"}. Group families together and separate any potential conflicts. Return ONLY a JSON array of tables: [{"table": 1, "guests": ["Name1", "Name2", ...]}]. Each table should have roughly equal guests.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const seating = JSON.parse(jsonStr);
    res.json({ seating });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
