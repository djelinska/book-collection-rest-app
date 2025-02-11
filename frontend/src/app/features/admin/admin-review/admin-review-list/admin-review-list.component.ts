import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { ReviewDto } from '../../../../core/services/admin/models/review.dto';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-review-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './admin-review-list.component.html',
  styleUrl: './admin-review-list.component.scss',
})
export class AdminReviewListComponent implements OnInit {
  public reviews!: ReviewDto[];
  public filteredReviews!: ReviewDto[];
  public query: string = '';
  public modalRef?: BsModalRef;
  public sortField: keyof ReviewDto = 'book';
  public sortDirection: 'asc' | 'desc' = 'asc';

  public filterForm = this.fb.group({
    query: new FormControl<string>(''),
    rating: new FormControl<number | null>(null),
  });

  public constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
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
    this.onFilter();
    this.onSort();
  }

  private onFilter(): void {
    const { query, rating } = this.filterForm.value;
    const lowerQuery = query?.toLowerCase() ?? '';

    this.filteredReviews = this.reviews
      .filter(
        (r) =>
          !lowerQuery ||
          r.content.toLowerCase().includes(lowerQuery) ||
          r.book.title.toLowerCase().includes(lowerQuery)
      )
      .filter((r) => !rating || r.rating === rating);
  }

  public onSort(
    field: keyof ReviewDto = this.sortField,
    direction: 'asc' | 'desc' = this.sortDirection
  ): void {
    const factor = direction === 'asc' ? 1 : -1;

    this.sortField = field;
    this.sortDirection = direction;

    this.filteredReviews.sort((a, b) => {
      let valA: unknown = a[field];
      let valB: unknown = b[field];

      if (field === 'book') {
        valA = a.book.title;
        valB = b.book.title;
      } else if (field === 'author') {
        valA = a.author.username;
        valB = b.author.username;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * factor;
      }

      if (valA instanceof Date && valB instanceof Date) {
        return (valA.getTime() - valB.getTime()) * factor;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      return strA.localeCompare(strB) * factor;
    });
  }

  private loadReviews(): void {
    this.adminService.getAllReviews().subscribe({
      next: (response: ReviewDto[]) => {
        this.reviews = response;
        this.filteredReviews = response;
        this.onFilter();
        this.onSort();
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania recenzji.');
      },
    });
  }
}
