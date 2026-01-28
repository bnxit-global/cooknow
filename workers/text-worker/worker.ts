export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)

    // -----------------------------
    // Discovery (GET)
    // -----------------------------
    if (request.method === 'GET' && url.pathname === '/discovery') {
      return new Response(
        JSON.stringify({
          popular: [
            {
              id: '101',
              name: 'Truffle Risotto',
              popularity: '98%',
              region: 'Italy',
            },
            {
              id: '102',
              name: 'Wagyu Beef Bowl',
              popularity: '84%',
              region: 'Japan',
            },
            {
              id: '103',
              name: 'Lobster Thermidor',
              popularity: '72%',
              region: 'France',
            },
          ],
          history: [],
          inventory: ['Egg', 'Rice', 'Tomato', 'Basil'],
          local_nodes: ['New York', 'Tokyo', 'Paris'],
        }),
        { headers: { 'content-type': 'application/json' } }
      )
    }

    // -----------------------------
    // Recipe Generation (POST)
    // -----------------------------
    if (request.method === 'POST') {
      try {
        const body = await request.json()

        const userPrompt = body.prompt
        const recipeName = (body.recipeName || '').trim()
        const ingredients = Array.isArray(body.ingredients)
          ? body.ingredients
          : []
        const country = (body.country || '').trim()

        let prompt = userPrompt

        if (!prompt) {
          const styleList = [
            'Rustic',
            'Modern Fine Dining',
            'Comfort Food',
            'Street Food',
            'Avant-Garde',
          ]

          const style = styleList[Math.floor(Math.random() * styleList.length)]

          const parts = [
            `You are a culinary AI. Create a UNIQUE ${style} style 1-person recipe.`,
          ]

          if (recipeName) {
            parts.push(`The recipe name must be "${recipeName}".`)
          }

          if (ingredients.length) {
            parts.push(
              `Use some or all of these ingredients: ${ingredients.join(', ')}.`
            )
          }

          if (country) {
            parts.push(`Prefer ${country} cuisine and authentic local naming.`)
          }

          parts.push(
            `Respond ONLY with valid JSON including:
id, name, country, story, cookingTime, ingredients (array), instructions (array).`
          )

          prompt = parts.join(' ')
        }

        const aiResponse = await env.AI.run(
          '@cf/mistral/mistral-7b-instruct-v0.2-lora',
          {
            messages: [
              { role: 'system', content: 'You generate recipes in JSON only.' },
              { role: 'user', content: prompt },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }
        )

        let recipe

        try {
          const raw =
            aiResponse.response || aiResponse.text || JSON.stringify(aiResponse)

          recipe = JSON.parse(raw.replace(/```json|```/gi, '').trim())
        } catch {
          recipe = {
            id: `error-${Date.now()}`,
            name: recipeName || 'Mystery Recipe',
            country: country || 'Global',
            story: 'Fallback recipe due to parsing issue.',
            cookingTime: '15 min',
            ingredients: ingredients.length ? ingredients : ['Creativity'],
            instructions: ['Please try again.'],
          }
        }

        // -----------------------------
        // Final enforcement (minimal)
        // -----------------------------
        if (recipeName) recipe.name = recipeName
        if (!recipe.country) recipe.country = country || 'Global'

        return new Response(JSON.stringify(recipe), {
          headers: { 'content-type': 'application/json' },
        })
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
          status: 500,
          headers: { 'content-type': 'application/json' },
        })
      }
    }

    return new Response('Worker Online', { status: 200 })
  },
}
