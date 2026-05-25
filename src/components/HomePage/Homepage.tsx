import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../../api/users';
import { clearTokenFromStorage } from '../../api/helpers';
import { selectCurrentUser, resetCurrentUser } from '../../reducers/currentUser';
import { BACKEND_BASE_URL } from '../../constants';
import logo from '../../images/logo.png';
import TitleSearch from './TitleSearch';
import classes from './Homepage.module.css';

const Homepage: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const handleSignout = useCallback(async () => {
    if (currentUser) {
      const isSignedOut = await signout(currentUser.token);
      if (isSignedOut) {
        dispatch(resetCurrentUser());
        clearTokenFromStorage();
      }
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    // hit the backend on load to wake up dynos
    fetch(`${BACKEND_BASE_URL}`);
  }, []);

  return (
    <div className={classes.heroImageContainer}>
      {currentUser ? (
        <div className={classes.linkContainer}>
          <div className={classes.navButton} onClick={handleSignout}>
            Log Out
          </div>
        </div>
      ) : (
        <div className={classes.linkContainer}>
          <Link className={classes.navButton} to="/login">
            Log In
          </Link>
        </div>
      )}
      <div className={classes.contentContainer}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={logo} alt="Glasser Recipes" />
        </div>
        <TitleSearch />
        <div className={classes.buttonContainer}>
          <Link className={classes.transparentButton} to="/browse">
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
