import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/decode-token';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  token = this.tokenSubject.asObservable();

  constructor(private router: Router) {}

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  deleteToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['homepage']); 
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  getDecodedFromStorage(): DecodedToken | null {
    const token = this.tokenSubject.value;
    if (!token) return null;
    return this.decodeToken(token);
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedFromStorage();
    if (!decoded?.exp) return true; 
    return Date.now() >= decoded.exp * 1000;
  }
}
