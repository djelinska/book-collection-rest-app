import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BookAddToShelfComponent } from '../shared/book-add-to-shelf/book-add-to-shelf.component';
import { BookDto } from '../../../shared/models/book.dto';
import { BookService } from '../../../core/services/book/book.service';
import { DatePipe } from '@angular/common';
import { Genre } from '../../../shared/enums/genre';
import { Language } from '../../../shared/enums/language';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [DatePipe, BookAddToShelfComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  public book!: BookDto;
  public genreNames: Record<string, string> = Genre;
  public languageNames: Record<string, string> = Language;

  public constructor(
    private bookService: BookService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.loadBook();
  }

  public onAddToShelf(): void {
    this.loadBook();
  }

  public getImagePath(imagePath: string): string {
    return this.bookService.getImagePath(imagePath);
  }

  private loadBook(): void {
    this.route.data.subscribe((resolver) => {
      this.book = resolver['book'] as BookDto;
    });
  }
}
