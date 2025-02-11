import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { Role } from '../../../../shared/enums/role';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../../../shared/models/user.dto';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent implements OnInit {
  public users!: UserDto[];
  public filteredUsers!: UserDto[];
  public loggedInUser!: UserDto | null;
  public modalRef?: BsModalRef;
  public sortField: keyof UserDto = 'username';
  public sortDirection: 'asc' | 'desc' = 'asc';

  public filterForm = this.fb.group({
    query: new FormControl<string>(''),
    isAdmin: new FormControl<boolean>(false),
  });

  public constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loadUsers();
  }

  public onDelete(id: number): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Potwierdź usunięcie',
        message: 'Czy na pewno chcesz usunąć tego użytkownika?',
        confirmCallback: () => {
          this.deleteUser(id);
        },
      },
    });
  }

  private deleteUser(id: number): void {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.toastr.success('Użytkownik został usunięty');
        this.loadUsers();
      },
      error: () => {
        this.toastr.error('Nie udało się usunąć użytkownika.');
      },
    });
  }

  public onSubmit(): void {
    this.onFilter();
    this.onSort();
  }

  private onFilter(): void {
    const { query, isAdmin } = this.filterForm.value;

    this.filteredUsers = this.users
      .filter(
        (u) => !query || u.username.toLowerCase().includes(query.toLowerCase())
      )
      .filter((u) => !isAdmin || u.role === Role.ROLE_ADMIN);
  }

  public onSort(
    field: keyof UserDto = this.sortField,
    direction: 'asc' | 'desc' = this.sortDirection
  ): void {
    const factor = direction === 'asc' ? 1 : -1;

    this.sortField = field;
    this.sortDirection = direction;

    this.filteredUsers.sort((a, b) => {
      const valA = String(a[field]).toLowerCase();
      const valB = String(b[field]).toLowerCase();

      return valA.localeCompare(valB) * factor;
    });
  }

  private loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (response: UserDto[]) => {
        this.users = response;
        this.filteredUsers = response;
        this.onFilter();
        this.onSort();
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania użytkowników.');
      },
    });
  }
}
