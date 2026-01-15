import { Ai } from '@cloudflare/ai';

export interface Env {
  AI: any;
}

// Mock Data for Discovery Features
const TRENDING_RECIPES = [
  { id: '101', name: 'Cyber Ramen v3', popularity: '98%', region: 'District 7' },
  { id: '102', name: 'Neural Gnocchi', popularity: '84%', region: 'Cloud Core' },
  { id: '103', name: 'Quantum Toast', popularity: '72%', region: 'Edge Node' }
];

const RECIPE_HISTORY = [
  { id: '201', name: 'Protocol Scrambled Eggs', date: '2026-01-15', status: 'COMPLETED' },
  { id: '202', name: 'Lattice Lasagna', date: '2026-01-14', status: 'SIMULATED' }
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const ai = new Ai(env.AI);

    // Discovery & History Endpoints
    if (url.pathname === '/api/discovery') {
      return new Response(JSON.stringify({
        popular: TRENDING_RECIPES,
        history: RECIPE_HISTORY,
        inventory: ["Egg", "Rice", "Tomato", "Basil"],
        local_nodes: ["New York Cluster", "Tokyo Edge", "Paris Hub"]
      }), {
        headers: { 'content-type': 'application/json' }
      });
    }

    // Text Generation Endpoint
    if (url.pathname === '/api/text') {
      const { prompt } = await request.json() as any;
      const response = await ai.run('@cf/google/gemma-7b-it-lora', {
        messages: [
          { role: 'system', content: 'You are a culinary AI for a futuristic kitchen app. Use clinical, high-tech, yet appetizing language.' },
          { role: 'user', content: prompt }
        ]
      });
      return new Response(JSON.stringify(response), {
        headers: { 'content-type': 'application/json' }
      });
    }

    // Image Generation (SDXL Lightning) Endpoint
    if (url.pathname === '/api/image') {
      const { prompt } = await request.json() as any;
      const inputs = {
        prompt: `Neon-lit futuristic food, cinematic macro photography, ${prompt}, 8k, sharp focus, vibrant colors, cyberpunk aesthetic`,
        num_steps: 4,
      };
      const response = await ai.run('@cf/bytedance/sdxl-lightning', inputs);
      return new Response(response, {
        headers: { 'content-type': 'image/png' }
      });
    }

    return new Response('Quantum Chef Neural Hub Online.', { status: 200 });
  },
};
