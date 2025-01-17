import { BookDetailsComponent } from './book-details/book-details.component';
import { BookListComponent } from './book-list/book-list.component';
import { Routes } from '@angular/router';
import { bookResolver } from '../../core/resolvers/book.resolver';

export const BOOK_ROUTES: Routes = [
  {
    path: 'list',
    component: BookListComponent,
  },

  {
    path: ':id/details',
    component: BookDetailsComponent,
    resolve: { book: bookResolver },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
