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

    const prompt = `Generate 5 creative, romantic Indian wedding hashtags for ${brideName} and ${groomName} wedding${
      weddingDate ? ` on ${weddingDate}` : ""
    }. Make them catchy, unique, and shareable on Instagram. Return ONLY a JSON array of 5 strings like: ["#PriyaWedArjun", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown if AI returns it
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

    const prompt = `Write an emotional, cinematic 3-paragraph love story for ${brideName} and ${groomName}. Style: ${
      style || "romantic Bollywood"
    }. How they met: ${
      howTheyMet || "a chance encounter"
    }. Make it beautiful, poetic, and heartfelt — like a movie script narration. Max 200 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const story = response.text().trim();

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

    const prompt = `Translate this Indian wedding invitation text to ${targetLanguage}. Keep names in original script. Text: ${text}${
      coupleNames ? ` (Couple names: ${coupleNames})` : ""
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text().trim();

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

    const prompt = `Generate 5 fun questions about the couple ${brideName} and ${groomName} for a wedding quiz. 
    Context: How they met: ${howTheyMet || "unknown"}, Proposal: ${proposalStory || "unknown"}.
    Return ONLY a JSON array of objects with this structure: [{"question": string, "options": string[], "answer": number}] 
    The "answer" should be the index (0-3) of the correct option.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(jsonStr);

    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
