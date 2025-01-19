import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../../../shared/models/user.dto';
import { UserFormDto } from './models/user-form.dto';
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

  public updateUserProfile(user: UserFormDto): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/edit`, user);
  }

  public downloadBackup(): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/backup`, {
      responseType: 'blob' as 'json',
    });
  }

  public importBackup(data: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/import`, data);
  }

  public deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete`);
  }
}
