/* eslint-disable func-names */
import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import {
  AddRecipeRequest,
  AddRecipeResponse,
  Category,
  EditRecipeRequest,
  Ingredient,
} from '../../types/recipe.types';
import { addRecipe, editRecipe } from '../../api/recipe';
import { CATEGORIES } from '../../constants';
import {
  countOccurrences,
  removeSmartQuotes,
  replaceFractions,
  trimAndRemoveEmpty,
} from '../../helpers';
import { InputField, TextAreaField, SelectField, CheckboxField } from './FormComponents';
import { StepsAndNotes, IngredientsWithNotes } from './FieldArrays';
import classes from './RecipeForm.module.scss';

export type FormValues = {
  title: string;
  source: string;
  source_url: string;
  submitted_by: string;
  servings: string;
  category: Category;
  vegetarian: boolean;
  featured: boolean;
  tags: string;
  ingredientsTextarea: string;
  ingredientsWithNotes: Ingredient[];
  steps: string;
  footnotes: string[];
};

const defaultValues: FormValues = {
  title: '',
  source: '',
  source_url: '',
  submitted_by: '',
  servings: '',
  category: '',
  vegetarian: false,
  featured: false,
  tags: '',
  ingredientsTextarea: '',
  ingredientsWithNotes: [],
  steps: '',
  footnotes: [],
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  source: Yup.string(),
  source_url: Yup.string(),
  submitted_by: Yup.string().required('Required'),
  servings: Yup.string(),
  category: Yup.string().required('Required'),
  vegetarian: Yup.boolean(),
  featured: Yup.boolean(),
  ingredientsTextarea: Yup.string().test('ingredients-required', 'Required', function (value) {
    return this.parent.ingredientsWithNotes.length > 0 || !!value;
  }),
  ingredientsWithNotes: Yup.array(
    Yup.object().shape({
      ingredient: Yup.string().required(' '),
      note: Yup.string(),
    }),
  ),
  steps: Yup.string()
    .required('Required')
    .test('footnotes-match', 'You must enter * for each footnote', function (value) {
      const numStars = countOccurrences('*', value || '');
      const numNotes = this.parent.footnotes.filter((el: string) => !!el).length;
      return numStars === numNotes;
    }),
  footnotes: Yup.array(Yup.string()),
});

const prepareEditRequest = (
  values: FormValues,
  savedValues: Partial<FormValues>,
  hasIngredientNotes: boolean,
): EditRecipeRequest => {
  const editRequest: EditRecipeRequest = {};
  if (values.title !== savedValues.title) editRequest.title = removeSmartQuotes(values.title);
  if (values.source !== savedValues.source) editRequest.source = values.source;
  if (values.source_url !== savedValues.source_url) editRequest.source_url = values.source_url;
  if (values.submitted_by !== savedValues.submitted_by)
    editRequest.submitted_by = values.submitted_by;
  if (values.servings !== savedValues.servings) editRequest.servings = values.servings;
  if (values.category !== savedValues.category) editRequest.category = values.category;
  if (values.vegetarian !== savedValues.vegetarian) editRequest.vegetarian = values.vegetarian;
  if (values.featured !== savedValues.featured) editRequest.featured = values.featured;
  if (values.tags !== savedValues.tags)
    editRequest.tags = trimAndRemoveEmpty(values.tags.split(','));
  if (
    values.ingredientsTextarea !== savedValues.ingredientsTextarea ||
    values.ingredientsWithNotes.map((el) => el.ingredient).join(',') !==
      savedValues.ingredientsWithNotes?.map((el) => el.ingredient).join(',') ||
    values.ingredientsWithNotes.map((el) => el.note).join(',') !==
      savedValues.ingredientsWithNotes?.map((el) => el.note).join(',')
  ) {
    editRequest.ingredients = hasIngredientNotes
      ? values.ingredientsWithNotes.map(({ ingredient, note }) => ({
          ingredient: removeSmartQuotes(ingredient),
          note: note ? removeSmartQuotes(note) : note,
        }))
      : trimAndRemoveEmpty(removeSmartQuotes(values.ingredientsTextarea).split(/\n/)).map((i) => ({
          ingredient: i,
        }));
  }
  if (values.steps !== savedValues.steps) {
    editRequest.steps = trimAndRemoveEmpty(removeSmartQuotes(values.steps).split(/\n+/));
  }
  if (
    values.footnotes.length !== savedValues.footnotes?.length ||
    trimAndRemoveEmpty(values.footnotes).join(',') !== savedValues.footnotes?.join(',')
  ) {
    editRequest.footnotes = trimAndRemoveEmpty(values.footnotes).map(removeSmartQuotes);
  }
  return editRequest;
};

type Props = {
  id?: number;
  savedValues?: Partial<FormValues>;
  type: 'add' | 'edit';
};

const RecipeForm: React.FC<Props> = ({ id, savedValues = {}, type }) => {
  const history = useHistory();
  const [submitError, setSubmitError] = useState('');
  const [showIngredientNotes, setShowIngredientNotes] = useState(
    !!savedValues?.ingredientsWithNotes?.some((i) => i.note),
  );

  const switchToFootnotes = useCallback(
    (values: FormValues, setFieldValue: (field: string, value: string) => void) => {
      values.ingredientsTextarea.length
        ? trimAndRemoveEmpty(values.ingredientsTextarea.split('\n')).forEach((ing, index) => {
            setFieldValue(`ingredientsWithNotes.${index}.ingredient`, ing);
          })
        : setFieldValue(`ingredientsWithNotes.0.ingredient`, '');
      setShowIngredientNotes(true);
    },
    [],
  );

  const handleCancel = useCallback(() => {
    history.push(`/recipe/${id}`);
  }, [history, id]);

  const handleSubmit = useCallback(
    async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      setSubmitting(true);
      let result: AddRecipeResponse;

      if (type === 'edit' && id) {
        const editRequest = prepareEditRequest(values, savedValues, showIngredientNotes);
        result = await editRecipe(id, editRequest);
      } else {
        const addRequest: AddRecipeRequest = {
          ...values,
          tags: trimAndRemoveEmpty(values.tags.split(',')),
          ingredients: showIngredientNotes
            ? values.ingredientsWithNotes.map(({ ingredient, note }) => {
                const converted: Ingredient = {
                  ingredient: replaceFractions(ingredient),
                };
                if (note) {
                  converted.note = replaceFractions(note);
                }
                return converted;
              })
            : trimAndRemoveEmpty(values.ingredientsTextarea.split(/\n/)).map((i) => ({
                ingredient: replaceFractions(i),
              })),
          steps: trimAndRemoveEmpty(replaceFractions(values.steps).split(/\n+/)),
          footnotes: trimAndRemoveEmpty(values.footnotes.map((f) => replaceFractions(f))),
        };
        result = await addRecipe(addRequest);
      }

      if ('id' in result) {
        setSubmitting(false);
        history.push(`/recipe/${result.id}`);
      } else {
        setSubmitError(result.error.message);
        setSubmitting(false);
      }
    },
    [history, id, savedValues, showIngredientNotes, type],
  );

  if (type === 'edit' && !id) {
    history.push('/404');
  }

  return (
    <>
      <h1 className={classes.pageTitle}>{type === 'add' ? 'Add a New Recipe' : 'Edit Recipe'}</h1>
      <Formik
        initialValues={{
          ...defaultValues,
          ...savedValues,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form className={classes.form}>
            <div className={classes.formRow}>
              <InputField
                labelText="Title"
                name="title"
                hasError={!!(errors.title && touched.title)}
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                labelText="Original Source"
                name="source"
                hasError={!!(errors.source && touched.source)}
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                labelText="Source URL"
                name="source_url"
                hasError={!!(errors.source_url && touched.source_url)}
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                labelText="Submitted By"
                name="submitted_by"
                hasError={!!(errors.submitted_by && touched.submitted_by)}
                fullWidth
              />
            </div>
            <div className={classes.comboRow}>
              <div className={classes.servingsContainer}>
                <InputField
                  labelText="Servings"
                  name="servings"
                  hasError={!!(errors.servings && touched.servings)}
                  className={classes.servings}
                />
              </div>
              <div>
                <SelectField
                  options={CATEGORIES}
                  title="Category"
                  name="category"
                  hasError={!!(errors.category && touched.category)}
                />
              </div>
              <div>
                <CheckboxField labelText="Vegetarian" name="vegetarian" />
              </div>
              <div>
                <CheckboxField labelText="Featured" name="featured" />
              </div>
            </div>
            <div className={classes.formRow}>
              <InputField
                labelText="Tags (separated by comma)"
                name="tags"
                hasError={!!(errors.tags && touched.tags)}
                placeholder="Ex: fish, indian, crockpot"
                fullWidth
              />
            </div>
            {showIngredientNotes ? (
              <IngredientsWithNotes values={values} errors={errors} touched={touched} />
            ) : (
              <div className={classes.textareaRow}>
                <div className={classes.labelAndLinkContainer}>
                  <label className={classes.textareaLabel} htmlFor="ingredientsTextarea">
                    Ingredients
                  </label>
                  <div
                    className={classes.addFootnoteLink}
                    onClick={() => switchToFootnotes(values, setFieldValue)}
                  >
                    + Add Notes
                  </div>
                </div>
                <TextAreaField
                  name="ingredientsTextarea"
                  placeholder={
                    'Enter each ingredient separated by a line break.\nTo create a section header, wrap it in underscores: _Header_'
                  }
                  hasError={!!(errors.ingredientsTextarea && touched.ingredientsTextarea)}
                />
              </div>
            )}
            <StepsAndNotes values={values} errors={errors} touched={touched} />
            <div className={classes.formRow}>
              {type === 'edit' && (
                <button
                  className={classes.secondaryButton}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              <button className={classes.solidButton} type="submit" disabled={isSubmitting}>
                {type === 'edit' ? 'Save Changes' : 'Submit'}
              </button>
            </div>
            <div className={classes.formRow}>
              <div className={classes.errorMessage}>{submitError}</div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RecipeForm;
