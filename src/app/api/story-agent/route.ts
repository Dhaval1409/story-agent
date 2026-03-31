// /api/story-agent/route.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

/* --------------------------------------------------
   DIRECTOR LIST
-------------------------------------------------- */

const DIRECTOR_LIST = `
Select a storytelling style:

1. Christopher Nolan
2. Quentin Tarantino
3. Denis Villeneuve
4. Steven Spielberg
5. Martin Scorsese
6. Hayao Miyazaki
7. David Fincher
8. Zack Snyder
9. Alfred Hitchcock
10. James Cameron

Reply with the director name only.
`;

/* --------------------------------------------------
   LANGUAGE SELECTION
-------------------------------------------------- */

const LANGUAGE_SELECTION = `
Which language should the narration be written in?

Options:
- English
- Hindi (Devanagari script)
- Hinglish (Roman script only)

Reply with the exact option.
`;

/* --------------------------------------------------
   STORY SYSTEM INSTRUCTION
-------------------------------------------------- */

const STORY_SYSTEM_INSTRUCTION = `
You are a cinematic narration engine.

Your task:
- Write a powerful cinematic story meant to be spoken aloud.
- Follow the storytelling rhythm and tone of the selected director.
- Keep natural spoken pacing.
- Avoid bullet points.
- Avoid screenplay formatting.
- Avoid meta commentary.
- No technical explanation.
- Pure immersive narration only.

Output format:

Title

Logline (1–2 lines)

Full cinematic narration in flowing paragraphs.

Use short paragraph spacing for dramatic pauses.
Keep sentences natural for voiceover delivery.
Focus on mood, sensory imagery, tension, and emotional depth.

CRITICAL LANGUAGE RULE:
You must strictly follow the selected language instruction.
Do not mix scripts.
`;

/* --------------------------------------------------
   POST HANDLER
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const { idea, director, language } = await req.json();

    if (!idea || idea.trim().length < 5) {
      return NextResponse.json({
        text: "Please provide a story idea first."
      });
    }

    if (!director) {
      return NextResponse.json({
        text: DIRECTOR_LIST
      });
    }

    if (!language) {
      return NextResponse.json({
        text: LANGUAGE_SELECTION
      });
    }

    /* -------- LANGUAGE ENFORCEMENT -------- */
    /* -------- LANGUAGE ENFORCEMENT -------- */
let languageInstruction = "";
const lang = language.toLowerCase();

if (lang.includes("hindi")) {
  languageInstruction = "Write the entire story strictly in Hindi using Devanagari script only. Do not use English words.";
} else if (lang.includes("hinglish")) {
  languageInstruction = "Write the entire story in Hinglish using Roman script only. Do NOT use Devanagari script.";
} else {
  languageInstruction = "Write the entire story strictly in English.";
}

    /* -------- GENERATE STORY -------- */
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: STORY_SYSTEM_INSTRUCTION,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    const finalPrompt = `
Director Style: ${director}

Language Instruction:
${languageInstruction}

Story Idea:
${idea}

Write the complete cinematic narrated story.
`;

    const result = await model.generateContent(finalPrompt);

    // Log full JSON response in terminal
    console.log("Full JSON Response:\n", JSON.stringify(result.response, null, 2));

    return NextResponse.json({
      text: result.response.text()
    });

  } catch (error) {
    console.error("Story Agent Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
