import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../../../shared/models/user.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + '/profile';

  public constructor(private http: HttpClient) {}

  public getUserProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(this.apiUrl);
  }
}
