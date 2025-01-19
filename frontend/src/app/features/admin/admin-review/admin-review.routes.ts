import { AdminReviewFormComponent } from './admin-review-form/admin-review-form.component';
import { AdminReviewListComponent } from './admin-review-list/admin-review-list.component';
import { Routes } from '@angular/router';

export const ADMIN_REVIEW_ROUTES: Routes = [
  {
    path: 'list',
    component: AdminReviewListComponent,
  },
  {
    path: 'add',
    component: AdminReviewFormComponent,
  },
  {
    path: ':id/edit',
    component: AdminReviewFormComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
