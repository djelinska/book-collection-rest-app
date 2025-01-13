import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { Component } from '@angular/core';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { RegisterRequest } from '../../../core/services/auth/models/register-request';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormErrorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public form = this.fb.group({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  public constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  public onSubmit(): void {
    if (this.form.valid) {
      const details: RegisterRequest = {
        username: this.form.value.username ?? '',
        password: this.form.value.password ?? '',
      };

      this.authService.register(details).subscribe({
        next: () => {
          this.toastr.success('Rejestracja zakończona sukcesem!');
          this.router.navigate(['login']);
        },
        error: (err) => {
          if (err.status === 409) {
            this.toastr.error('Nazwa użytkownika jest zajęta.');
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
