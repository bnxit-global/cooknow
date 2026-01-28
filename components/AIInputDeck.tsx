'use client'

import allIngredients from '@/lib/ingredients.json'
import { useEffect, useRef, useState } from 'react'

interface AIInputDeckProps {
  ingredients: string[]
  onAdd: (ing: string) => void
  onRemove: (ing: string) => void
}

export default function AIInputDeck({
  ingredients,
  onAdd,
  onRemove,
}: AIInputDeckProps) {
  const [inputValue, setInputValue] = useState('')
  const [systemStatus, setSystemStatus] = useState('SYSTEM READY')
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Suggestion Logic
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allIngredients
        .filter(
          (ing) =>
            ing.toLowerCase().startsWith(inputValue.toLowerCase()) &&
            !ingredients.includes(ing)
        )
        .slice(0, 50)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [inputValue, ingredients])

  // Click outside listener
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

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return

    setIsProcessing(true)
    setSystemStatus('ANALYZING INPUT...')
    setSuggestions([])

    setTimeout(() => {
      // Direct Match
      const match = allIngredients.find(
        (ing) => ing.toLowerCase() === cmd.toLowerCase()
      )

      // Partial Match
      const partial = allIngredients.find((ing) =>
        cmd.toLowerCase().includes(ing.toLowerCase())
      )

      const finalIng = match || partial

      if (finalIng && !ingredients.includes(finalIng)) {
        onAdd(finalIng)
        setSystemStatus(`ACCEPTED: ${finalIng.toUpperCase()}`)
      } else if (finalIng && ingredients.includes(finalIng)) {
        setSystemStatus(`ERROR: ${finalIng.toUpperCase()} ALREADY LOGGED`)
      } else {
        setSystemStatus('ERROR: UNKNOWN MATERIAL')
      }

      setInputValue('')
      setIsProcessing(false)

      // Reset status to ready after a delay
      setTimeout(() => setSystemStatus('SYSTEM READY'), 2000)
    }, 600)
  }

  return (
    <div className="flex flex-col h-full p-8 relative">
      {/* 1. System Status Display */}
      <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
            Status Monitor
          </span>
          <div
            className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}
          />
        </div>
        <div className="font-mono text-sm text-blue-400 tracking-wide">
          {'>'} {systemStatus}
        </div>
      </div>

      {/* 2. Main Input Command */}
      <div className="relative mb-8 z-50" ref={dropdownRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-blue-500 font-bold mr-2">➜</span>
          </div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand(inputValue)}
            placeholder="Enter Inventory Data..."
            className="w-full bg-[#0a0a0a] border border-blue-500/30 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all font-mono text-sm placeholder-white/20"
            autoFocus
          />
          <button
            onClick={() => handleCommand(inputValue)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-lg text-blue-400 transition-all active:scale-95"
          >
            EXECUTE
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c0a09] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[240px] overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleCommand(s)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-900/20 text-white/60 hover:text-blue-400 transition-colors border-b border-white/5 last:border-0 font-mono"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Inventory Grid (Holographic Chips) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-4 flex items-center gap-2">
          Active Inventory
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">
            {ingredients.length}
          </span>
        </h3>

        {ingredients.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {ingredients.map((ing) => (
              <div
                key={ing}
                className="group relative bg-white/[0.02] border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-lg p-3 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-white/90 capitalize">
                    {ing}
                  </span>
                  <button
                    onClick={() => onRemove(ing)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/50 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
            <span className="text-white/20 text-xs font-mono">
              NO DATA LOGGED
            </span>
          </div>
        )}
      </div>

      {/* 4. Footer Status */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20 font-mono">
        <span className="uppercase">Quantum Core v2.4</span>
        <span
          className={
            isProcessing ? 'text-blue-500 animate-pulse' : 'text-green-500'
          }
        >
          {isProcessing ? 'PROCESSING' : 'ONLINE'}
        </span>
      </div>
    </div>
  )
}
