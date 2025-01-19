import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BookAddToShelfComponent } from '../shared/book-add-to-shelf/book-add-to-shelf.component';
import { BookDetailsDto } from '../../../core/services/book/models/book-details.dto';
import { BookService } from '../../../core/services/book/book.service';
import { BookStatsDto } from '../../../core/services/stats/models/book-stats.dto';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { Genre } from '../../../shared/enums/genre';
import { HttpErrorResponse } from '@angular/common/http';
import { Language } from '../../../shared/enums/language';
import { Observable } from 'rxjs';
import { ReviewDto } from '../../../core/services/review/models/review.dto';
import { ReviewFormDto } from '../../../core/services/review/models/review-form.dto';
import { ReviewService } from '../../../core/services/review/review.service';
import { StatsService } from '../../../core/services/stats/stats.service';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../../shared/models/user.dto';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    BookAddToShelfComponent,
    ReactiveFormsModule,
    CommonModule,
    FormErrorComponent,
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  public form = this.fb.group({
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    content: new FormControl<string>('', [Validators.required]),
  });
  public isEditMode: boolean = false;
  private reviewId: number | null = null;
  public averageRating: number = 0;
  public numberOfRatings: number = 0;

  public book!: BookDetailsDto;
  public genreNames: Record<string, string> = Genre;
  public languageNames: Record<string, string> = Language;
  public bookReviews: ReviewDto[] = [];
  public loggedInUser!: UserDto | null;

  public bookStats$!: Observable<BookStatsDto>;

  public constructor(
    private authService: AuthService,
    private bookService: BookService,
    private reviewService: ReviewService,
    private statsService: StatsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loadBook();
    this.loadBookReviews();
    this.bookStats$ = this.statsService.getBookStatistics(this.book.id);
  }

  public onAddToShelf(): void {
    this.loadBook();
  }

  public onReviewEdit(review: ReviewDto): void {
    this.form.patchValue(review);
    this.isEditMode = true;
    this.reviewId = review.id;
  }

  public onReviewDelete(id: number): void {
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.toastr.success('Recenzja została usunięta');
        this.loadBookReviews();
      },
      error: () => {
        this.toastr.error('Nie udało się usunąć recenzji.');
      },
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: ReviewFormDto = {
        rating: this.form.value.rating ?? 0,
        content: this.form.value.content ?? '',
      };

      const action$ =
        this.reviewId && this.isEditMode
          ? this.reviewService.updateReview(this.reviewId, data)
          : this.bookService.addReviewForBook(this.book.id, data);

      action$.subscribe({
        next: () => {
          const successMessage = this.isEditMode
            ? 'Recenzja została zaktualizowana pomyślnie!'
            : 'Recenzja została dodana pomyślnie!';
          this.toastr.success(successMessage);
          this.loadBookReviews();
        },
        error: (err) => {
          this.handleError(err);
        },
      });

      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getImagePath(imagePath: string): string {
    return this.bookService.getImagePath(imagePath);
  }

  private loadBook(): void {
    this.route.data.subscribe((resolver) => {
      this.book = resolver['book'] as BookDetailsDto;
    });
  }

  private loadBookReviews(): void {
    this.bookService.getReviewsForBook(this.book.id).subscribe({
      next: (response) => {
        this.bookReviews = response;
        this.calculateReviewStats();
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania recenzji książki.');
      },
    });
  }

  private calculateReviewStats(): void {
    this.numberOfRatings = this.bookReviews.length;

    if (this.numberOfRatings > 0) {
      const totalRating = this.bookReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      this.averageRating = totalRating / this.numberOfRatings;
    } else {
      this.averageRating = 0;
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
