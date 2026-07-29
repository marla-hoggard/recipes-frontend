import React from 'react';
import { createPortal } from 'react-dom';
import { GetRecipeSuccess } from '../../types/recipe.types';

type Props = {
  recipe: GetRecipeSuccess;
};

/**
 * Adds a scripe with structured data for third-party services to parse.
 */

// We need to sanitize our custom recipe data into a standard format
// Section headers are stored as the full ingredient/step text wrapped in underscores
const isSectionHeader = (text: string) => /^_.+_$/.test(text.trim());
const stripEmphasis = (text: string) => text.replace(/^_(.+)_$/, '$1').replace(/_/g, '');

const buildRecipeJsonLd = (recipe: GetRecipeSuccess) => {
  const recipeIngredient = recipe.ingredients
    .filter(({ ingredient }) => !isSectionHeader(ingredient))
    .map(({ ingredient, note }) =>
      note ? `${stripEmphasis(ingredient)} (${note})` : stripEmphasis(ingredient),
    );

  const recipeInstructions = recipe.steps
    .filter((step) => !isSectionHeader(step))
    .map((step) => ({
      '@type': 'HowToStep',
      text: stripEmphasis(step.replace(/\*/g, '')),
    }));

  return {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    recipeCategory: recipe.category,
    image: `${window.location.origin}/logo-circle.png`,
    ...(recipe.servings ? { recipeYield: recipe.servings } : {}),
    recipeIngredient,
    recipeInstructions,
    author: {
      '@type': 'Person',
      name: recipe.source ?? recipe.submitted_by,
    },
    datePublished: recipe.created_at.slice(0, 10),
    url: window.location.href,
    ...(recipe.source_url ? { isBasedOnUrl: recipe.source_url } : {}),
    ...(recipe.tags?.length ? { keywords: recipe.tags.join(', ') } : {}),
    ...(recipe.vegetarian ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
  };
};

const RecipeJsonLd: React.FC<Props> = ({ recipe }) => {
  const json = buildRecipeJsonLd(recipe);

  return createPortal(
    <script
      type="application/ld+json"
      // Escape `<` so the JSON can't prematurely close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }}
    />,
    document.head,
  );
};

export default RecipeJsonLd;
