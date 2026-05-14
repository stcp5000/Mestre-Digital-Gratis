import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API routes
app.post("/api/generate-hashtags", async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 20 popular and relevant hashtags for the following topic: ${topic}. Return only the hashtags separated by spaces, starting with #.`,
    });
    
    res.json({ hashtags: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate hashtags" });
  }
});

app.post("/api/spell-check", async (req, res) => {
  const { text, tone, language } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const prompt = `You are a professional editor. Correct the following text for spelling, grammar, and punctuation. 
    Language: ${language || 'Portuguese'}
    Tone requested: ${tone || 'Standard'}
    Original Text: ${text}
    
    Return the corrected text only. Do not include explanations, notes, or any other content. If the text is already perfect according to the tone, return it as is.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    res.json({ correctedText: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to process spell check" });
  }
});

app.post("/api/checklist/suggest", async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const prompt = `Você é um especialista em produtividade. Crie uma lista de até 10 tarefas essenciais para um checklist sobre o seguinte tema: "${topic}".
    Para cada tarefa, sugira também uma duração aproximada (ex: "15 min", "1 hora").
    Retorne o resultado estritamente no formato JSON como um array de objetos: [{"text": "nome da tarefa", "duration": "duração"}].`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    // Parse the JSON directly if possible, or return the text for the client to parse
    const data = JSON.parse(response.text || "[]");
    res.json({ suggestions: data });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
