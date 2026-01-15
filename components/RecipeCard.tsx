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
      className="group relative h-[380px] rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#0a0a0a]"
    >
      {/* Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
        {/* Tags */}
        <div className="flex gap-2 mb-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded backdrop-blur-md">
            {recipe.cookingTime}
          </span>
          <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded backdrop-blur-md">
            high match
          </span>
        </div>

        <h3 className="text-2xl font-medium leading-tight mb-2 group-hover:text-blue-400 transition-colors">
          {recipe.name}
        </h3>

        <p className="text-sm text-white/50 line-clamp-2 transform transition-all duration-300 group-hover:text-white/80">
          {recipe.story}
        </p>

        {/* Hover Border Glow */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl transition-all duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
