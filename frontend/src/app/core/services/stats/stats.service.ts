import { BookStatsDto } from './models/book-stats.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStatsDto } from './models/user-stats.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = environment.apiUrl + '/statistics';

  public constructor(private http: HttpClient) {}

  public getUserStatistics(): Observable<UserStatsDto> {
    return this.http.get<UserStatsDto>(`${this.apiUrl}/user`);
  }

  public getBookStatistics(id: number): Observable<BookStatsDto> {
    return this.http.get<BookStatsDto>(`${this.apiUrl}/book/${id}`);
  }
}
