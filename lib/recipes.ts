import { Recipe } from './types'

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Late-Night Hostel Egg Rice',
    ingredients: ['rice', 'egg', 'onion', 'salt', 'oil'],
    instructions: [
      'Heat oil in a pan on medium heat.',
      'Add sliced onion and sauté for 1-2 minutes.',
      'Crack the egg directly into the pan and scramble.',
      'Add cooked rice and mix well.',
      'Add salt and stir-fry for 2-3 minutes.',
    ],
    cookingTime: '7 min',
    imageUrl:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    story:
      'Made this at midnight with just rice, egg, and onion — simple, filling, and lifesaving.',
  },
  {
    id: '2',
    name: 'One-Pan Tomato Toast',
    ingredients: ['bread', 'tomato', 'garlic', 'olive oil', 'salt'],
    instructions: [
      'Slice tomatoes and mince garlic.',
      'Sauté garlic in olive oil until fragrant.',
      'Add tomatoes and cook until soft.',
      'Toast bread slices in a separate pan or toaster.',
      'Top toast with tomato mixture and sprinkle salt.',
    ],
    cookingTime: '5 min',
    imageUrl:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    story: 'The ultimate breakfast hack when you only have tomatoes and bread.',
  },
  {
    id: '3',
    name: 'Quick Omelette Supreme',
    ingredients: ['egg', 'cheese', 'butter', 'salt', 'pepper'],
    instructions: [
      'Beat eggs with salt and pepper.',
      'Melt butter in a non-stick pan over medium heat.',
      'Pour egg mixture and let it set slightly.',
      'Add grated cheese on one half.',
      'Fold omelette and serve hot.',
    ],
    cookingTime: '5 min',
    imageUrl:
      'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=800',
    story:
      'A classic breakfast that never disappoints. Perfect for lazy mornings.',
  },
  {
    id: '4',
    name: 'Garlic Butter Noodles',
    ingredients: ['noodles', 'garlic', 'butter', 'soy sauce', 'green onion'],
    instructions: [
      'Boil noodles according to package instructions.',
      'Melt butter in a pan and sauté minced garlic.',
      'Add cooked noodles to the pan.',
      'Drizzle soy sauce and toss well.',
      'Garnish with chopped green onions.',
    ],
    cookingTime: '10 min',
    imageUrl:
      'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800',
    story: 'When you crave comfort food but only have 10 minutes.',
  },
  {
    id: '5',
    name: 'Creamy Banana Smoothie',
    ingredients: ['banana', 'milk', 'honey', 'ice'],
    instructions: [
      'Peel and slice the banana.',
      'Add banana, milk, and honey to a blender.',
      'Add ice cubes.',
      'Blend until smooth.',
      'Pour and enjoy immediately.',
    ],
    cookingTime: '3 min',
    imageUrl:
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    story: 'My go-to energy booster for busy days. No cooking required!',
  },
  {
    id: '6',
    name: 'Simple Veggie Stir-Fry',
    ingredients: ['carrot', 'cabbage', 'bell pepper', 'soy sauce', 'oil'],
    instructions: [
      'Slice all vegetables into thin strips.',
      'Heat oil in a wok or large pan.',
      'Add vegetables and stir-fry on high heat.',
      'Add soy sauce and toss for 2 minutes.',
      'Serve hot with rice or noodles.',
    ],
    cookingTime: '8 min',
    imageUrl:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    story: 'A healthy option when you want something quick and fresh.',
  },
  {
    id: '7',
    name: 'Mediterranean Chickpea Salad',
    ingredients: ['chickpeas', 'cucumber', 'lemon', 'olive oil', 'parsley'],
    instructions: [
      'Rinse chickpeas and drain.',
      'Dice cucumber and chop parsley.',
      'Mix all ingredients in a large bowl.',
      'Drizzle with olive oil and lemon juice.',
      'Toss well and serve chilled.',
    ],
    cookingTime: '5 min',
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    story: 'Inspired by a sun-soaked afternoon in Greece.',
  },
  {
    id: '8',
    name: 'Kimchi Fried Rice',
    ingredients: ['rice', 'kimchi', 'egg', 'soy sauce', 'sesame oil'],
    instructions: [
      'Chop kimchi into small pieces.',
      'Heat oil and stir-fry kimchi until fragrant.',
      'Add rice and stir-fry with soy sauce.',
      'Drizzle sesame oil at the end.',
      'Top with a fried egg.',
    ],
    cookingTime: '12 min',
    imageUrl:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800',
    story: 'The ultimate comfort food for any kimchi lover.',
  },
  {
    id: '9',
    name: 'Avocado Salsa Cruda',
    ingredients: ['avocado', 'tomato', 'onion', 'lime', 'cilantro'],
    instructions: [
      'Dice all solid ingredients.',
      'Combine in a bowl.',
      'Squeeze lime juice over the top.',
      'Gently toss and serve immediately.',
    ],
    cookingTime: '5 min',
    imageUrl:
      'https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?auto=format&fit=crop&q=80&w=800',
    story: 'Pure freshness in every bite.',
  },
  {
    id: '10',
    name: 'Universal Kitchen Fusion',
    ingredients: ['any', 'salt', 'pepper', 'oil'],
    instructions: [
      'Heat oil in your primary cooking vessel.',
      'Prepare your chosen ingredients (chop or slice as needed).',
      'Sauté aromatics first, then proteins, then vegetables.',
      'Season liberally with salt and pepper.',
      'Garnish with whatever green herbs are on hand.',
    ],
    cookingTime: '15 min',
    imageUrl:
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop',
    story: 'The master formula for those who cook by instinct.',
  },
  {
    id: '11',
    name: 'The Global Pantry Stew',
    ingredients: ['any', 'water', 'stock', 'onion', 'garlic'],
    instructions: [
      'Simmer onion and garlic in a deep pot.',
      'Add your selection of ingredients and cover with water or stock.',
      'Bring to a boil, then simmer for 20 minutes.',
      'Taste and adjust seasoning with your favorite spices.',
      'Serve warm for maximum comfort.',
    ],
    cookingTime: '25 min',
    imageUrl:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop',
    story: 'A melting pot of flavors from around the world.',
  },
]

export function findRecipes(userIngredients: string[]): Recipe[] {
  if (userIngredients.length === 0) return []

  // Filter recipes based on ingredient matching
  const matchingRecipes = MOCK_RECIPES.filter((recipe) => {
    // If it's a "universal" recipe, it always matches if user has ingredients
    if (recipe.ingredients.includes('any')) return true

    const matchCount = recipe.ingredients.filter((ing) =>
      userIngredients.some((ui) => ing.toLowerCase().includes(ui.toLowerCase()))
    ).length

    return matchCount > 0
  })

  // Ensure at least 2 recipes are returned if possible
  // In a real scenario, we might use the AI worker to generate these
  return matchingRecipes.length >= 2
    ? matchingRecipes
    : matchingRecipes.concat(
        MOCK_RECIPES.filter((r) => !matchingRecipes.includes(r)).slice(
          0,
          2 - matchingRecipes.length
        )
      )
}
