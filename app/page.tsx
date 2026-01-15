'use client';

import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import VisualConcierge from '@/components/VisualConcierge';
import { Recipe } from '@/lib/types';
import { useState } from 'react';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addIngredient = (ing: string) => {
    if (!ingredients.includes(ing)) {
      setIngredients([...ingredients, ing]);
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    // Note: We do NOT clear recipes here, we append to them.

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) throw new Error('Generation failed');

      const newRecipe: Recipe = await res.json();

      // Append new recipe to the top of the list
      setRecipes(prev => [newRecipe, ...prev]);

    } catch (error) {
      console.error(error);
      alert('Failed to generate recipe. Please check your API keys in .env.local');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="md:h-screen w-full md:overflow-hidden flex flex-col md:flex-row bg-[#080808] text-white">

      {/* LEFT PANEL: Visual Concierge */}
      <section className="w-full md:w-[450px] flex-shrink-0 flex flex-col border-r border-white/5 bg-[#080808] relative z-20 shadow-2xl">
        <header className="h-20 flex items-center px-6 justify-between bg-transparent">
          <div>
            <h1 className="font-bold tracking-tight text-lg text-white">COOKNOW</h1>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">Powered by BNXIT</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-green-500/50'}`} />
        </header>

        <VisualConcierge
          ingredients={ingredients}
          onAdd={addIngredient}
          onRemove={removeIngredient}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </section>

      {/* RIGHT PANEL: Recipe Grid */}
      <section className="flex-1 min-h-screen md:min-h-0 relative bg-[#0a0a0a]">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm transition-all">
             <div className="text-center">
               <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6 mx-auto" />
               <h3 className="text-xl font-light text-white mb-2 animate-pulse">Dreaming up a new variation...</h3>
               <p className="text-sm text-white/40">Analyzing flavors • Generating Steps • Plating Dish</p>
             </div>
          </div>
        )}

        <div className="h-full md:overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32">
          <div className="max-w-7xl mx-auto pt-4 relative z-0">
            {recipes.length > 0 ? (
              <>
                <div className="mb-10 animate-enter flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Your Menu</h2>
                    <p className="text-sm text-zinc-500">
                      {recipes.length} unique {recipes.length === 1 ? 'creation' : 'creations'} generated.
                    </p>
                  </div>

                  {!isGenerating && (
                    <button
                      onClick={handleGenerate}
                      className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold flex items-center gap-2 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      <span>↻ Generate Another</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {recipes.map((recipe, index) => (
                    <div key={recipe.id} className="animate-enter" style={{ animationDelay: `${index * 100}ms` }}>
                      <RecipeCard recipe={recipe} onClick={setSelectedRecipe} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              !isGenerating && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-30">
                  <span className="text-4xl mb-4 grayscale">🍽️</span>
                  <h3 className="text-lg font-medium text-white">Ready to Order</h3>
                  <p className="max-w-xs mx-auto text-sm text-zinc-500 mt-2">
                    Add ingredients on the left and click "Create Recipe" to start the AI engine.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </main>
  );
}
