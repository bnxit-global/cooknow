'use client';

import RecipeModal from '@/components/RecipeModal';
import { Recipe } from '@/lib/types';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsGenerating(true);

    // Split query into ingredients for the API.
    // Supports comma separation or space separation if commas are missing.
    const rawIngredients = query.includes(',') ? query.split(',') : query.split(' ');
    const ingredients = rawIngredients.map(s => s.trim()).filter(s => s.length > 0);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) throw new Error('Generation failed');

      const newRecipe: Recipe = await res.json();
      setRecipes(prev => [newRecipe, ...prev]);
      setSelectedRecipe(newRecipe); // Open modal directly

    } catch (error) {
      console.error(error);
      alert('Failed to generate recipe. Please check your system configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSurprise = () => {
    const randomIngredients = ['Truffle, Wagyu', 'Saffron, Rice', 'Heirloom Tomato, Basil', 'Scallop, Lemon'];
    setQuery(randomIngredients[Math.floor(Math.random() * randomIngredients.length)]);
    setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleGenerate(fakeEvent);
    }, 100);
  };

  return (
    <main className="min-h-screen w-full bg-[#FAFAFA] text-[#111111] flex flex-col font-sans selection:bg-[#D4AF37]/20">

      {/* HERO / SEARCH SECTION */}
      <div className={`flex flex-col items-center w-full max-w-[900px] mx-auto transition-all duration-1000 ease-in-out ${recipes.length > 0 ? 'mt-32 scale-90 opacity-90' : 'mt-[30vh]'}`}>

        {/* LOGO */}
        <div className="mb-12 text-center select-none">
          <h1 className="text-6xl md:text-8xl font-serif text-[#111111] tracking-tight leading-none mb-4">
            CookNow
          </h1>
          <p className="text-sm md:text-base text-gray-400 font-light tracking-[0.2em] uppercase">
            Curated AI Culinary Intelligence
          </p>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleGenerate} className="w-full max-w-[600px] relative group z-10 mx-auto px-4">
            <div className={`
                flex items-center w-full px-8 py-5
                bg-white border text-[#111111]
                transition-all duration-500 rounded-none
                ${isGenerating ? 'shadow-xl border-gray-200' : 'shadow-lg border-transparent hover:shadow-2xl hover:scale-[1.01]'}
            `}>
                <input
                type="text"
                className="flex-1 outline-none text-xl bg-transparent font-serif placeholder:font-sans placeholder-gray-300 placeholder:text-base placeholder:tracking-wide placeholder:uppercase placeholder:font-light"
                placeholder="List available ingredients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isGenerating}
                />

                {isGenerating ? (
                    <div className="w-5 h-5 border-[2px] border-black/10 border-t-black rounded-full animate-spin" />
                ) : (
                    <button type="submit" className="ml-4 text-gray-300 hover:text-black transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-300 mt-4 text-center font-light tracking-wider">
               SEPARATE INGREDIENTS WITH COMMAS OR SPACES
            </p>
        </form>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 md:gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <button
            onClick={() => handleGenerate()}
            className="px-8 py-3 bg-transparent border border-black/5 hover:border-black/20 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-black hover:text-white"
          >
            Discover
          </button>
          <button
            onClick={handleSurprise}
            className="px-8 py-3 bg-transparent border border-black/5 hover:border-black/20 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-black hover:text-white"
          >
            Surprise Palette
          </button>
        </div>
      </div>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </main>
  );
}
