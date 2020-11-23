import { CreateUserRequest, UserResponse, SigninRequest } from "./types/api.types";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const createUser = async (request: CreateUserRequest): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return result || { error: "API Function Error" };
  } catch (error) {
    console.error(error);
    return { error: "API Function Error" };
  }
};

export const login = async (request: SigninRequest): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return result || { error: "API Function Error" };
  } catch (error) {
    console.error(error);
    return { error: "API Function Error" };
  }
};

export const signout = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        token,
      },
    });
    const result = await response.json();
    if (result.error) {
      console.error(result.error);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
