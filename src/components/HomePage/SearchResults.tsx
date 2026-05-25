import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Recipe } from '../../types/recipe.types';
import classes from './TitleSearch.module.css';

type Props = {
  innerRef: React.RefObject<HTMLUListElement>;
  cursor: number;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  setCursor: (n: number) => void;
  recipes: Recipe[];
};

const TitleSearchResults: React.FC<Props> = ({
  innerRef,
  cursor,
  handleClick,
  setCursor,
  recipes,
}) => {
  const [hasMovedMouse, setMovedMouse] = useState(false);
  const handleMouseOver = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      if (hasMovedMouse && event.currentTarget.dataset.index !== undefined) {
        setCursor(parseInt(event.currentTarget.dataset.index));
      }
    },
    [hasMovedMouse, setCursor],
  );

  const handleMouseMove = useCallback(() => {
    if (!hasMovedMouse) {
      setMovedMouse(true);
    }
  }, [hasMovedMouse]);

  return (
    <ul ref={innerRef} className={classes.recipeList} onMouseMove={handleMouseMove}>
      {recipes.map(({ title, id }, idx) => (
        <li
          key={id}
          className={classNames({
            [classes.searchResult]: true,
            [classes.selected]: cursor === idx,
          })}
          data-index={idx}
          data-id={id}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
        >
          <div>{title}</div>
        </li>
      ))}
    </ul>
  );
};
export default TitleSearchResults;
