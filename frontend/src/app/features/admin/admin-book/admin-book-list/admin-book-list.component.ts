import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { BookService } from '../../../../core/services/book/book.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';
import { PaginatedBooksDto } from '../../../../core/services/admin/models/paginated-books.dto';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-book-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-book-list.component.html',
  styleUrl: './admin-book-list.component.scss',
})
export class AdminBookListComponent implements OnInit {
  public paginatedBooks!: PaginatedBooksDto;
  public query: string = '';
  public genres = Object.keys(Genre);
  public genreNames: Record<string, string> = Genre;
  public languages = Object.keys(Language);
  public languageNames: Record<string, string> = Language;
  public modalRef?: BsModalRef;

  public constructor(
    private adminService: AdminService,
    private bookService: BookService,
    private toastr: ToastrService,
    private modalService: BsModalService
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
    this.loadBooks();
  }

  private loadBooks(): void {
    this.adminService.searchBooks(this.query).subscribe({
      next: (response) => {
        this.paginatedBooks = response;
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
