import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ShelfListDto } from '../../../core/services/shelf/models/shelf-list.dto';
import { ShelfService } from '../../../core/services/shelf/shelf.service';
import { ShelfType } from '../../../shared/enums/shelf-type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shelf-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shelf-list.component.html',
  styleUrl: './shelf-list.component.scss',
})
export class ShelfListComponent implements OnInit {
  public shelves!: ShelfListDto[];
  public defaultShelfType: ShelfType = ShelfType.DEFAULT;

  public constructor(
    private shelfService: ShelfService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.loadShelves();
  }

  private loadShelves(): void {
    this.shelfService.getUserShelves().subscribe({
      next: (response) => {
        this.shelves = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania półek.');
      },
    });
  }

  public onDelete(id: number): void {
    this.shelfService.deleteUserShelf(id).subscribe({
      next: () => {
        this.toastr.success('Półka została pomyślnie usunięta!');
        this.router.navigate(['/shelf/list']);
        this.loadShelves();
      },
      error: (err) => {
        if (err.status === 500) {
          this.toastr.error('Wystąpił błąd podczas próby zapisu.');
        } else {
          this.toastr.error('Wystąpił nieoczekiwany błąd.');
        }
      },
    });
  }
}
