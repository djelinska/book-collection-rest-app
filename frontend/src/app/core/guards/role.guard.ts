import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { Role } from '../../shared/enums/role';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: Role[] = route.data['roles'] as Role[];
  const user = authService.getLoggedInUser();

  if (user && requiredRoles.includes(user.role)) {
    return true;
  }
  router.navigate(['/home']);

  return false;
};
