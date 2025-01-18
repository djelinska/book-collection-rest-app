import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BookDto,
  ShelfDetailsDto,
} from '../../../core/services/shelf/models/shelf-details.dto';
import { Component, OnInit } from '@angular/core';

import { ShelfService } from '../../../core/services/shelf/shelf.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shelf-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shelf-details.component.html',
  styleUrl: './shelf-details.component.scss',
})
export class ShelfDetailsComponent implements OnInit {
  public shelf!: ShelfDetailsDto;
  public books!: BookDto[];

  public constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private shelfService: ShelfService
  ) {}

  public ngOnInit(): void {
    this.route.data.subscribe((resolver) => {
      this.shelf = resolver['shelf'] as ShelfDetailsDto;
    });

    this.shelfService.getBooksForUserShelf(this.shelf.id).subscribe({
      next: (response) => {
        this.books = response;
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas pobierania książek półki.');
      },
    });
  }
}
