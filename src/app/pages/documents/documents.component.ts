import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface Document {
  number: string;
  title: string;
  type: string;
  status: string;
  statusColor: 'info' | 'warning' | 'danger' | 'success';
  owner: string;
  ownerRole: string;
  lastActionDate: string;
  daysDelay: number;
  priority: string;
  isLate: boolean;
}

interface ApiDocument {
  id: number;
  number: string;
  subject: string;
  documentType: string;
  status: string;
  category: string;
  priority: string;
  currentHolder: string;
  holderRole: string;
  isLate: boolean;
  delayDays: number;
  createdAt: string;
}

interface ApiResponse {
  documents: ApiDocument[];
  total: number;
  limit: number;
  offset: number;
}

@Component({
  selector: 'app-documents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-title">
          <h2 class="page-title">Bibliothèque de Documents</h2>
          <p class="page-subtitle">{{ subtitleText() }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-filters" (click)="toggleFilters()">
            <span class="icon">⊞</span>
            {{ showFilters() ? 'Masquer filtres' : 'Afficher filtres' }}
          </button>
          <button class="btn-export" (click)="exportCsv()">
            <span class="icon">⬇</span>
            Exporter CSV
          </button>
        </div>
      </div>

      @if (showFilters()) {
        <div class="filters-section">
          <h3 class="filters-title">Filtres</h3>
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">Statut</label>
              <select class="filter-select" [(ngModel)]="filterStatus" (ngModelChange)="loadDocuments()">
                <option value="">Tous les statuts</option>
                <option value="Document créé">Document créé</option>
                <option value="Remis">Remis</option>
                <option value="À traiter">À traiter</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Traité">Traité</option>
                <option value="Clôturé">Clôturé</option>
                <option value="Validé">Validé</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Catégorie</label>
              <select class="filter-select" [(ngModel)]="filterCategory" (ngModelChange)="loadDocuments()">
                <option value="">Toutes les catégories</option>
                <option value="COURRIER_ARRIVEE">Courrier d'arrivée</option>
                <option value="COURRIER_DEPART">Courrier de départ</option>
                <option value="NOTE_INTERNE">Note interne</option>
                <option value="RAPPORT">Rapport</option>
                <option value="DEMANDE">Demande</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Priorité</label>
              <select class="filter-select" [(ngModel)]="filterPriority" (ngModelChange)="loadDocuments()">
                <option value="">Toutes priorités</option>
                <option value="Urgente">Urgente</option>
                <option value="Haute">Haute</option>
                <option value="Normale">Normale</option>
                <option value="Basse">Basse</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">En retard</label>
              <select class="filter-select" [(ngModel)]="filterLate" (ngModelChange)="loadDocuments()">
                <option value="">Tous</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>
          </div>
        </div>
      }

      <div class="table-section">
        <table class="documents-table">
          <thead>
            <tr class="table-header">
              <th class="col-number">N°</th>
              <th class="col-title">OBJET</th>
              <th class="col-type">TYPE</th>
              <th class="col-status">STATUT</th>
              <th class="col-owner">DÉTENTEUR ACTUEL</th>
              <th class="col-action">DERNIÈRE ACTION</th>
              <th class="col-delay">RETARD</th>
              <th class="col-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @if (isLoading()) {
              <tr><td colspan="8" style="text-align:center;padding:40px;color:#64748b">Chargement...</td></tr>
            } @else if (documents().length === 0) {
              <tr><td colspan="8" style="text-align:center;padding:40px;color:#64748b">Aucun document trouvé</td></tr>
            } @else {
              @for (doc of documents(); track doc.number) {
                <tr class="table-row" [class.late-row]="doc.isLate" (click)="selectDocument(doc)">
                  <td class="col-number">
                    <span class="doc-number">{{ doc.number }}</span>
                  </td>
                  <td class="col-title">
                    <span class="doc-title">{{ doc.title }}</span>
                  </td>
                  <td class="col-type">
                    <span class="doc-type">{{ doc.type }}</span>
                  </td>
                  <td class="col-status">
                    <span class="pill" [class]="doc.statusColor">{{ doc.status }}</span>
                  </td>
                  <td class="col-owner">
                    <div class="owner-info">
                      <span class="owner-name">{{ doc.owner }}</span>
                      <span class="owner-role">{{ doc.ownerRole }}</span>
                    </div>
                  </td>
                  <td class="col-action">
                    <span class="action-date">{{ doc.lastActionDate }}</span>
                    @if (doc.daysDelay > 0) {
                      <span class="action-days">{{ doc.daysDelay }} jours de retard</span>
                    }
                  </td>
                  <td class="col-delay">
                    <span class="delay-badge" [class.delay-ok]="!doc.isLate">{{ doc.isLate ? 'Oui' : 'Non' }}</span>
                  </td>
                  <td class="col-actions" (click)="$event.stopPropagation()">
                    <div class="action-buttons">
                      <button class="icon-btn" title="Voir">👁</button>
                      <button class="icon-btn" title="Plus">⋯</button>
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-title {
      flex: 1;
    }

    .page-title {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
    }

    .page-subtitle {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-filters,
    .btn-export {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-filters {
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }

    .btn-filters:hover {
      background: #e2e8f0;
    }

    .btn-export {
      background: #0b3a78;
      color: white;
    }

    .btn-export:hover {
      background: #082456;
    }

    .icon {
      font-size: 14px;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 20px;
      margin-bottom: 24px;
    }

    .filters-title {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .filter-select {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      background: white;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: #0b3a78;
      box-shadow: 0 0 0 3px rgba(11, 58, 120, 0.12);
    }

    .date-range {
      display: flex;
      gap: 8px;
    }

    .date-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      background: white;
    }

    .date-input:focus {
      outline: none;
      border-color: #0b3a78;
      box-shadow: 0 0 0 3px rgba(11, 58, 120, 0.12);
    }

    .table-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .documents-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .table-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 700;
      color: #64748b;
      font-size: 11px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .table-row {
      border-bottom: 1px solid #edf2f7;
      transition: background-color 0.2s;
      cursor: pointer;
    }

    .table-row:hover {
      background-color: #f8fafc;
    }

    td {
      padding: 14px 16px;
      color: #1f2937;
    }

    .doc-number {
      font-weight: 700;
      color: #0b3a78;
      font-size: 12px;
    }

    .doc-title {
      color: #0f172a;
      font-weight: 500;
    }

    .doc-type {
      color: #64748b;
      font-size: 12px;
    }

    .pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }

    .pill.info {
      background: #e0edff;
      color: #1d4ed8;
    }

    .pill.warning {
      background: #ffedd5;
      color: #b45309;
    }

    .pill.danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    .pill.success {
      background: #dcfce7;
      color: #15803d;
    }

    .owner-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .owner-name {
      font-weight: 500;
      color: #0f172a;
    }

    .owner-role {
      font-size: 11px;
      color: #64748b;
    }

    .action-date {
      display: block;
      font-weight: 500;
      color: #0f172a;
    }

    .action-days {
      display: block;
      font-size: 11px;
      color: #64748b;
    }

    .delay-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      background: #fee2e2;
      color: #b91c1c;
    }

    .delay-badge.delay-ok {
      background: #dcfce7;
      color: #15803d;
    }

    .late-row {
      background: #fef2f2;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .icon-btn:hover {
      background: #f1f5f9;
    }

    @media (max-width: 1200px) {
      .filters-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .documents-table {
        font-size: 12px;
      }

      th,
      td {
        padding: 10px 12px;
      }
    }
  `]
})
export class DocumentsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  showFilters = signal(true);
  isLoading = signal(false);
  currentScopeLabel = signal<string | null>(null);
  documents = signal<Document[]>([]);
  totalDocuments = signal(0);

  filterStatus = '';
  filterPriority = '';
  filterCategory = '';
  filterLate = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const scope = params.get('scope');
      const showFiltersParam = params.get('showFilters');

      if (showFiltersParam === '1') {
        this.showFilters.set(true);
      }

      if (scope === 'delayed') {
        this.filterLate = 'true';
      }

      this.currentScopeLabel.set(this.mapScope(scope));
      this.loadDocuments();
    });
  }

  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  loadDocuments(): void {
    this.isLoading.set(true);

    let params = new HttpParams().set('limit', '100');
    if (this.filterStatus) params = params.set('status', this.filterStatus);
    if (this.filterPriority) params = params.set('priority', this.filterPriority);
    if (this.filterCategory) params = params.set('category', this.filterCategory);
    if (this.filterLate) params = params.set('late', this.filterLate);

    this.http.get<ApiResponse>(`${API_BASE_URL}/documents`, { params }).subscribe({
      next: (response) => {
        this.documents.set(response.documents.map(d => this.mapDocument(d)));
        this.totalDocuments.set(response.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.documents.set([]);
        this.isLoading.set(false);
      }
    });
  }

  subtitleText(): string {
    const scopeLabel = this.currentScopeLabel();
    const count = this.documents().length;
    const total = this.totalDocuments();
    const label = count < total ? `${count} / ${total} documents` : `${count} documents`;
    return scopeLabel ? `${label} · ${scopeLabel}` : label;
  }

  selectDocument(doc: Document): void {
    this.router.navigate(['/documents'], { queryParams: { docId: doc.number } });
  }

  exportCsv(): void {
    const docs = this.documents();
    if (docs.length === 0) return;
    const headers = ['Numéro', 'Objet', 'Type', 'Statut', 'Détenteur', 'Rôle', 'Dernière action', 'Retard (jours)', 'Priorité', 'En retard'];
    const escape = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const rows = docs.map(d => [
      escape(d.number), escape(d.title), escape(d.type), escape(d.status),
      escape(d.owner), escape(d.ownerRole), escape(d.lastActionDate),
      d.daysDelay.toString(), escape(d.priority), d.isLate ? 'Oui' : 'Non'
    ].join(','));
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents-coref-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private mapDocument(d: ApiDocument): Document {
    const completedStatuses = ['Traité', 'Clôturé', 'Validé', 'Remis', 'Terminé'];
    const warningStatuses = ['En cours', 'En traitement'];
    let statusColor: 'info' | 'warning' | 'danger' | 'success';

    if (d.isLate) {
      statusColor = 'danger';
    } else if (completedStatuses.includes(d.status)) {
      statusColor = 'success';
    } else if (warningStatuses.includes(d.status)) {
      statusColor = 'warning';
    } else {
      statusColor = 'info';
    }

    const categoryLabels: Record<string, string> = {
      'COURRIER_ARRIVEE': "Courrier d'arrivée",
      'COURRIER_DEPART': 'Courrier de départ',
      'NOTE_INTERNE': 'Note interne',
      'RAPPORT': 'Rapport',
      'DEMANDE': 'Demande'
    };

    return {
      number: d.number,
      title: d.subject,
      type: categoryLabels[d.documentType] || d.documentType || d.category,
      status: d.status,
      statusColor,
      owner: d.currentHolder,
      ownerRole: d.holderRole,
      lastActionDate: this.formatDate(d.createdAt),
      daysDelay: d.delayDays,
      priority: d.priority,
      isLate: d.isLate
    };
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' }).format(new Date(value));
  }

  private mapScope(scope: string | null): string | null {
    const scopeLabels: Record<string, string> = {
      'all': 'Tous',
      'to-process': 'À traiter',
      'in-progress': 'En cours',
      'done': 'Terminés',
      'assigned-to-me': 'Destinés à moi',
      'sent-by-me': 'Envoyés par moi',
      'no-ack': 'Sans accusé réception',
      'delayed': 'En retard',
      'blocked': 'Bloqués',
      'treated-this-week': 'Traités cette semaine',
      'pilier': 'Par pilier'
    };
    return scope ? (scopeLabels[scope] ?? null) : null;
  }
}
