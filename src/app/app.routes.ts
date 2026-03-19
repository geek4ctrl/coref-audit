import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { authChildGuard, authGuard } from './auth/auth.guard';

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
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'PILIER', 'PILIER_COORD', 'SECRETARIAT', 'SERVICE_INTERNE', 'AUDITEUR'] },
      },
      {
        path: 'a-classer-annoter',
        loadComponent: () => import('./pages/a-classer-annoter/a-classer-annoter.component').then((m) => m.AClasserAnnoterComponent),
        data: { roles: ['ADMIN', 'ASSISTANT_CHEF'] },
      },
      {
        path: 'envoyes-au-chef',
        loadComponent: () => import('./pages/envoyes-au-chef/envoyes-au-chef.component').then((m) => m.EnvoyesAuChefComponent),
        data: { roles: ['ADMIN', 'ASSISTANT_CHEF'] },
      },
      {
        path: 'a-traiter-par-chef',
        loadComponent: () => import('./pages/a-traiter-par-chef/a-traiter-par-chef.component').then((m) => m.ATraiterParChefComponent),
        data: { roles: ['ADMIN', 'ASSISTANT_CHEF', 'SERVICE_INTERNE'] },
      },
      {
        path: 'documents',
        loadComponent: () => import('./pages/documents/documents.component').then((m) => m.DocumentsComponent),
        data: {
          roles: [
            'ADMIN',
            'CHEF_SG',
            'ASSISTANT_CHEF',
            'SECRETARIAT',
            'PILIER',
            'PILIER_COORD',
            'SERVICE_INTERNE',
            'AUDITEUR',
          ],
        },
      },
      {
        path: 'reception',
        loadComponent: () => import('./pages/reception/reception.component').then((m) => m.ReceptionComponent),
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'distributions',
        loadComponent: () => import('./pages/distributions/distributions.component').then((m) => m.DistributionsComponent),
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'bordereaux',
        loadComponent: () => import('./pages/bordereaux/bordereaux.component').then((m) => m.BordereauxComponent),
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'enregistrer-courrier',
        loadComponent: () => import('./pages/enregistrer-courrier/enregistrer-courrier.component').then((m) => m.EnregistrerCourrierComponent),
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'messagerie',
        loadComponent: () => import('./pages/messagerie/messagerie.component').then((m) => m.MessagerieComponent),
        data: { roles: ['ADMIN', 'RECEPTION', 'SERVICE_INTERNE', 'CHEF_SG'] },
      },
      {
        path: 'envoi',
        loadComponent: () => import('./pages/envoi/envoi.component').then((m) => m.EnvoiComponent),
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT'] },
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.component').then((m) => m.CategoriesComponent),
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'recherche',
        loadComponent: () => import('./pages/recherche/recherche.component').then((m) => m.RechercheComponent),
        data: {
          roles: [
            'ADMIN',
            'CHEF_SG',
            'ASSISTANT_CHEF',
            'RECEPTION',
            'SECRETARIAT',
            'PILIER',
            'PILIER_COORD',
            'SERVICE_INTERNE',
            'AUDITEUR',
          ],
        },
      },
      {
        path: 'nouveau',
        loadComponent: () => import('./pages/nouveau-document/nouveau-document.component').then((m) => m.NouveauDocumentComponent),
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT', 'PILIER', 'SERVICE_INTERNE'] },
      },
      {
        path: 'espace-reception',
        loadComponent: () => import('./pages/espace-reception/espace-reception.component').then((m) => m.EspaceReceptionComponent),
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/espace-reception/espace-reception.component').then((m) => m.EspaceReceptionComponent),
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'relances',
        loadComponent: () => import('./pages/relances/relances.component').then((m) => m.RelancesComponent),
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF'] },
      },
      {
        path: 'retards',
        loadComponent: () => import('./pages/retards/retards.component').then((m) => m.RetardsComponent),
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'AUDITEUR'] },
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./pages/utilisateurs/utilisateurs.component').then((m) => m.UtilisateursComponent),
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./pages/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent),
        data: { roles: ['ADMIN', 'AUDITEUR'] },
      },
    ],
  },
];
