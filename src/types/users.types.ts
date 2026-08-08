import { ApiError } from './api.types';

export type CreateUserRequest = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};

export type SigninRequest = {
  username: string;
  password: string;
};

type UserSuccessResponse = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    token: string;
    is_admin: boolean;
  };
};

export type UserResponse = UserSuccessResponse | ApiError;
