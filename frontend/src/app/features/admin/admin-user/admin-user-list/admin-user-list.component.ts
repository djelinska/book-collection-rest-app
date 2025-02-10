import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
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
  public modalRef?: BsModalRef;

  public constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: BsModalService
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
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.searchUsers(this.query).subscribe({
      next: (response) => {
        this.paginatedUsers = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania użytkowników.');
      },
    });
  }
}
