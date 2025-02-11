import { HttpClient, HttpParams } from '@angular/common/http';

import { BookDetailsDto } from './models/book-details.dto';
import { BookListDto } from './models/book-list.dto';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedBooksDto } from './models/paginated-books.dto';
import { ReviewDto } from '../review/models/review.dto';
import { ReviewFormDto } from '../review/models/review-form.dto';
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

  public getAllBooks(): Observable<BookListDto[]> {
    return this.http.get<BookListDto[]>(this.apiUrl);
  }

  public getBookById(id: number): Observable<BookDetailsDto> {
    return this.http.get<BookDetailsDto>(`${this.apiUrl}/${id}`);
  }

  public getReviewsForBook(id: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/${id}/reviews`);
  }

  public addReviewForBook(id: number, review: ReviewFormDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/reviews`, review);
  }

  public getImagePath(imagePath: string): string {
    return `/uploads/${imagePath}`;
  }
}
