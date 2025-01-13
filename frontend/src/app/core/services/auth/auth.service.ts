import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  public constructor(private http: HttpClient) {}

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
          }

          return response;
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
