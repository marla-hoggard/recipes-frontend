import React from 'react';
import { Routes as RRRoutes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../reducers/currentUser';
import Header from './SiteFrame/Header/Header';
import Main from './SiteFrame/Main/Main';
import AddRecipe from './AddRecipe/AddRecipe';
import Browse from './Browse/Browse';
import EditRecipe from './EditRecipe/EditRecipe';
import Homepage from './HomePage/Homepage';
import LoginForm from './Authentication/LoginForm';
import InvalidRoute from './InvalidRoute/InvalidRoute';
import RecipeView from './RecipeView/RecipeView';
import SearchPage from './Search/SearchPage';
import SignupForm from './Authentication/SignupForm';

// /login and /signup are appended as a suffix to whatever page the user is currently on,
// so they can't be expressed as ordinary react-router-dom route paths.
const RouteContent: React.FC<{ isAuthenticated: boolean; pathname: string }> = ({
  isAuthenticated,
  pathname,
}) => {
  if (pathname.endsWith('/signup')) {
    return isAuthenticated ? (
      <Navigate to={pathname.replace('/signup', '')} replace />
    ) : (
      <SignupForm />
    );
  }

  if (pathname.endsWith('/login')) {
    return isAuthenticated ? (
      <Navigate to={pathname.replace('/login', '')} replace />
    ) : (
      <LoginForm />
    );
  }

  return (
    <RRRoutes>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/browse/:name" element={<Browse />} />
      <Route
        path="/new"
        element={isAuthenticated ? <AddRecipe /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/recipe/:id/edit"
        element={isAuthenticated ? <EditRecipe /> : <Navigate to="/login" replace />}
      />
      <Route path="/recipe/:id" element={<RecipeView />} />
      <Route path="/404" element={<InvalidRoute />} />
      <Route path="*" element={<InvalidRoute />} />
    </RRRoutes>
  );
};

const Routes: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pathname } = useLocation();

  if (pathname === '/') {
    return <Homepage />;
  }

  return (
    <>
      <Header />
      <Main>
        <RouteContent isAuthenticated={isAuthenticated} pathname={pathname} />
      </Main>
    </>
  );
};

export default Routes;
