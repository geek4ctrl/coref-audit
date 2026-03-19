import { Routes } from '@angular/router';

export const documentsRoutes: Routes = [
  {
    path: 'documents',
    loadComponent: () => import('../pages/documents/documents.component').then((m) => m.DocumentsComponent),
    data: {
      roles: [
        'ADMIN',
        'CHEF_SG',
        'ASSISTANT_CHEF',
        'SECRETARIAT',
        'PILIER',
        'PILIER_COORD',
        'SERVICE_INTERNE',
        'AUDITEUR'
      ],
      preload: true
    }
  },
  {
    path: 'recherche',
    loadComponent: () => import('../pages/recherche/recherche.component').then((m) => m.RechercheComponent),
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
        'AUDITEUR'
      ],
      preload: true
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('../pages/nouveau-document/nouveau-document.component').then((m) => m.NouveauDocumentComponent),
    data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT', 'PILIER', 'SERVICE_INTERNE'] }
  }
];
