'use client';

import allIngredients from '@/lib/ingredients.json';
import { useEffect, useRef, useState } from 'react';

interface VisualConciergeProps {
  ingredients: string[];
  onAdd: (ing: string) => void;
  onRemove: (ing: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function VisualConcierge({ ingredients, onAdd, onRemove, onGenerate, isGenerating }: VisualConciergeProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allIngredients.filter(ing =>
        ing.toLowerCase().includes(inputValue.toLowerCase()) &&
        !ingredients.includes(ing)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, ingredients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (val: string) => {
    if (!val.trim()) return;
    const match = allIngredients.find(ing => ing.toLowerCase() === val.toLowerCase());
    const partial = allIngredients.find(ing => val.toLowerCase().includes(ing.toLowerCase()));
    const finalIng = match || partial;

    if (finalIng && !ingredients.includes(finalIng)) {
      onAdd(finalIng);
      setInputValue('');
      setSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col h-full relative p-6">

      {/* 1. Hero / AI Trigger */}
      <div className="flex-1 min-h-0 flex flex-col mb-8">
        <div className="relative w-full h-full max-h-64 md:max-h-none rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl group transition-all duration-500 hover:shadow-blue-900/20">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80"
            alt="Chef's Table"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'scale-110 saturate-150 blur-sm' : 'group-hover:scale-105 opacity-60'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-90" />

          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start z-10">
            {isGenerating ? (
              <div className="animate-pulse">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">AI Chef processing</span>
                <h2 className="text-3xl font-bold text-white mb-1">Dreaming...</h2>
                <p className="text-white/60">Crafting a unique recipe from your ingredients.</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                  The Chef is Ready
                </h2>
                <p className="text-white/60 mb-6 text-sm">
                  Add ingredients below, then ask the AI to invent a masterpiece.
                </p>
                <button
                  onClick={onGenerate}
                  disabled={ingredients.length === 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>✨ Create Recipe</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Input */}
      <div className="relative z-50 mb-6" ref={dropdownRef}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <label className="text-xs font-medium text-white/50 uppercase tracking-widest">
            Pantry Inventory
          </label>
        </div>

        <div className="relative group">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd(inputValue)}
            placeholder="Search ingredients (e.g. Garlic)..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all"
            disabled={isGenerating}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-lg text-white/30">
            ↵
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleAdd(s)}
                  className="w-full text-left px-4 py-3 text-sm rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Tags */}
      <div className="flex-1 min-h-[100px] overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap gap-2 content-start">
          {ingredients.map(ing => (
            <button
              key={ing}
              onClick={() => !isGenerating && onRemove(ing)}
              className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl text-sm text-zinc-300 transition-all group"
            >
              <span className="capitalize">{ing}</span>
              <span className="text-white/20 group-hover:text-red-400 text-xs">×</span>
            </button>
          ))}
          {ingredients.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl p-8">
              <span className="text-2xl mb-2">🍎</span>
              <span className="text-sm">Pantry is empty</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
