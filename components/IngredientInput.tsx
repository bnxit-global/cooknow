'use client';

import allIngredients from '@/lib/ingredients.json';
import { useEffect, useRef, useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  onAdd: (ing: string) => void;
  onRemove: (ing: string) => void;
}

export default function IngredientInput({ ingredients, onAdd, onRemove }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="mb-4">
        <label className="text-gold uppercase tracking-widest text-[10px] font-bold mb-2 block">
          Pantry Request
        </label>
      </div>

      <div className="relative mb-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Search ingredients..."
            className="concierge-input"
          />
          <button
            onClick={handleSubmit}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            Add Item <span className="text-lg">→</span>
          </button>
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0c0a09] border border-gold/20 shadow-xl z-50 rounded-sm"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  onAdd(suggestion);
                  setInputValue('');
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 text-left text-[#f5f5f4] hover:bg-[#d4af37]/10 hover:pl-6 transition-all duration-300 font-serif border-b border-white/5 last:border-0 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Ingredients Tags */}
      {ingredients.length > 0 && (
        <div>
          <label className="text-white/30 uppercase tracking-widest text-[10px] font-bold mb-3 block">
            Selected Items ({ingredients.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <button
                key={ing}
                onClick={() => onRemove(ing)}
                className="group pl-3 pr-2 py-1.5 border border-[#d4af37]/20 bg-[#d4af37]/5 text-[#f5f5f4] text-sm font-sans hover:border-red-500/30 hover:bg-red-900/10 transition-all flex items-center gap-2 rounded-sm"
              >
                <span>{ing}</span>
                <span className="text-gold/40 hover:text-red-400 text-xs">✕</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
