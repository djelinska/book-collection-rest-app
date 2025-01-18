import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { ShelfDetailsDto } from '../services/shelf/models/shelf-details.dto';
import { ShelfService } from '../services/shelf/shelf.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const shelfResolver: ResolveFn<ShelfDetailsDto | null> = (route) => {
  const shelfService = inject(ShelfService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return shelfService.getUserShelfById(route.params['id']).pipe(
    catchError((error) => {
      if (error.status === 500) {
        toastr.error('Wystąpił błąd podczas pobierania półki.');
      } else if (error.status === 404) {
        toastr.error('Półka nie została znaleziona.');
      } else {
        toastr.error('Wystąpił nieoczekiwany błąd.');
      }
      router.navigate(['not-found']);

      return of(null);
    })
  );
};
