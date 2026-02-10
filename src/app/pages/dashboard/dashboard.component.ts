import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent, StatusCard } from '../../shared/status-card/status-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatusCardComponent],
  template: `
    <div class="dashboard">
      <div class="page-heading">
        <div>
          <h2 class="page-title">Dashboard Chef</h2>
          <p class="page-subtitle">Centre de contrôle — Vue d'ensemble en 5 secondes</p>
        </div>
      </div>

      <div class="status-cards-grid">
        @for (card of statusCards; track card.title) {
          <app-status-card [card]="card" />
        }
      </div>

      <div class="filters-card">
        <div class="filters-title">Filtres rapides:</div>
        <div class="filters-row">
          <div class="filter-chips">
            @for (filter of quickFilters; track filter.label) {
              <button class="filter-chip" [class.active]="filter.active">
                <span class="chip-label">{{ filter.label }}</span>
                <span class="chip-count">{{ filter.count }}</span>
              </button>
            }
          </div>
          <button class="pill-action">Par pilier</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <div>
            <h3 class="table-title">Documents en cours</h3>
            <p class="table-subtitle">{{ documents.length }} documents</p>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="documents-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Objet</th>
                <th>Chez qui</th>
                <th>Statut</th>
                <th>Dernière action</th>
                <th>Retard</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documents; track doc.number) {
                <tr>
                  <td>
                    <div class="doc-number">{{ doc.number }}</div>
                  </td>
                  <td>
                    <div class="doc-title">{{ doc.object }}</div>
                    <div class="doc-meta">{{ doc.type }}</div>
                  </td>
                  <td>
                    <div class="doc-owner">{{ doc.owner }}</div>
                    <div class="doc-meta">{{ doc.ownerRole }}</div>
                  </td>
                  <td>
                    <span class="status-pill" [ngClass]="doc.statusTone">{{ doc.status }}</span>
                  </td>
                  <td>
                    <div class="doc-owner">{{ doc.lastAction }}</div>
                    <div class="doc-meta">{{ doc.lastActionNote }}</div>
                  </td>
                  <td>
                    <span class="delay-pill" [ngClass]="doc.delayTone">{{ doc.delay }}</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="icon-btn" aria-label="Voir">👁️</button>
                      <button class="icon-btn" aria-label="Rappel">⏱️</button>
                      <button class="icon-btn" aria-label="Envoyer">📨</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .page-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .page-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    .status-cards-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .filters-card {
      background: white;
      border-radius: 14px;
      padding: 14px 18px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .filters-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
    }

    .filters-row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      font-size: 12px;
      color: #1f2937;
      transition: all 0.2s ease;
    }

    .filter-chip.active {
      background: #0b3a78;
      color: white;
      border-color: #0b3a78;
      box-shadow: 0 8px 16px rgba(15, 42, 94, 0.2);
    }

    .chip-count {
      background: rgba(15, 23, 42, 0.08);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
    }

    .filter-chip.active .chip-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .pill-action {
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #f1f5f9;
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .table-card {
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      padding: 16px 18px 4px;
    }

    .table-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .table-title {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .table-subtitle {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .documents-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .documents-table th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
      padding: 12px 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    .documents-table td {
      padding: 14px 10px;
      border-bottom: 1px solid #eef2f7;
      vertical-align: top;
      font-size: 13px;
      color: #0f172a;
    }

    .doc-number {
      font-weight: 600;
      color: #0b3a78;
      font-size: 12px;
    }

    .doc-title {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .doc-owner {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .doc-meta {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .status-pill,
    .delay-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid transparent;
    }

    .status-pill.info {
      color: #1d4ed8;
      background: #e0edff;
    }

    .status-pill.warning {
      color: #b45309;
      background: #ffedd5;
    }

    .status-pill.success {
      color: #15803d;
      background: #dcfce7;
    }

    .delay-pill.danger {
      color: #b91c1c;
      background: #fee2e2;
    }

    .delay-pill.muted {
      color: #64748b;
      background: #f1f5f9;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .icon-btn:hover {
      background: #e2e8f0;
    }

    @media (max-width: 1024px) {
      .status-cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .filters-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .pill-action {
        align-self: flex-start;
      }
    }

    @media (max-width: 768px) {
      .status-cards-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 20px;
      }
    }
  `]
})
export class DashboardComponent {
  statusCards: StatusCard[] = [
    {
      title: 'À recevoir',
      count: 0,
      description: 'Documents en réception',
      color: '#1d4ed8',
      icon: '📄'
    },
    {
      title: 'À traiter',
      count: 0,
      description: 'Nécessitent votre action',
      color: '#0b3a78',
      emphasis: true,
      icon: '📝'
    },
    {
      title: 'En cours',
      count: 0,
      description: 'Documents en traitement',
      color: '#d97706',
      icon: '🔄'
    },
    {
      title: 'Terminés',
      count: 0,
      description: 'Documents archivés',
      color: '#dc2626',
      icon: '🗂️'
    }
  ];

  quickFilters = [
    { label: 'Tous', count: 15, active: true },
    { label: 'À traiter', count: 14 },
    { label: 'Destinés à moi', count: 0 },
    { label: 'Envoyés par moi', count: 2 },
    { label: 'Sans accusé réception', count: 4 },
    { label: 'En retard', count: 10 },
    { label: 'Bloqués', count: 1 },
    { label: 'Traités cette semaine', count: 0 }
  ];

  documents = [
    {
      number: 'COREF-2026-0001',
      object: 'Réforme de la TVA - Analyse d\'impact budgétaire',
      type: 'Rapport',
      owner: 'Marie Kabongo',
      ownerRole: 'Pilier',
      status: 'Document envoyé',
      statusTone: 'info',
      lastAction: '01/02/2026',
      lastActionNote: 'Il y a 9 jours',
      delay: 'En retard',
      delayTone: 'danger'
    },
    {
      number: 'COREF-2026-0002',
      object: 'Demande de congé - Personnel DRH',
      type: 'Demande_conge',
      owner: 'Direction des Ressources Humaines',
      ownerRole: 'Service',
      status: 'Traitement commencé',
      statusTone: 'warning',
      lastAction: '30/01/2026',
      lastActionNote: 'Il y a 11 jours',
      delay: 'En retard',
      delayTone: 'danger'
    },
    {
      number: 'COREF-2026-0003',
      object: 'Note de service - Budget 2026',
      type: 'Note',
      owner: 'Cabinet du Ministre',
      ownerRole: 'Service',
      status: 'En validation',
      statusTone: 'success',
      lastAction: '05/02/2026',
      lastActionNote: 'Il y a 5 jours',
      delay: '—',
      delayTone: 'muted'
    }
  ];
}
