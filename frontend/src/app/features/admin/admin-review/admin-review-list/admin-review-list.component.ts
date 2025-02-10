import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { PaginatedReviewsDto } from '../../../../core/services/admin/models/paginated-reviews.dto';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-review-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-review-list.component.html',
  styleUrl: './admin-review-list.component.scss',
})
export class AdminReviewListComponent implements OnInit {
  public paginatedReviews!: PaginatedReviewsDto;
  public query: string = '';
  public modalRef?: BsModalRef;

  public constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  public ngOnInit(): void {
    this.loadReviews();
  }

  public onDelete(id: number): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Potwierdź usunięcie',
        message: 'Czy na pewno chcesz usunąć tę recenzję?',
        confirmCallback: () => {
          this.deleteReview(id);
        },
      },
    });
  }

  private deleteReview(id: number): void {
    this.adminService.deleteReview(id).subscribe({
      next: () => {
        this.toastr.success('Recenzja została usunięta');
        this.loadReviews();
      },
      error: () => {
        this.toastr.error('Nie udało się usunąć recenzji.');
      },
    });
  }

  public onSubmit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.adminService.searchReviews(this.query).subscribe({
      next: (response) => {
        this.paginatedReviews = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania recenzji.');
      },
    });
  }
}
