import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCocktail,
  faCookieBite,
  faHamburger,
  faWineBottle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { getCategoryColor } from './categoryHelpers';
import Breakfast from '../../Browse/CategoryImages/Breakfast';
import Cheese from '../../Browse/CategoryImages/Cheese';
import Fries from '../../Browse/CategoryImages/Fries';
import { Category } from '../../../types/recipe.types';
import classes from './RecipeList.module.css';

type SVGIconProps = {
  SvgComponent: FunctionComponent<{ className?: string }>;
};

const SVGIcon: React.FC<SVGIconProps> = ({ SvgComponent }) => (
  <div className={classes.svgContainer}>
    <SvgComponent className={classes.svgIcon} />
  </div>
);

type FAIconProps = {
  icon: IconDefinition;
};

const FAIcon: React.FC<FAIconProps> = ({ icon }) => (
  <FontAwesomeIcon className={classes.faIcon} icon={icon} transform="grow-32" />
);

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'appetizer':
      return <SVGIcon SvgComponent={Cheese} />;
    case 'side':
      return <SVGIcon SvgComponent={Fries} />;
    case 'breakfast':
      return <SVGIcon SvgComponent={Breakfast} />;
    case 'dessert':
      return <FAIcon icon={faCookieBite} />;
    case 'sauce':
      return <FAIcon icon={faWineBottle} />;
    case 'beverage':
      return <FAIcon icon={faCocktail} />;
    case 'entree':
    default:
      return <FAIcon icon={faHamburger} />;
  }
};

type Props = {
  category: Category;
};

const CategoryImage: React.FC<Props> = ({ category }) => {
  const color = getCategoryColor(category);
  const Icon = getCategoryIcon(category);

  return <div className={classNames(classes.categoryIcon, classes[color])}>{Icon}</div>;
};

export default CategoryImage;
