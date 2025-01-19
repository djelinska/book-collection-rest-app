import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedUsersDto } from './models/paginated-users.dto';
import { UserDto } from '../../../shared/models/user.dto';
import { UserFormDto } from './models/user-form.dto';
import { ValidationErrorDto } from '../../../shared/models/validation-error.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/admin';

  public constructor(private http: HttpClient) {}

  public getUsers(query: string): Observable<PaginatedUsersDto> {
    const params = new HttpParams().set('query', query);

    return this.http.get<PaginatedUsersDto>(`${this.apiUrl}/users`, { params });
  }

  public getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/users/${id}`);
  }

  public createUser(user: UserFormDto): Observable<void | ValidationErrorDto> {
    return this.http.post<void | ValidationErrorDto>(
      `${this.apiUrl}/users`,
      user
    );
  }

  public updateUser(
    id: number,
    user: UserFormDto
  ): Observable<void | ValidationErrorDto> {
    return this.http.put<void | ValidationErrorDto>(
      `${this.apiUrl}/users/${id}`,
      user
    );
  }

  public deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
