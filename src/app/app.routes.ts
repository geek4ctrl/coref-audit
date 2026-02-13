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

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'reception', component: ReceptionComponent },
      { path: 'envoi', component: EnvoiComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'recherche', component: RechercheComponent },
      { path: 'nouveau', component: NouveauDocumentComponent },
      { path: 'espace-reception', component: EspaceReceptionComponent },
      { path: 'retards', component: RetardsComponent },
      { path: 'utilisateurs', component: UtilisateursComponent }
    ]
  }
];
