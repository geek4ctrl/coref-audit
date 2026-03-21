import { Routes } from '@angular/router';

export const messagingRoutes: Routes = [
  {
    path: 'messagerie',
    loadComponent: () => import('../pages/messagerie/messagerie.component').then((m) => m.MessagerieComponent),
    data: { roles: ['ADMIN', 'RECEPTION', 'SERVICE_INTERNE', 'CHEF_SG', 'ASSISTANT_CHEF', 'PILIER'], preload: true }
  }
];
