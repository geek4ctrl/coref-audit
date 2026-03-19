import { Routes } from '@angular/router';

export const receptionRoutes: Routes = [
  {
    path: 'reception',
    loadComponent: () => import('../pages/reception/reception.component').then((m) => m.ReceptionComponent),
    data: { roles: ['ADMIN', 'RECEPTION'], preload: true }
  },
  {
    path: 'distributions',
    loadComponent: () => import('../pages/distributions/distributions.component').then((m) => m.DistributionsComponent),
    data: { roles: ['ADMIN', 'RECEPTION'] }
  },
  {
    path: 'bordereaux',
    loadComponent: () => import('../pages/bordereaux/bordereaux.component').then((m) => m.BordereauxComponent),
    data: { roles: ['ADMIN', 'RECEPTION'] }
  },
  {
    path: 'enregistrer-courrier',
    loadComponent: () => import('../pages/enregistrer-courrier/enregistrer-courrier.component').then((m) => m.EnregistrerCourrierComponent),
    data: { roles: ['ADMIN', 'RECEPTION'] }
  }
];
