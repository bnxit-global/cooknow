export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  imageUrl: string;
  story: string;
}

export interface Ingredient {
  id: string;
  name: string;
}
