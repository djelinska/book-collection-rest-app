import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatedBooksDto } from '../../../../core/services/admin/models/paginated-books.dto';
import { PaginatedUsersDto } from '../../../../core/services/admin/models/paginated-users.dto';
import { ReviewFormDto } from '../../../../core/services/admin/models/review-form.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent, CommonModule, RouterLink],
  templateUrl: './admin-review-form.component.html',
  styleUrl: './admin-review-form.component.scss',
})
export class AdminReviewFormComponent implements OnInit {
  public form = this.fb.group({
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    content: new FormControl<string>('', [Validators.required]),
    bookId: new FormControl<number | null>(null, [Validators.required]),
    userId: new FormControl<number | null>(null, [Validators.required]),
  });

  public books!: PaginatedBooksDto;
  public users!: PaginatedUsersDto;

  public reviewId: number | null = null;
  public isEditMode: boolean = false;

  public constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.isEditMode = true;
        this.reviewId = +id;
        this.loadReview(this.reviewId);
      }
    });

    this.adminService.searchBooks('', -1).subscribe({
      next: (response) => {
        this.books = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania książek.');
      },
    });

    this.adminService.searchUsers('', -1).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania użytkowników.');
      },
    });
  }

  private loadReview(reviewId: number): void {
    this.adminService.getReviewById(reviewId).subscribe({
      next: (review) => {
        this.form.patchValue({
          rating: review.rating,
          content: review.content,
          bookId: review.book.id,
          userId: review.author.id,
        });
      },
      error: () => {
        this.toastr.error('Nie udało się pobrać danych recenzji.');
        this.router.navigate(['/admin/review/list']);
      },
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: ReviewFormDto = {
        rating: this.form.value.rating ?? 0,
        content: this.form.value.content ?? '',
        bookId: this.form.value.bookId ?? 0,
        userId: this.form.value.userId ?? 0,
      };

      const action$ =
        this.reviewId && this.isEditMode
          ? this.adminService.updateReview(this.reviewId, data)
          : this.adminService.createReview(data);

      action$.subscribe({
        next: () => {
          const successMessage = this.reviewId
            ? 'Recenzja została zaktualizowana pomyślnie!'
            : 'Recenzja została dodana pomyślnie!';
          this.toastr.success(successMessage);
          this.router.navigate(['/admin/review/list']);
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 500) {
      this.toastr.error('Wystąpił błąd podczas próby zapisu.');
    } else {
      this.toastr.error('Wystąpił nieoczekiwany błąd.');
    }
  }
}
