/* eslint-disable func-names */
import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import {
  AddRecipeRequest,
  AddRecipeResponse,
  Category,
  EditRecipeRequest,
  Ingredient,
} from "../../types/api.types";
import { addRecipe, editRecipe } from "../../api";
import { countOccurrences, trimAndRemoveEmpty } from "../../helpers";
import { InputField, TextAreaField, SelectField, CheckboxField } from "./FormComponents";
import { StepsAndNotes, IngredientsWithFootnotes } from "./FieldArrays";
import classes from "./RecipeForm.module.scss";

export type FormValues = {
  title: string;
  source: string;
  sourceUrl: string;
  submittedBy: string;
  servings: string;
  category: Category;
  vegetarian: boolean;
  tags: string;
  ingredientsTextarea: string;
  ingredientsWithNotes: Ingredient[];
  steps: string;
  notes: string[];
};

const defaultValues: FormValues = {
  title: "",
  source: "",
  sourceUrl: "",
  submittedBy: "",
  servings: "",
  category: "",
  vegetarian: false,
  tags: "",
  ingredientsTextarea: "",
  ingredientsWithNotes: [],
  steps: "",
  notes: [],
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  source: Yup.string(),
  sourceUrl: Yup.string(),
  submittedBy: Yup.string().required("Required"),
  servings: Yup.string(),
  category: Yup.string().required("Required"),
  vegetarian: Yup.boolean(),
  ingredientsTextarea: Yup.string().test("ingredients-required", "Required", function (value) {
    return this.parent.ingredientsWithNotes.length > 0 || !!value;
  }),
  ingredientsWithNotes: Yup.array(
    Yup.object().shape({
      ingredient: Yup.string().required(" "),
      footnote: Yup.string(),
    }),
  ),
  steps: Yup.string()
    .required("Required")
    .test("notes-match", "You must enter * for each note", function (value) {
      const numStars = countOccurrences("*", value || "");
      const numNotes = this.parent.notes.filter((el: string) => !!el).length;
      return numStars === numNotes;
    }),
  notes: Yup.array(Yup.string()),
});

const prepareEditRequest = (
  values: FormValues,
  savedValues: Partial<FormValues>,
  hasFootnotes: boolean,
): EditRecipeRequest => {
  const editRequest: EditRecipeRequest = {};
  if (values.title !== savedValues.title) editRequest.title = values.title;
  if (values.source !== savedValues.source) editRequest.source = values.source;
  if (values.sourceUrl !== savedValues.sourceUrl) editRequest.sourceUrl = values.sourceUrl;
  if (values.submittedBy !== savedValues.submittedBy) editRequest.submittedBy = values.submittedBy;
  if (values.servings !== savedValues.servings) editRequest.servings = values.servings;
  if (values.category !== savedValues.category) editRequest.category = values.category;
  if (values.vegetarian !== savedValues.vegetarian) editRequest.vegetarian = values.vegetarian;
  if (values.tags !== savedValues.tags)
    editRequest.tags = values.tags.split(",").map((el) => el.trim());
  if (
    values.ingredientsTextarea !== savedValues.ingredientsTextarea ||
    values.ingredientsWithNotes.map((el) => el.ingredient).join(",") !==
      savedValues.ingredientsWithNotes?.map((el) => el.ingredient).join(",") ||
    values.ingredientsWithNotes.map((el) => el.footnote).join(",") !==
      savedValues.ingredientsWithNotes?.map((el) => el.footnote).join(",")
  ) {
    editRequest.ingredients = hasFootnotes
      ? values.ingredientsWithNotes
      : trimAndRemoveEmpty(values.ingredientsTextarea.split(/\n/)).map((i) => ({ ingredient: i }));
  }
  if (values.steps !== savedValues.steps) {
    editRequest.steps = trimAndRemoveEmpty(values.steps.split(/\n+/));
  }
  if (
    values.notes.length !== savedValues.notes?.length ||
    trimAndRemoveEmpty(values.notes).join(",") !== savedValues.notes?.join(",")
  ) {
    editRequest.notes = trimAndRemoveEmpty(values.notes);
  }
  return editRequest;
};

type Props = {
  id?: number;
  savedValues?: Partial<FormValues>;
  type: "add" | "edit";
};

const RecipeForm: React.FC<Props> = ({ id, savedValues = {}, type }) => {
  const history = useHistory();
  const [submitError, setSubmitError] = useState("");
  const [showFootnotes, setShowFootnotes] = useState(
    !!savedValues?.ingredientsWithNotes?.some((i) => i.footnote),
  );

  const switchToFootnotes = useCallback(
    (values: FormValues, setFieldValue: (field: string, value: string) => void) => {
      trimAndRemoveEmpty(values.ingredientsTextarea.split("\n")).forEach((ing, index) => {
        setFieldValue(`ingredientsWithNotes.${index}.ingredient`, ing);
      });
      setShowFootnotes(true);
    },
    [],
  );

  if (type === "edit" && !id) {
    history.push("/404");
  }

  return (
    <>
      <h1 className={classes.pageTitle}>{type === "add" ? "Add a New Recipe" : "Edit Recipe"}</h1>
      <Formik
        initialValues={{
          ...defaultValues,
          ...savedValues,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          setSubmitting(true);
          let result: AddRecipeResponse;

          if (type === "edit" && id) {
            const editRequest = prepareEditRequest(values, savedValues, showFootnotes);
            result = await editRecipe(id, editRequest);
          } else {
            const addRequest: AddRecipeRequest = {
              ...values,
              tags: values.tags.split(",").map((el) => el.trim()),
              ingredients: showFootnotes
                ? values.ingredientsWithNotes
                : trimAndRemoveEmpty(values.ingredientsTextarea.split(/\n/)).map((i) => ({
                    ingredient: i,
                  })),
              steps: trimAndRemoveEmpty(values.steps.split(/\n+/)),
              notes: trimAndRemoveEmpty(values.notes),
            };
            console.log(addRequest);
            result = await addRecipe(addRequest);
          }

          if ("id" in result) {
            setSubmitting(false);
            history.push(`/recipe/${result.id}`);
          } else {
            setSubmitError(result.error.message);
            setSubmitting(false);
          }
        }}
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
                name="sourceUrl"
                hasError={!!(errors.sourceUrl && touched.sourceUrl)}
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                labelText="Submitted By"
                name="submittedBy"
                hasError={!!(errors.submittedBy && touched.submittedBy)}
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
                  options={[
                    "appetizer",
                    "entree",
                    "side",
                    "dessert",
                    "breakfast",
                    "sauce",
                    "beverage",
                  ]}
                  title="Category"
                  name="category"
                  hasError={!!(errors.category && touched.category)}
                />
              </div>
              <div>
                <CheckboxField labelText="Vegetarian" name="vegetarian" />
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
            {showFootnotes ? (
              <IngredientsWithFootnotes values={values} errors={errors} touched={touched} />
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
                    + Add Footnotes
                  </div>
                </div>
                <TextAreaField
                  name="ingredientsTextarea"
                  placeholder="Enter each ingredient separated by a line break."
                  hasError={!!(errors.ingredientsTextarea && touched.ingredientsTextarea)}
                />
              </div>
            )}
            <StepsAndNotes values={values} errors={errors} touched={touched} />
            <div className={classes.formRow}>
              <button className={classes.submit} type="submit" disabled={isSubmitting}>
                Submit
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
