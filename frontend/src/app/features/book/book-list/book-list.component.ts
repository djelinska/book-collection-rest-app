import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { BookAddToShelfComponent } from '../shared/book-add-to-shelf/book-add-to-shelf.component';
import { BookListDto } from '../../../core/services/book/models/book-list.dto';
import { BookService } from '../../../core/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Genre } from '../../../shared/enums/genre';
import { Language } from '../../../shared/enums/language';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    BookAddToShelfComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  public books!: BookListDto[];
  public filteredBooks!: BookListDto[];
  public genres = Object.keys(Genre);
  public genreNames: Record<string, string> = Genre;
  public languages = Object.keys(Language);
  public languageNames: Record<string, string> = Language;
  public sortField: keyof BookListDto = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';

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

  public onSubmit(): void {
    this.onFilter();
    this.onSort();
  }

  private onFilter(): void {
    const { query, genre, language } = this.filterForm.value;
    const lowerQuery = query?.toLowerCase() ?? '';

    this.filteredBooks = this.books
      .filter(
        (b) =>
          !lowerQuery ||
          b.title.toLowerCase().includes(lowerQuery) ||
          b.author.toLowerCase().includes(lowerQuery)
      )
      .filter((b) => !genre || b.genre === genre)
      .filter((b) => !language || b.language === language);
  }

  public onSort(
    field: keyof BookListDto = this.sortField,
    direction: 'asc' | 'desc' = this.sortDirection
  ): void {
    const factor = direction === 'asc' ? 1 : -1;

    this.sortField = field;
    this.sortDirection = direction;

    this.filteredBooks.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * factor;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      return strA.localeCompare(strB) * factor;
    });
  }

  public refreshBooks(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (response: BookListDto[]) => {
        this.books = response;
        this.filteredBooks = response;
        this.onFilter();
        this.onSort();
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania książek.');
      },
    });
  }

  public getImagePath(imagePath: string): string {
    return this.bookService.getImagePath(imagePath);
  }
}
