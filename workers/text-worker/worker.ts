export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // -----------------------------
    // 1. Discovery Endpoint (GET)
    // -----------------------------
    if (url.pathname.includes('/discovery')) {
        const TRENDING_RECIPES = [
            { id: '101', name: 'Truffle Risotto', popularity: '98%', region: 'Italy' },
            { id: '102', name: 'Wagyu Beef Bowl', popularity: '84%', region: 'Japan' },
            { id: '103', name: 'Lobster Thermidor', popularity: '72%', region: 'France' }
        ];

        return new Response(JSON.stringify({
            popular: TRENDING_RECIPES,
            history: [],
            inventory: ["Egg", "Rice", "Tomato", "Basil"],
            local_nodes: ["New York", "Tokyo", "Paris"]
        }), {
            headers: { 'content-type': 'application/json' }
        });
    }

    // -----------------------------
    // 2. Recipe Generation Endpoint (POST)
    // -----------------------------
    if (request.method === 'POST') {
        try {
            const { prompt } = await request.json();
            if (!prompt) return new Response('Missing prompt', { status: 400 });

            // AI call
            const response = await env.AI.run("@hf/google/gemma-7b-it", {
                messages: [
                    { role: 'system', content: 'You are a culinary AI. Generate a creative recipe in JSON format.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1000,
                temperature: 0.7
            });

            // Safe JSON parsing
            let recipe;
            try {
                // Cloudflare AI response is typically { response: "string" }
                const rawText = response.response || response.text || JSON.stringify(response);
                // Cleanup markdown if present
                const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
                recipe = JSON.parse(cleanText);
            } catch (err) {
                console.error("JSON Parse Error:", err);
                recipe = {
                    id: `error-${Date.now()}`,
                    name: "Mystery Recipe",
                    story: response.text || "Recipe generation experienced a hiccup, but here is a placeholder.",
                    cookingTime: "15 min",
                    ingredients: ["Creativity", "Patience"],
                    instructions: ["Please try generating again."]
                };
            }

            return new Response(JSON.stringify(recipe), {
                headers: { 'content-type': 'application/json' }
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: `${e}` }), {
                status: 500,
                headers: { 'content-type': 'application/json' }
            });
        }
    }

    // -----------------------------
    // 3. Default Response
    // -----------------------------
    return new Response(
        'Worker Online. POST to / for recipe generation or GET /discovery for sample data.',
        { status: 200 }
    );
  },
};
