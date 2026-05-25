import React from 'react';
import classNames from 'classnames';
import { Field, ErrorMessage } from 'formik';
import classes from './RecipeForm.module.css';

type InputFieldProps = {
  labelText?: string;
  name: string;
  hasError: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  className = '',
  fullWidth = false,
  labelText,
  name,
  placeholder,
  hasError,
}) => (
  <>
    {labelText && (
      <label className={classes.label} htmlFor={name}>
        {labelText}
      </label>
    )}
    <Field
      className={classNames({
        [classes.input]: true,
        [classes.error]: hasError,
        [classes.fullWidth]: fullWidth,
        [className]: !!className,
      })}
      name={name}
      type="text"
      placeholder={placeholder}
    />
    {hasError && (
      <div className={classes.errorMessage}>
        <ErrorMessage name={name} />
      </div>
    )}
  </>
);

type TextAreaFieldProps = {
  labelText?: string;
  name: string;
  hasError: boolean;
  placeholder?: string;
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  labelText,
  name,
  hasError,
  placeholder,
}) => (
  <>
    {labelText && (
      <label className={classes.textareaLabel} htmlFor={name}>
        {labelText}
      </label>
    )}
    <Field
      className={hasError ? classes.textareaError : classes.textarea}
      name={name}
      as="textarea"
      placeholder={placeholder}
    />
    {hasError && (
      <div className={classes.errorMessage}>
        <ErrorMessage name={name} />
      </div>
    )}
  </>
);

type SelectFieldProps = {
  options: string[];
  title: string;
  name: string;
  hasError: boolean;
};

export const SelectField: React.FC<SelectFieldProps> = ({ hasError, name, options, title }) => (
  <Field className={hasError ? classes.selectError : classes.select} name={name} as="select">
    <option defaultValue={title}>{title}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </Field>
);

type CheckboxFieldProps = {
  labelText?: string;
  name: string;
};

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ labelText, name }) =>
  labelText ? (
    <label>
      <Field className={classes.checkbox} type="checkbox" name={name} />
      {labelText}
    </label>
  ) : (
    <Field className={classes.checkbox} type="checkbox" name={name} />
  );
