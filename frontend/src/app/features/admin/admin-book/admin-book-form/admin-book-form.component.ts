import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { BookFormDto } from '../../../../core/services/admin/models/book-form.dto';
import { BookService } from '../../../../core/services/book/book.service';
import { CommonModule } from '@angular/common';
import { EbookFormat } from '../../../../shared/enums/ebook-format';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { Genre } from '../../../../shared/enums/genre';
import { HttpErrorResponse } from '@angular/common/http';
import { Language } from '../../../../shared/enums/language';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { urlValidator } from '../../../../shared/validators/url-validator.validator';

@Component({
  selector: 'app-admin-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    CommonModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './admin-book-form.component.html',
  styleUrl: './admin-book-form.component.scss',
})
export class AdminBookFormComponent implements OnInit {
  public currentYear = new Date().getFullYear();

  public form = this.fb.group({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
    author: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    publisher: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    isbn: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13),
    ]),
    publicationYear: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(this.currentYear),
    ]),
    genre: new FormControl<Genre | null>(null, Validators.required),
    pageCount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10000),
    ]),
    language: new FormControl<Language | null>(null, Validators.required),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(2000),
    ]),
    image: new FormControl<File | null>(null, Validators.required),
    isEbook: new FormControl<boolean>(false),
    ebookFormat: new FormControl<EbookFormat | null>(null),
    ebookFileSize: new FormControl<number | null>(null),
    ebookLink: new FormControl<string>(''),
  });

  public genres = Object.keys(Genre);
  public genreNames: Record<string, string> = Genre;
  public languages = Object.keys(Language);
  public languageNames: Record<string, string> = Language;
  public ebookFormats = Object.keys(EbookFormat);
  public ebookFormatNames: Record<string, string> = EbookFormat;

  public bookId: number | null = null;
  public isEditMode: boolean = false;

  public existingImagePath!: string;
  public imageFile: File | null = null;
  public selectedImagePreview: string | null = null;

  public constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private bookService: BookService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.isEditMode = true;
        this.bookId = +id;
        this.loadBook(this.bookId);
      }
    });

    if (!this.isEditMode) {
      this.form.get('image')?.setValidators(Validators.required);
    } else {
      this.form.get('image')?.clearValidators();
    }
    this.form.get('image')?.updateValueAndValidity();

    this.form.get('isEbook')?.valueChanges.subscribe((isEbook) => {
      if (isEbook) {
        this.form.get('ebookFormat')?.setValidators(Validators.required);
        this.form
          .get('ebookFileSize')
          ?.setValidators([Validators.required, Validators.min(0.1)]);
        this.form
          .get('ebookLink')
          ?.setValidators([Validators.required, urlValidator]);
      } else {
        this.form.get('ebookFormat')?.clearValidators();
        this.form.get('ebookFileSize')?.clearValidators();
        this.form.get('ebookLink')?.clearValidators();

        this.form.get('ebookFormat')?.setValue(null);
        this.form.get('ebookFileSize')?.setValue(null);
        this.form.get('ebookLink')?.setValue(null);
      }
      this.form.get('ebookFormat')?.updateValueAndValidity();
      this.form.get('ebookFileSize')?.updateValueAndValidity();
      this.form.get('ebookLink')?.updateValueAndValidity();
    });
  }

  private loadBook(bookId: number): void {
    this.adminService.getBookById(bookId).subscribe({
      next: (book) => {
        this.form.patchValue(book);
        this.existingImagePath = book.imagePath;
      },
      error: () => {
        this.toastr.error('Nie udało się pobrać danych książki.');
        this.router.navigate(['/admin/book/list']);
      },
    });
  }

  public onImageChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImagePreview = null;
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();

      if (this.imageFile) {
        formData.append('image', this.imageFile, this.imageFile.name);
      }

      const data: BookFormDto = {
        title: this.form.value.title ?? '',
        author: this.form.value.author ?? '',
        publisher: this.form.value.publisher ?? '',
        isbn: this.form.value.isbn ?? '',
        publicationYear: this.form.value.publicationYear ?? null,
        genre: this.form.value.genre ?? null,
        pageCount: this.form.value.pageCount ?? null,
        language: this.form.value.language ?? null,
        description: this.form.value.description ?? '',
        isEbook: this.form.value.isEbook ?? false,
        ebookFormat: this.form.value.ebookFormat ?? null,
        ebookFileSize: this.form.value.ebookFileSize ?? null,
        ebookLink: this.form.value.ebookLink ?? '',
      };

      formData.append(
        'book',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );

      const action$ =
        this.bookId && this.isEditMode
          ? this.adminService.updateBook(this.bookId, formData)
          : this.adminService.createBook(formData);

      action$.subscribe({
        next: () => {
          const successMessage = this.bookId
            ? 'Książka została zaktualizowana pomyślnie!'
            : 'Książka została dodana pomyślnie!';
          this.toastr.success(successMessage);
          this.router.navigate(['/admin/book/list']);
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

  public getImagePath(imagePath: string): string {
    return this.bookService.getImagePath(imagePath);
  }
}
