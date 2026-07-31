import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Category as CategoryType } from '../../types/recipe.types';
import classes from './Category.module.css';
import { useNavigate } from 'react-router-dom';

type Props = {
  category: CategoryType;
};

const Category: React.FC<Props> = ({ category }) => {
  const navigate = useNavigate();

  const searchByCategory = useCallback(() => {
    navigate(`/search?category=${category}`);
  }, [navigate, category]);

  return (
    <div className={classNames(classes.category, classes[category])} onClick={searchByCategory}>
      {category}
    </div>
  );
};

export default Category;
