export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
        return new Response('Send a POST request with { prompt: string }', { status: 405 });
    }

    try {
        const { prompt } = await request.json();
        if (!prompt) {
             return new Response('Missing prompt', { status: 400 });
        }

        const inputs = {
            prompt: prompt,
            width: 1024,
            height: 1024,
            num_steps: 20,
        };

        // Switching to standard SDXL base for better compatibility
        const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);

        return new Response(response, {
            headers: { 'content-type': 'image/png' }
        });

    } catch (e) {
        return new Response(`Error: ${e}`, { status: 500 });
    }
  },
};
