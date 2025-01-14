import { BehaviorSubject, Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtPayload } from '../../../shared/models/jwt-payload';
import { LoginRequest } from './models/login-request';
import { LoginResponse } from './models/login-response';
import { RegisterRequest } from './models/register-request';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private readonly tokenKey = 'auth_token';

  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  public constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token: string | null = localStorage.getItem(this.tokenKey);
    if (token && this.isTokenValid(token)) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      const expirationDate = new Date(payload.exp * 1000);

      return expirationDate > new Date();
    } catch (err) {
      console.error('Invalid token format:', err);

      return false;
    }
  }

  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public register(details: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, details);
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response: LoginResponse) => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.isAuthenticatedSubject.next(true);
          }

          return response;
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }
}
