import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface BordereauItem {
  id: number;
  number: string;
  status: string;
  generatedAt: string;
  document: {
    id: number;
    number: string;
    subject: string;
  };
}

interface BordereauxResponse {
  totalCount: number;
  signedCount: number;
  unsignedCount: number;
  bordereaux: BordereauItem[];
}

@Component({
  selector: 'app-bordereaux',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Bordereaux de remise</h1>
        <p class="page-subtitle">Gérer les bordereaux et les preuves de remise</p>
      </header>

      <section class="kpis">
        <article class="kpi-card">
          <p class="kpi-value">{{ totalCount() }}</p>
          <p class="kpi-label">Bordereaux total</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-value">{{ signedCount() }}</p>
          <p class="kpi-label">Signés</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-value">{{ unsignedCount() }}</p>
          <p class="kpi-label">Non signés</p>
        </article>
      </section>

      <section class="panel" [class.empty]="bordereaux().length === 0">
        <p class="panel-title">Liste des bordereaux ({{ totalCount() }})</p>

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        @if (isLoading()) {
          <p class="empty-text">Chargement...</p>
        } @else {
          @if (bordereaux().length === 0) {
            <p class="empty-text">Aucun bordereau généré</p>
          } @else {
            @for (item of bordereaux(); track item.id) {
              <article class="row">
                <div>
                  <p class="doc-number">{{ item.number }}</p>
                  <p class="doc-subject">{{ item.document.number }} · {{ item.document.subject }}</p>
                  <p class="doc-date">Généré le {{ formatDateTime(item.generatedAt) }}</p>
                </div>
                <div class="row-actions">
                  <span class="status" [class.status-signed]="item.status === 'Signé'">{{ item.status }}</span>
                  @if (item.status !== 'Signé') {
                    <button type="button" class="sign-btn" (click)="markSigned(item.id)">Marquer signé</button>
                  }
                </div>
              </article>
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
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
      font-size: 20px;
    }

    .panel {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      overflow: hidden;
    }

    .panel-title {
      margin: 0;
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      color: #0b3a78;
      font-size: 24px;
      font-weight: 700;
    }

    .empty {
      min-height: 220px;
    }

    .empty-text {
      margin: 0;
      color: #64748b;
      font-size: 20px;
      text-align: center;
      padding-top: 70px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-top: 1px solid #f1f5f9;
    }

    .doc-number {
      margin: 0;
      color: #0b3a78;
      font-size: 17px;
      font-weight: 700;
    }

    .doc-subject,
    .doc-date {
      margin: 4px 0 0;
      color: #334155;
      font-size: 14px;
    }

    .status {
      border-radius: 999px;
      padding: 6px 10px;
      background: #fef3c7;
      color: #92400e;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }

    .status-signed {
      background: #dcfce7;
      color: #166534;
    }

    .row-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sign-btn {
      border: 0;
      border-radius: 8px;
      background: #0b3a78;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 11px;
      cursor: pointer;
    }

    .error {
      margin: 0;
      padding: 14px 16px 0;
      font-size: 14px;
      color: #b91c1c;
    }
  `]
})
export class BordereauxComponent implements OnInit {
  private readonly http = inject(HttpClient);

  isLoading = signal(false);
  errorMessage = signal('');
  totalCount = signal(0);
  signedCount = signal(0);
  unsignedCount = signal(0);
  bordereaux = signal<BordereauItem[]>([]);

  ngOnInit(): void {
    this.loadBordereaux();
  }

  formatDateTime(value: string) {
    const date = new Date(value);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  markSigned(bordereauId: number) {
    this.errorMessage.set('');

    this.http.post(`${API_BASE_URL}/reception/bordereaux/${bordereauId}/mark-signed`, {}).subscribe({
      next: () => this.loadBordereaux(),
      error: () => this.errorMessage.set('Impossible de mettre à jour le bordereau.')
    });
  }

  private loadBordereaux() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<BordereauxResponse>(`${API_BASE_URL}/reception/bordereaux`).subscribe({
      next: (response) => {
        this.totalCount.set(response.totalCount);
        this.signedCount.set(response.signedCount);
        this.unsignedCount.set(response.unsignedCount);
        this.bordereaux.set(response.bordereaux);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger les bordereaux.');
      }
    });
  }
}
