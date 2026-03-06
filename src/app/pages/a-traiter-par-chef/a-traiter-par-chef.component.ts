import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { API_BASE_URL } from '../../auth/auth.service';

interface AssistantDashboardDocument {
  id: number;
  number: string;
  object: string;
  status: string;
  lastActionAt: string;
}

interface AssistantDashboardResponse {
  documents: AssistantDashboardDocument[];
}

@Component({
  selector: 'app-a-traiter-par-chef',
  imports: [CommonModule],
  template: `
    <div class="screen">
      <div class="heading">
        <h2>À traiter par Chef</h2>
        <p>Suivi des documents en attente de traitement par le Chef/SG</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">En attente Chef</div>
          <div class="kpi-value orange">{{ pendingByChief }}</div>
          <div class="kpi-icon amber">◷</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Traités par Chef</div>
          <div class="kpi-value green">{{ processedByChief }}</div>
          <div class="kpi-icon green">✓</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">En retard</div>
          <div class="kpi-value red">{{ delayedCount }}</div>
          <div class="kpi-icon red">!</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Dossiers en attente Chef ({{ pendingRows.length }})</div>

        @if (pendingRows.length) {
          <div class="list">
            @for (doc of pendingRows; track doc.id) {
              <div class="list-row">
                <div>
                  <div class="doc-number">{{ doc.number }}</div>
                  <div class="doc-subject">{{ doc.object }}</div>
                </div>
                <div class="doc-meta">Envoyé le {{ formatDateTime(doc.lastActionAt) }}</div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-icon">◷</div>
            <div class="empty-title">Aucun document en attente Chef</div>
            <div class="empty-note">Les documents transférés au Chef apparaîtront ici</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .screen,
    .screen * {
      font-size: 11px !important;
    }

    .screen { display: flex; flex-direction: column; gap: 18px; }
    .heading h2 { margin: 0; color: #0b2f5c; font-size: 12px; line-height: 1.1; }
    .heading p { margin: 6px 0 0; color: #475569; font-size: 11px; }

    .kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .kpi-card {
      position: relative;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 20px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    }
    .kpi-label { color: #475569; font-size: 11px; margin-bottom: 8px; }
    .kpi-value { font-size: 12px; font-weight: 800; line-height: 1; }
    .kpi-value.orange { color: #ea580c; }
    .kpi-value.green { color: #16a34a; }
    .kpi-value.red { color: #dc2626; }
    .kpi-icon {
      position: absolute;
      right: 18px;
      top: 18px;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .kpi-icon.amber { background: #ffedd5; color: #ea580c; }
    .kpi-icon.green { background: #dcfce7; color: #16a34a; }
    .kpi-icon.red { background: #fee2e2; color: #dc2626; }

    .panel {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      min-height: 260px;
    }
    .panel-title {
      padding: 16px 20px;
      font-size: 12px;
      color: #0b2f5c;
      font-weight: 700;
      border-bottom: 1px solid #e2e8f0;
    }
    .list { display: flex; flex-direction: column; }
    .list-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
    }
    .list-row:last-child { border-bottom: none; }
    .doc-number { font-size: 11px; color: #64748b; letter-spacing: 0.04em; text-transform: uppercase; }
    .doc-subject { margin-top: 4px; color: #0f172a; font-size: 12px; font-weight: 600; }
    .doc-meta { color: #475569; font-size: 11px; white-space: nowrap; }

    .empty-state {
      min-height: 190px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 4px;
      padding: 20px;
    }
    .empty-icon { font-size: 12px; color: #cbd5e1; }
    .empty-title { color: #475569; font-size: 12px; font-weight: 600; }
    .empty-note { color: #94a3b8; font-size: 11px; }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .heading h2 { font-size: 12px; }
      .panel-title { font-size: 12px; }
    }
  `]
})
export class ATraiterParChefComponent implements OnInit {
  private readonly http = inject(HttpClient);

  pendingByChief = 0;
  processedByChief = 0;
  delayedCount = 0;
  pendingRows: AssistantDashboardDocument[] = [];

  ngOnInit(): void {
    this.http.get<AssistantDashboardResponse>(`${API_BASE_URL}/assistant/dashboard`).subscribe({
      next: (response) => {
        const documents = response.documents || [];

        this.pendingRows = documents.filter((item) => item.status === 'Envoyé au Chef');
        this.pendingByChief = this.pendingRows.length;
        this.processedByChief = documents.filter((item) => item.status === 'Terminé').length;
        this.delayedCount = this.pendingRows.filter((item) => {
          const date = new Date(item.lastActionAt);
          if (Number.isNaN(date.getTime())) {
            return false;
          }
          return Date.now() - date.getTime() > 3 * 24 * 60 * 60 * 1000;
        }).length;
      },
      error: () => {
        this.pendingRows = [];
        this.pendingByChief = 0;
        this.processedByChief = 0;
        this.delayedCount = 0;
      }
    });
  }

  formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
