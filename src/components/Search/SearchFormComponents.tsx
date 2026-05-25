import React from 'react';
import classNames from 'classnames';
import { Field } from 'formik';
import classes from './Search.module.css';

type InputFieldProps = {
  labelText?: string;
  name: string;
  placeholder?: string;
  className?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  className = '',
  labelText,
  name,
  placeholder,
}) => (
  <div className={classes.inputGroup}>
    {labelText && (
      <div>
        <label className={classes.label} htmlFor={name}>
          {labelText}
        </label>
      </div>
    )}
    <div className={classes.inputContainer}>
      <Field
        className={classNames({
          [classes.input]: true,
          [className]: !!className,
        })}
        name={name}
        type="text"
        placeholder={placeholder}
      />
    </div>
  </div>
);

type SelectFieldProps = {
  options: string[];
  title: string;
  name: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({ name, options, title }) => (
  <Field className={classes.select} name={name} as="select">
    <option value="">{title}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </Field>
);

type RadioGroupProps = {
  name: string;
  options: string[];
  title?: string;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, title }) => (
  <div className={classes.radioGroup}>
    {title && <div className={classes.radioTitle}>{title}</div>}
    <div role="group" aria-labelledby={name}>
      {options.map((option) => (
        <label key={option} className={classes.radioLabel}>
          <Field type="radio" name={name} value={option} className={classes.radioButton} />
          {option}
        </label>
      ))}
    </div>
  </div>
);

// export const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, title, defaultOption }) => (
//   <Field component="div" name={name} className={classes.radioGroup}>
//     {title && <div className={classes.radioTitle}>{title}</div>}
//     {options.map((option, i) => (
//       <div className={classes.radioOption} key={option}>
//         <input
//           className={classes.radioButton}
//           id={`radio-${name}[${i}]}`}
//           type="radio"
//           defaultChecked={defaultOption === option}
//           name={name}
//           value={option}
//         />
//         <label className={classes.radioLabel} htmlFor={`radio-${name}[${i}]}`}>
//           {option}
//         </label>
//       </div>
//     ))}
//   </Field>
// );
