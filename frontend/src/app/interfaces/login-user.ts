import { Status } from "../enums/status";

export interface LoginUserRequest {
  email:string;
  password:string;
}

export interface LoginUserResponse{
  status : Status,
  data : {
    user_id : string;
    email: string;
    role:string;
    token:string;
  }
}