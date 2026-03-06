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
  selector: 'app-envoyes-au-chef',
  imports: [CommonModule],
  template: `
    <div class="screen">
      <div class="heading">
        <h2>Envoyés au Chef</h2>
        <p>Suivi des documents transmis au Chef/SG</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Envoyés aujourd'hui</div>
          <div class="kpi-value blue">{{ sentToday }}</div>
          <div class="kpi-icon blue">✈</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Toujours en attente</div>
          <div class="kpi-value orange">{{ waitingCount }}</div>
          <div class="kpi-icon amber">▣</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Passés en traitement</div>
          <div class="kpi-value green">{{ processedCount }}</div>
          <div class="kpi-icon green">▤</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Documents envoyés ({{ sentDocuments.length }})</div>

        @if (sentDocuments.length) {
          <div class="list">
            @for (doc of sentDocuments; track doc.id) {
              <div class="list-row">
                <div>
                  <div class="doc-number">{{ doc.number }}</div>
                  <div class="doc-subject">{{ doc.object }}</div>
                </div>
                <div class="doc-meta">{{ formatDateTime(doc.lastActionAt) }}</div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-icon">✈</div>
            <div class="empty-title">Aucun document envoyé au Chef</div>
            <div class="empty-note">Les documents transférés apparaîtront ici</div>
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

    .heading h2 {
      margin: 0;
      color: #0b2f5c;
      font-size: 12px;
      line-height: 1.1;
      letter-spacing: -0.01em;
    }

    .heading p {
      margin: 6px 0 0;
      color: #475569;
      font-size: 11px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

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
    .kpi-value.blue { color: #2563eb; }
    .kpi-value.orange { color: #ea580c; }
    .kpi-value.green { color: #16a34a; }

    .kpi-icon {
      position: absolute;
      right: 18px;
      top: 18px;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .kpi-icon.blue { background: #dbeafe; color: #2563eb; }
    .kpi-icon.amber { background: #ffedd5; color: #ea580c; }
    .kpi-icon.green { background: #dcfce7; color: #16a34a; }

    .panel {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      min-height: 270px;
    }

    .panel-title {
      padding: 18px 20px;
      font-size: 12px;
      color: #0b2f5c;
      font-weight: 700;
      border-bottom: 1px solid #e2e8f0;
      background: #fff;
    }

    .list { display: flex; flex-direction: column; }

    .list-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .list-row:last-child { border-bottom: none; }

    .doc-number { font-size: 11px; color: #64748b; letter-spacing: 0.04em; text-transform: uppercase; }
    .doc-subject { margin-top: 4px; color: #0f172a; font-size: 12px; font-weight: 600; }
    .doc-meta { color: #475569; font-size: 11px; white-space: nowrap; }

    .empty-state {
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 6px;
      color: #94a3b8;
      padding: 20px;
    }

    .empty-icon {
      font-size: 12px;
      line-height: 1;
      color: #cbd5e1;
      margin-bottom: 6px;
    }

    .empty-title {
      color: #475569;
      font-size: 12px;
      font-weight: 600;
    }

    .empty-note {
      color: #94a3b8;
      font-size: 11px;
    }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .heading h2 { font-size: 12px; }
      .panel-title { font-size: 12px; }
      .empty-title { font-size: 12px; }
      .empty-note { font-size: 11px; }
    }
  `]
})
export class EnvoyesAuChefComponent implements OnInit {
  private readonly http = inject(HttpClient);

  sentToday = 0;
  waitingCount = 0;
  processedCount = 0;
  sentDocuments: AssistantDashboardDocument[] = [];

  ngOnInit(): void {
    this.http.get<AssistantDashboardResponse>(`${API_BASE_URL}/assistant/dashboard`).subscribe({
      next: (response) => {
        const documents = response.documents || [];

        this.sentDocuments = documents.filter((item) => item.status === 'Envoyé au Chef');
        this.waitingCount = this.sentDocuments.length;
        this.processedCount = documents.filter((item) => item.status === 'Terminé').length;

        const today = new Date();
        this.sentToday = this.sentDocuments.filter((item) => {
          const date = new Date(item.lastActionAt);
          return (
            !Number.isNaN(date.getTime()) &&
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          );
        }).length;
      },
      error: () => {
        this.sentToday = 0;
        this.waitingCount = 0;
        this.processedCount = 0;
        this.sentDocuments = [];
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
