import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { authChildGuard, authGuard } from './auth/auth.guard';
import { adminRoutes } from './routes/admin.routes';
import { assistantRoutes } from './routes/assistant.routes';
import { auditRoutes } from './routes/audit.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { documentsRoutes } from './routes/documents.routes';
import { envoiRoutes } from './routes/envoi.routes';
import { followupsRoutes } from './routes/followups.routes';
import { messagingRoutes } from './routes/messaging.routes';
import { receptionRoutes } from './routes/reception.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      ...dashboardRoutes,
      ...assistantRoutes,
      ...documentsRoutes,
      ...receptionRoutes,
      ...messagingRoutes,
      ...envoiRoutes,
      ...followupsRoutes,
      ...adminRoutes,
      ...auditRoutes,
    ],
  },
];
