import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'categories',
    loadComponent: () => import('../pages/categories/categories.component').then((m) => m.CategoriesComponent),
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'utilisateurs',
    loadComponent: () => import('../pages/utilisateurs/utilisateurs.component').then((m) => m.UtilisateursComponent),
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'espace-reception',
    loadComponent: () => import('../pages/espace-reception/espace-reception.component').then((m) => m.EspaceReceptionComponent),
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'services',
    loadComponent: () => import('../pages/espace-reception/espace-reception.component').then((m) => m.EspaceReceptionComponent),
    data: { roles: ['ADMIN'] }
  }
];
