import { Recipe } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const WORKER_TEXT_URL = process.env.NEXT_PUBLIC_WORKER_TEXT_URL
const WORKER_IMAGE_URL = process.env.NEXT_PUBLIC_WORKER_IMAGE_URL

const IS_CONFIGURED = !!WORKER_TEXT_URL && !!WORKER_IMAGE_URL

export async function POST(req: NextRequest) {
  if (!IS_CONFIGURED) {
    console.warn('Worker URLs missing, falling back to legacy or error.')
    // For now we error, but in a real app might want more robust handling
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      return NextResponse.json(
        { error: 'System not configured. Missing Worker URLs.' },
        { status: 500 }
      )
    }
    // If legacy env vars exist, we could fallback, but let's encourage the new path.
  }

  try {
    const { ingredients, userInput, country } = await req.json()

    // Add randomness to the prompt to ensure variety
    const styles = [
      'Rustic',
      'Modern Fine Dining',
      'Comfort Food',
      'Street Food',
      'Avant-Garde',
    ]
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    const uniqueId = crypto.randomUUID()

    const countryClause =
      country && country.trim().length > 0
        ? `Prefer ${country} cuisine, and use authentic local recipe names and flavors typical of ${country}.`
        : ''

    let prompt = ''

    // Detect if userInput is a recipe name or ingredients list
    const isRecipeNameRequest =
      userInput && !userInput.includes(',') && userInput.split(' ').length <= 4

    if (isRecipeNameRequest) {
      prompt = `
        You are a world-class professional chef. The user specifically wants a recipe for: "${userInput}".
        Create a premium, ${randomStyle} version of this dish.
        ${countryClause}
        You must output ONLY valid JSON in this exact format:
        {
          "id": "${uniqueId}",
          "name": "${userInput}",
          "country": "${country ? country : 'Global'}",
          "story": "A quick, appetizing story about this specific version of ${userInput} in ${randomStyle} style.",
          "cookingTime": "XX min",
          "ingredients": ["ing1", "ing2", ...],
          "instructions": ["step 1", "step 2", ...]
        }
      `
    } else {
      prompt = `
        You are a creative professional chef. Create a UNIQUE, ${randomStyle} style 1-person recipe using some or all of these ingredients: ${ingredients.join(', ')}.
        ${countryClause}
        Do NOT repeat generic recipes. Be creative with flavors and where applicable use traditional naming conventions.
        You must output ONLY valid JSON in this exact format:
        {
          "id": "${uniqueId}",
          "name": "Creative Recipe Name",
          "country": "${country ? country : 'Global'}",
          "story": "A short, appetizing description (max 2 sentences) describing the ${randomStyle} style.",
          "cookingTime": "XX min",
          "ingredients": ["ing1", "ing2", ...],
          "instructions": ["step 1", "step 2", ...]
        }
      `
    }

    // 1. Generate text using Worker
    let recipe
    try {
      const textRes = await fetch(WORKER_TEXT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ingredients, userInput, country }),
      })

      if (!textRes.ok) {
        const errorBody = await textRes.text()
        console.error(`Text Worker Error (${textRes.status}):`, errorBody)
        throw new Error(`Text Worker Failed: ${errorBody}`)
      }

      recipe = (await textRes.json()) as Recipe

      // Ensure ID is unique even if hallucinated
      if (
        !recipe.id ||
        recipe.id.includes('gen-') ||
        recipe.id.includes('error-')
      ) {
        recipe.id = uniqueId
      }

      // Ensure recipe includes country information
      if (!recipe.country) recipe.country = country || 'Global'
    } catch (e) {
      console.error('Text Gen Error', e)
      // Fallback or re-throw
      throw new Error(`Failed to generate recipe text: ${e}`)
    }

    // 2. Generate Image using Worker
    // Create a much more descriptive prompt based on the SPECIFIC recipe
    const ingredientList = recipe.ingredients.slice(0, 5).join(', ')
    const countryPhrase =
      recipe.country && recipe.country !== 'Global'
        ? `${recipe.country} cuisine styling`
        : ''
    const imagePrompt = `professional food photography of ${recipe.name}, featuring ${ingredientList}, ${randomStyle} plating, ${countryPhrase}, gourmet presentation, macro shot, highly detailed, 8k, cinematic lighting, soft bokeh background`

    try {
      const imageRes = await fetch(WORKER_IMAGE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      })

      if (!imageRes.ok) {
        const errorBody = await imageRes.text()
        console.error(`Image Worker Error (${imageRes.status}):`, errorBody)
        throw new Error(`Image Worker Failed: ${errorBody}`)
      }

      const arrayBuffer = await imageRes.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      recipe.imageUrl = `data:image/png;base64,${base64}`
    } catch (imageError) {
      console.error('Image Generation Error:', imageError)
      // Robust Fallback Image (Generic Food)
      recipe.imageUrl =
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
