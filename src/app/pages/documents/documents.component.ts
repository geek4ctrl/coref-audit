import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
          <p class="page-subtitle">{{ documents().length }} documents</p>
        </div>
        <div class="header-actions">
          <button class="btn-filters" (click)="toggleFilters()">
            <span class="icon">⊞</span>
            {{ showFilters() ? 'Masquer filtres' : 'Afficher filtres' }}
          </button>
          <button class="btn-export">
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
              <select class="filter-select" (change)="onFilterChange()">
                <option>Tous les statuts</option>
                <option>Document envoyé</option>
                <option>Document reçu</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Détenteur actuel</label>
              <select class="filter-select" (change)="onFilterChange()">
                <option>Tous les détenteurs</option>
                <option>Direction des Ressources Humaines</option>
                <option>Marie Kabongo</option>
                <option>Jean Mukendi</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Type de document</label>
              <select class="filter-select" (change)="onFilterChange()">
                <option>Tous les types</option>
                <option>Courrier d'arrivée</option>
                <option>Rapport</option>
                <option>Décision</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Priorité</label>
              <select class="filter-select" (change)="onFilterChange()">
                <option>Toutes priorités</option>
                <option>Haute</option>
                <option>Moyenne</option>
                <option>Basse</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">En retard</label>
              <select class="filter-select" (change)="onFilterChange()">
                <option>Tous</option>
                <option>Oui</option>
                <option>Non</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Période</label>
              <div class="date-range">
                <input
                  type="date"
                  class="date-input"
                  (change)="onFilterChange()"
                  placeholder="yyyy/mm/dd"
                />
                <input
                  type="date"
                  class="date-input"
                  (change)="onFilterChange()"
                  placeholder="yyyy/mm/dd"
                />
              </div>
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
            @for (doc of documents(); track doc.number) {
              <tr class="table-row" (click)="selectDocument(doc)">
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
                  <span class="action-days">Il y a {{ doc.daysDelay }} jours</span>
                </td>
                <td class="col-delay">
                  <span class="delay-badge">{{ doc.daysDelay > 0 ? 'Oui' : 'Non' }}</span>
                </td>
                <td class="col-actions" (click)="$event.stopPropagation()">
                  <div class="action-buttons">
                    <button class="icon-btn" title="Voir">👁</button>
                    <button class="icon-btn" title="Plus">⋯</button>
                  </div>
                </td>
              </tr>
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
export class DocumentsComponent {
  private router = inject(Router);
  showFilters = signal(true);

  documents = signal<Document[]>([
    {
      number: 'COREF-2026-0015',
      title: "Courrier d'arrivée - Demande d'audience Ministre",
      type: "Courrier d'arrivée",
      status: 'Document envoyé',
      statusColor: 'info',
      owner: 'Direction des Ressources Humaines',
      ownerRole: 'SERVICE',
      lastActionDate: '02/02/2026',
      daysDelay: 11
    },
    {
      number: 'COREF-2026-0019',
      title: 'Rapport statistiques - Exécution budgétaire janvier',
      type: 'Rapport',
      status: 'Document reçu',
      statusColor: 'success',
      owner: 'Marie Kabongo',
      ownerRole: 'PILIER',
      lastActionDate: '02/02/2026',
      daysDelay: 11
    },
    {
      number: 'COREF-2026-0013',
      title: 'Décision - Attribution marché public véhicules',
      type: 'Décision',
      status: 'Document reçu',
      statusColor: 'success',
      owner: 'Jean Mukendi',
      ownerRole: 'CHEF',
      lastActionDate: '02/02/2026',
      daysDelay: 11
    },
    {
      number: 'COREF-2026-0017',
      title: "Rapport d'audit interne - Janvier 2026",
      type: 'Rapport',
      status: 'Document envoyé',
      statusColor: 'info',
      owner: 'Marie Kabongo',
      ownerRole: 'PILIER',
      lastActionDate: '01/02/2026',
      daysDelay: 12
    }
  ]);

  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  onFilterChange(): void {
    // Handle filter changes
  }

  selectDocument(doc: Document): void {
    this.router.navigate(['/documents'], { queryParams: { docId: doc.number } });
  }
}
