'use client'

import { Recipe } from '@/lib/types'

interface RecipeCardProps {
  recipe: Recipe
  onClick: (recipe: Recipe) => void
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      onClick={() => onClick(recipe)}
      className="group cursor-pointer flex flex-col h-full bg-white/5 backdrop-blur-[12px] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        <img
          src={
            recipe.imageUrl ||
            `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop`
          }
          alt={recipe.name}
          className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-500" />

        {/* Floating Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-lg shadow-black/20 backdrop-blur-md transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            {recipe.cookingTime} Min
          </div>
          {recipe.country && (
            <div className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-lg shadow-black/20 backdrop-blur-md transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 delay-150">
              {recipe.country}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 flex-1 border-t border-white/5">
        <h3 className="text-2xl font-serif text-white leading-tight group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-sm">
          {recipe.name}
        </h3>

        <p className="text-sm text-white/70 font-light leading-relaxed line-clamp-3 italic">
          &quot;{recipe.story}&quot;
        </p>

        <div className="mt-auto pt-4 flex items-center gap-3 overflow-hidden border-t border-white/10">
          <div className="h-[1px] w-6 bg-[#D4AF37] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">
            View Recipe
          </span>
        </div>
      </div>
    </div>
  )
}
