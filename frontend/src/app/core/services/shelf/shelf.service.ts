import { BookDto, ShelfDetailsDto } from './models/shelf-details.dto';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShelfFormDto } from './models/shelf-form.dto';
import { ShelfListDto } from './models/shelf-list.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShelfService {
  private apiUrl = environment.apiUrl + '/shelves';

  public constructor(private http: HttpClient) {}

  public getUserShelves(): Observable<ShelfListDto[]> {
    return this.http.get<ShelfListDto[]>(this.apiUrl);
  }

  public getUserShelfById(id: number): Observable<ShelfDetailsDto> {
    return this.http.get<ShelfDetailsDto>(`${this.apiUrl}/${id}`);
  }

  public getBooksForUserShelf(id: number): Observable<BookDto[]> {
    return this.http.get<BookDto[]>(`${this.apiUrl}/${id}/books`);
  }

  public createUserShelf(shelf: ShelfFormDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, shelf);
  }

  public updateUserShelf(id: number, shelf: ShelfFormDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, shelf);
  }

  public deleteUserShelf(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
