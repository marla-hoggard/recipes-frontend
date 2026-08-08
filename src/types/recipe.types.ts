import { ApiError } from './api.types';

export type Category =
  | 'appetizer'
  | 'entree'
  | 'dessert'
  | 'side'
  | 'beverage'
  | 'breakfast'
  | 'sauce'
  | '';

export type BrowseCategories =
  | 'all'
  | 'featured'
  | 'appetizers'
  | 'entrees'
  | 'breakfast'
  | 'sides'
  | 'desserts'
  | 'chicken'
  | 'seafood'
  | 'pasta'
  | 'vegetarian'
  | 'passover'
  | 'sauces'
  | 'beverages';

export type Ingredient = {
  ingredient: string;
  note?: string;
};

export type AddRecipeRequest = {
  title: string;
  source?: string;
  source_url?: string;
  submitted_by: string;
  servings?: string;
  category: Category;
  vegetarian?: boolean;
  featured?: boolean;
  tags?: string[];
  ingredients: Ingredient[];
  steps: string[];
  footnotes?: string[];
};

export type EditRecipeRequest = Partial<AddRecipeRequest>;

type AddRecipeSuccess = {
  id: number;
  title: string;
};

export type AddRecipeResponse = AddRecipeSuccess | ApiError;

export type GetRecipeSuccess = {
  id: number;
  title: string;
  source: string | null;
  source_url: string | null;
  submitted_by: string;
  servings: string | null;
  category: Category;
  vegetarian: boolean;
  featured: boolean;
  ingredients: Ingredient[];
  steps: string[];
  footnotes: string[];
  tags: string[];
  created_at: string;
};

export type GetRecipeResponse = GetRecipeSuccess | ApiError;

export type Recipe = {
  id: number;
  title: string;
  source: string | null;
  source_url: string | null;
  submitted_by: string;
  servings: string | null;
  category: Category;
  vegetarian: boolean;
  featured: boolean;
  created_at: string;
  tags?: string[];
  ingredients?: string[];
  steps?: string[];
  footnotes?: string[];
};

export type SearchParams = {
  all?: boolean;
  limit?: number;
  title?: string;
  source?: string;
  submitted_by?: string;
  category?: Category;
  vegetarian?: boolean;
  featured?: boolean;
  steps?: string;
  footnotes?: string;
  tags?: string;
  ingredients?: string;
  wildcard?: string;
};
