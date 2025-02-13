import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../shared/enums/role';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { UserDto } from '../../../shared/models/user.dto';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') public fileInput!: ElementRef;

  public user!: UserDto | null;
  public importFile: File | null = null;
  public adminRole: Role = Role.ROLE_ADMIN;
  public modalRef?: BsModalRef;

  public constructor(
    private userService: UserService,
    private authSerive: AuthService,
    private toastr: ToastrService,
    private modalService: BsModalService,
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
      this.modalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: 'Potwierdź import kopii zapasowej',
          message:
            'Czy na pewno chcesz zaimportować wybraną kopię zapasową? Operacja może spowodować nadpisanie aktualnych danych i jest nieodwracalna.',
          confirmCallback: () => {
            this.importBackup();
          },
        },
      });
    }
  }

  public importBackup(): void {
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

      this.importFile = null;
      this.fileInput.nativeElement.value = '';
    }
  }

  public onDeleteAccount(): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Potwierdź usunięcie',
        message:
          'Czy na pewno chcesz usunąć swoje konto? Wszystkie dane zostaną trwale usunięte.',
        confirmCallback: () => {
          this.deleteAccount();
        },
      },
    });
  }

  public deleteAccount(): void {
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
