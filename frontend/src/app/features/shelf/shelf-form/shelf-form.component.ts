import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ShelfDetailsDto } from '../../../core/services/shelf/models/shelf-details.dto';
import { ShelfFormDto } from '../../../core/services/shelf/models/shelf-form.dto';
import { ShelfService } from '../../../core/services/shelf/shelf.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shelf-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    RouterLink,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './shelf-form.component.html',
  styleUrl: './shelf-form.component.scss',
})
export class ShelfFormComponent implements OnInit {
  public form = this.fb.group({
    name: new FormControl<string>('', [Validators.required]),
  });
  public shelfId: number | null = null;
  public isEditMode: boolean = false;

  public constructor(
    private fb: FormBuilder,
    private shelfService: ShelfService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const shelfId = +this.route.snapshot.params['id'] || null;

    if (shelfId) {
      this.shelfId = shelfId;
      this.isEditMode = true;

      this.route.data.subscribe((resolver) => {
        const shelf = resolver['shelf'] as ShelfDetailsDto;

        this.form.patchValue({
          name: shelf.name,
        });
      });
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: ShelfFormDto = {
        name: this.form.value.name ?? '',
      };

      const action$ =
        this.shelfId && this.isEditMode
          ? this.shelfService.updateUserShelf(this.shelfId, data)
          : this.shelfService.createUserShelf(data);

      action$.subscribe({
        next: () => {
          const successMessage = this.shelfId
            ? 'Półka została zaktualizowana pomyślnie!'
            : 'Półka została dodana pomyślnie!';
          this.toastr.success(successMessage);
          this.router.navigate(['/shelf/list']);
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 500) {
      this.toastr.error('Wystąpił błąd podczas próby zapisu.');
    } else {
      this.toastr.error('Wystąpił nieoczekiwany błąd.');
    }
  }
}
