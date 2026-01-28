'use client'

import allIngredients from '@/lib/ingredients.json'
import { useEffect, useRef, useState } from 'react'

interface VisualConciergeProps {
  ingredients: string[]
  onAdd: (ing: string) => void
  onRemove: (ing: string) => void
  onGenerate: () => void
  isGenerating: boolean
}

export default function VisualConcierge({
  ingredients,
  onAdd,
  onRemove,
  onGenerate,
  isGenerating,
}: VisualConciergeProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allIngredients
        .filter(
          (ing) =>
            ing.toLowerCase().includes(inputValue.toLowerCase()) &&
            !ingredients.includes(ing)
        )
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [inputValue, ingredients])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAdd = (val: string) => {
    if (!val.trim()) return
    const match = allIngredients.find(
      (ing) => ing.toLowerCase() === val.toLowerCase()
    )
    const partial = allIngredients.find((ing) =>
      val.toLowerCase().includes(ing.toLowerCase())
    )
    const finalIng = match || partial

    if (finalIng && !ingredients.includes(finalIng)) {
      onAdd(finalIng)
      setInputValue('')
      setSuggestions([])
    }
  }

  return (
    <div className="flex flex-col gap-12 w-full animate-enter">
      <div className="relative group" ref={dropdownRef}>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-1.5 h-1.5 bg-gold rounded-full" />
          <label className="text-[10px] text-gold/40 uppercase tracking-[0.4em] font-black">
            Entrée des Ingrédients
          </label>
        </div>

        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd(inputValue)}
            placeholder="Introduce an element (e.g. Black Truffle)..."
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-6 px-10 text-xl text-white placeholder-white/10 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] transition-all font-light selection:bg-gold/30"
            disabled={isGenerating}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
            <span className="text-[10px] text-gold/20 uppercase tracking-widest font-black">
              Press Enter
            </span>
            <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center text-white/20">
              ↵
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-[#0A0B0D] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-[200] backdrop-blur-3xl animate-enter">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[9px] text-gold/30 uppercase tracking-[0.3em] font-black">
                  Recommandations de l&apos;Atelier
                </span>
              </div>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleAdd(s)}
                  className="w-full text-left px-8 py-4 text-sm hover:bg-gold/5 text-[#FFFFF0]/40 hover:text-gold transition-all flex items-center justify-between group/item"
                >
                  <span className="tracking-wide uppercase text-[11px] font-medium">
                    {s}
                  </span>
                  <span className="text-gold/0 group-hover/item:text-gold/40 transition-all text-xs">
                    +
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="text-[9px] text-gold/20 uppercase tracking-[0.4em] font-black">
            L&apos;Inventaire Curaté
          </span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {ingredients.map((ing) => (
            <button
              key={ing}
              onClick={() => !isGenerating && onRemove(ing)}
              className="flex items-center gap-4 pl-6 pr-4 py-3 bg-[#0C0D0F] border border-white/5 hover:border-gold/30 rounded-xl text-sm text-[#FFFFF0]/50 transition-all group hover:-translate-y-0.5"
            >
              <span className="capitalize tracking-wider font-medium">
                {ing}
              </span>
              <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                <span className="text-lg leading-none pt-0.5">×</span>
              </div>
            </button>
          ))}
          {ingredients.length === 0 && (
            <div className="w-full flex flex-col items-center py-10 opacity-10">
              <div className="w-12 h-12 border border-dashed border-white rounded-full mb-4" />
              <span className="text-[10px] uppercase tracking-[0.4em]">
                Awaiting Elements
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onGenerate}
          disabled={ingredients.length === 0 || isGenerating}
          className="group relative px-20 py-6 gold-button overflow-hidden rounded-2xl"
        >
          <span className="relative z-10 flex items-center gap-6 text-sm tracking-[0.4em]">
            {isGenerating ? 'COMPOSING...' : 'INITIALIZE CURATION'}
            <span
              className={`text-xl transition-all duration-700 ${isGenerating ? 'animate-spin' : 'group-hover:translate-x-2'}`}
            >
              {isGenerating ? '◌' : '→'}
            </span>
          </span>
          <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
        </button>
      </div>
    </div>
  )
}
