import { BehaviorSubject, Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtPayloadDto } from '../../../shared/models/jwt-payload.dto';
import { LoginRequest } from './models/login-request';
import { LoginResponse } from './models/login-response';
import { RegisterRequest } from './models/register-request';
import { UserDto } from '../../../shared/models/user.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user';

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
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayloadDto;
      const expirationDate = new Date(payload.exp * 1000);

      return expirationDate > new Date();
    } catch (err) {
      console.error('Invalid token format:', err);

      return false;
    }
  }

  public getCurrentUser(): UserDto | null {
    const userString = localStorage.getItem(this.userKey);

    return userString ? (JSON.parse(userString) as UserDto) : null;
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
            localStorage.setItem(
              this.userKey,
              JSON.stringify({ ...response.user })
            );
            this.isAuthenticatedSubject.next(true);
          }

          return response;
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
  }
}
