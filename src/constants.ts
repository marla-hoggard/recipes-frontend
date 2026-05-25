export const CATEGORIES = [
  'appetizer',
  'entree',
  'side',
  'dessert',
  'breakfast',
  'sauce',
  'beverage',
];

export const USER_TOKEN_STORAGE_KEY = 'user_token';

const getBackendURL = (env?: string) => {
  switch (env) {
    case 'local':
      return import.meta.env.REACT_APP_BACKEND_BASE_URL_LOCAL;
    case 'ip':
      return import.meta.env.REACT_APP_BACKEND_BASE_URL_IP;
    default:
      return import.meta.env.REACT_APP_BACKEND_BASE_URL_PROD;
  }
};

export const BACKEND_BASE_URL = import.meta.env.REACT_APP_BACKEND_BASE_URL || getBackendURL();
