import { Routes } from '@angular/router';
import { ShelfDetailsComponent } from './shelf-details/shelf-details.component';
import { ShelfFormComponent } from './shelf-form/shelf-form.component';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { shelfResolver } from '../../core/resolvers/shelf.resolver';

export const SHELF_ROUTES: Routes = [
  {
    path: 'list',
    component: ShelfListComponent,
  },

  {
    path: ':id/details',
    component: ShelfDetailsComponent,
    resolve: { shelf: shelfResolver },
  },
  {
    path: 'add',
    component: ShelfFormComponent,
  },
  {
    path: ':id/edit',
    component: ShelfFormComponent,
    resolve: { shelf: shelfResolver },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
