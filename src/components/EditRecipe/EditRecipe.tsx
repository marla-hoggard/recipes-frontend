import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { getRecipe } from '../../api/recipe';
import { selectCurrentUser, selectCurrentUserFullName } from '../../reducers/currentUser';
import RecipeForm, { FormValues } from '../RecipeForm/RecipeForm';

const EditRecipe: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserFullName = useSelector(selectCurrentUserFullName);
  const [loading, setLoading] = useState(true);
  const [savedValues, setSavedValues] = useState<Partial<FormValues>>({});

  const fetchAndCheckPermissions = useCallback(async () => {
    if (!currentUser) {
      history.push('/login');
      return;
    }

    const recipe = await getRecipe(id);
    if ('id' in recipe) {
      // TODO: Update to match user id in addition to name
      if (!currentUser.isAdmin && recipe.submitted_by !== currentUserFullName) {
        history.push('/');
        return;
      }

      setSavedValues({
        ...recipe,
        source: recipe.source || '',
        source_url: recipe.source_url || '',
        servings: recipe.servings || '',
        tags: recipe.tags.join(', '),
        ingredientsTextarea: recipe.ingredients.map((i) => i.ingredient).join('\n'),
        ingredientsWithNotes: recipe.ingredients.map(({ ingredient, note }) => ({
          ingredient,
          note: note || '',
        })),
        steps: recipe.steps.join('\n\n'),
        footnotes: recipe.footnotes,
      });
      setLoading(false);
    } else {
      history.push('/404');
    }
  }, [currentUser, currentUserFullName, history, id]);

  useEffect(() => {
    fetchAndCheckPermissions();
  }, [fetchAndCheckPermissions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <RecipeForm savedValues={savedValues} type="edit" id={id} />;
};

export default EditRecipe;
