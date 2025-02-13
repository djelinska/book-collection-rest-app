import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Role } from '../../../../shared/enums/role';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { UserDto } from '../../../../shared/models/user.dto';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    TranslateModule,
  ],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent implements OnInit {
  public users!: UserDto[];
  public filteredUsers!: UserDto[];
  public paginatedUsers!: UserDto[];
  public loggedInUser!: UserDto | null;
  public modalRef?: BsModalRef;
  public sortField: keyof UserDto = 'username';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public page = 0;
  public totalPages = 0;
  public pageSizeOptions: number[] = [2, 5, 10];
  public pageSize = 5;

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
    this.page = 0;
    this.onFilter();
    this.onSort();
    this.paginateUsers();
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
    this.sortField = field;
    this.sortDirection = direction;
    this.page = 0;

    this.sortUsers();
    this.paginateUsers();
  }

  private sortUsers(): void {
    const factor = this.sortDirection === 'asc' ? 1 : -1;

    this.filteredUsers.sort((a, b) => {
      const valA = String(a[this.sortField]).toLowerCase();
      const valB = String(b[this.sortField]).toLowerCase();

      return valA.localeCompare(valB) * factor;
    });
  }

  public onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.paginateUsers();
  }

  private paginateUsers(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  public goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.paginateUsers();
    }
  }

  private loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (response: UserDto[]) => {
        this.users = response;
        this.filteredUsers = [...this.users];
        this.onFilter();
        this.onSort();
        this.paginateUsers();
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania użytkowników.');
      },
    });
  }
}
