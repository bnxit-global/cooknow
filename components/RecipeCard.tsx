'use client';

import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      onClick={() => onClick(recipe)}
      className="group cursor-pointer flex flex-col gap-6"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 mb-2">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

        {/* Floating Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            {recipe.cookingTime} Min
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 border-t border-black/5 pt-6 group-hover:border-black/20 transition-colors duration-500">
        <h3 className="text-2xl font-serif text-[#111111] leading-tight group-hover:text-gray-600 transition-colors">
          {recipe.name}
        </h3>

        <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2">
          {recipe.story}
        </p>

        <div className="flex items-center gap-2 mt-2">
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
              View Recipe
           </span>
           <span className="text-[10px] text-gray-300 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
}
