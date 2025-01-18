import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [guestGuard],
    component: WelcomeComponent,
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    component: RegisterComponent,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    component: HomeComponent,
  },
  {
    path: 'book',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/book/book.routes').then((r) => r.BOOK_ROUTES),
  },
  {
    path: 'shelf',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/shelf/shelf.routes').then((r) => r.SHELF_ROUTES),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
