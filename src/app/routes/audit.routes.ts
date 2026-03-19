import { Routes } from '@angular/router';

export const auditRoutes: Routes = [
  {
    path: 'audit-logs',
    loadComponent: () => import('../pages/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent),
    data: { roles: ['ADMIN', 'AUDITEUR'] }
  }
];
