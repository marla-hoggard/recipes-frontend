import React, { useRef } from 'react';
import classNames from 'classnames';
import { Ingredient } from '../../types/recipe.types';
import classes from './Ingredients.module.css';

type Props = {
  ingredients: Ingredient[];
};

const Ingredients: React.FC<Props> = ({ ingredients }) => {
  const count = useRef(1);

  return (
    <div>
      {ingredients.map(({ ingredient, note }, i) => {
        const isSectionHeader = /^_.+_$/.test(ingredient.trim());
        const displayText = isSectionHeader ? `${ingredient.slice(1, -1)}` : ingredient;
        return (
          <div
            className={classNames({
              [classes.ingredient]: true,
              [classes.ingredientHeader]: isSectionHeader,
            })}
            key={i}
          >
            {displayText}
            {note && <span className={classes.superscript}>[{count.current++}]</span>}
          </div>
        );
      })}
      {ingredients.some((el) => el.note) && (
        <ol className={classes.ingredientsNotes}>
          {ingredients
            .filter((el) => el.note)
            .map(({ note }, index) => (
              <li key={index} data-icon={`[${index + 1}]`}>
                {note}
              </li>
            ))}
        </ol>
      )}
    </div>
  );
};

export default Ingredients;
