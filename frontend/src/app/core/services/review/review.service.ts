import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewFormDto } from './models/review-form.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = environment.apiUrl + '/reviews';

  public constructor(private http: HttpClient) {}

  public updateReview(id: number, review: ReviewFormDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, review);
  }

  public deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
