import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReceptionComponent } from './pages/reception/reception.component';
import { EnvoiComponent } from './pages/envoi/envoi.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { NouveauDocumentComponent } from './pages/nouveau-document/nouveau-document.component';
import { EspaceReceptionComponent } from './pages/espace-reception/espace-reception.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { RechercheComponent } from './pages/recherche/recherche.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { RetardsComponent } from './pages/retards/retards.component';
import { RelancesComponent } from './pages/relances/relances.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'AUDITEUR'] }
      },
      {
        path: 'documents',
        component: DocumentsComponent,
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
          ]
        }
      },
      {
        path: 'reception',
        component: ReceptionComponent,
        data: { roles: ['ADMIN', 'RECEPTION'] }
      },
      {
        path: 'envoi',
        component: EnvoiComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT'] }
      },
      { path: 'categories', component: CategoriesComponent, data: { roles: ['ADMIN'] } },
      {
        path: 'recherche',
        component: RechercheComponent,
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
          ]
        }
      },
      {
        path: 'nouveau',
        component: NouveauDocumentComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT'] }
      },
      { path: 'espace-reception', component: EspaceReceptionComponent, data: { roles: ['ADMIN'] } },
      { path: 'services', component: EspaceReceptionComponent, data: { roles: ['ADMIN'] } },
      {
        path: 'relances',
        component: RelancesComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF'] }
      },
      {
        path: 'retards',
        component: RetardsComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'AUDITEUR'] }
      },
      { path: 'utilisateurs', component: UtilisateursComponent, data: { roles: ['ADMIN'] } }
    ]
  }
];
