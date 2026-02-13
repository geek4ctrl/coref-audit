import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  icon: string;
  value: number;
  label: string;
  tone: 'danger' | 'warning' | 'info';
}

interface HolderDelay {
  name: string;
  count: number;
  averageDelay: number;
}

interface LateDocument {
  number: string;
  title: string;
  owner: string;
  dueDate: string;
  delay: string;
  status: 'En cours' | 'En retard' | 'Relance envoyee';
  priority: 'Haute' | 'Moyenne' | 'Basse';
}

@Component({
  selector: 'app-retards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Documents en Retard</h2>
          <p class="page-subtitle">Suivi des echeances depassees — Urgence & Performance</p>
        </div>
      </div>

      <div class="stats-grid">
        @for (card of statCards; track card.label) {
          <div class="stat-card">
            <div class="stat-icon" [class]="card.tone">
              <span>{{ card.icon }}</span>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </div>
        }
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Top 5 des detenteurs avec retards</h3>
        </div>
        <div class="holders-list">
          @for (holder of topHolders; track holder.name; let i = $index) {
            <div class="holder-row">
              <div class="holder-rank">{{ i + 1 }}</div>
              <div class="holder-details">
                <div class="holder-name">{{ holder.name }}</div>
                <div class="holder-meta">
                  {{ holder.count }} documents en retard • Moyenne : {{ holder.averageDelay }} jours
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="card table-card">
        <div class="card-header table-header">
          <h3 class="card-title">Liste des documents en retard ({{ documents.length }})</h3>
        </div>
        <div class="table-wrapper">
          <table class="documents-table">
            <thead>
              <tr>
                <th>N° / Objet</th>
                <th>Chez qui</th>
                <th>Echeance</th>
                <th>Retard</th>
                <th>Statut</th>
                <th>Priorite</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documents; track doc.number) {
                <tr>
                  <td>
                    <div class="doc-number">{{ doc.number }}</div>
                    <div class="doc-title">{{ doc.title }}</div>
                  </td>
                  <td>
                    <div class="doc-owner">{{ doc.owner }}</div>
                  </td>
                  <td>
                    <div class="doc-meta">{{ doc.dueDate }}</div>
                  </td>
                  <td>
                    <span class="delay-pill">{{ doc.delay }}</span>
                  </td>
                  <td>
                    <span class="status-pill" [ngClass]="doc.status.toLowerCase().replace(' ', '-')">{{ doc.status }}</span>
                  </td>
                  <td>
                    <span class="priority-pill" [ngClass]="doc.priority.toLowerCase()">{{ doc.priority }}</span>
                  </td>
                  <td class="actions">
                    <button class="icon-btn" aria-label="Voir">👁</button>
                    <button class="icon-btn" aria-label="Relancer">🔔</button>
                    <button class="icon-btn" aria-label="Plus">⋯</button>
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
    .page {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .page-title {
      margin: 0 0 4px 0;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }

    .page-subtitle {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .stat-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .stat-icon.danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .stat-icon.warning {
      background: #ffedd5;
      color: #f97316;
    }

    .stat-icon.info {
      background: #efe7ff;
      color: #8b5cf6;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
    }

    .card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      overflow: hidden;
    }

    .card-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0b3a78;
    }

    .holders-list {
      display: flex;
      flex-direction: column;
      padding: 8px 16px 16px;
      gap: 10px;
    }

    .holder-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 4px;
    }

    .holder-rank {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      background: #f1f5f9;
      color: #0f172a;
    }

    .holder-name {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .holder-meta {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }

    .table-card {
      padding-bottom: 6px;
    }

    .table-header {
      padding-bottom: 12px;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .documents-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }

    .documents-table th,
    .documents-table td {
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      color: #1f2937;
      border-bottom: 1px solid #eef2f7;
    }

    .documents-table thead th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      background: #f8fafc;
    }

    .doc-number {
      font-size: 10px;
      font-weight: 700;
      color: #0b3a78;
      letter-spacing: 0.06em;
    }

    .doc-title {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      margin-top: 4px;
    }

    .doc-owner {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .doc-meta {
      font-size: 12px;
      color: #64748b;
    }

    .delay-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      background: #fee2e2;
      color: #b91c1c;
      font-size: 11px;
      font-weight: 600;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #fee2e2;
      color: #b91c1c;
    }

    .status-pill.en-cours {
      background: #e2e8f0;
      color: #475569;
    }

    .status-pill.en-retard {
      background: #fee2e2;
      color: #b91c1c;
    }

    .status-pill.relance-envoyee {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .priority-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #e2e8f0;
      color: #475569;
    }

    .priority-pill.haute {
      background: #fef3c7;
      color: #b45309;
    }

    .priority-pill.moyenne {
      background: #e2e8f0;
      color: #475569;
    }

    .priority-pill.basse {
      background: #dcfce7;
      color: #15803d;
    }

    .actions {
      white-space: nowrap;
    }

    .icon-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
      cursor: pointer;
      margin-right: 6px;
    }

    .icon-btn:last-child {
      margin-right: 0;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RetardsComponent {
  statCards: StatCard[] = [
    { icon: '⚠', value: 13, label: 'Documents en retard', tone: 'danger' },
    { icon: '⏰', value: 7, label: 'Jours de retard moyen', tone: 'warning' },
    { icon: '↘', value: 5, label: 'Max chez Marie', tone: 'info' }
  ];

  topHolders: HolderDelay[] = [
    { name: 'Marie Kabongo', count: 5, averageDelay: 8 },
    { name: 'Direction des Ressources Humaines', count: 3, averageDelay: 7 },
    { name: 'Jean Mukendi', count: 2, averageDelay: 8 },
    { name: 'Service Logistique', count: 2, averageDelay: 2 },
    { name: 'Service Juridique', count: 1, averageDelay: 13 }
  ];

  documents: LateDocument[] = [
    {
      number: 'COREF-2025-0086',
      title: 'Demande de ventilation budgetaire',
      owner: 'Marie Kabongo',
      dueDate: '09 Jan 2026',
      delay: '8 jours',
      status: 'En retard',
      priority: 'Haute'
    },
    {
      number: 'COREF-2025-0082',
      title: 'Rapport d audit Q4',
      owner: 'Direction des Ressources Humaines',
      dueDate: '11 Jan 2026',
      delay: '7 jours',
      status: 'Relance envoyee',
      priority: 'Moyenne'
    },
    {
      number: 'COREF-2025-0078',
      title: 'Note de service - Archivage',
      owner: 'Jean Mukendi',
      dueDate: '10 Jan 2026',
      delay: '8 jours',
      status: 'En retard',
      priority: 'Moyenne'
    },
    {
      number: 'COREF-2025-0069',
      title: 'Contrat de prestation',
      owner: 'Service Logistique',
      dueDate: '16 Jan 2026',
      delay: '2 jours',
      status: 'En cours',
      priority: 'Basse'
    },
    {
      number: 'COREF-2025-0064',
      title: 'Avis juridique - Convention',
      owner: 'Service Juridique',
      dueDate: '05 Jan 2026',
      delay: '13 jours',
      status: 'En retard',
      priority: 'Haute'
    }
  ];
}
