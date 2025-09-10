import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser } from '../interfaces/register-user';
import { ErrorResponse, FailResponse } from '../interfaces/validation-get-all-products';
import { LoginUserRequest, LoginUserResponse } from '../interfaces/login-user';

export type UserRegisterResponse = RegisterUser | FailResponse | ErrorResponse ;
export type UserLoginResponse = LoginUserResponse | FailResponse | ErrorResponse;
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private registerUrl = 'http://localhost:5000/users'; 
  private loginUrl = 'http://localhost:5000/users/login'; 

  constructor(private _HttpClient: HttpClient) {}

  registerUser(user: RegisterUser): Observable<UserRegisterResponse> {
    return this._HttpClient.post<UserRegisterResponse>(this.registerUrl, user);
  }

  loginUser(user : LoginUserRequest) : Observable<UserLoginResponse>{
    return this._HttpClient.post<UserLoginResponse>(this.loginUrl , user);
  }
}
