import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BookDto,
  ShelfDetailsDto,
} from '../../../core/services/shelf/models/shelf-details.dto';
import { Component, OnInit } from '@angular/core';

import { BookListDto } from '../../../core/services/book/models/book-list.dto';
import { BookService } from '../../../core/services/book/book.service';
import { FormsModule } from '@angular/forms';
import { ShelfService } from '../../../core/services/shelf/shelf.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shelf-details',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './shelf-details.component.html',
  styleUrl: './shelf-details.component.scss',
})
export class ShelfDetailsComponent implements OnInit {
  public shelf!: ShelfDetailsDto;
  public shelfBooks: BookDto[] = [];
  public availableBooks: BookListDto[] = [];
  public selectedBookId: number | null = null;

  public constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private bookService: BookService
  ) {}

  public ngOnInit(): void {
    this.route.data.subscribe((resolver) => {
      this.shelf = resolver['shelf'] as ShelfDetailsDto;
    });

    this.bookService.getBooks().subscribe({
      next: (response) => {
        this.availableBooks = response;
      },
      error: () => {
        this.toastr.error(
          'Wystąpił błąd podczas pobierania dostępnych książek.'
        );
      },
    });

    this.loadBooksForShelf();
  }

  public onAddBook(): void {
    if (this.selectedBookId) {
      const shelfId = this.shelf.id;
      this.shelfService
        .addBookToUserShelf(shelfId, this.selectedBookId)
        .subscribe({
          next: () => {
            this.toastr.success('Książka została dodana do półki!');
            this.loadBooksForShelf();
          },
          error: () => {
            this.toastr.error('Nie udało się dodać książki do półki');
          },
        });
    }
  }

  public onRemoveBook(bookId: number): void {
    const shelfId = this.shelf.id;
    this.shelfService.removeBookFromUserShelf(shelfId, bookId).subscribe({
      next: () => {
        this.toastr.success('Książka została usunięta z półki');
        this.loadBooksForShelf();
      },
      error: () => {
        this.toastr.error('Nie udało się usunąć książki z półki');
      },
    });
  }

  private loadBooksForShelf(): void {
    this.shelfService.getBooksForUserShelf(this.shelf.id).subscribe({
      next: (response) => {
        this.shelfBooks = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania książek półki.');
      },
    });
  }
}
