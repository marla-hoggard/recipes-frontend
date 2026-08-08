import React from 'react';
import { faPepperHot } from '@fortawesome/free-solid-svg-icons';
import FailWhale from '../base/FailWhale';

const RecipeNotFound: React.FC = () => {
  return (
    <FailWhale
      icon={faPepperHot}
      title="Recipe Not Found"
      message="This recipe doesn't exist or may have been removed."
      linkTo="/browse"
      linkLabel="Browse Recipes"
    />
  );
};

export default RecipeNotFound;
