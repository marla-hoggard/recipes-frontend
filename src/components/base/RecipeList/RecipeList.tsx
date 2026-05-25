import React from 'react';
import { Recipe as RecipeType } from '../../../types/recipe.types';
import RecipeListItem from './RecipeListItem';
import classes from './RecipeList.module.css';

type Props = {
  recipes: RecipeType[];
};

const RecipeList: React.FC<Props> = ({ recipes }) => {
  return (
    <div className={classes.recipeListContainer}>
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
