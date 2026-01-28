'use client'

import { Recipe } from '@/lib/types'
import { useEffect } from 'react'

interface RecipeModalProps {
  recipe: Recipe | null
  onClose: () => void
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [recipe])

  if (!recipe) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-500"
      onClick={onClose}
    >
      {/* Immersive Background Image with Slow Zoom */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover opacity-60 animate-[kenburns_20s_infinite_alternate]"
          style={{ transformOrigin: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent md:via-black/40"></div>
      </div>

      <style jsx global>{`
        @keyframes kenburns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.15);
          }
        }
      `}</style>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[220] px-6 py-2 border border-white/20 text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-xs uppercase tracking-[0.2em] font-bold backdrop-blur-md"
      >
        Close
      </button>

      {/* Content Container - Full Height on Desktop */}
      <div
        className="relative z-[210] w-full h-full flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Spacer / Image View Area */}
        <div
          className="hidden md:block w-1/12 lg:w-1/2 h-full"
          onClick={onClose}
        ></div>

        {/* Right Content Panel - Glassmorphism */}
        <div className="w-full md:w-11/12 lg:w-1/2 h-full bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl relative">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-8 md:p-16">
            <div className="mb-8 flex items-center gap-4">
              <span className="px-4 py-1.5 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]">
                {recipe.cookingTime} min
              </span>
              {recipe.country && (
                <span className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                  {recipe.country}
                </span>
              )}
            </div>

            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-[0.95] tracking-tight drop-shadow-lg">
              {recipe.name}
            </h2>

            <p className="text-white/80 text-lg md:text-xl font-light italic mb-16 leading-relaxed border-l-2 border-[#D4AF37] pl-8">
              &quot;{recipe.story}&quot;
            </p>

            {/* Ingredients */}
            <div className="mb-16">
              <h3 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-8 border-b border-white/10 pb-4">
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-sm text-white/90 font-medium group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></span>
                    <span className="group-hover:translate-x-1 transition-transform border-b border-white/20 pb-0.5">
                      {ing}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="pb-12">
              <h3 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-8 border-b border-white/10 pb-4">
                Preparation
              </h3>
              <div className="space-y-12">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-3xl font-serif text-white/10 group-hover:text-[#D4AF37] transition-colors duration-500 shrink-0 font-bold">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <p className="text-white/80 leading-relaxed text-base md:text-lg font-light group-hover:text-white transition-colors">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer branding in Modal */}
          <div className="p-8 border-t border-white/5 text-center md:text-right">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
              CookNow AI • BNXIT
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
