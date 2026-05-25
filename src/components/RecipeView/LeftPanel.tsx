import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetRecipeSuccess } from '../../types/recipe.types';
import { selectCurrentUserFullName, selectIsAdmin } from '../../reducers/currentUser';
import { categoryToBrowsePath } from '../base/RecipeList/categoryHelpers';
import Ingredients from './Ingredients';
import RightPanel from './RightPanel';
import Tag from '../base/Tag';
import classes from './RecipeView.module.css';

type Props = {
  isMobileView?: boolean;
  recipe: GetRecipeSuccess;
  recipeId: number;
};

const LeftPanel: React.FC<Props> = ({ isMobileView = false, recipe, recipeId }) => {
  const currentUserFullName = useSelector(selectCurrentUserFullName);
  const isAdmin = useSelector(selectIsAdmin);
  const canEdit = isAdmin || currentUserFullName === recipe?.submitted_by;

  const [instructionsTabIsActive, setInststructionsTabToActive] = useState(false);

  const showInsturctionsTab = isMobileView && instructionsTabIsActive;

  const handleShowIngredients = useCallback(() => setInststructionsTabToActive(false), []);
  const handleShowInstructions = useCallback(() => setInststructionsTabToActive(true), []);

  return (
    <>
      <div className={classes.recipeMetadata}>
        <div>
          <Link
            to={`/browse/${categoryToBrowsePath(recipe.category)}`}
            className={classes.category}
          >
            {recipe.category}
          </Link>
        </div>
        {recipe.servings && (
          <div className={classes.servings}>
            {`${/[a-z]/i.test(recipe.servings) ? 'Makes:' : 'Serves:'} `}
            {recipe.servings}
          </div>
        )}
      </div>
      {isMobileView && (
        <div className={classes.tabs}>
          <div
            className={instructionsTabIsActive ? classes.tab : classes.activeTab}
            onClick={handleShowIngredients}
          >
            Ingredients
          </div>
          <div
            className={instructionsTabIsActive ? classes.activeTab : classes.tab}
            onClick={handleShowInstructions}
          >
            Steps
          </div>
        </div>
      )}
      {showInsturctionsTab ? (
        <RightPanel recipe={recipe} isMobileView />
      ) : (
        <>
          {!isMobileView && <div className={classes.sectionTitle}>Ingredients</div>}
          <Ingredients ingredients={recipe.ingredients} />
        </>
      )}
      <div className={classes.spacer} />
      {(recipe.vegetarian || recipe.tags.length > 0) && (
        <div className={classes.tagsContainer}>
          {recipe.tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
          {recipe.vegetarian && <Tag key="vegetarian" text="vegetarian" />}
        </div>
      )}
      <div
        className={
          isMobileView
            ? classes.centered
            : !recipe.vegetarian && !recipe.tags.length
            ? classes.topMargin
            : undefined
        }
      >
        Submitted By: {recipe.submitted_by}
        {canEdit && (
          <>
            {' | '}
            <Link className={classes.link} to={`/recipe/${recipeId}/edit`}>
              Edit
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default LeftPanel;
