import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ReviewDto } from '../../../../core/services/admin/models/review.dto';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-review-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    TranslateModule,
  ],
  templateUrl: './admin-review-list.component.html',
  styleUrl: './admin-review-list.component.scss',
})
export class AdminReviewListComponent implements OnInit {
  public reviews!: ReviewDto[];
  public filteredReviews!: ReviewDto[];
  public paginatedReviews!: ReviewDto[];
  public query: string = '';
  public modalRef?: BsModalRef;
  public sortField: keyof ReviewDto = 'book';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public page = 0;
  public totalPages = 0;
  public pageSizeOptions: number[] = [2, 5, 10];
  public pageSize = 5;

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
    this.page = 0;
    this.onFilter();
    this.onSort();
    this.paginateReviews();
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
    this.sortField = field;
    this.sortDirection = direction;
    this.page = 0;

    this.sortReviews();
    this.paginateReviews();
  }

  public sortReviews(): void {
    const factor = this.sortDirection === 'asc' ? 1 : -1;

    this.filteredReviews.sort((a, b) => {
      let valA: unknown = a[this.sortField];
      let valB: unknown = b[this.sortField];

      if (this.sortField === 'book') {
        valA = a.book.title;
        valB = b.book.title;
      } else if (this.sortField === 'author') {
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

  public onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.paginateReviews();
  }

  private paginateReviews(): void {
    this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);

    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  public goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.paginateReviews();
    }
  }

  private loadReviews(): void {
    this.adminService.getAllReviews().subscribe({
      next: (response: ReviewDto[]) => {
        this.reviews = response;
        this.filteredReviews = response;
        this.onFilter();
        this.onSort();
        this.paginateReviews();
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania recenzji.');
      },
    });
  }
}
