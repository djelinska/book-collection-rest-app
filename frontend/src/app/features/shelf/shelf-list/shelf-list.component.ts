import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ShelfListDto } from '../../../core/services/shelf/models/shelf-list.dto';
import { ShelfService } from '../../../core/services/shelf/shelf.service';
import { ShelfType } from '../../../shared/enums/shelf-type';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shelf-list',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './shelf-list.component.html',
  styleUrl: './shelf-list.component.scss',
})
export class ShelfListComponent implements OnInit {
  public shelves!: ShelfListDto[];
  public defaultShelfType: ShelfType = ShelfType.DEFAULT;
  public wantToReadShelfType: ShelfType = ShelfType.WANT_TO_READ;
  public readShelfType: ShelfType = ShelfType.READ;
  public modalRef?: BsModalRef;

  public constructor(
    private shelfService: ShelfService,
    private toastr: ToastrService,
    private modalService: BsModalService,
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
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Potwierdź usunięcie',
        message: 'Czy na pewno chcesz usunąć tę półkę?',
        confirmCallback: () => {
          this.deleteShelf(id);
        },
      },
    });
  }

  private deleteShelf(id: number): void {
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
