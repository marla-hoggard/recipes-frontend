import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { addRecipe } from "../../api";
import { InputField, TextAreaField, SelectField, CheckboxField } from "./FormComponents";
import classes from "./RecipeForm.module.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  source: Yup.string(),
  sourceUrl: Yup.string(),
  submittedBy: Yup.string().required("Required"),
  servings: Yup.string(),
  category: Yup.string().required("Required"),
  vegetarian: Yup.boolean(),
  ingredients: Yup.string().required("Required"),
  steps: Yup.string().required("Required"),
});

const AddRecipeForm: React.FC = () => {
  const history = useHistory();
  const [submitError, setSubmitError] = useState("");
  return (
    <>
      <h1 className={classes.pageTitle}>Add a New Recipe</h1>
      <Formik
        initialValues={{
          title: "",
          source: "",
          sourceUrl: "",
          submittedBy: "Marla Hoggard",
          servings: "",
          category: "",
          vegetarian: false,
          tags: "",
          ingredients: "",
          steps: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const body = {
            ...values,
            tags: values.tags.split(",").map((el) => el.trim()),
            ingredients: values.ingredients.split(/\n/).map((el) => el.trim()),
            steps: values.steps.split(/\n+/).map((el) => el.trim()),
          };
          const result = await addRecipe(body);
          if ("id" in result) {
            setSubmitting(false);
            history.push(`/recipe/${result.id}`);
          } else {
            setSubmitError(result.error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
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
            <div className={classes.textareaRow}>
              <TextAreaField
                labelText="Ingredients"
                name="ingredients"
                placeholder="Enter each ingredient separated by a line break."
                hasError={!!(errors.ingredients && touched.ingredients)}
              />
            </div>
            <div className={classes.textareaRow}>
              <TextAreaField
                labelText="Instructions"
                name="steps"
                hasError={!!(touched.steps && errors.steps)}
                placeholder="Enter recipe instructions with line breaks between steps."
              />
            </div>
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

export default AddRecipeForm;