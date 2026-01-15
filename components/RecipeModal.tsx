'use client';

import { Recipe } from '@/lib/types';
import { useEffect, useState } from 'react';
import CookingMode from './CookingMode';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCooking, setIsCooking] = useState(false);

  useEffect(() => {
    if (recipe) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      setIsCooking(false);
      document.body.style.overflow = 'auto';
    }
  }, [recipe]);

  if (!recipe) return null;

  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-end transition-all duration-500 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm" onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} />

        {/* Side Sheet Modal */}
        <div className={`relative w-full max-w-2xl h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto custom-scrollbar transition-transform duration-500 ease-out transform ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Header Image */}
          <div className="h-72 w-full relative">
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

            <button
              onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
              className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ←
            </button>
          </div>

          <div className="p-8 md:p-12 relative -mt-20">
            <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium uppercase tracking-wider">
                {recipe.cookingTime}
              </span>
              <span className="px-3 py-1 bg-white/5 text-white/50 border border-white/10 rounded-full text-xs font-medium uppercase tracking-wider">
                {recipe.ingredients.length} Items
              </span>
            </div>

            <h2 className="text-4xl font-semibold mb-6 leading-tight neon-text inline-block">
              {recipe.name}
            </h2>

            <p className="text-lg text-white/60 mb-10 leading-relaxed font-light">
              {recipe.story}
            </p>

            {/* Ingredients Grid */}
            <div className="mb-10 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Required Components</h3>
              <div className="grid grid-cols-2 gap-3">
                {recipe.ingredients.map(ing => (
                  <div key={ing} className="flex items-center gap-2 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className="capitalize">{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-6 mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Sequence</h3>
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-6 h-6 rounded bg-white/5 text-white/40 flex items-center justify-center text-xs font-mono border border-white/5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-white/80 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsCooking(true)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
            >
              Inititalize Cooking Sequence
            </button>
          </div>
        </div>
      </div>

      {isCooking && <CookingMode recipe={recipe} onClose={() => setIsCooking(false)} />}
    </>
  );
}
