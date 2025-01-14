import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + '/profile';

  public constructor(private http: HttpClient) {}

  public getUserProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }
}
