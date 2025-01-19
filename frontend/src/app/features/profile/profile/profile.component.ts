import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../shared/enums/role';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../../shared/models/user.dto';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public user!: UserDto | null;
  public importFile: File | null = null;
  public adminRole: Role = Role.ROLE_ADMIN;

  public constructor(
    private userService: UserService,
    private authSerive: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getUserProfile();
  }

  private getUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {
        this.toastr.error('Błąd podczas ładowania danych użytkownika.');
      },
    });
  }

  public downloadBackup(): void {
    this.userService.downloadBackup().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'backup_' + this.user?.username + '.json';
        link.click();
        this.toastr.success('Kopia zapasowa została pobrana.');
      },
      error: () => {
        this.toastr.error('Błąd podczas pobierania kopii zapasowej.');
      },
    });
  }

  public onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      this.importFile = file;
    }
  }

  public onImportBackup(): void {
    if (this.importFile) {
      const formData = new FormData();
      formData.append('file', this.importFile);

      this.userService.importBackup(formData).subscribe({
        next: () => {
          this.toastr.success('Kopia zapasowa została zaimportowana.');
        },
        error: () => {
          this.toastr.error('Błąd podczas importu kopii zapasowej.');
        },
      });
    }
  }

  public deleteAccount(): void {
    if (confirm('Czy na pewno chcesz usunąć konto?')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.toastr.success('Konto zostało usunięte.');
          this.authSerive.logout();
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastr.error('Błąd podczas usuwania konta.');
        },
      });
    }
  }
}
