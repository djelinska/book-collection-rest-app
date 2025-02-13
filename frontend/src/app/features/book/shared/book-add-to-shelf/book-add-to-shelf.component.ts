import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ShelfListDto } from '../../../../core/services/shelf/models/shelf-list.dto';
import { ShelfService } from '../../../../core/services/shelf/shelf.service';
import { ShelfType } from '../../../../shared/enums/shelf-type';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-book-add-to-shelf',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './book-add-to-shelf.component.html',
  styleUrl: './book-add-to-shelf.component.scss',
})
export class BookAddToShelfComponent implements OnInit {
  @Input() public bookId!: number;
  @Output() public refresh = new EventEmitter<void>();
  public availableShelves: ShelfListDto[] = [];
  public wantToReadShelfType: ShelfType = ShelfType.WANT_TO_READ;
  public readShelfType: ShelfType = ShelfType.READ;

  public constructor(
    private shelfService: ShelfService,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this.shelfService.getUserShelves().subscribe({
      next: (response) => {
        this.availableShelves = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania dostępnych półek.');
      },
    });
  }

  public addBookToShelf(shelfId: number, bookId: number): void {
    this.shelfService.addBookToUserShelf(shelfId, bookId).subscribe({
      next: () => {
        this.toastr.success('Książka została dodana do półki!');
        this.refresh.emit();
      },
      error: () => {
        this.toastr.error('Nie udało się dodać książki do półki');
      },
    });
  }
}
