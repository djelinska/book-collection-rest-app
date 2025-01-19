import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatedUsersDto } from '../../../../core/services/admin/models/paginated-users.dto';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../../../shared/models/user.dto';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent implements OnInit {
  public paginatedUsers!: PaginatedUsersDto;
  public loggedInUser!: UserDto | null;
  public query: string = '';

  public constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loadUsers();
  }

  public onDelete(id: number): void {
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
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getUsers(this.query).subscribe({
      next: (response) => {
        this.paginatedUsers = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania użytkowników.');
      },
    });
  }
}
