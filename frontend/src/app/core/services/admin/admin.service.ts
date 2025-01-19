import { HttpClient, HttpParams } from '@angular/common/http';

import { BookDto } from './models/book.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedBooksDto } from './models/paginated-books.dto';
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

  // users

  public getUsers(query: string): Observable<PaginatedUsersDto> {
    const params = new HttpParams().set('query', query).set('size', '10');

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

  // books

  public getBooks(query: string): Observable<PaginatedBooksDto> {
    const params = new HttpParams().set('query', query).set('size', '10');

    return this.http.get<PaginatedBooksDto>(`${this.apiUrl}/books`, { params });
  }

  public getBookById(id: number): Observable<BookDto> {
    return this.http.get<BookDto>(`${this.apiUrl}/books/${id}`);
  }

  public createBook(data: FormData): Observable<void | ValidationErrorDto> {
    return this.http.post<void | ValidationErrorDto>(
      `${this.apiUrl}/books`,
      data
    );
  }

  public updateBook(
    id: number,
    data: FormData
  ): Observable<void | ValidationErrorDto> {
    return this.http.put<void | ValidationErrorDto>(
      `${this.apiUrl}/books/${id}`,
      data
    );
  }

  public deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
  }
}
