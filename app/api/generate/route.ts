import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const IS_CONFIGURED = !!ACCOUNT_ID && !!API_TOKEN;

async function runAI(model: string, input: any) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return response;
}

export async function POST(req: NextRequest) {
  if (!IS_CONFIGURED) {
    return NextResponse.json(
      { error: "Cloudflare credentials missing. Check .env.local" },
      { status: 500 }
    );
  }

  try {
    const { ingredients } = await req.json();

    // Add randomness to the prompt to ensure variety
    const styles = ["Rustic", "Modern Fine Dining", "Comfort Food", "Street Food", "Avant-Garde"];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    const prompt = `
      You are a creative professional chef. Create a UNIQUE, ${randomStyle} style 1-person recipe using some or all of these ingredients: ${ingredients.join(", ")}.
      Do NOT repeat generic recipes. Be creative with flavors.
      You must output ONLY valid JSON in this exact format:
      {
        "id": "gen-${randomSeed}",
        "name": "Creative Recipe Name",
        "story": "A short, appetizing description (max 2 sentences) describing the ${randomStyle} style.",
        "cookingTime": "XX min",
        "ingredients": ["ing1", "ing2", ...],
        "instructions": ["step 1", "step 2", ...]
      }
    `;

    // 1. Generate text
    const textRes = await runAI("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: "You are a JSON-only API. Output strictly valid JSON. No markdown." },
        { role: "user", content: prompt }
      ]
    });

    if (!textRes.ok) throw new Error(`Text Gen Failed: ${textRes.statusText}`);
    const textData = await textRes.json();
    let recipeRaw = textData.result.response;

    // Cleanup markdown
    recipeRaw = recipeRaw.replace(/```json/g, "").replace(/```/g, "").trim();

    let recipe;
    try {
        recipe = JSON.parse(recipeRaw);
    } catch (e) {
        // Fallback for bad JSON
        console.error("JSON Parse Error", e);
        throw new Error("AI produced invalid JSON");
    }

    // 2. Generate Image
    const imagePrompt = `high end food photography, ${recipe.name}, ${randomStyle} style, detailed texture, 8k resolution, cinematic lighting, photorealistic, delicious`;

    try {
      const imageRes = await runAI("@cf/stabilityai/stable-diffusion-xl-base-1.0", {
        prompt: imagePrompt
      });

      if (!imageRes.ok) throw new Error("Image Gen Failed");

      const arrayBuffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      recipe.imageUrl = `data:image/png;base64,${base64}`;
    } catch (imageError) {
      console.error("Image Generation Error:", imageError);
      // Robust Fallback Image (Generic Food)
      recipe.imageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80";
    }

    return NextResponse.json(recipe);

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
