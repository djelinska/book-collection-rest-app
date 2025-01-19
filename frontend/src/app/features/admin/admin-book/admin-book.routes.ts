import { AdminBookFormComponent } from './admin-book-form/admin-book-form.component';
import { AdminBookListComponent } from './admin-book-list/admin-book-list.component';
import { Routes } from '@angular/router';

export const ADMIN_BOOK_ROUTES: Routes = [
  {
    path: 'list',
    component: AdminBookListComponent,
  },
  {
    path: 'add',
    component: AdminBookFormComponent,
  },
  {
    path: ':id/edit',
    component: AdminBookFormComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
