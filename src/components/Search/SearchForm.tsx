import React, { useEffect } from 'react';
import { Formik, FormikHelpers, Form, useFormikContext } from 'formik';
import { Category, SearchParams, Recipe } from '../../types/recipe.types';
import { CATEGORIES } from '../../constants';
import { RadioGroup, SelectField, InputField } from './SearchFormComponents';
import classes from './Search.module.scss';
import { searchRecipes } from '../../api/recipe';

export type SearchValues = {
  matchType: 'any' | 'all';
  category: Category;
  vegetarian: string;
  featured: string;
  wildcard: string;
  title: string;
  source: string;
  submitted_by: string;
  tags: string;
  ingredients: string;
  step: string;
  footnote: string;
};

const defaultValues: SearchValues = {
  matchType: 'all',
  category: '',
  vegetarian: '',
  featured: '',
  wildcard: '',
  title: '',
  source: '',
  submitted_by: '',
  tags: '',
  ingredients: '',
  step: '',
  footnote: '',
};

type Props = {
  paramValues?: Partial<SearchValues>;
  setSearchResults: (results: Recipe[]) => void;
};

const SearchForm: React.FC<Props> = ({ paramValues = {}, setSearchResults }) => (
  <>
    <h1 className={classes.pageTitle}>Search Recipes</h1>
    <Formik
      initialValues={defaultValues}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<SearchValues>) => {
        setSubmitting(true);
        const searchParams: SearchParams = Object.fromEntries(
          Object.entries(values).filter(([key, value]) => !!value && key !== 'matchAll'),
        );
        if (values.matchType === 'all') {
          searchParams.all = true;
        }
        if (values.vegetarian) {
          searchParams.vegetarian = values.vegetarian === 'vegetarian';
        }
        if (values.featured) {
          searchParams.featured = values.featured === 'featured';
        }
        const results = await searchRecipes(searchParams);
        setSearchResults(results);
        setSubmitting(false);
      }}
    >
      <AdvancedSearchForm paramValues={paramValues} />
    </Formik>
  </>
);

const AdvancedSearchForm: React.FC<{ paramValues: Partial<SearchValues> }> = ({ paramValues }) => {
  const { isSubmitting, setFieldValue } = useFormikContext();

  useEffect(() => {
    Object.entries(paramValues).forEach(([key, value]) => setFieldValue(key, value));
  }, [paramValues, setFieldValue]);

  return (
    <Form className={classes.form}>
      <div className={classes.formRow}>
        <RadioGroup name="matchType" title="Match:" options={['any', 'all']} />
      </div>
      <div className={classes.formRow}>
        <InputField
          labelText="Global:"
          name="wildcard"
          placeholder="Search any field, separate with commas"
        />
        <InputField labelText="Title:" name="title" placeholder="Separate terms with comma" />
      </div>
      <div className={classes.formRow}>
        <InputField labelText="Source:" name="source" />
        <InputField labelText="Submitted By:" name="submitted_by" />
      </div>
      <div className={classes.formRow}>
        <InputField labelText="Tags:" name="tags" placeholder="Separate terms with comma" />
        <InputField
          labelText="Ingredients:"
          name="ingredients"
          placeholder="Separate terms with comma"
        />
      </div>
      <div className={classes.formRow}>
        <InputField labelText="Steps:" name="steps" placeholder="Separate terms with comma" />
        <InputField
          labelText="Footnotes:"
          name="footnotes"
          placeholder="Separate terms with comma"
        />
      </div>
      <div className={classes.formRow}>
        <SelectField name="category" title="CATEGORY" options={CATEGORIES} />
        <RadioGroup name="featured" options={['featured', 'non-featured']} />
        <RadioGroup name="vegetarian" options={['vegetarian', 'non-vegetarian']} />
      </div>
      <div className={classes.buttonRow}>
        <button className={classes.button} type="submit" disabled={isSubmitting}>
          Search
        </button>
        <button className={classes.secondaryButton} type="reset">
          Reset
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
