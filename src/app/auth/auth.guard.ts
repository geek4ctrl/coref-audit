import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const userRole = authService.getRole();

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    router.navigate([authService.getDefaultRoute(userRole)]);
    return false;
  }

  return true;
};
