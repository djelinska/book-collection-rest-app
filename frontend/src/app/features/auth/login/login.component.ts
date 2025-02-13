import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { LoginRequest } from '../../../core/services/auth/models/login-request';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormErrorComponent,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public form = this.fb.group({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public onSubmit(): void {
    if (this.form.valid) {
      const credentials: LoginRequest = {
        username: this.form.value.username ?? '',
        password: this.form.value.password ?? '',
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.toastr.success('Zalogowano pomyślnie!');
          this.router.navigate(['home']);
        },
        error: (err) => {
          if (err.status === 404) {
            this.toastr.error('Nie znaleziono użytkownika o podanej nazwie.');
          } else if (err.status === 401) {
            this.toastr.error('Nieprawidłowa nazwa użytkownika lub hasło.');
          } else if (err.status === 500) {
            this.toastr.error(
              'Wystąpił błąd serwera. Spróbuj ponownie później.'
            );
          } else {
            this.toastr.error('Wystąpił nieoczekiwany błąd.');
          }
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
