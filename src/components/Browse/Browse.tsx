import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getAllRecipes, searchRecipes } from '../../api/recipe';
import { BrowseCategories, Recipe, SearchParams } from '../../types/recipe.types';
import Loading from '../base/Loading';
import RecipeList from '../base/RecipeList/RecipeList';
import CategoryList from './CategoryList';
import classes from './Browse.module.css';

type CategoryData = {
  [k in BrowseCategories]: {
    displayName: string;
    searchParams: SearchParams;
  };
};

const CATEGORY_DATA: CategoryData = {
  all: {
    displayName: 'All Recipes',
    searchParams: {},
  },
  featured: {
    displayName: 'Featured Recipes',
    searchParams: { featured: true },
  },
  appetizers: {
    displayName: "Appetizers & Hors D'euvres",
    searchParams: { category: 'appetizer' },
  },
  entrees: {
    displayName: 'Entrees',
    searchParams: { category: 'entree' },
  },
  breakfast: {
    displayName: 'Breakfast & Brunch',
    searchParams: { category: 'breakfast' },
  },
  sides: {
    displayName: 'Sides & Veggies',
    searchParams: { category: 'side' },
  },
  desserts: {
    displayName: 'Desserts',
    searchParams: { category: 'dessert' },
  },
  chicken: {
    displayName: 'Recipes with Chicken',
    searchParams: { wildcard: 'chicken' },
  },
  seafood: {
    displayName: 'Recipes with Seafood',
    searchParams: { wildcard: 'seafood, fish' },
  },
  pasta: {
    displayName: 'Pasta Recipes',
    searchParams: { wildcard: 'pasta' },
  },
  vegetarian: {
    displayName: 'Vegetarian Recipes',
    searchParams: { vegetarian: true },
  },
  passover: {
    displayName: 'Kosher for Passover',
    searchParams: { tags: 'passover' },
  },
  sauces: {
    displayName: 'Sauces, Dressings & Marinades',
    searchParams: { category: 'sauce' },
  },
  beverages: {
    displayName: 'Beverages',
    searchParams: { category: 'beverage' },
  },
};

function isBrowseCategory(name: string): name is BrowseCategories {
  return name in CATEGORY_DATA;
}

const Browse: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  const history = useHistory();
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

  const fetchSearchResults = useCallback(
    async (params: SearchParams) => {
      const results = name === 'all' ? await getAllRecipes() : await searchRecipes(params);
      setSearchResults(results);
      setLoading(false);
    },
    [name],
  );

  useEffect(() => {
    if (!name) {
      return;
    }

    if (!isBrowseCategory(name)) {
      history.push('/404');
      return;
    }

    const { displayName, searchParams } = CATEGORY_DATA[name];

    setPageTitle(displayName);
    fetchSearchResults(searchParams);
  }, [name, history, fetchSearchResults]);

  const PageTitle = useMemo(() => <h1 className={classes.pageTitle}>{pageTitle}</h1>, [pageTitle]);

  if (!name) {
    return <CategoryList />;
  }

  if (loading) {
    return (
      <>
        {PageTitle}
        <Loading text="Searching..." />
      </>
    );
  }

  if (!searchResults) {
    return (
      <>
        {PageTitle}
        <div>No recipes found</div>
      </>
    );
  }

  return (
    <>
      {PageTitle}
      <RecipeList recipes={searchResults} />
    </>
  );
};

export default Browse;
