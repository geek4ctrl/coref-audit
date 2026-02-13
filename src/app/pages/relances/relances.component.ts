import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface RelanceDocument {
  number: string;
  title: string;
  owner: string;
  status: string;
  statusColor: 'danger' | 'info' | 'warning';
  lastActionDate: string;
  lastActionTime: string;
  inactiveDays: number;
  relanceCount: number;
}

@Component({
  selector: 'app-relances',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Relances</h2>
        <p class="page-subtitle">Documents nécessitant votre attention — "Qui n'a pas répondu ?"</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon bell">🔔</div>
          <div class="stat-content">
            <div class="stat-number">11</div>
            <div class="stat-label">À relancer</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blocked">⚠️</div>
          <div class="stat-content">
            <div class="stat-number">1</div>
            <div class="stat-label">Bloqués</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon delayed">⏱️</div>
          <div class="stat-content">
            <div class="stat-number">10</div>
            <div class="stat-label">En retard</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon multiple">👥</div>
          <div class="stat-content">
            <div class="stat-number">0</div>
            <div class="stat-label">≥2 relances</div>
          </div>
        </div>
      </div>

      <div class="info-box">
        <span class="info-icon">⚠️</span>
        <div class="info-content">
          <strong>Critères de détection automatique :</strong>
          <ul class="criteria-list">
            <li>Statut ENVOYÉ mais pas encore REÇU après 48h</li>
            <li>Statut EN_TRAITEMENT sans activité depuis 3 jours</li>
            <li>Statut BLOQUÉ (quelle que soit la durée)</li>
          </ul>
        </div>
      </div>

      <div class="documents-section">
        <h3 class="section-title">Documents nécessitant une relance (11)</h3>

        <div class="table-container">
          <table class="relances-table">
            <thead>
              <tr class="table-header">
                <th class="col-number">N° / OBJET</th>
                <th class="col-owner">CHEZ QUI</th>
                <th class="col-status">STATUT</th>
                <th class="col-action">DERNIÈRE ACTION</th>
                <th class="col-inactive">INACTIVITÉ</th>
                <th class="col-relance">RELANCES</th>
                <th class="col-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documents(); track doc.number) {
                <tr class="table-row">
                  <td class="col-number">
                    <div class="doc-info">
                      <span class="doc-number">{{ doc.number }}</span>
                      <span class="doc-title">{{ doc.title }}</span>
                    </div>
                  </td>
                  <td class="col-owner">
                    <span class="owner-name">{{ doc.owner }}</span>
                  </td>
                  <td class="col-status">
                    <span class="status-badge" [class]="doc.statusColor">
                      {{ doc.status }}
                      <span class="status-icon">⚠️</span>
                    </span>
                  </td>
                  <td class="col-action">
                    <div class="action-info">
                      <span class="action-date">{{ doc.lastActionDate }}</span>
                      <span class="action-time">{{ doc.lastActionTime }}</span>
                    </div>
                  </td>
                  <td class="col-inactive">
                    @if (doc.inactiveDays > 0) {
                      <span class="inactive-days">{{ doc.inactiveDays }} jours</span>
                    } @else {
                      <span class="inactive-none">—</span>
                    }
                  </td>
                  <td class="col-relance">
                    <span class="relance-count">{{ doc.relanceCount }}</span>
                  </td>
                  <td class="col-actions">
                    <div class="action-buttons">
                      <button class="icon-btn" title="Relancer">🔔</button>
                      <button class="icon-btn" title="Voir">👁</button>
                      <button class="icon-btn" title="Assigner">👤</button>
                      <button class="icon-btn" title="Détails">⊞</button>
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
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      margin-bottom: 24px;
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-icon.bell {
      background: #fff4e6;
    }

    .stat-icon.blocked {
      background: #fee2e2;
    }

    .stat-icon.delayed {
      background: #fff4e6;
    }

    .stat-icon.multiple {
      background: #f3e8ff;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
    }

    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .info-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
    }

    .info-content strong {
      display: block;
      color: #1e40af;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .criteria-list {
      margin: 0;
      padding-left: 20px;
      color: #1e40af;
      font-size: 12px;
    }

    .criteria-list li {
      margin-bottom: 4px;
    }

    .criteria-list li:last-child {
      margin-bottom: 0;
    }

    .documents-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .section-title {
      margin: 0;
      padding: 16px 20px;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-container {
      overflow-x: auto;
    }

    .relances-table {
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
    }

    .table-row:hover {
      background-color: #f8fafc;
    }

    td {
      padding: 14px 16px;
    }

    .doc-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .doc-number {
      font-weight: 700;
      color: #0b3a78;
      font-size: 12px;
    }

    .doc-title {
      color: #0f172a;
      font-size: 13px;
    }

    .owner-name {
      color: #1f2937;
      font-weight: 500;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .status-badge.danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    .status-badge.info {
      background: #e0edff;
      color: #1d4ed8;
    }

    .status-badge.warning {
      background: #ffedd5;
      color: #b45309;
    }

    .status-icon {
      font-size: 10px;
    }

    .action-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .action-date {
      color: #0f172a;
      font-weight: 500;
    }

    .action-time {
      color: #64748b;
      font-size: 11px;
    }

    .inactive-days {
      color: #b91c1c;
      font-weight: 600;
    }

    .inactive-none {
      color: #94a3b8;
    }

    .relance-count {
      color: #1f2937;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px 6px;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .icon-btn:hover {
      background: #f1f5f9;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .relances-table {
        font-size: 12px;
      }

      th,
      td {
        padding: 10px 12px;
      }
    }
  `]
})
export class RelancesComponent {
  documents = signal<RelanceDocument[]>([
    {
      number: 'COREF-2026-0005',
      title: 'Dossier incomplet - Demande de subvention',
      owner: 'Service Juridique',
      status: 'Document bloqué',
      statusColor: 'danger',
      lastActionDate: '24/01/2026',
      lastActionTime: '14:00',
      inactiveDays: 19,
      relanceCount: 1
    },
    {
      number: 'COREF-2026-0015',
      title: "Courrier d'arrivée - Demande d'audience Ministre",
      owner: 'Direction des Ressources Humaines',
      status: 'Document envoyé',
      statusColor: 'info',
      lastActionDate: '02/02/2026',
      lastActionTime: '09:30',
      inactiveDays: 11,
      relanceCount: 0
    },
    {
      number: 'COREF-2026-0017',
      title: "Rapport d'audit interne - Janvier 2026",
      owner: 'Marie Kabongo',
      status: 'Document envoyé',
      statusColor: 'info',
      lastActionDate: '01/02/2026',
      lastActionTime: '11:00',
      inactiveDays: 12,
      relanceCount: 0
    },
    {
      number: 'COREF-2026-0014',
      title: 'Note de service - Mise à jour procédures',
      owner: 'Jean Mukendi',
      status: 'Traitement commencé',
      statusColor: 'warning',
      lastActionDate: '01/02/2026',
      lastActionTime: '08:15',
      inactiveDays: 0,
      relanceCount: 0
    }
  ]);
}
