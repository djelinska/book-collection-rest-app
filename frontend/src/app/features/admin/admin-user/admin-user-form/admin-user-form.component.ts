import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../../shared/enums/role';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormDto } from '../../../../core/services/admin/models/user-form.dto';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    CommonModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss',
})
export class AdminUserFormComponent implements OnInit {
  public form = this.fb.group({
    username: new FormControl<string>('', [Validators.required]),
    role: new FormControl<Role>(Role.ROLE_USER, [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  public roles = Object.keys(Role);
  public userId: number | null = null;
  public isEditMode: boolean = false;

  public constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.isEditMode = true;
        this.userId = +id;
        this.loadUser(this.userId);
      }
    });

    if (this.isEditMode) {
      this.form.get('password')?.disable();
    }
  }

  private loadUser(userId: number): void {
    this.adminService.getUserById(userId).subscribe({
      next: (user) => {
        this.form.patchValue({
          username: user.username,
          role: user.role,
        });
      },
      error: () => {
        this.toastr.error('Nie udało się pobrać danych użytkownika.');
        this.router.navigate(['/admin/user/list']);
      },
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: UserFormDto = {
        username: this.form.value.username ?? '',
        role: this.form.value.role ?? Role.ROLE_USER,
        password: this.form.value.password ?? '',
      };

      const action$ =
        this.userId && this.isEditMode
          ? this.adminService.updateUser(this.userId, data)
          : this.adminService.createUser(data);

      action$.subscribe({
        next: () => {
          const successMessage = this.userId
            ? 'Użytkownik został zaktualizowany pomyślnie!'
            : 'Użytkownik został dodany pomyślnie!';
          this.toastr.success(successMessage);

          if (
            this.userId &&
            this.userId === this.authService.getLoggedInUser()?.id
          ) {
            this.authService.logout();
            this.toastr.success(
              'Twoje dane zostały zaktualizowane. Zaloguj się ponownie.'
            );
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/admin/user/list']);
          }
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 400) {
      this.toastr.error(
        'Nie można zmienić roli administratora, ponieważ w systemie musi pozostać co najmniej jeden administrator.'
      );
    } else if (err.status === 409) {
      this.toastr.error('Nazwa użytkownika jest zajęta.');
    } else if (err.status === 500) {
      this.toastr.error('Wystąpił błąd podczas próby zapisu.');
    } else {
      this.toastr.error('Wystąpił nieoczekiwany błąd.');
    }
  }
}
