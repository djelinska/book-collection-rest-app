import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { BookDto } from '../../../../core/services/admin/models/book.dto';
import { BookService } from '../../../../core/services/book/book.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-book-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './admin-book-list.component.html',
  styleUrl: './admin-book-list.component.scss',
})
export class AdminBookListComponent implements OnInit {
  public books!: BookDto[];
  public filteredBooks!: BookDto[];
  public genres = Object.keys(Genre);
  public genreNames: Record<string, string> = Genre;
  public languages = Object.keys(Language);
  public languageNames: Record<string, string> = Language;
  public modalRef?: BsModalRef;
  public sortField: keyof BookDto = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';

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

  private loadBooks(): void {
    this.adminService.getAllBooks().subscribe({
      next: (response: BookDto[]) => {
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
