import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    data: {
      roles: [
        'ADMIN',
        'CHEF_SG',
        'ASSISTANT_CHEF',
        'PILIER',
        'PILIER_COORD',
        'SECRETARIAT',
        'SERVICE_INTERNE',
        'AUDITEUR'
      ],
      preload: true
    }
  }
];
