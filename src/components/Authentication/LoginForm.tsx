/* eslint-disable func-names */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { login } from '../../api/users';
import { InputField } from './FormComponents';
import { setCurrentUser } from '../../reducers/currentUser';
import classes from './Authentication.module.css';
import { saveTokenToStorage } from '../../api/helpers';

type FormValues = {
  username: string;
  password: string;
};

const defaultValues: FormValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm: React.FC = () => {
  const [generalError, setGeneralError] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();

  const handleSubmit = useCallback(
    async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      setSubmitting(true);
      setGeneralError('');
      const { username, password } = values;
      const cleanedUsername = username.trim().toLowerCase();
      const result = await login({ username: cleanedUsername, password });
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
        history.push(pathname.replace(/\/login$/, ''));
      } else {
        setGeneralError(result.error);
        setSubmitting(false);
      }
    },
    [dispatch, history, pathname],
  );

  return (
    <>
      <h1 className={classes.pageTitle}>Log In</h1>
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={classes.loginForm}>
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
                fullWidth
              />
            </div>
            <div className={classes.formRow}>
              <button className={classes.solidButton} type="submit" disabled={isSubmitting}>
                Log In
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

export default LoginForm;
