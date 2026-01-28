'use client';

import { Recipe } from '@/lib/types';
import { useEffect, useState } from 'react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (recipe) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }
  }, [recipe]);

  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      {/* Modal Container */}
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row relative animate-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          ×
        </button>

        {/* Left: Image (or Top on mobile) */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Recipe • {recipe.cookingTime} min
          </div>

          <h2 className="text-3xl font-serif text-[#202124] mb-4 leading-tight">
            {recipe.name}
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {recipe.story}
          </p>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[#202124] uppercase mb-4 border-b pb-2">Ingredients</h3>
            <ul className="grid grid-cols-1 gap-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-bold text-[#202124] uppercase mb-4 border-b pb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="pl-2 marker:font-bold marker:text-gray-900">
                  <span className="">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
