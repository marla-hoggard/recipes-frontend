import { CreateUserRequest, UserResponse, SigninRequest } from '../types/users.types';
import { BACKEND_BASE_URL, GENERIC_API_ERROR_MESSAGE } from '../constants';
import { authHeaders } from './helpers';

export const createUser = async (request: CreateUserRequest): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return result || { error: { message: GENERIC_API_ERROR_MESSAGE } };
  } catch (error) {
    console.error(error);
    return { error: { message: GENERIC_API_ERROR_MESSAGE } };
  }
};

export const login = async (request: SigninRequest): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return result || { error: { message: GENERIC_API_ERROR_MESSAGE } };
  } catch (error) {
    console.error(error);
    return { error: { message: GENERIC_API_ERROR_MESSAGE } };
  }
};

export const signout = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
    });
    await response.text();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getUserByToken = async (token: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
    });
    const result = await response.json();
    return result || { error: { message: GENERIC_API_ERROR_MESSAGE } };
  } catch (error) {
    console.error(error);
    return { error: { message: GENERIC_API_ERROR_MESSAGE } };
  }
};
