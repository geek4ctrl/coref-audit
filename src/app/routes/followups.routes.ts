import { Routes } from '@angular/router';

export const followupsRoutes: Routes = [
  {
    path: 'relances',
    loadComponent: () => import('../pages/relances/relances.component').then((m) => m.RelancesComponent),
    data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF'] }
  },
  {
    path: 'retards',
    loadComponent: () => import('../pages/retards/retards.component').then((m) => m.RetardsComponent),
    data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'AUDITEUR'] }
  }
];
