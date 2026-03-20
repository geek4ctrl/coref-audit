import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';
import { finalize } from 'rxjs/operators';

interface RetardsResponse {
  cards: { totalLate: number; avgDelay: number; maxHolderName: string; maxHolderCount: number };
  topHolders: { name: string; count: number; averageDelay: number }[];
  documents: {
    id: number; number: string; subject: string; owner: string;
    dueDate: string; delayDays: number; priority: string; status: string;
  }[];
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
          <p class="page-subtitle">Suivi des échéances dépassées — Urgence & Performance</p>
        </div>
      </div>

      @if (isLoading) {
        <div class="loading-card">Chargement des données...</div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon danger"><span>⚠</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.totalLate }}</div>
              <div class="stat-label">Documents en retard</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon warning"><span>⏰</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.avgDelay }}</div>
              <div class="stat-label">Jours de retard moyen</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon info"><span>↘</span></div>
            <div class="stat-info">
              <div class="stat-value">{{ cards.maxHolderCount }}</div>
              <div class="stat-label">Max chez {{ cards.maxHolderName }}</div>
            </div>
          </div>
        </div>

        @if (topHolders.length) {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Top {{ topHolders.length }} des détenteurs avec retards</h3>
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
        }

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
                  <th>Échéance</th>
                  <th>Retard</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                </tr>
              </thead>
              <tbody>
                @for (doc of documents; track doc.number) {
                  <tr>
                    <td>
                      <div class="doc-number">{{ doc.number }}</div>
                      <div class="doc-title">{{ doc.subject }}</div>
                    </td>
                    <td><div class="doc-owner">{{ doc.owner }}</div></td>
                    <td><div class="doc-meta">{{ doc.dueDate }}</div></td>
                    <td><span class="delay-pill">{{ doc.delayDays }} jours</span></td>
                    <td><span class="status-pill">{{ doc.status }}</span></td>
                    <td><span class="priority-pill" [ngClass]="doc.priority.toLowerCase()">{{ doc.priority }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
            @if (!documents.length) {
              <div class="empty-state">Aucun document en retard.</div>
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

    .priority-pill.urgente {
      background: #fee2e2;
      color: #b91c1c;
    }

    .priority-pill.haute {
      background: #fef3c7;
      color: #b45309;
    }

    .priority-pill.moyenne, .priority-pill.normale {
      background: #e2e8f0;
      color: #475569;
    }

    .priority-pill.basse {
      background: #dcfce7;
      color: #15803d;
    }

    .empty-state, .loading-card {
      padding: 32px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
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
export class RetardsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  isLoading = true;
  cards = { totalLate: 0, avgDelay: 0, maxHolderName: '—', maxHolderCount: 0 };
  topHolders: { name: string; count: number; averageDelay: number }[] = [];
  documents: { id: number; number: string; subject: string; owner: string; dueDate: string; delayDays: number; priority: string; status: string }[] = [];

  ngOnInit(): void {
    this.http.get<RetardsResponse>(`${API_BASE_URL}/retards`)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (data) => {
          this.cards = data.cards;
          this.topHolders = data.topHolders;
          this.documents = data.documents;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cdr.markForCheck();
        }
      });
  }
}
