import { Routes } from '@angular/router';

export const assistantRoutes: Routes = [
  {
    path: 'a-classer-annoter',
    loadComponent: () => import('../pages/a-classer-annoter/a-classer-annoter.component').then((m) => m.AClasserAnnoterComponent),
    data: { roles: ['ADMIN', 'ASSISTANT_CHEF'] }
  },
  {
    path: 'envoyes-au-chef',
    loadComponent: () => import('../pages/envoyes-au-chef/envoyes-au-chef.component').then((m) => m.EnvoyesAuChefComponent),
    data: { roles: ['ADMIN', 'ASSISTANT_CHEF'] }
  },
  {
    path: 'a-traiter-par-chef',
    loadComponent: () => import('../pages/a-traiter-par-chef/a-traiter-par-chef.component').then((m) => m.ATraiterParChefComponent),
    data: { roles: ['ADMIN', 'ASSISTANT_CHEF', 'SERVICE_INTERNE'] }
  }
];
