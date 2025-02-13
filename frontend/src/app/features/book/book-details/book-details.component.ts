import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AdminService } from '../../../core/services/admin/admin.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BookAddToShelfComponent } from '../shared/book-add-to-shelf/book-add-to-shelf.component';
import { BookDetailsDto } from '../../../core/services/book/models/book-details.dto';
import { BookService } from '../../../core/services/book/book.service';
import { BookStatsDto } from '../../../core/services/stats/models/book-stats.dto';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { EbookFormat } from '../../../shared/enums/ebook-format';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { Genre } from '../../../shared/enums/genre';
import { HttpErrorResponse } from '@angular/common/http';
import { Language } from '../../../shared/enums/language';
import { Observable } from 'rxjs';
import { QuoteDto } from '../../../shared/models/quote.dto';
import { ReviewDto } from '../../../core/services/review/models/review.dto';
import { ReviewFormDto } from '../../../core/services/review/models/review-form.dto';
import { ReviewService } from '../../../core/services/review/review.service';
import { Role } from '../../../shared/enums/role';
import { ShelfType } from '../../../shared/enums/shelf-type';
import { StatsService } from '../../../core/services/stats/stats.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { UserDto } from '../../../shared/models/user.dto';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    BookAddToShelfComponent,
    ReactiveFormsModule,
    CommonModule,
    FormErrorComponent,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  public isEditMode: boolean = false;
  private reviewId: number | null = null;
  public averageRating: number = 0;
  public numberOfRatings: number = 0;
  public book!: BookDetailsDto;
  public genreNames: Record<string, string> = Genre;
  public languageNames: Record<string, string> = Language;
  public wantToReadShelfType: ShelfType = ShelfType.WANT_TO_READ;
  public readShelfType: ShelfType = ShelfType.READ;
  public ebookFormatNames: Record<string, string> = EbookFormat;
  public bookReviews: ReviewDto[] = [];
  public loggedInUser!: UserDto | null;
  public adminRole: Role = Role.ROLE_ADMIN;
  public bookStats$!: Observable<BookStatsDto>;
  public modalRef?: BsModalRef;

  public form = this.fb.group({
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    content: new FormControl<string>('', [Validators.required]),
    quotes: this.fb.array<FormGroup>([]),
  });

  public constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private bookService: BookService,
    private reviewService: ReviewService,
    private statsService: StatsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loadBook();
    this.loadBookReviews();
    this.bookStats$ = this.statsService.getBookStatistics(this.book.id);
  }

  public onDelete(id: number): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Potwierdź usunięcie',
        message: 'Czy na pewno chcesz usunąć tę książkę?',
        confirmCallback: () => {
          this.deleteBook(id);
        },
      },
    });
  }

  private deleteBook(id: number): void {
    this.adminService.deleteBook(id).subscribe({
      next: () => {
        this.toastr.success('Książka została usunięta.');
        this.router.navigate(['/book/list']);
      },
      error: () => {
        this.toastr.error('Nie udało się usunąć książki.');
      },
    });
  }

  public onAddToShelf(): void {
    this.bookService.getBookById(this.book.id).subscribe({
      next: (response: BookDetailsDto) => {
        this.book = response;
      },
    });
  }

  public get quotes(): FormArray {
    return this.form.get('quotes') as FormArray;
  }

  public addQuote(): void {
    this.quotes.push(this.createQuoteFormGroup({ text: '', page: null }));
  }

  public removeQuote(index: number): void {
    this.quotes.removeAt(index);
    const updatedQuotes = this.quotes.controls.map((q) =>
      this.createQuoteFormGroup(q.value)
    );
    this.form.setControl('quotes', this.fb.array(updatedQuotes));
  }

  public onReviewEdit(review: ReviewDto): void {
    this.form.patchValue({
      rating: review.rating,
      content: review.content,
    });

    this.quotes.clear();
    review.quotes.forEach((quote) => {
      this.quotes.push(this.createQuoteFormGroup(quote));
    });

    this.isEditMode = true;
    this.reviewId = review.id;
  }

  private createQuoteFormGroup(quote: QuoteDto): FormGroup {
    return this.fb.group({
      text: new FormControl<string>(quote.text, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      page: new FormControl<number | null>(quote.page ?? null, [
        Validators.min(1),
      ]),
    });
  }

  public onReviewDelete(id: number): void {
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

  public deleteReview(id: number): void {
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

  public onCancelReview(): void {
    this.form.reset();
    this.quotes.clear();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: ReviewFormDto = {
        rating: this.form.value.rating ?? null,
        content: this.form.value.content ?? '',
        quotes: this.quotes.value as QuoteDto[],
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
      this.quotes.clear();
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
