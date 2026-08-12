import { USER_TOKEN_STORAGE_KEY } from '../constants';

export const saveTokenToStorage = (token: string): void => {
  sessionStorage.setItem(USER_TOKEN_STORAGE_KEY, token);
};

export const clearTokenFromStorage = (): void => {
  sessionStorage.removeItem(USER_TOKEN_STORAGE_KEY);
};

export const getTokenFromStorage = (): string | null => {
  const token = sessionStorage.getItem(USER_TOKEN_STORAGE_KEY);
  return token || null;
};

export const authHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
});
