import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const DRAMA_SYSTEM_INSTRUCTION = `
You are a professional theatre script generator.

Your task:
- Generate a complete stage-ready drama script.
- The script must be suitable for school or college performance.
- Balance all characters equally.
- Follow traditional theatre structure.

STRICT FORMAT RULES:
1. Start with:
Title
Tagline
Theme

2. Then include:
Plot Structure:
- Beginning
- Middle
- End

3. Then:
Characters List:
Each character must include:
Name
Age
Personality
Role in story
Costume suggestion

4. Then:
Acts and Scenes:
Clearly label Act 1, Act 2, etc.
Mention location of each scene.

5. Script Format Rules:
- Character names must be in ALL CAPS.
- Dialogue format: ASHISH: Dialogue here
- Narration must appear as: NARRATOR: Narration text
- Stage directions must appear inside brackets: (Lights dim) (Pause) (Crowd noise)

6. End the script with:
Motto
Slogan (if appropriate)
Final Call to Action

CRITICAL RULES:
- Do not use bullet points (except for plot/character breakdown).
- Do not explain anything.
- Do not add meta commentary.
- Output must be performance-ready.
- If number of characters is provided, strictly match that count.
- If no characters are provided, generate suitable ones automatically.
`;

export async function POST(req: Request) {
  try {
    const { topic, charCount, language, duration } = await req.json();

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json({ text: "Please provide a drama topic first." });
    }

    /* -------- LANGUAGE ENFORCEMENT -------- */
    let languageInstruction = "";
    const lang = language?.toLowerCase() || "hinglish";

    if (lang.includes("hindi")) {
      languageInstruction = "STRICT: Write the entire script in Hindi using Devanagari script only. Use high-impact theatrical vocabulary.";
    } else if (lang.includes("hinglish")) {
      languageInstruction = "STRICT: Write the entire script in Hinglish using Roman script only (e.g., 'Suno sab log!'). Natural mix of Hindi and English.";
    } else {
      languageInstruction = "STRICT: Write the entire script in English.";
    }

    /* -------- GENERATE SCRIPT -------- */
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Using the latest model for better drama flow
      systemInstruction: DRAMA_SYSTEM_INSTRUCTION,
    });

    const finalPrompt = `
    Social Topic: ${topic}
    Number of Characters: ${charCount}
    Requested Performance Time: ${duration} Minutes
    Language Instruction: ${languageInstruction}

    Write a complete, emotionally powerful stage-ready script. Ensure the length is appropriate for a ${duration} minute performance.
    `;

    const result = await model.generateContent(finalPrompt);

    return NextResponse.json({
      text: result.response.text()
    });

  } catch (error) {
    console.error("Drama Agent Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}