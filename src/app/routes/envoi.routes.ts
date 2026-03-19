import { Routes } from '@angular/router';

export const envoiRoutes: Routes = [
  {
    path: 'envoi',
    loadComponent: () => import('../pages/envoi/envoi.component').then((m) => m.EnvoiComponent),
    data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT'] }
  }
];
