'use client';

import { Recipe } from '@/lib/types';
import { useState } from 'react';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function CookingMode({ recipe, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505] text-white flex flex-col">
      {/* HUD Header */}
      <div className="h-16 px-6 flex items-center justify-between bg-[#0a0a0a] border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            Esc
          </button>
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-mono rounded">
            LIVE SESSION
          </span>
        </div>
        <div className="font-mono text-xs text-white/30">
          {String(currentStep + 1).padStart(2, '0')} / {String(recipe.instructions.length).padStart(2, '0')}
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-[2px] bg-white/5 w-full">
        <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Tech Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl w-full text-center">
          <div className="mb-12 inline-block">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 mb-4 block animate-pulse">
              CURRENT OPERATION
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-light leading-snug mb-16 animate-enter">
            {recipe.instructions[currentStep]}
          </h2>

          <div className="flex justify-center gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-12 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {currentStep === recipe.instructions.length - 1 ? 'Complete Protocol' : 'Next Phase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
