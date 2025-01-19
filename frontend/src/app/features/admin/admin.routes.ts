import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('./admin-user/admin-user.routes').then((r) => r.ADMIN_USER_ROUTES),
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
];
