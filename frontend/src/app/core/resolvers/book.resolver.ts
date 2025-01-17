import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { BookDto } from '../../shared/models/book.dto';
import { BookService } from '../services/book/book.service';
import { inject } from '@angular/core';

export const bookResolver: ResolveFn<BookDto | null> = (route) => {
  const bookService = inject(BookService);
  const router = inject(Router);

  return bookService.getBookById(route.params['id']).pipe(
    catchError(() => {
      router.navigate(['not-found']);

      return of(null);
    })
  );
};
