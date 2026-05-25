import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Recipe as RecipeType } from '../../../types/recipe.types';
import { getCategoryColor } from './categoryHelpers';
import CategoryImage from './CategoryImage';
import classes from './RecipeList.module.css';

type Props = {
  recipe: RecipeType;
};

type TagsListProps = {
  tags?: string[];
  vegetarian: boolean;
};

const TagsList: React.FC<TagsListProps> = ({ tags = [], vegetarian }) => {
  const items = vegetarian ? tags.concat('vegetarian') : tags;

  return <div className={classes.tags}>{items.join(', ')}</div>;
};

const RecipeListItem: React.FC<Props> = ({
  recipe: { id, category, source, title, featured, tags, vegetarian },
}) => {
  const history = useHistory();

  const goToRecipe = useCallback(() => {
    history.push(`/recipe/${id}`);
  }, [history, id]);

  const color = getCategoryColor(category);

  return (
    <div className={classes.recipeItemContainer} onClick={goToRecipe}>
      <CategoryImage category={category} />
      <div className={classNames(classes.recipeDetails, classes[color])}>
        <div className={classes.title}>
          {title}
          {featured && <FontAwesomeIcon className={classes.featuredStar} icon={faStar} />}
        </div>
        <div className={classes.source}>{source ? source : ''}</div>
        {(tags?.length || vegetarian) && <TagsList tags={tags} vegetarian={vegetarian} />}
      </div>
    </div>
  );
};

// const RecipeListItemOld: React.FC<Props> = ({
//   recipe: { id, category, source, title, featured },
// }) => {
//   return (
//     <div className={classes.recipeItemContainer}>
//       <div className={classes.row}>
//         <div className={classes.titleAndSource}>
//           <Link to={`/recipe/${id}`} className={classes.link}>
//             {title}
//             {featured && <FontAwesomeIcon className={classes.featuredStar} icon={faStar} />}
//           </Link>
//           {source && ` (${source})`}
//         </div>
//         <Category category={category} />
//       </div>
//     </div>
//   );
// };

export default RecipeListItem;
