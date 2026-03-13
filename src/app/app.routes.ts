import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReceptionComponent } from './pages/reception';
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
import { DistributionsComponent } from './pages/distributions/distributions.component';
import { BordereauxComponent } from './pages/bordereaux/bordereaux.component';
import { EnregistrerCourrierComponent } from './pages/enregistrer-courrier/enregistrer-courrier.component';
import { MessagerieComponent } from './pages/messagerie';
import { AClasserAnnoterComponent } from './pages/a-classer-annoter/a-classer-annoter.component';
import { EnvoyesAuChefComponent } from './pages/envoyes-au-chef/envoyes-au-chef.component';
import { ATraiterParChefComponent } from './pages/a-traiter-par-chef/a-traiter-par-chef.component';
import { authChildGuard, authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'PILIER', 'PILIER_COORD', 'SECRETARIAT', 'SERVICE_INTERNE', 'AUDITEUR'] },
      },
      {
        path: 'a-classer-annoter',
        component: AClasserAnnoterComponent,
        data: { roles: ['ADMIN', 'ASSISTANT_CHEF'] },
      },
      {
        path: 'envoyes-au-chef',
        component: EnvoyesAuChefComponent,
        data: { roles: ['ADMIN', 'ASSISTANT_CHEF'] },
      },
      {
        path: 'a-traiter-par-chef',
        component: ATraiterParChefComponent,
        data: { roles: ['ADMIN', 'ASSISTANT_CHEF', 'SERVICE_INTERNE'] },
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
            'AUDITEUR',
          ],
        },
      },
      {
        path: 'reception',
        component: ReceptionComponent,
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'distributions',
        component: DistributionsComponent,
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'bordereaux',
        component: BordereauxComponent,
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'enregistrer-courrier',
        component: EnregistrerCourrierComponent,
        data: { roles: ['ADMIN', 'RECEPTION'] },
      },
      {
        path: 'messagerie',
        component: MessagerieComponent,
        data: { roles: ['ADMIN', 'RECEPTION', 'SERVICE_INTERNE'] },
      },
      {
        path: 'envoi',
        component: EnvoiComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT'] },
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
            'AUDITEUR',
          ],
        },
      },
      {
        path: 'nouveau',
        component: NouveauDocumentComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'SECRETARIAT', 'PILIER', 'SERVICE_INTERNE'] },
      },
      { path: 'espace-reception', component: EspaceReceptionComponent, data: { roles: ['ADMIN'] } },
      { path: 'services', component: EspaceReceptionComponent, data: { roles: ['ADMIN'] } },
      {
        path: 'relances',
        component: RelancesComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF'] },
      },
      {
        path: 'retards',
        component: RetardsComponent,
        data: { roles: ['ADMIN', 'CHEF_SG', 'ASSISTANT_CHEF', 'AUDITEUR'] },
      },
      { path: 'utilisateurs', component: UtilisateursComponent, data: { roles: ['ADMIN'] } },
    ],
  },
];
