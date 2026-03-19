import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../auth/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

interface AssistantDashboardDocument {
  id: number;
  number: string;
  object: string;
  type: string;
  status: string;
  priority?: string;
  lastActionAt: string;
}

interface AssistantDashboardResponse {
  documents: AssistantDashboardDocument[];
  cards?: {
    toProcess?: number;
    inProgress?: number;
    done?: number;
  };
}

@Component({
  selector: 'app-a-classer-annoter',
  imports: [CommonModule],
  template: `
    <div class="screen">
      <div class="heading">
        <h2>À classer / Annoter</h2>
        <p>Documents reçus de la Réception à préparer avant envoi au Chef</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Nouveaux (non ouverts)</div>
          <div class="kpi-value blue">{{ newCount }}</div>
          <div class="kpi-icon blue">◻</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">À classer (ouverts)</div>
          <div class="kpi-value orange">{{ openCount }}</div>
          <div class="kpi-icon amber">◈</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Prêts à envoyer</div>
          <div class="kpi-value green">{{ readyCount }}</div>
          <div class="kpi-icon green">✈</div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-title">Documents à traiter ({{ rows.length }})</div>

        <div class="table-scroll">
          <table class="grid">
          <thead>
            <tr>
              <th>N°</th>
              <th>OBJET</th>
              <th>TYPE</th>
              <th>PRIORITÉ</th>
              <th>DATE RÉCEPTION</th>
              <th>ÉTAT</th>
              <th class="actions-header">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.id) {
              <tr>
                <td class="number">{{ row.number }}</td>
                <td class="subject">{{ row.object }}</td>
                <td>{{ row.type }}</td>
                <td>
                  <span class="pill neutral">{{ row.priorityLabel }}</span>
                </td>
                <td>{{ row.receivedAtLabel }}</td>
                <td>
                  <span [class]="'pill state ' + row.stateTone">{{ row.stateLabel }}</span>
                </td>
                <td>
                  <div class="actions">
                    <button class="icon open" (click)="markOpen(row.id)" [disabled]="isPending(row.id)" aria-label="Ouvrir">👁</button>
                    <button class="icon priority" (click)="markPriority(row.id)" [disabled]="isPending(row.id)" aria-label="Priorité">🏷</button>
                    <button class="icon share" (click)="sendToChief(row.id)" [disabled]="isPending(row.id)" aria-label="Partager">⤴</button>
                    <button class="icon send" (click)="markDone(row.id)" [disabled]="isPending(row.id)" aria-label="Envoyer">✈</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
          </table>
        </div>

        @if (!rows.length && !isLoading) {
          <div class="empty">Aucun document à traiter.</div>
        }
      </div>

      <div class="recent-card">
        <div class="recent-header">
          <div class="recent-title">Derniers documents reçus</div>
          <button type="button" class="recent-link" (click)="goToSearch()">Voir tout →</button>
        </div>
        @if (recentDocuments.length) {
          @for (doc of recentDocuments; track doc.id) {
            <div class="recent-row">
              <div>
                <div class="recent-number">{{ doc.number }}</div>
                <div class="recent-subject">{{ doc.object }}</div>
                <div class="recent-meta">Reçu: {{ doc.receivedAtLabel }}</div>
              </div>
              <span class="pill neutral">{{ doc.priorityLabel }}</span>
            </div>
          }
        } @else {
          <div class="empty">Aucun document reçu.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .screen,
    .screen * {
      font-size: 11px !important;
    }

    .screen {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .heading h2 {
      margin: 0;
      font-size: 12px;
      line-height: 1.1;
      color: #0b2f5c;
      letter-spacing: -0.02em;
    }

    .heading p {
      margin: 6px 0 0;
      color: #475569;
      font-size: 11px;
    }

    .kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .kpi-card {
      position: relative;
      background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 20px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
    }

    .kpi-label { color: #475569; font-size: 11px; margin-bottom: 8px; }
    .kpi-value { font-size: 12px; font-weight: 800; line-height: 1; }
    .kpi-value.blue { color: #2563eb; }
    .kpi-value.orange { color: #d97706; }
    .kpi-value.green { color: #16a34a; }
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
      color: #1e293b;
    }
    .kpi-icon.blue { background: #dbeafe; color: #2563eb; }
    .kpi-icon.amber { background: #fef3c7; color: #d97706; }
    .kpi-icon.green { background: #dcfce7; color: #16a34a; }

    .table-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }

    .table-title {
      padding: 18px 20px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
      font-weight: 700;
      color: #0b2f5c;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }

    .table-scroll { overflow-x: auto; }
    .grid { width: 100%; border-collapse: collapse; }
    .grid th {
      text-align: left;
      font-size: 10px;
      color: #64748b;
      letter-spacing: 0.04em;
      padding: 12px 20px;
      border-bottom: 1px solid #e2e8f0;
      white-space: nowrap;
      background: #f8fafc;
    }

    .grid td {
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      font-size: 11px;
      vertical-align: middle;
      white-space: nowrap;
    }

    .grid tbody tr {
      transition: background 0.15s ease;
    }

    .grid tbody tr:hover {
      background: #f8fbff;
    }

    .grid tbody tr:last-child td { border-bottom: none; }
    .number { color: #0b2f5c; font-weight: 600; white-space: nowrap; }
    .subject { color: #0f172a; font-weight: 700; max-width: 360px; overflow: hidden; text-overflow: ellipsis; }

    .pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 10px;
      border: 1px solid transparent;
    }
    .pill.neutral { background: #f1f5f9; border-color: #e2e8f0; color: #475569; }
    .pill.state.new { background: #dbeafe; border-color: #bfdbfe; color: #2563eb; }
    .pill.state.open { background: #fef3c7; border-color: #fde68a; color: #d97706; }
    .pill.state.ready { background: #dcfce7; border-color: #bbf7d0; color: #16a34a; }
    .pill.state.done { background: #dcfce7; border-color: #bbf7d0; color: #15803d; }

    .actions { display: flex; justify-content: flex-end; gap: 7px; }
    .actions-header { text-align: right; }
    .icon {
      width: 28px;
      height: 28px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #334155;
      font-size: 12px;
      transition: all 0.15s ease;
    }

    .icon:hover:not(:disabled) {
      transform: translateY(-1px);
      background: #f8fafc;
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
    }

    .icon.open { color: #334155; }
    .icon.priority { color: #d97706; }
    .icon.share { color: #2563eb; }
    .icon.send { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
    .icon:disabled { opacity: 0.55; cursor: not-allowed; }

    .empty { padding: 18px 20px; color: #64748b; font-size: 11px; border-top: 1px solid #e2e8f0; }

    .recent-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }

    .recent-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }

    .recent-title {
      font-size: 12px;
      font-weight: 700;
      color: #0b2f5c;
    }

    .recent-link {
      border: 1px solid #dbe3ef;
      background: #fff;
      color: #1d4ed8;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 11px;
    }

    .recent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .recent-row:last-child { border-bottom: none; }

    .recent-number {
      color: #0b2f5c;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .recent-subject {
      color: #0f172a;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .recent-meta {
      color: #64748b;
    }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .table-title { font-size: 12px; }
      .heading h2 { font-size: 12px; }
      .grid th,
      .grid td { padding: 10px 12px; }
    }
  `]
})
export class AClasserAnnoterComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  rows: Array<{
    id: number;
    number: string;
    object: string;
    type: string;
    priorityLabel: string;
    receivedAtLabel: string;
    stateLabel: string;
    stateTone: 'new' | 'open' | 'ready' | 'done';
  }> = [];
  recentDocuments: Array<{
    id: number;
    number: string;
    object: string;
    receivedAtLabel: string;
    priorityLabel: string;
  }> = [];

  newCount = 0;
  openCount = 0;
  readyCount = 0;
  isLoading = false;
  private readonly pendingIds = new Set<number>();

  ngOnInit(): void {
    this.load();
  }

  isPending(id: number): boolean {
    return this.pendingIds.has(id);
  }

  markOpen(id: number): void {
    this.runMutation(id, `${API_BASE_URL}/assistant/documents/${id}/classify`, { status: 'En cours' }, {
      successMessage: 'Document ouvert.'
    });
  }

  markPriority(id: number): void {
    this.runMutation(id, `${API_BASE_URL}/assistant/documents/${id}/classify`, { priority: 'Haute' }, {
      successMessage: 'Priorite mise a jour.'
    });
  }

  sendToChief(id: number): void {
    this.runMutation(id, `${API_BASE_URL}/assistant/documents/${id}/send-to-chief`, {}, {
      successMessage: 'Document envoye au chef.',
      action: {
        label: 'Voir',
        onAction: () => this.router.navigate(['/envoyes-au-chef'])
      }
    });
  }

  markDone(id: number): void {
    this.runMutation(id, `${API_BASE_URL}/assistant/documents/${id}/mark-treated`, {}, {
      successMessage: 'Document marque comme traite.',
      action: {
        label: 'Annuler',
        onAction: () => this.undoToInProgress(id)
      }
    });
  }

  private runMutation(
    id: number,
    url: string,
    payload: object,
    messages?: { successMessage?: string; errorMessage?: string; action?: { label: string; onAction: () => void } }
  ): void {
    if (this.pendingIds.has(id)) {
      return;
    }

    this.pendingIds.add(id);
    this.http.patch(url, payload).subscribe({
      next: () => {
        this.pendingIds.delete(id);
        if (messages?.successMessage) {
          this.toast.success(messages.successMessage, 2500, messages.action);
        }
        this.load();
      },
      error: () => {
        this.pendingIds.delete(id);
        this.toast.error(messages?.errorMessage || 'Action impossible.');
      }
    });
  }

  private undoToInProgress(id: number): void {
    this.runMutation(id, `${API_BASE_URL}/assistant/documents/${id}/classify`, { status: 'En cours' }, {
      successMessage: 'Action annulee.'
    });
  }

  private load(): void {
    this.isLoading = true;
    this.http.get<AssistantDashboardResponse>(`${API_BASE_URL}/assistant/dashboard`).subscribe({
      next: (response) => {
        const documents = Array.isArray(response.documents) ? response.documents : [];

        const cards = response.cards;
        if (cards) {
          this.newCount = cards.toProcess ?? 0;
          this.openCount = cards.inProgress ?? 0;
          this.readyCount = documents.filter((item) => this.normalizeStatus(item.status) === 'envoye au chef').length;
        } else {
          this.newCount = documents.filter((item) => this.normalizeStatus(item.status) === 'a traiter').length;
          this.openCount = documents.filter((item) => this.normalizeStatus(item.status) === 'en cours').length;
          this.readyCount = documents.filter((item) => this.normalizeStatus(item.status) === 'envoye au chef').length;
        }

        const allRows = documents.map((item) => ({
          id: item.id,
          number: item.number,
          object: item.object,
          type: this.mapType(item.type),
          priorityLabel: this.mapPriority(item.priority),
          receivedAtLabel: this.formatDateTime(item.lastActionAt),
          stateLabel: this.mapState(item.status).label,
          stateTone: this.mapState(item.status).tone
        }));

        this.rows = allRows;
        this.recentDocuments = allRows.slice(0, 5).map((row) => ({
          id: row.id,
          number: row.number,
          object: row.object,
          receivedAtLabel: row.receivedAtLabel,
          priorityLabel: row.priorityLabel
        }));
        this.cdr.detectChanges();

        this.isLoading = false;
      },
      error: () => {
        this.rows = [];
        this.recentDocuments = [];
        this.newCount = 0;
        this.openCount = 0;
        this.readyCount = 0;
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  goToSearch(): void {
    this.router.navigate(['/recherche']);
  }

  private mapType(type: string): string {
    if (!type) {
      return '—';
    }
    if (type.toLowerCase().includes('courrier')) {
      return "Courrier d'arrivée";
    }
    return type;
  }

  private mapPriority(priority?: string): string {
    if (!priority) {
      return 'Normal';
    }

    if (priority === 'Normale') {
      return 'Normal';
    }

    return priority;
  }

  private mapState(status: string): { label: string; tone: 'new' | 'open' | 'ready' | 'done' } {
    const normalized = this.normalizeStatus(status);
    if (normalized === 'a traiter') {
      return { label: 'Nouveau', tone: 'new' };
    }
    if (normalized === 'en cours') {
      return { label: 'Ouvert', tone: 'open' };
    }
    if (normalized === 'envoye au chef') {
      return { label: 'Prêt', tone: 'ready' };
    }
    return { label: 'Traité', tone: 'done' };
  }

  private normalizeStatus(status?: string): string {
    return (status || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  private formatDateTime(value: string): string {
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
