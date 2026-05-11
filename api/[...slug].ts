import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY ||
  "";
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel(
  { model: "gemini-2.0-flash" },
  baseUrl ? { baseUrl } : undefined
);

function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const slugParts: string[] = Array.isArray(req.query.slug)
    ? req.query.slug
    : [req.query.slug];
  const route = slugParts.join("/");

  try {
    if (route === "healthz") {
      res.json({ status: "ok" });
      return;
    }

    if (route === "ai/hashtag" && req.method === "POST") {
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
      return;
    }

    if (route === "ai/story" && req.method === "POST") {
      const { brideName, groomName, howTheyMet, style } = req.body;
      if (!brideName || !groomName) {
        res.status(400).json({ error: "brideName and groomName are required" });
        return;
      }
      const prompt = `Write an emotional, cinematic 3-paragraph love story for ${brideName} and ${groomName}. Style: ${style || "romantic Bollywood"}. How they met: ${howTheyMet || "a chance encounter"}. Make it beautiful, poetic, and heartfelt — like a movie script narration. Max 200 words.`;
      const result = await model.generateContent(prompt);
      const story = result.response.text().trim();
      res.json({ story });
      return;
    }

    if (route === "ai/translate" && req.method === "POST") {
      const { text, targetLanguage, coupleNames } = req.body;
      if (!text || !targetLanguage) {
        res.status(400).json({ error: "text and targetLanguage are required" });
        return;
      }
      const prompt = `Translate this Indian wedding invitation text to ${targetLanguage}. Keep names in original script. Text: ${text}${coupleNames ? ` (Couple names: ${coupleNames})` : ""}`;
      const result = await model.generateContent(prompt);
      const translation = result.response.text().trim();
      res.json({ translation });
      return;
    }

    if (route === "ai/quiz" && req.method === "POST") {
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
      return;
    }

    if (route === "ai/vows" && req.method === "POST") {
      const { brideName, groomName, writerName, role, tone, keywords } = req.body;
      if (!brideName || !groomName) {
        res.status(400).json({ error: "brideName and groomName are required" });
        return;
      }
      const roleText =
        role === "bride"
          ? brideName
          : role === "groom"
          ? groomName
          : writerName || "someone special";
      const prompt = `Write beautiful, heartfelt wedding vows from ${roleText} to ${role === "bride" ? groomName : role === "groom" ? brideName : `${brideName} & ${groomName}`}. Tone: ${tone || "romantic and emotional"}. Include these themes: ${keywords || "love, commitment, forever, journey"}. Make it personal, poetic, and memorable. Around 150-200 words. Format as flowing paragraphs.`;
      const result = await model.generateContent(prompt);
      const vows = result.response.text().trim();
      res.json({ vows });
      return;
    }

    if (route === "ai/speech" && req.method === "POST") {
      const { brideName, groomName, speakerName, speakerRole, tone, memories } = req.body;
      if (!brideName || !groomName) {
        res.status(400).json({ error: "brideName and groomName are required" });
        return;
      }
      const prompt = `Write a wedding speech/toast for ${speakerName || "the best man/maid of honour"} (role: ${speakerRole || "friend"}) for the wedding of ${brideName} and ${groomName}. Tone: ${tone || "warm, funny, and heartfelt"}. Shared memories to include: ${memories || "years of friendship, adventures, support"}. Include: an opening joke or warm opener, personal anecdotes, heartfelt wishes, and a toast. Around 250-300 words. Make it memorable and moving.`;
      const result = await model.generateContent(prompt);
      const speech = result.response.text().trim();
      res.json({ speech });
      return;
    }

    if (route === "ai/caption" && req.method === "POST") {
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
      return;
    }

    if (route === "ai/seating" && req.method === "POST") {
      const { guestCount, tableCount, guestNames } = req.body;
      const prompt = `Suggest seating arrangement for ${guestCount || 50} wedding guests across ${tableCount || 5} tables. Guest list: ${(guestNames || []).join(", ") || "various guests"}. Group families together and separate any potential conflicts. Return ONLY a JSON array of tables: [{"table": 1, "guests": ["Name1", "Name2", ...]}]. Each table should have roughly equal guests.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const seating = JSON.parse(jsonStr);
      res.json({ seating });
      return;
    }

    res.status(404).json({ error: "Route not found" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
