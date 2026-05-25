import React from 'react';
import classNames from 'classnames';
import { Field, ErrorMessage } from 'formik';
import classes from './Authentication.module.css';

type InputFieldProps = {
  labelText?: string;
  name: string;
  hasError: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  left?: boolean; // Left of two in a row
  right?: boolean; // Right of two in a row
  fullWidth?: boolean;
  className?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  className = '',
  name,
  placeholder,
  hasError,
  type = 'text',
  left = false,
  right = false,
  fullWidth = false,
}) => (
  <div
    className={classNames({
      [classes.inputGroup]: true,
      [classes.left]: left,
      [classes.right]: right,
      [classes.fullWidth]: fullWidth,
    })}
  >
    <Field
      className={classNames({
        [classes.input]: true,
        [classes.error]: hasError,
        [classes.left]: left,
        [classes.right]: right,
        [classes.fullWidth]: fullWidth,
        [className]: !!className,
      })}
      name={name}
      type={type}
      placeholder={placeholder}
    />
    <div className={classes.errorMessage}>
      <ErrorMessage name={name} />
    </div>
  </div>
);
