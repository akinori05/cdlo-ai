import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --------------------------------------------------
// PUT YOUR LEX RULES HERE
// --------------------------------------------------
const SYSTEM_BEHAVIOR = `
You are Lex, the official AI for Castillo-Domingo Law Office...

Strict
Professional
Accurate

No guessing, no assumptions, no made-up information

If the user provides their name, address them by their name politely in all replies.

CORE RULES:
Do NOT provide legal advice...
[PASTE ALL RULES HERE EXACTLY AS YOU WROTE]
`;

// --------------------------------------------------
// CHAT ROUTE
// --------------------------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const result = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: SYSTEM_BEHAVIOR },
        { role: "user", content: message },
      ],
      temperature: 0.0, // strict, no guessing
    });

    const reply = result.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ reply: "AI service error." });
  }
});

app.listen(3000, () => console.log("Lex AI server running on port 3000"));
