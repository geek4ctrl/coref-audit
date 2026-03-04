import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, API_BASE_URL } from '../../auth/auth.service';

interface StatCard {
  value: number;
  subtitle: string;
  icon: string;
  accent: 'blue' | 'orange' | 'sky' | 'purple';
  action?: 'openCreateModal' | 'goToBordereaux' | 'goToDistributions' | 'none';
}

interface SummaryCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
}

interface ReceptionDocument {
  number: string;
  title: string;
  createdAt: string;
  badge: string;
}

interface ReceptionDocumentApi {
  number: string;
  subject: string;
  status: string;
  createdAt: string;
}

interface ReceptionCreatePayload {
  documentType: 'EXTERNE' | 'PILIER';
  receivedDate: string;
  sender: string;
  subject: string;
  category: string;
  confidentiality: 'PUBLIC' | 'INTERNE' | 'CONFIDENTIEL';
  observations: string;
}

@Component({
  selector: 'app-reception',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="header">
        <div>
          <h1 class="title">Dashboard Réception</h1>
          <p class="subtitle">Vue d'ensemble du guichet</p>
        </div>

        <div class="header-actions">
          <button type="button" class="btn btn-yellow" (click)="openCreateModal()">✎ Rédiger un document</button>
          <button type="button" class="btn btn-purple">⬒ Gérer les Bordereaux</button>
        </div>
      </header>

      <section class="stats-grid" aria-label="Indicateurs réception">
        @for (card of statCards; track card.subtitle) {
          <article
            class="stat-card"
            [class.active]="$index === 0"
            [class.clickable]="card.action !== 'none'"
            (click)="onStatCardClick(card)"
          >
            <div [class]="'stat-icon ' + card.accent">{{ card.icon }}</div>
            <div>
              <p class="stat-value">{{ card.value }}</p>
              <p class="stat-label">{{ card.subtitle }}</p>
            </div>
          </article>
        }
      </section>

      <section class="summary-grid" aria-label="Synthèse réception">
        @for (item of summaryCards; track item.title) {
          <article class="summary-card">
            <p class="summary-title">{{ item.icon }} {{ item.title }}</p>
            <p class="summary-value">{{ item.value }}</p>
            <p class="summary-subtitle">{{ item.subtitle }}</p>
          </article>
        }
      </section>

      <section class="quick-register" aria-label="Nouveau courrier">
        <div>
          <h2 class="quick-title">Enregistrer un nouveau courrier</h2>
          <p class="quick-subtitle">Scannez et distribuez un courrier entrant en quelques clics</p>
        </div>
        <button type="button" class="quick-btn" (click)="openCreateModal()">Nouveau courrier</button>
      </section>

      <section class="recent" aria-label="Documents récemment enregistrés">
        <h2 class="recent-title">Documents récemment enregistrés</h2>

        @for (doc of recentDocuments(); track doc.number) {
          <article class="doc-row">
            <div class="doc-main">
              <p class="doc-number">{{ doc.number }}</p>
              <p class="doc-name">{{ doc.title }}</p>
              <p class="doc-date">{{ doc.createdAt }}</p>
            </div>

            <div class="doc-actions">
              <span class="badge">{{ doc.badge }}</span>
              <button type="button" class="link-action">Sans scan</button>
              <button type="button" class="link-action">À distribuer</button>
            </div>
          </article>
        }
      </section>

      @if (isCreateModalOpen()) {
        <div class="modal-backdrop" (click)="closeCreateModal()">
          <section class="modal" role="dialog" aria-modal="true" aria-label="Enregistrer un courrier" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <div>
                <h3 class="modal-title">Enregistrer un courrier</h3>
                <p class="modal-subtitle">Le document sera disponible dans Distributions pour envoi ultérieur</p>
              </div>
              <button type="button" class="modal-close" (click)="closeCreateModal()" aria-label="Fermer">✕</button>
            </header>

            <div class="modal-body">
              <div class="field-group type-group">
                <p class="field-label">Type de document *</p>
                <div class="type-options">
                  <button
                    type="button"
                    class="type-option"
                    [class.selected]="selectedDocumentType() === 'EXTERNE'"
                    (click)="selectedDocumentType.set('EXTERNE')"
                  >
                    <span class="type-title">Document Externe</span>
                    <span class="type-subtitle">Sera envoyé à l'Assistante du Chef</span>
                  </button>
                  <button
                    type="button"
                    class="type-option"
                    [class.selected]="selectedDocumentType() === 'PILIER'"
                    (click)="selectedDocumentType.set('PILIER')"
                  >
                    <span class="type-title">Document Pilier</span>
                    <span class="type-subtitle">Sera envoyé au Coordinateur (signature requise)</span>
                  </button>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label" for="date-reception">Date de réception *</label>
                <input
                  id="date-reception"
                  class="field-input"
                  type="date"
                  [value]="createForm().receivedDate"
                  (input)="updateFormField('receivedDate', $any($event.target).value)"
                />
              </div>

              <div class="field-group">
                <label class="field-label" for="expediteur">Expéditeur *</label>
                <input
                  id="expediteur"
                  class="field-input"
                  type="text"
                  placeholder="Nom de l'expéditeur ou organisation"
                  [value]="createForm().sender"
                  (input)="updateFormField('sender', $any($event.target).value)"
                />
              </div>

              <div class="field-group">
                <label class="field-label" for="objet">Objet du document *</label>
                <textarea
                  id="objet"
                  class="field-input field-textarea"
                  rows="3"
                  placeholder="Décrivez brièvement l'objet du document"
                  [value]="createForm().subject"
                  (input)="updateFormField('subject', $any($event.target).value)"
                ></textarea>
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label" for="categorie">Catégorie *</label>
                  <select
                    id="categorie"
                    class="field-input"
                    [value]="createForm().category"
                    (change)="updateFormField('category', $any($event.target).value)"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    @for (category of categories; track category) {
                      <option [value]="category">{{ category }}</option>
                    }
                  </select>
                </div>
                <div class="field-group">
                  <label class="field-label" for="confidentialite">Niveau de confidentialité *</label>
                  <select
                    id="confidentialite"
                    class="field-input"
                    [value]="createForm().confidentiality"
                    (change)="updateFormField('confidentiality', $any($event.target).value)"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="INTERNE">INTERNE</option>
                    <option value="CONFIDENTIEL">CONFIDENTIEL</option>
                  </select>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label" for="observations">Observations</label>
                <textarea
                  id="observations"
                  class="field-input field-textarea"
                  rows="2"
                  placeholder="Notes ou observations complémentaires (optionnel)"
                  [value]="createForm().observations"
                  (input)="updateFormField('observations', $any($event.target).value)"
                ></textarea>
              </div>

              @if (modalError()) {
                <p class="modal-error">{{ modalError() }}</p>
              }

              <div class="workflow-note">
                <span>⚠</span>
                <p><strong>Workflow automatique :</strong> Une fois créé, le document suivra le parcours prédéfini et sera tracé à chaque étape.</p>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeCreateModal()" [disabled]="isSaving()">Annuler</button>
                <button type="button" class="btn-primary" (click)="submitCreateDocument()" [disabled]="isSaving()">
                  {{ isSaving() ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </div>
          </section>
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      flex-wrap: wrap;
    }

    .title {
      margin: 0;
      font-size: 20px;
      line-height: 1.05;
      font-weight: 800;
      color: #0b3470;
    }

    .subtitle {
      margin: 6px 0 0;
      font-size: 12px;
      color: #475569;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      border: 0;
      border-radius: 12px;
      padding: 14px 22px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
    }

    .btn-yellow {
      background: #f0c23a;
      color: #0f172a;
    }

    .btn-purple {
      background: #8b2cf0;
      color: #ffffff;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid #dbe3ef;
      border-radius: 14px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 96px;
    }

    .stat-card.clickable {
      cursor: pointer;
    }

    .stat-card.clickable:hover {
      border-color: #93c5fd;
      box-shadow: 0 0 0 1px #93c5fd;
    }

    .stat-card.active {
      border-color: #0b3a78;
      box-shadow: inset 0 0 0 1px #0b3a78;
    }

    .stat-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      font-weight: 700;
    }

    .stat-icon.blue {
      background: #0b3a78;
      color: #ffffff;
    }

    .stat-icon.orange {
      background: #fff2df;
      color: #f97316;
    }

    .stat-icon.sky {
      background: #e2edff;
      color: #2563eb;
    }

    .stat-icon.purple {
      background: #f2e8ff;
      color: #9333ea;
    }

    .stat-value {
      margin: 0;
      font-size: 30px;
      line-height: 1;
      font-weight: 800;
      color: #0f172a;
    }

    .stat-label {
      margin: 6px 0 0;
      font-size: 14px;
      color: #334155;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .summary-card {
      background: #ffffff;
      border: 1px solid #dbe3ef;
      border-radius: 14px;
      padding: 18px 20px;
      min-height: 112px;
    }

    .summary-title {
      margin: 0;
      color: #0f172a;
      font-size: 18px;
      font-weight: 700;
    }

    .summary-value {
      margin: 14px 0 0;
      color: #0b3a78;
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }

    .summary-subtitle {
      margin: 8px 0 0;
      color: #475569;
      font-size: 14px;
    }

    .quick-register {
      background: #063a78;
      border-radius: 14px;
      padding: 24px 28px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .quick-title {
      margin: 0;
      font-size: 22px;
      line-height: 1.1;
      font-weight: 800;
    }

    .quick-subtitle {
      margin: 10px 0 0;
      font-size: 14px;
      color: #dbeafe;
    }

    .quick-btn {
      border: 0;
      border-radius: 12px;
      background: #f0c23a;
      color: #0f172a;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 24px;
      cursor: pointer;
      min-width: 180px;
    }

    .recent {
      background: #ffffff;
      border: 1px solid #dbe3ef;
      border-radius: 14px;
      overflow: hidden;
    }

    .recent-title {
      margin: 0;
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      color: #0b3a78;
      font-size: 20px;
      font-weight: 700;
    }

    .doc-row {
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-top: 1px solid #f1f5f9;
    }

    .doc-number {
      margin: 0;
      font-size: 16px;
      color: #0b3a78;
      font-weight: 700;
    }

    .doc-name {
      margin: 4px 0 0;
      font-size: 14px;
      color: #0f172a;
      font-weight: 600;
    }

    .doc-date {
      margin: 6px 0 0;
      font-size: 12px;
      color: #64748b;
    }

    .doc-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .badge {
      background: #e2e8f0;
      color: #334155;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 14px;
      font-weight: 700;
    }

    .link-action {
      border: 0;
      border-radius: 8px;
      padding: 7px 10px;
      background: #f1f5f9;
      color: #334155;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1200;
    }

    .modal {
      width: min(900px, 100%);
      max-height: 90vh;
      overflow: auto;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 24px 48px rgba(2, 6, 23, 0.28);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 18px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      margin: 0;
      font-size: 20px;
      color: #0b3a78;
      font-weight: 700;
    }

    .modal-subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: #64748b;
    }

    .modal-close {
      border: 0;
      background: transparent;
      color: #64748b;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
    }

    .modal-body {
      padding: 16px 18px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-label {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }

    .field-input {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 14px;
      color: #0f172a;
      background: #ffffff;
    }

    .field-textarea {
      resize: vertical;
    }

    .field-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .type-group {
      border: 1px solid #bfdbfe;
      background: #f8fbff;
      border-radius: 10px;
      padding: 12px;
    }

    .type-options {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .type-option {
      text-align: left;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      background: #ffffff;
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .type-option.selected {
      border-color: #2563eb;
      box-shadow: inset 0 0 0 1px #2563eb;
      background: #f8fbff;
    }

    .type-title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }

    .type-subtitle {
      font-size: 12px;
      color: #64748b;
    }

    .workflow-note {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      border: 1px solid #facc15;
      background: #fffbeb;
      color: #854d0e;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
    }

    .workflow-note p {
      margin: 0;
    }

    .modal-error {
      margin: 0;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #fecaca;
      background: #fef2f2;
      color: #b91c1c;
      font-size: 13px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .btn-secondary,
    .btn-primary {
      border: 0;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #1e293b;
    }

    .btn-primary {
      background: #0b3a78;
      color: #ffffff;
    }

    .btn-secondary:disabled,
    .btn-primary:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .title {
        font-size: 22px;
      }

      .subtitle,
      .stat-label,
      .summary-subtitle,
      .doc-name {
        font-size: 15px;
      }

      .quick-title {
        font-size: 24px;
      }

      .quick-subtitle {
        font-size: 16px;
      }

      .quick-btn {
        font-size: 16px;
        min-width: 160px;
      }

      .recent-title {
        font-size: 20px;
      }

      .doc-number {
        font-size: 16px;
      }

      .doc-date {
        font-size: 15px;
      }
    }

    @media (max-width: 768px) {
      .stats-grid,
      .summary-grid {
        grid-template-columns: 1fr;
      }

      .btn {
        width: 100%;
      }

      .doc-row {
        align-items: flex-start;
        flex-direction: column;
      }

      .doc-actions {
        justify-content: flex-start;
      }

      .field-row,
      .type-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReceptionComponent {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isCreateModalOpen = signal(false);
  selectedDocumentType = signal<'EXTERNE' | 'PILIER'>('EXTERNE');
  isSaving = signal(false);
  modalError = signal('');

  createForm = signal<ReceptionCreatePayload>({
    documentType: 'EXTERNE',
    receivedDate: new Date().toISOString().slice(0, 10),
    sender: '',
    subject: '',
    category: '',
    confidentiality: 'PUBLIC',
    observations: ''
  });

  statCards: StatCard[] = [
    { value: 0, subtitle: 'Entrées du jour', icon: '◈', accent: 'blue', action: 'none' },
    { value: 1, subtitle: 'À scanner', icon: '⬚', accent: 'orange', action: 'goToBordereaux' },
    { value: 1, subtitle: 'À distribuer', icon: '➤', accent: 'sky', action: 'goToDistributions' },
    { value: 0, subtitle: 'Bordereaux en attente', icon: '⬒', accent: 'purple', action: 'goToBordereaux' }
  ];

  summaryCards: SummaryCard[] = [
    { title: 'Ce mois', value: 0, subtitle: 'Documents distribués', icon: '◷' },
    { title: 'Total', value: 1, subtitle: 'Documents enregistrés', icon: '↗' }
  ];

  categories: string[] = [
    "Courrier d'arrivée",
    'Courrier de départ',
    'Note de service',
    'Demande',
    'Rapport',
    'Contrat',
    'Facture',
    'Demande de congé',
    'Ordre de mission',
    'PV de réunion',
    'Décision',
    'Circulaire',
    'Mémorandum',
    'Convention',
    'Autre'
  ];

  recentDocuments = signal<ReceptionDocument[]>([]);

  ngOnInit() {
    this.loadRecentDocuments();
  }

  openCreateModal() {
    this.modalError.set('');
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.modalError.set('');
    this.isCreateModalOpen.set(false);
  }

  updateFormField<K extends keyof ReceptionCreatePayload>(key: K, value: ReceptionCreatePayload[K]) {
    this.createForm.update((current) => ({ ...current, [key]: value }));
  }

  submitCreateDocument() {
    const form = this.createForm();
    const payload: ReceptionCreatePayload = {
      ...form,
      documentType: this.selectedDocumentType()
    };

    if (!payload.receivedDate || !payload.sender || !payload.subject || !payload.category || !payload.confidentiality) {
      this.modalError.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.modalError.set('');

    this.http.post<{ document: ReceptionDocumentApi }>(`${API_BASE_URL}/reception/documents`, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeCreateModal();
        this.resetCreateForm();
        this.loadRecentDocuments();
      },
      error: () => {
        this.isSaving.set(false);
        this.modalError.set('Échec de l’enregistrement. Vérifiez les champs et réessayez.');
      }
    });
  }

  onStatCardClick(card: StatCard) {
    if (card.action === 'openCreateModal') {
      this.openCreateModal();
      return;
    }

    if (card.action === 'goToBordereaux') {
      this.router.navigate(['/bordereaux']);
      return;
    }

    if (card.action === 'goToDistributions') {
      this.router.navigate(['/distributions']);
    }
  }

  private resetCreateForm() {
    this.selectedDocumentType.set('EXTERNE');
    this.createForm.set({
      documentType: 'EXTERNE',
      receivedDate: new Date().toISOString().slice(0, 10),
      sender: '',
      subject: '',
      category: '',
      confidentiality: 'PUBLIC',
      observations: ''
    });
  }

  private loadRecentDocuments() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.http
      .get<{ documents: ReceptionDocumentApi[] }>(`${API_BASE_URL}/reception/documents/recent?limit=5`)
      .subscribe({
        next: (response) => {
          this.recentDocuments.set(
            response.documents.map((document) => ({
              number: document.number,
              title: document.subject,
              createdAt: this.formatDateTime(document.createdAt),
              badge: this.normalizeStatusLabel(document.status)
            }))
          );
        },
        error: () => {
          this.recentDocuments.set([]);
        }
      });
  }

  private formatDateTime(value: string) {
    const date = new Date(value);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  private normalizeStatusLabel(status: string) {
    if (status === 'Document crÃ©Ã©' || status === 'Document cree') {
      return 'Document créé';
    }
    return status;
  }
}
