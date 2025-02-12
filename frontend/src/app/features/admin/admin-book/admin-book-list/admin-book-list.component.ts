import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { BookDto } from '../../../../core/services/admin/models/book.dto';
import { BookService } from '../../../../core/services/book/book.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-book-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, PaginationComponent],
  templateUrl: './admin-book-list.component.html',
  styleUrl: './admin-book-list.component.scss',
})
export class AdminBookListComponent implements OnInit {
  public books!: BookDto[];
  public filteredBooks!: BookDto[];
  public paginatedBooks!: BookDto[];
  public genres = Object.keys(Genre);
  public genreNames: Record<string, string> = Genre;
  public languages = Object.keys(Language);
  public languageNames: Record<string, string> = Language;
  public modalRef?: BsModalRef;
  public sortField: keyof BookDto = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public page = 0;
  public totalPages = 0;
  public pageSizeOptions: number[] = [2, 5, 10];
  public pageSize = 5;

  public filterForm = this.fb.group({
    query: new FormControl<string>(''),
    genre: new FormControl<string>(''),
    language: new FormControl<string>(''),
  });

  public constructor(
    private adminService: AdminService,
    private bookService: BookService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.loadBooks();
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
        this.loadBooks();
      },
      error: () => {
        this.toastr.error('Nie udało się usunąć książki.');
      },
    });
  }

  public onSubmit(): void {
    this.onFilter();
    this.onSort();
    this.paginateBooks();
  }

  private onFilter(): void {
    const { query, genre, language } = this.filterForm.value;
    const lowerQuery = query?.toLowerCase() ?? '';

    this.filteredBooks = this.books
      .filter(
        (b) =>
          !lowerQuery ||
          b.title.toLowerCase().includes(lowerQuery) ||
          b.author.toLowerCase().includes(lowerQuery) ||
          b.isbn.toLowerCase().includes(lowerQuery)
      )
      .filter((b) => !genre || b.genre === genre)
      .filter((b) => !language || b.language === language);
  }

  public onSort(
    field: keyof BookDto = this.sortField,
    direction: 'asc' | 'desc' = this.sortDirection
  ): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.page = 0;

    this.sortBooks();
    this.paginateBooks();
  }

  public sortBooks(): void {
    const factor = this.sortDirection === 'asc' ? 1 : -1;

    this.filteredBooks.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * factor;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      return strA.localeCompare(strB) * factor;
    });
  }

  public onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.paginateBooks();
  }

  private paginateBooks(): void {
    this.totalPages = Math.ceil(this.filteredBooks.length / this.pageSize);

    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  public goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.paginateBooks();
    }
  }

  private loadBooks(): void {
    this.adminService.getAllBooks().subscribe({
      next: (response: BookDto[]) => {
        this.books = response;
        this.filteredBooks = response;
        this.onFilter();
        this.onSort();
        this.paginateBooks();
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
