import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface AuditLog {
  id: number;
  userEmail: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown> | null;
  ipAddress: string;
  createdAt: string;
}

interface ApiResponse {
  logs: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}

@Component({
  selector: 'app-audit-logs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-title">
          <h2 class="page-title">Journal d'Audit</h2>
          <p class="page-subtitle">{{ logs().length }} / {{ total() }} entrées</p>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Action</label>
            <select class="filter-select" [(ngModel)]="filterAction" (ngModelChange)="loadLogs()">
              <option value="">Toutes les actions</option>
              <option value="LOGIN">Connexion</option>
              <option value="CREATE_USER">Création utilisateur</option>
              <option value="UPDATE_USER">Modification utilisateur</option>
              <option value="CREATE_RECEPTION_DOCUMENT">Réception courrier</option>
              <option value="CREATE_DOCUMENT">Création document</option>
              <option value="CHIEF_DECISION">Décision du Chef</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Type d'entité</label>
            <select class="filter-select" [(ngModel)]="filterEntityType" (ngModelChange)="loadLogs()">
              <option value="">Tous les types</option>
              <option value="AUTH">Authentification</option>
              <option value="USER">Utilisateur</option>
              <option value="DOCUMENT">Document</option>
              <option value="SERVICE">Service</option>
              <option value="PILIER">Pilier</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-section">
        <table class="logs-table">
          <thead>
            <tr class="table-header">
              <th>DATE & HEURE</th>
              <th>UTILISATEUR</th>
              <th>RÔLE</th>
              <th>ACTION</th>
              <th>TYPE</th>
              <th>DÉTAILS</th>
            </tr>
          </thead>
          <tbody>
            @if (isLoading()) {
              <tr><td colspan="6" class="empty-cell">Chargement...</td></tr>
            } @else if (logs().length === 0) {
              <tr><td colspan="6" class="empty-cell">Aucune entrée trouvée</td></tr>
            } @else {
              @for (log of logs(); track log.id) {
                <tr class="table-row">
                  <td class="col-date">{{ formatDate(log.createdAt) }}</td>
                  <td class="col-user">{{ log.userEmail }}</td>
                  <td><span class="role-badge">{{ log.userRole }}</span></td>
                  <td><span class="action-badge" [ngClass]="actionClass(log.action)">{{ actionLabel(log.action) }}</span></td>
                  <td class="col-type">{{ log.entityType }}</td>
                  <td class="col-details">{{ formatDetails(log.details) }}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      @if (total() > logs().length) {
        <div class="load-more">
          <button class="btn-load-more" (click)="loadMore()">Charger plus</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      margin-bottom: 20px;
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

    .filters-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 16px;
      margin-bottom: 20px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .filter-select {
      padding: 9px 12px;
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

    .table-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .logs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .table-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      padding: 12px 14px;
      text-align: left;
      font-weight: 700;
      color: #64748b;
      font-size: 11px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .table-row {
      border-bottom: 1px solid #edf2f7;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    td {
      padding: 12px 14px;
      color: #1f2937;
      vertical-align: top;
    }

    .empty-cell {
      text-align: center;
      padding: 40px;
      color: #64748b;
    }

    .col-date {
      font-size: 12px;
      white-space: nowrap;
      color: #64748b;
    }

    .col-user {
      font-weight: 500;
    }

    .col-type {
      font-size: 12px;
      color: #64748b;
    }

    .col-details {
      font-size: 11px;
      color: #64748b;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .role-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      background: #f1f5f9;
      color: #475569;
    }

    .action-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .action-badge.login { background: #dbeafe; color: #1d4ed8; }
    .action-badge.create { background: #dcfce7; color: #15803d; }
    .action-badge.update { background: #fef3c7; color: #b45309; }
    .action-badge.decision { background: #ede9fe; color: #6d28d9; }
    .action-badge.default { background: #f1f5f9; color: #475569; }

    .load-more {
      text-align: center;
      padding: 16px;
    }

    .btn-load-more {
      padding: 10px 24px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: white;
      font-size: 13px;
      font-weight: 600;
      color: #0b3a78;
      cursor: pointer;
    }

    .btn-load-more:hover {
      background: #f1f5f9;
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AuditLogsComponent implements OnInit {
  private readonly http = inject(HttpClient);

  logs = signal<AuditLog[]>([]);
  total = signal(0);
  isLoading = signal(false);
  currentOffset = 0;

  filterAction = '';
  filterEntityType = '';

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.currentOffset = 0;
    this.isLoading.set(true);

    this.http.get<ApiResponse>(`${API_BASE_URL}/audit-logs`, { params: this.buildParams() }).subscribe({
      next: (res) => {
        this.logs.set(res.logs);
        this.total.set(res.total);
        this.currentOffset = res.logs.length;
        this.isLoading.set(false);
      },
      error: () => {
        this.logs.set([]);
        this.isLoading.set(false);
      }
    });
  }

  loadMore(): void {
    this.http.get<ApiResponse>(`${API_BASE_URL}/audit-logs`, {
      params: this.buildParams().set('offset', this.currentOffset.toString())
    }).subscribe({
      next: (res) => {
        this.logs.update(prev => [...prev, ...res.logs]);
        this.currentOffset += res.logs.length;
      }
    });
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short', timeStyle: 'short'
    }).format(new Date(value));
  }

  formatDetails(details: Record<string, unknown> | null): string {
    if (!details) return '—';
    const entries = Object.entries(details)
      .filter(([, v]) => v != null && v !== '')
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
    return entries.join(', ') || '—';
  }

  actionLabel(action: string): string {
    const labels: Record<string, string> = {
      'LOGIN': 'Connexion',
      'CREATE_USER': 'Création utilisateur',
      'UPDATE_USER': 'Modification utilisateur',
      'CREATE_RECEPTION_DOCUMENT': 'Réception courrier',
      'CREATE_DOCUMENT': 'Création document',
      'CHIEF_DECISION': 'Décision Chef',
      'CREATE_SERVICE': 'Création service',
      'UPDATE_SERVICE': 'Modification service',
      'CREATE_PILIER': 'Création pilier',
      'UPDATE_PILIER': 'Modification pilier'
    };
    return labels[action] || action;
  }

  actionClass(action: string): string {
    if (action === 'LOGIN') return 'login';
    if (action.startsWith('CREATE')) return 'create';
    if (action.startsWith('UPDATE')) return 'update';
    if (action === 'CHIEF_DECISION') return 'decision';
    return 'default';
  }

  private buildParams(): HttpParams {
    let params = new HttpParams().set('limit', '50');
    if (this.filterAction) params = params.set('action', this.filterAction);
    if (this.filterEntityType) params = params.set('entityType', this.filterEntityType);
    return params;
  }
}
