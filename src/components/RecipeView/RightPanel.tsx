import React from 'react';
import { GetRecipeSuccess } from '../../types/recipe.types';
import Steps from './Steps';
import classes from './RecipeView.module.css';

type Props = {
  isMobileView?: boolean;
  recipe: GetRecipeSuccess;
};

const RightPanel: React.FC<Props> = ({ isMobileView = false, recipe }) => (
  <>
    {!isMobileView && <div className={classes.sectionTitle}>Directions</div>}
    <Steps steps={recipe.steps} />
    {recipe.footnotes.length > 0 && (
      <>
        <div className={classes.sectionTitle}>Notes</div>
        <ol className={classes.notesList}>
          {recipe.footnotes.map((footnote, index) => (
            <li key={index} data-icon={`[${index + 1}]`}>
              {footnote}
            </li>
          ))}
        </ol>
      </>
    )}
  </>
);

export default RightPanel;
