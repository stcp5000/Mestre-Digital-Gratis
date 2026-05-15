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

// Simple visitor counter (in-memory)
let visitorCount = 1240; // Starting with a base number to look better

// API routes
app.get("/api/visitor-count", (req, res) => {
  visitorCount++;
  res.json({ count: visitorCount });
});
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

app.post("/api/cta/generate", async (req, res) => {
  const { context, niche, focus, tone } = req.body;
  if (!context) {
    return res.status(400).json({ error: "Context is required" });
  }

  try {
    const prompt = `Você é um Copywriter de Resposta Direta e especialista em conversão (CRO). 
    Gere uma lista de 6 CTAs (Call to Actions) persuasivos para o seguinte contexto: "${context}".
    
    O nicho do negócio é: "${niche}".
    O foco principal deve ser: "${focus}".
    O estilo de design/tom solicitado pelo usuário é: "${tone}".

    Para cada CTA, forneça:
    1. O texto do CTA propriamente dito (curto, impactante e direto).
    2. O tipo de abordagem (ex: Urgência, Autoridade, Curiosidade, Benefício Direto).
    3. Uma breve explicação estratégica do porquê esse CTA funciona (gatilho mental utilizado).

    Retorne o resultado EXCLUSIVAMENTE no formato JSON com a chave "ctas":
    {
      "ctas": [
        {
          "cta": "Texto do Botão ou Chamada",
          "type": "Tipo de Abordagem",
          "why": "Explicação estratégica curta"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = JSON.parse(response.text || '{"ctas": []}');
    res.json(data);
  } catch (error: any) {
    console.error("Gemini CTA Error:", error);
    res.status(500).json({ error: "Failed to generate CTAs" });
  }
});

app.post("/api/brand-names/generate", async (req, res) => {
  const { keywords, niche, tone } = req.body;
  if (!keywords) {
    return res.status(400).json({ error: "Keywords are required" });
  }

  try {
    const prompt = `Você é um especialista em branding e naming profissional. Gere uma lista de 8 nomes criativos para uma nova marca baseada no seguinte conceito: "${keywords}".
    O nicho de mercado é: "${niche}".
    O tom da marca deve ser: "${tone}".

    Para cada nome sugerido, forneça também uma tagline curta (slogan) e o tipo de nome (ex: Abstrato, Composto, Neologismo, Descritivo).
    
    Retorne o resultado estritamente no formato JSON como um objeto com a chave "names":
    {
      "names": [
        {"name": "Nome", "tagline": "Slogan criativo", "type": "Tipo de nome"}
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = JSON.parse(response.text || '{"names": []}');
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Naming Error:", error);
    res.status(500).json({ error: "Failed to generate brand names" });
  }
});

app.post("/api/caption/generate", async (req, res) => {
  const { topic, niche, objective, tone } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const prompt = `Você é um Social Media Manager e estrategista de conteúdo de elite. 
    Gere 5 legendas irresistíveis para um post sobre: "${topic}".
    
    Nicho: "${niche}"
    Objetivo: "${objective}"
    Tom de voz: "${tone}"

    Para cada legenda, inclua:
    1. O corpo da legenda (usando emojis, espaçamento e quebras de linha para legibilidade).
    2. Uma sugestão de 5-10 hashtags estratégicas.
    3. Uma sugestão de CTA (Call to Action) integrado.

    Retorne o resultado EXCLUSIVAMENTE no formato JSON com a chave "captions":
    {
      "captions": [
        {
          "body": "Texto da legenda aqui...",
          "hashtags": ["#tag1", "#tag2"],
          "cta": "Link na bio | Comenta aqui"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = JSON.parse(response.text || '{"captions": []}');
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Caption Error:", error);
    res.status(500).json({ error: "Failed to generate captions" });
  }
});

app.post("/api/titles/generate", async (req, res) => {
  const { topic, platform, style } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const prompt = `Você é um Especialista em SEO e Estrategista de Conteúdo de Elite. 
    Sua missão é gerar uma lista de 8 títulos de altíssima performance para o seguinte assunto: "${topic}".
    
    Plataforma alvo: "${platform}"
    Estilo/Tom solicitado pelo usuário: "${style}" (Ex: Divertido, Clássico, Viral, Profissional)

    Para cada título, forneça:
    1. O título propriamente dito (otimizado para SEO, cliques e curiosidade, usando palavras-chave poderosas).
    2. A estratégia psicológica ou de SEO por trás (ex: Gatilho de Escassez, Palavra-chave de cauda longa, Curiosidade extrema).
    3. Uma estimativa de CTR Score de 1 a 100.
    4. Uma sugestão de 3 tags SEO relevantes.

    Retorne o resultado EXCLUSIVAMENTE no formato JSON com a chave "titles":
    {
      "titles": [
        {
          "title": "O Título Matador",
          "strategy": "Explicação curta da estratégia",
          "score": 95,
          "tags": ["tag1", "tag2", "tag3"]
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = JSON.parse(response.text || '{"titles": []}');
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Title Gen Error:", error);
    res.status(500).json({ error: "Failed to generate titles" });
  }
});

app.post("/api/shopping-list/suggest", async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const prompt = `Você é um assistente de compras inteligente. Sugira uma lista de até 12 itens essenciais para uma lista de compras com o seguinte contexto: "${topic}".
    Organize por categorias (ex: Hortifruti, Carnes, Limpeza, etc).
    Retorne o resultado estritamente no formato JSON como um array de objetos: [{"name": "nome do item", "category": "categoria"}].`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = JSON.parse(response.text || "[]");
    res.json({ suggestions: data });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate shopping list suggestions" });
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
