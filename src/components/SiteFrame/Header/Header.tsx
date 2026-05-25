import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { signout } from '../../../api/users';
import { clearTokenFromStorage } from '../../../api/helpers';
import { selectCurrentUser, resetCurrentUser } from '../../../reducers/currentUser';
import logo from '../../../images/logo-small.png';
import classes from './Header.module.css';
import useMediaQuery from '../../../hooks/useMediaQuery';

const Header: React.FC = () => {
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector(selectCurrentUser);
  const authedBreakpoint = useMediaQuery('(max-width: 767px)');
  const unauthedBreakpoint = useMediaQuery('(max-width: 515px)');
  const collapseHeader = currentUser ? authedBreakpoint : unauthedBreakpoint;
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleCloseMenu = (e: Event) => {
      const clickedMenuIcon = menuButtonRef.current?.contains(e.target as Node);
      if (isMobileMenuVisible && !clickedMenuIcon) {
        setIsMobileMenuVisible(false);
      }
    };

    if (isMobileMenuVisible) {
      document.body.addEventListener('click', handleCloseMenu);
    }

    return () => {
      if (isMobileMenuVisible) {
        document.body.removeEventListener('click', handleCloseMenu);
      }
    };
  }, [isMobileMenuVisible]);

  useEffect(() => {
    if (!collapseHeader) {
      setIsMobileMenuVisible(false);
    }
  }, [collapseHeader]);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuVisible((isVisible) => !isVisible);
  }, []);

  const handleSignout = useCallback(async () => {
    if (currentUser) {
      const isSignedOut = await signout(currentUser.token);
      if (isSignedOut) {
        dispatch(resetCurrentUser());
        clearTokenFromStorage();
      }
    }
  }, [currentUser, dispatch]);

  if (pathname.includes('/login')) {
    return (
      <div className={classes.headerContainer}>
        <div className={classes.leftContainer}>
          <div className={classes.logoContainer}>
            <Link className={classes.logoLink} to="/">
              <img className={classes.logo} src={logo} alt="Glasser Recipes" />
            </Link>
          </div>
        </div>
        <div className={classes.rightContainer}>
          <div className={classes.linkContainer}>
            <Link className={classes.navLink} to={`${pathname.replace('/login', '/signup')}`}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (pathname.includes('/signup')) {
    return (
      <div className={classes.headerContainer}>
        <div className={classes.leftContainer}>
          <div className={classes.logoContainer}>
            <Link className={classes.logoLink} to="/">
              <img className={classes.logo} src={logo} alt="Glasser Recipes" />
            </Link>
          </div>
        </div>
        <div className={classes.rightContainer}>
          <div className={classes.linkContainer}>
            <Link className={classes.navLink} to={pathname.replace('/signup', '/login')}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (collapseHeader) {
    return (
      <>
        <div className={classes.headerContainer}>
          <div className={classes.leftContainer}>
            <div className={classes.logoContainer}>
              <Link className={classes.logoLink} to="/">
                <img className={classes.logo} src={logo} alt="Glasser Recipes" />
              </Link>
            </div>
          </div>
          <div className={classes.rightContainer}>
            <div
              ref={menuButtonRef}
              className={classes.linkContainer}
              onClick={handleToggleMobileMenu}
            >
              <FontAwesomeIcon className={classes.divLink} icon={faBars} />
            </div>
          </div>
        </div>

        <div
          className={classNames(
            classes.mobileFlyoutContainer,
            isMobileMenuVisible ? classes.visible : classes.hidden,
          )}
        >
          <div className={classes.flyoutRow}>
            <Link className={classes.navLink} to="/browse">
              Browse
            </Link>
          </div>
          <div className={classes.flyoutRow}>
            <Link className={classes.navLink} to="/search">
              Search
            </Link>
          </div>
          {!!currentUser && (
            <div className={classes.flyoutRow}>
              <Link className={classes.navLink} to="/new">
                New Recipe
              </Link>
            </div>
          )}
          <div className={classes.flyoutRow}>
            {currentUser ? (
              <div className={classes.navLink} onClick={handleSignout}>
                Log Out
              </div>
            ) : (
              <Link className={classes.navLink} to={`${pathname}/login`}>
                Log In
              </Link>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={classes.headerContainer}>
      <div className={classes.leftContainer}>
        <div className={classes.logoContainer}>
          <Link className={classes.logoLink} to="/">
            <img className={classes.logo} src={logo} alt="Glasser Recipes" />
          </Link>
        </div>
      </div>
      <div className={classes.rightContainer}>
        {!!currentUser && (
          <div className={classes.linkContainer}>
            <div className={classes.navItem}>Hi, {currentUser.firstName}</div>
          </div>
        )}
        <div className={classes.linkContainer}>
          <Link className={classes.navLink} to="/browse">
            Browse
          </Link>
        </div>
        <div className={classes.linkContainer}>
          <Link className={classes.navLink} to="/search">
            Search
          </Link>
        </div>
        {!!currentUser && (
          <div className={classes.linkContainer}>
            <Link className={classes.navLink} to="/new">
              New Recipe
            </Link>
          </div>
        )}
        <div className={classes.linkContainer}>
          {currentUser ? (
            <div className={classes.divLink} onClick={handleSignout}>
              Log Out
            </div>
          ) : (
            <Link className={classes.navLink} to={`${pathname}/login`}>
              Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
