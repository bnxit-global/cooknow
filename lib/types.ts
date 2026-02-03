export interface IngredientObject {
  name: string
  quantity?: string
  preparation?: string
}

export interface Recipe {
  id: string
  name: string
  country?: string
  ingredients: (string | IngredientObject)[]
  instructions: string[]
  cookingTime: string
  imageUrl: string
  story: string
}

export interface Ingredient {
  id: string
  name: string
}
