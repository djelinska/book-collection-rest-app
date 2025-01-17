import { HttpClient, HttpParams } from '@angular/common/http';

import { BookDto } from '../../../shared/models/book.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedBooksDto } from './models/paginated-books.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = environment.apiUrl + '/books';

  public constructor(private http: HttpClient) {}

  public searchBooks(
    query: string,
    genre: string,
    language: string,
    page: number = 0,
    sortField: string = 'title',
    sortDirection: string = 'asc'
  ): Observable<PaginatedBooksDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);

    if (query) params = params.set('query', query);
    if (genre) params = params.set('genre', genre);
    if (language) params = params.set('language', language);

    return this.http.get<PaginatedBooksDto>(`${this.apiUrl}/search`, {
      params,
    });
  }

  public getBooks(): Observable<BookDto[]> {
    return this.http.get<BookDto[]>(this.apiUrl);
  }

  public getBookById(id: number): Observable<BookDto> {
    return this.http.get<BookDto>(`${this.apiUrl}/${id}`);
  }

  public createBook(BookDto: any): Observable<void> {
    return this.http.post<void>(this.apiUrl, BookDto);
  }

  public updateBook(id: number, BookDto: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, BookDto);
  }

  public deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public getImagePath(imagePath: string): string {
    return `/uploads/${imagePath}`;
  }
}
