import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface RelancesResponse {
  cards: { total: number; overdue: number; critical: number; warning: number };
  documents: {
    id: number; number: string; subject: string; owner: string;
    deadline: string; daysRemaining: number; priority: string;
    status: string; urgency: string;
  }[];
}

@Component({
  selector: 'app-relances',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Relances</h2>
        <p class="page-subtitle">Suivi et gestion des relances de documents</p>
      </div>

      @if (isLoading) {
        <div class="loading-card">Chargement des données...</div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon info"><span>📋</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.total }}</div>
              <div class="stat-label">Total avec échéance</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon danger"><span>🔴</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.overdue }}</div>
              <div class="stat-label">En retard</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon warning"><span>🟠</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.critical }}</div>
              <div class="stat-label">Critique (≤ 2 jours)</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon caution"><span>🟡</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.warning }}</div>
              <div class="stat-label">Attention (≤ 5 jours)</div>
            </div>
          </div>
        </div>

        <div class="card table-card">
          <div class="card-header">
            <h3 class="card-title">Documents à suivre ({{ documents.length }})</h3>
          </div>
          <div class="table-wrapper">
            <table class="documents-table">
              <thead>
                <tr>
                  <th>N° / Objet</th>
                  <th>Chez qui</th>
                  <th>Échéance</th>
                  <th>Jours restants</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                @for (doc of documents; track doc.id) {
                  <tr [class.urgent-row]="doc.urgency === 'overdue'">
                    <td>
                      <div class="doc-number">{{ doc.number }}</div>
                      <div class="doc-title">{{ doc.subject }}</div>
                    </td>
                    <td><div class="doc-owner">{{ doc.owner }}</div></td>
                    <td><div class="doc-meta">{{ doc.deadline }}</div></td>
                    <td>
                      <span class="urgency-pill" [ngClass]="doc.urgency">
                        @if (doc.daysRemaining < 0) {
                          {{ doc.daysRemaining * -1 }}j en retard
                        } @else {
                          {{ doc.daysRemaining }}j restants
                        }
                      </span>
                    </td>
                    <td><span class="priority-pill" [ngClass]="doc.priority.toLowerCase()">{{ doc.priority }}</span></td>
                    <td><span class="status-pill">{{ doc.status }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
            @if (!documents.length) {
              <div class="empty-state">Aucun document avec échéance active.</div>
            }
          </div>
        </div>
      }
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

    .page-header { margin-top: 4px; }

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
      grid-template-columns: repeat(4, minmax(0, 1fr));
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
      width: 40px; height: 40px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }

    .stat-icon.info { background: #dbeafe; color: #1d4ed8; }
    .stat-icon.danger { background: #fee2e2; color: #dc2626; }
    .stat-icon.warning { background: #ffedd5; color: #f97316; }
    .stat-icon.caution { background: #fef9c3; color: #ca8a04; }

    .stat-value {
      font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.1;
    }

    .stat-label { font-size: 12px; color: #64748b; }

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
      margin: 0; font-size: 14px; font-weight: 700; color: #0b3a78;
    }

    .table-wrapper { width: 100%; overflow-x: auto; }

    .documents-table {
      width: 100%; border-collapse: collapse; min-width: 900px;
    }

    .documents-table th, .documents-table td {
      padding: 14px 16px; text-align: left; font-size: 12px; color: #1f2937;
      border-bottom: 1px solid #eef2f7;
    }

    .documents-table thead th {
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
      color: #64748b; background: #f8fafc;
    }

    .doc-number { font-size: 10px; font-weight: 700; color: #0b3a78; letter-spacing: 0.06em; }
    .doc-title { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    .doc-owner { font-size: 13px; font-weight: 600; color: #0f172a; }
    .doc-meta { font-size: 12px; color: #64748b; }

    .urgency-pill {
      display: inline-flex; align-items: center; padding: 4px 10px;
      border-radius: 999px; font-size: 11px; font-weight: 600;
    }

    .urgency-pill.overdue { background: #fee2e2; color: #b91c1c; }
    .urgency-pill.critical { background: #ffedd5; color: #c2410c; }
    .urgency-pill.warning { background: #fef9c3; color: #a16207; }
    .urgency-pill.normal { background: #dcfce7; color: #15803d; }

    .priority-pill {
      display: inline-flex; align-items: center; padding: 4px 10px;
      border-radius: 999px; font-size: 11px; font-weight: 600;
      background: #e2e8f0; color: #475569;
    }

    .priority-pill.urgente { background: #fee2e2; color: #b91c1c; }
    .priority-pill.haute { background: #fef3c7; color: #b45309; }
    .priority-pill.normale { background: #e2e8f0; color: #475569; }
    .priority-pill.basse { background: #dcfce7; color: #15803d; }

    .status-pill {
      display: inline-flex; align-items: center; padding: 4px 10px;
      border-radius: 999px; font-size: 11px; font-weight: 600;
      background: #e2e8f0; color: #475569;
    }

    .urgent-row {
      background: #fef2f2 !important;
      border-left: 3px solid #ef4444;
    }

    .empty-state, .loading-card {
      padding: 32px; text-align: center; font-size: 13px; color: #64748b;
      background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb;
    }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RelancesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  isLoading = true;
  cards = { total: 0, overdue: 0, critical: 0, warning: 0 };
  documents: RelancesResponse['documents'] = [];

  ngOnInit(): void {
    this.http.get<RelancesResponse>(`${API_BASE_URL}/relances`).subscribe({
      next: (data) => {
        this.cards = data.cards;
        this.documents = data.documents;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
