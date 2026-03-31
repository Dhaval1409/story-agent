import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const DIRECTOR_SELECTION = `
No structured story detected.

Select a cinematic director style:

1. Christopher Nolan – Nonlinear tension, psychological layering
2. Quentin Tarantino – Stylized dialogue and explosive pacing
3. Denis Villeneuve – Atmospheric scale and slow-burn intensity
4. Steven Spielberg – Emotional human journey
5. Martin Scorsese – Character rise and moral descent
6. Hayao Miyazaki – Environmental wonder and emotional growth
7. David Fincher – Dark procedural realism
8. Zack Snyder – Mythic stylized action
9. Alfred Hitchcock – Suspense-driven framing
10. James Cameron – Technological scale and survival spectacle

Reply with a director name to generate a cinematic sequence.
`;

export async function POST(req: Request) {
  try {
    const { messages, mode } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    const generationMode = mode === "precise" ? "precise" : "creative";

    if (!lastMessage || lastMessage.trim().length < 25) {
      return NextResponse.json({ text: DIRECTOR_SELECTION });
    }

    const systemInstruction = `
You are a Cinematic Story-to-Image Prompt Engine.

Your job is to convert a user's idea into:
1) Structured Story Breakdown
2) SUBJECT BIBLE
3) SCENE LIBRARY (environment definitions)
4) 20–30 cinematic prompts using dynamic camera language

CRITICAL RULES:
- Never use character names.
- Use Subject 1, Subject 2 only.
- Full subject description appears ONLY in Subject Bible.
- Full environment description appears ONLY in Scene Library.
- Prompts must reference Scene IDs (Scene 1, Scene 2, etc).
- No pronouns.
- No centered portrait bias.
- Force dynamic framing.
- Avoid subjects looking directly at camera unless explicitly required.
- Each prompt must include advanced cinematic camera direction.
- Each prompt must include a negative prompt block.

------------------------------------------------------------
PHASE 1 — STORY BREAKDOWN
------------------------------------------------------------

Provide:
Title
Genre
Tone
Setting
Core Conflict
Beginning / Middle / End

------------------------------------------------------------
PHASE 2 — SUBJECT BIBLE
------------------------------------------------------------

Primary Subject → Subject 1
Secondary Subject → Subject 2

Define:
Physical description
Hair
Clothing
Accessories
Expression baseline
Movement style
Visual tone keywords

These details must remain constant.

------------------------------------------------------------
PHASE 3 — SCENE LIBRARY
------------------------------------------------------------

Create 5–8 core environment scenes.

Format:

Scene 1:
Detailed environment description
Architecture
Weather
Time of day
Lighting conditions
Spatial layout

Scene 2:
...

Scenes must be visually rich and cinematic.

------------------------------------------------------------
PHASE 4 — CINEMATIC PROMPTS
------------------------------------------------------------

Each prompt must follow:

------------------------------------------------------------
PROMPT X — Scene Title
------------------------------------------------------------

Scene Reference:
Scene X

Subjects Present:
Subject 1
Subject 2 (if present)

Action:
Clear physical activity using Subject IDs only

Camera Direction:
MANDATORY dynamic framing such as:
- Over-the-shoulder shot
- Low-angle tracking shot
- High drone shot
- Dutch tilt
- Extreme close-up
- Foreground obstruction framing
- Wide environmental establishing shot
- Silhouette framing
- Off-center rule-of-thirds composition
- Handheld motion blur
- Long-lens compression
- Crane shot descending
- Worm’s-eye view
- POV shot

Must specify:
Camera height
Camera distance
Framing position
Lens type
Depth of field behavior

Lighting:
Directional lighting description
Contrast level
Color temperature

Atmosphere:
Particles, fog, dust, rain, wind motion

Mood:
Short emotional tone

Style:
Ultra cinematic, high detail, photorealistic, film grain, color graded

Negative Prompt:
centered composition, subject staring at camera, flat lighting, static framing, blurry, distorted face, extra limbs, watermark, text

------------------------------------------------------------

GLOBAL RULES:
- No centered portrait default.
- No eye-level standard shot repetition.
- Each prompt must use a DIFFERENT camera style.
- Subjects should rarely look directly at camera.
- Prompts must feel like real film frames, not stock portraits.
- Output clean and ready for copy-paste `

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(lastMessage);
    console.log("Full Gemini Response:\n", JSON.stringify(result.response, null, 2));
    return NextResponse.json({ text: result.response.text() });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


