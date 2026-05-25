/* eslint-disable func-names */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { createUser } from '../../api/users';
import { setCurrentUser } from '../../reducers/currentUser';
import { InputField } from './FormComponents';
import classes from './Authentication.module.css';
import { saveTokenToStorage } from '../../api/helpers';

type FormValues = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const defaultValues: FormValues = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  username: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .max(20, 'Must be at most 20 characters')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .max(20, 'Must be at most 20 characters')
    .required('Required'),
  password_confirmation: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .max(20, 'Must be at most 20 characters')
    .test('password-match', 'Must match your password', function (value) {
      return this.parent.password === value;
    })
    .required('Required'),
});

const SignupForm: React.FC = () => {
  const [generalError, setGeneralError] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();

  const handleSubmit = useCallback(
    async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      setSubmitting(true);
      setGeneralError('');
      const { first_name, last_name, email, username, password } = values;
      const cleanedUsername = username.trim().toLowerCase();
      const cleanedEmail = email.trim();
      const result = await createUser({
        first_name,
        last_name,
        email: cleanedEmail,
        username: cleanedUsername,
        password,
      });
      if ('user' in result) {
        setSubmitting(false);
        dispatch(
          setCurrentUser({
            firstName: result.user.first_name,
            lastName: result.user.last_name,
            email: result.user.email,
            username: result.user.username,
            token: result.user.token,
            isAdmin: result.user.is_admin,
          }),
        );
        saveTokenToStorage(result.user.token);
        history.push(pathname.replace(/\/signup$/, ''));
      } else {
        setGeneralError(result.error);
        setSubmitting(false);
      }
    },
    [dispatch, history, pathname],
  );

  return (
    <>
      <h1 className={classes.pageTitle}>Sign Up</h1>
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={classes.signupForm}>
            <div className={classes.formRow}>
              <InputField
                name="first_name"
                placeholder="First Name"
                hasError={!!(errors.first_name && touched.first_name)}
                left
              />
              <InputField
                name="last_name"
                placeholder="Last Name"
                hasError={!!(errors.last_name && touched.last_name)}
                right
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                name="email"
                placeholder="Email"
                type="email"
                hasError={!!(errors.email && touched.email)}
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                name="username"
                placeholder="Username"
                hasError={!!(errors.username && touched.username)}
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <InputField
                name="password"
                placeholder="Password"
                type="password"
                hasError={!!(errors.password && touched.password)}
                left
              />
              <InputField
                name="password_confirmation"
                placeholder="Confirm Password"
                type="password"
                hasError={!!(errors.password_confirmation && touched.password_confirmation)}
                right
              />
            </div>
            <div className={classes.formRow}>
              <button className={classes.solidButton} type="submit" disabled={isSubmitting}>
                Sign Up
              </button>
            </div>
            <div className={classes.errorMessageContainer}>
              <div className={classes.errorMessage}>{generalError}</div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignupForm;
