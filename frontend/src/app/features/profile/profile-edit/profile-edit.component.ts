import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { ToastrService } from 'ngx-toastr';
import { UserFormDto } from '../../../core/services/user/models/user-form.dto';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormErrorComponent, RouterLink],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent {
  public form = this.fb.group({
    currentPassword: new FormControl<string>('', Validators.required),
    newPassword: new FormControl<string>('', Validators.required),
  });

  public constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public onSubmit(): void {
    if (this.form.valid) {
      const data: UserFormDto = {
        currentPassword: this.form.value.currentPassword || '',
        newPassword: this.form.value.newPassword || '',
      };

      this.userService.updateUserProfile(data).subscribe({
        next: () => {
          this.toastr.success('Profil został pomyślnie zaktualizowany.');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error('Nieprawidłowe aktualne hasło.');
          } else {
            this.toastr.error('Błąd podczas edycji profilu.');
          }
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
