import { AdminUserFormComponent } from './admin-user-form/admin-user-form.component';
import { AdminUserListComponent } from './admin-user-list/admin-user-list.component';
import { Routes } from '@angular/router';

export const ADMIN_USER_ROUTES: Routes = [
  {
    path: 'list',
    component: AdminUserListComponent,
  },
  {
    path: 'add',
    component: AdminUserFormComponent,
  },
  {
    path: ':id/edit',
    component: AdminUserFormComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
