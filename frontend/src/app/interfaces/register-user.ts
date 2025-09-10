import { Status } from "../enums/status";

// Generic validation error
export interface ValidationError {
  field: string;
  msg: string;
}

// User address
export interface Address {
  city: string;
  street: string;
}

// Successful registration response
export interface RegisterUser {
  id : string,
  email: string;
  username: string;
}

// Fail response from backend (validation errors)
export interface UserRegisterFailResponse {
  status: Status.FAIL;
  data: ValidationError[];  
}

// Error response from backend (server error)
export interface UserRegisterErrorResponse {
  status: Status.ERROR;
  message: string;
}

// Union type for all possible API responses
export type UserRegisterResponse =
  | { status: Status.SUCCESS; data: RegisterUser }
  | UserRegisterFailResponse
  | UserRegisterErrorResponse;
