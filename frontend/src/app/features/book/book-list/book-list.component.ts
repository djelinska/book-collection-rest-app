import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { BookAddToShelfComponent } from '../shared/book-add-to-shelf/book-add-to-shelf.component';
import { BookService } from '../../../core/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Genre } from '../../../shared/enums/genre';
import { Language } from '../../../shared/enums/language';
import { PaginatedBooksDto } from '../../../core/services/book/models/paginated-books.dto';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookAddToShelfComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  public paginatedBooks!: PaginatedBooksDto;
  public page: number = 0;
  public genres = Object.keys(Genre);
  public genreNames: Record<string, string> = Genre;
  public languages = Object.keys(Language);
  public languageNames: Record<string, string> = Language;
  public sortField: string = 'title';
  public sortDirection: string = 'asc';

  public filterForm = this.fb.group({
    query: new FormControl<string>(''),
    genre: new FormControl<string>(''),
    language: new FormControl<string>(''),
  });

  public constructor(
    private bookService: BookService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(
    query: string = '',
    genre: string = '',
    language: string = '',
    page: number = this.page,
    sortField: string = this.sortField,
    sortDirection: string = this.sortDirection
  ): void {
    this.bookService
      .searchBooks(query, genre, language, page, sortField, sortDirection)
      .subscribe({
        next: (response: PaginatedBooksDto) => {
          this.paginatedBooks = response;
        },
        error: () => {
          this.toastr.error('Wystąpił błąd podczas pobierania książek.');
        },
      });
  }

  public onFilter(): void {
    const filters = this.filterForm.value;
    this.loadBooks(
      filters.query || '',
      filters.genre || '',
      filters.language || '',
      this.page,
      this.sortField,
      this.sortDirection
    );
  }

  public onSort(field: string, direction: string): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.page = 0;
    const filters = this.filterForm.value;
    this.loadBooks(
      filters.query || '',
      filters.genre || '',
      filters.language || '',
      this.page,
      field,
      direction
    );
  }

  public goToPage(page: number): void {
    if (page >= 0 && page < this.paginatedBooks.totalPages) {
      this.page = page;
      const filters = this.filterForm.value;
      this.loadBooks(
        filters.query || '',
        filters.genre || '',
        filters.language || '',
        this.page,
        this.sortField,
        this.sortDirection
      );
    }
  }

  public getImagePath(imagePath: string): string {
    return this.bookService.getImagePath(imagePath);
  }
}
