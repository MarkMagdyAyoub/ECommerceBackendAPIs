import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAccountResponse } from '../interfaces/user-account';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  getUserAccountByIdUrl = "http://localhost:5000/users";

  constructor(private _HttpClient : HttpClient) { }

  getUserAccountById(id: string , token : string): Observable<UserAccountResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this._HttpClient.get<UserAccountResponse>(`${this.getUserAccountByIdUrl}/${id}` , {headers});
  }
}
