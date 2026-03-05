import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface DistributionDocument {
  id: number;
  number: string;
  subject: string;
  status: string;
  createdAt: string;
  deliveredAt: string | null;
  hasBordereau: boolean;
  bordereauNumber: string | null;
}

interface DistributionOverviewResponse {
  toDistributeCount: number;
  distributedTodayCount: number;
  toDistribute: DistributionDocument[];
  distributedToday: DistributionDocument[];
}

@Component({
  selector: 'app-distributions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Distributions</h1>
        <p class="page-subtitle">Gérer les courriers à distribuer et les bordereaux</p>
      </header>

      <section class="kpis">
        <article class="kpi-card">
          <p class="kpi-value">{{ toDistributeCount() }}</p>
          <p class="kpi-label">À distribuer</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-value">{{ distributedTodayCount() }}</p>
          <p class="kpi-label">Distribués aujourd'hui</p>
        </article>
      </section>

      <section class="panel">
        <div class="tabs">
          <button type="button" class="tab" [class.active]="activeTab() === 'todo'" (click)="activeTab.set('todo')">
            À distribuer
          </button>
          <button type="button" class="tab" [class.active]="activeTab() === 'done'" (click)="activeTab.set('done')">
            Distribués aujourd'hui
          </button>
        </div>

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        @if (isLoading()) {
          <p class="empty-text">Chargement...</p>
        } @else {
          @if (activeTab() === 'todo') {
            @if (toDistribute().length === 0) {
              <p class="empty-text">Aucun courrier à distribuer.</p>
            } @else {
              @for (doc of toDistribute(); track doc.id) {
                <article class="row">
                  <div>
                    <p class="doc-number">{{ doc.number }}</p>
                    <p class="doc-title">{{ doc.subject }}</p>
                    <p class="doc-meta">Statut: {{ doc.status }}</p>
                  </div>
                  <div class="actions">
                    <button type="button" class="secondary-btn" (click)="markDelivered(doc.id)">Marquer remis</button>
                    <button
                      type="button"
                      class="send-btn"
                      [disabled]="doc.hasBordereau"
                      (click)="generateBordereau(doc.id)"
                    >
                      {{ doc.hasBordereau ? 'Bordereau généré' : 'Générer bordereau' }}
                    </button>
                  </div>
                </article>
              }
            }
          } @else {
            @if (distributedToday().length === 0) {
              <p class="empty-text">Aucun courrier remis aujourd'hui.</p>
            } @else {
              @for (doc of distributedToday(); track doc.id) {
                <article class="row">
                  <div>
                    <p class="doc-number">{{ doc.number }}</p>
                    <p class="doc-title">{{ doc.subject }}</p>
                    <p class="doc-meta">Remis à {{ formatDateTime(doc.deliveredAt || doc.createdAt) }}</p>
                  </div>
                  <p class="status-done">Remis</p>
                </article>
              }
            }
          }
        }
      </section>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .page-title {
      margin: 0;
      color: #0b3a78;
      font-size: 38px;
      font-weight: 800;
    }

    .page-subtitle {
      margin: 4px 0 0;
      color: #475569;
      font-size: 22px;
    }

    .kpis {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .kpi-card {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      padding: 18px;
    }

    .kpi-value {
      margin: 0;
      color: #0b3a78;
      font-size: 44px;
      font-weight: 800;
      line-height: 1;
    }

    .kpi-label {
      margin: 8px 0 0;
      color: #334155;
      font-size: 22px;
    }

    .panel {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      overflow: hidden;
    }

    .tabs {
      display: flex;
      gap: 20px;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 16px 0;
    }

    .tab {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: #475569;
      font-size: 20px;
      padding: 0 0 10px;
      border-bottom: 2px solid transparent;
    }

    .tab.active {
      color: #0b3a78;
      border-bottom-color: #0b3a78;
      font-weight: 700;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
    }

    .doc-number {
      margin: 0;
      color: #0b3a78;
      font-size: 18px;
      font-weight: 700;
    }

    .doc-title {
      margin: 4px 0 0;
      color: #0f172a;
      font-size: 16px;
    }

    .doc-meta {
      margin: 4px 0 0;
      color: #475569;
      font-size: 14px;
    }

    .actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .secondary-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #fff;
      color: #0f172a;
      font-size: 14px;
      font-weight: 700;
      padding: 9px 14px;
      cursor: pointer;
    }

    .send-btn {
      border: 0;
      border-radius: 8px;
      background: #0b3a78;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 9px 14px;
      cursor: pointer;
    }

    .send-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status-done {
      margin: 0;
      color: #047857;
      font-size: 14px;
      font-weight: 700;
    }

    .empty-text,
    .error {
      margin: 0;
      padding: 16px;
      font-size: 15px;
      color: #64748b;
    }

    .error {
      color: #b91c1c;
    }
  `]
})
export class DistributionsComponent implements OnInit {
  private readonly http = inject(HttpClient);

  activeTab = signal<'todo' | 'done'>('todo');
  isLoading = signal(false);
  errorMessage = signal('');

  toDistributeCount = signal(0);
  distributedTodayCount = signal(0);
  toDistribute = signal<DistributionDocument[]>([]);
  distributedToday = signal<DistributionDocument[]>([]);

  ngOnInit(): void {
    this.loadOverview();
  }

  markDelivered(documentId: number) {
    this.errorMessage.set('');
    this.http.post(`${API_BASE_URL}/reception/distributions/${documentId}/mark-delivered`, {}).subscribe({
      next: () => this.loadOverview(),
      error: () => this.errorMessage.set('Impossible de marquer ce courrier comme remis.')
    });
  }

  generateBordereau(documentId: number) {
    this.errorMessage.set('');
    this.http.post(`${API_BASE_URL}/reception/distributions/${documentId}/generate-bordereau`, {}).subscribe({
      next: () => this.loadOverview(),
      error: () => this.errorMessage.set('Impossible de générer le bordereau.')
    });
  }

  formatDateTime(value: string) {
    const date = new Date(value);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  private loadOverview() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<DistributionOverviewResponse>(`${API_BASE_URL}/reception/distributions/overview`).subscribe({
      next: (response) => {
        this.toDistributeCount.set(response.toDistributeCount);
        this.distributedTodayCount.set(response.distributedTodayCount);
        this.toDistribute.set(response.toDistribute);
        this.distributedToday.set(response.distributedToday);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger les distributions.');
      }
    });
  }
}
