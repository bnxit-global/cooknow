'use client'

import RecipeCard from '@/components/RecipeCard'
import RecipeModal from '@/components/RecipeModal'
import allIngredients from '@/lib/ingredients.json'
import { Recipe } from '@/lib/types'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Experience = dynamic(() => import('@/components/Experience'), {
  ssr: false,
})

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Samoa',
  'San Marino',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [country, setCountry] = useState('')
  const [countryCustom, setCountryCustom] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Suggestion Logic
  useEffect(() => {
    const lastIngredient = query.split(/[, ]+/).pop()?.trim().toLowerCase()
    if (lastIngredient && lastIngredient.length > 0) {
      const filtered = allIngredients
        .filter((ing) => ing.toLowerCase().startsWith(lastIngredient))
        .slice(0, 50)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query])

  // Click outside listener for suggestions
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

  const handleSuggestionClick = (suggestion: string) => {
    const parts = query.split(/[, ]+/)
    parts.pop()
    const newQuery = [...parts, suggestion].join(', ') + ', '
    setQuery(newQuery)
    setSuggestions([])
  }

  const handleGenerate = async (
    e?: React.FormEvent,
    overrideQuery?: string
  ) => {
    e?.preventDefault()
    const targetQuery = overrideQuery || query
    if (!targetQuery.trim()) return

    setIsGenerating(true)

    // Split query into ingredients for the API.
    // Supports comma separation or space separation if commas are missing.
    const rawIngredients = targetQuery.includes(',')
      ? targetQuery.split(',')
      : targetQuery.split(' ')
    const ingredients = rawIngredients
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    try {
      const finalCountry = country === 'Other' ? countryCustom.trim() : country
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          userInput: targetQuery.trim(), // Send raw input for name detection
          country: finalCountry,
        }),
      })

      if (!res.ok) throw new Error('Generation failed')

      const newRecipe: Recipe = await res.json()
      setRecipes((prev) => [newRecipe, ...prev])
      setSelectedRecipe(newRecipe) // Open modal directly
    } catch (error) {
      console.error(error)
      alert(
        'Failed to generate recipe. Please check your system configuration.'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSurprise = () => {
    // Pick 2-4 random ingredients from the library for true randomness
    const count = Math.floor(Math.random() * 3) + 2 // 2, 3, or 4
    const shuffled = [...allIngredients].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)
    const randomQuery = selected.join(', ')

    // Clear suggestions and maintain existing query (don't show random ings)
    setSuggestions([])

    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleGenerate(fakeEvent, randomQuery)
  }

  return (
    <main className="min-h-screen w-full relative text-black flex flex-col font-sans selection:bg-[#D4AF37]/20 overflow-x-hidden">
      {/* 3D Background Experience */}
      <Experience />

      {/* HERO / SEARCH SECTION */}
      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-[1000px] mx-auto transition-all duration-1000 ease-in-out px-4 ${recipes.length > 0 ? 'pt-24 pb-16' : 'min-h-[85vh] justify-center'}`}
      >
        {/* LOGO */}
        <div
          className={`mb-12 text-center select-none transition-all duration-1000 ${recipes.length > 0 ? 'scale-75' : ''}`}
        >
          <h1 className="text-7xl md:text-9xl font-serif bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#FFB84C] bg-clip-text text-transparent tracking-tighter leading-none mb-4 drop-shadow-2xl">
            CookNow
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 md:w-16 bg-[#D4AF37]/40"></div>
            <p className="text-[10px] md:text-xs text-white/80 font-bold tracking-[0.4em] uppercase">
              The Art of AI Cuisine
            </p>
            <div className="h-[1px] w-8 md:w-16 bg-[#D4AF37]/40"></div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleGenerate}
          className={`w-full max-w-[800px] relative group z-10 mx-auto transition-all duration-700 ${recipes.length > 0 ? 'scale-95' : ''}`}
        >
          <div
            className={`
                flex items-center w-full px-8 py-5
                bg-white/95 backdrop-blur-xl border border-white/20 text-[#111111]
                transition-all duration-700 rounded-none shadow-2xl
                ${isGenerating ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.01]'}
            `}
          >
            <input
              type="text"
              className="flex-1 outline-none text-xl md:text-2xl bg-transparent font-serif placeholder:font-sans placeholder:text-[#D4AF37]/60 placeholder:text-sm placeholder:tracking-[0.2em] placeholder:uppercase placeholder:font-medium"
              placeholder="Enter recipe name or ingredients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isGenerating}
            />

            {isGenerating ? (
              <div className="w-6 h-6 border-[3px] border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            ) : (
              <button
                type="submit"
                className="ml-4 text-[#D4AF37] hover:text-black transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Country / Cuisine selector */}
          <div className="w-full mt-6 flex flex-col md:flex-row gap-3 items-center justify-center">
            <div className="relative w-full md:w-64">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none outline-none text-xs tracking-widest uppercase font-bold bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-none border border-white/20 focus:border-[#D4AF37] transition-colors cursor-pointer"
                disabled={isGenerating}
              >
                <option value="" className="bg-[#111111] text-white">
                  Global Cuisine
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111111] text-white">
                    {c}
                  </option>
                ))}
                <option value="Other" className="bg-[#111111] text-white">
                  Other...
                </option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <path d="M0 3l5 5 5-5z" />
                </svg>
              </div>
            </div>

            {country === 'Other' && (
              <input
                type="text"
                value={countryCustom}
                onChange={(e) => setCountryCustom(e.target.value)}
                className="w-full md:w-64 outline-none text-xs tracking-widest uppercase font-bold bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-none border border-[#D4AF37] placeholder-white/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                placeholder="Enter country..."
                disabled={isGenerating}
              />
            )}
          </div>

          {suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 mt-2 bg-white backdrop-blur-2xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-h-[280px] overflow-y-auto rounded-none z-50 scrollbar-hide"
            >
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-8 py-4 hover:bg-[#D4AF37]/10 transition-colors text-[13px] font-bold uppercase tracking-widest text-[#111111] border-b border-black/5 last:border-0 flex items-center justify-between group/item"
                  >
                    <span>{suggestion}</span>
                    <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]">
                      ADD +
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-white/60 mt-6 text-center font-bold tracking-[0.3em] uppercase">
            Powered by{' '}
            <a
              href="https://www.bnxit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline underline-offset-4 transition-all"
            >
              BNXIT
            </a>
          </p>
        </form>

        {/* BUTTONS */}
        <div className="mt-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 opacity-90 transition-all duration-700">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !query.trim()}
            className="group relative px-12 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">Generate Recipe</span>
            <div className="absolute inset-0 bg-black translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
          </button>

          <button
            onClick={handleSurprise}
            disabled={isGenerating}
            className="group relative px-12 py-4 bg-transparent text-white font-bold text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:text-black disabled:opacity-50"
            aria-label="Surprise Plate — generate a random recipe"
          >
            <span className="relative z-10">Surprise Plate</span>
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
            <div className="absolute inset-0 border border-[#D4AF37] transition-all duration-500 group-hover:border-transparent" />
          </button>
        </div>
      </div>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      {/* RECIPES GRID */}
      {recipes.length > 0 && (
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id || index}
                recipe={recipe}
                onClick={(r) => setSelectedRecipe(r)}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
