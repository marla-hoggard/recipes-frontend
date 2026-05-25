import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Category as CategoryType } from '../../types/recipe.types';
import classes from './Category.module.css';
import { useHistory } from 'react-router-dom';

type Props = {
  category: CategoryType;
};

const Category: React.FC<Props> = ({ category }) => {
  const history = useHistory();

  const searchByCategory = useCallback(() => {
    history.push(`/search?category=${category}`);
  }, [history, category]);

  return (
    <div className={classNames(classes.category, classes[category])} onClick={searchByCategory}>
      {category}
    </div>
  );
};

export default Category;
