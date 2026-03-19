import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-envoi',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Envoyer / Router des Documents</h2>
        <p class="page-subtitle">Action principale — Créer ou transférer un document avec traçabilité complète</p>
      </div>

      <div class="content-wrapper">
        <div class="tabs-section">
          <div class="tabs">
            <button
              class="tab"
              [class.active]="activeTab() === 'new'"
              (click)="setActiveTab('new')"
            >
              <span class="tab-icon">📄</span>
              Nouveau document
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'route'"
              (click)="setActiveTab('route')"
            >
              <span class="tab-icon">✈</span>
              Router un document existant
            </button>
          </div>
        </div>

        @if (activeTab() === 'new') {
          <div class="form-section">
            <div class="info-box info-blue">
              <span class="info-icon">ℹ️</span>
              <div class="info-content">
                <strong>Création et envoi direct</strong>
                <p>Le document sera automatiquement créé avec le statut ENVOYÉ et remis au destinataire choisi.</p>
              </div>
            </div>

            <form class="document-form" (ngSubmit)="submitNewDocument()">
              <div class="form-group">
                <label class="form-label">Objet du document <span class="required">*</span></label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Ex: Rapport mensuel budget janvier 2025"
                  [(ngModel)]="newDocument.subject"
                  name="subject"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Type de document</label>
                  <select class="form-select" [(ngModel)]="newDocument.type" name="type">
                    <option>Courrier d'arrivée</option>
                    <option>Rapport</option>
                    <option>Décision</option>
                    <option>Note de service</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Priorité</label>
                  <select class="form-select" [(ngModel)]="newDocument.priority" name="priority">
                    <option value="">—</option>
                    <option>Basse</option>
                    <option>Normale</option>
                    <option>Haute</option>
                    <option>Urgente</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expéditeur (optionnel)</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Ex: Ministère des Finances"
                    [(ngModel)]="newDocument.sender"
                    name="sender"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Date de réception (optionnel)</label>
                  <input
                    type="date"
                    class="form-input"
                    [(ngModel)]="newDocument.receptionDate"
                    name="receptionDate"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Assigner à <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="newDocument.assignTo" name="assignTo" required>
                  <option value="">Sélectionner un destinataire</option>
                  @for (user of availableUsers; track user.id) {
                    <option [value]="user.id">{{ user.name }} ({{ user.role }})</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Délai de traitement (optionnel)</label>
                <div class="delay-input-group">
                  <input
                    type="number"
                    class="form-input delay-number"
                    placeholder="Ex: 7"
                    [(ngModel)]="newDocument.processingDelay"
                    name="processingDelay"
                    min="0"
                  />
                  <span class="delay-unit">jours</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Commentaire / Instructions (optionnel)</label>
                <textarea
                  class="form-textarea"
                  placeholder="Ex: À traiter en urgence, voir avec le service comptabilité"
                  [(ngModel)]="newDocument.comment"
                  name="comment"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Scan du document (optionnel)</label>
                <div
                  class="file-drop-zone"
                  [class.file-drop-zone-active]="isDraggingNew"
                  (dragover)="onDragOver($event)"
                  (dragleave)="isDraggingNew = false"
                  (drop)="onDropNew($event)"
                  (click)="fileInputNew.click()"
                >
                  <input
                    #fileInputNew
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style="display: none"
                    (change)="onFileSelectedNew($event)"
                  />
                  @if (newDocumentFile) {
                    <div class="file-preview">
                      <span class="file-name">📎 {{ newDocumentFile.name }}</span>
                      <button type="button" class="file-remove" (click)="removeNewFile($event)">✕</button>
                    </div>
                  } @else {
                    <div class="file-drop-content">
                      <span class="file-drop-icon">⬆</span>
                      <span class="file-drop-link">Cliquez pour télécharger ou glissez-déposez</span>
                      <span class="file-drop-hint">PDF, JPG, PNG (max 10 Mo)</span>
                    </div>
                  }
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="isSubmitting()">
                  <span class="btn-icon">✈</span> Créer et Envoyer
                </button>
                <button type="button" class="btn btn-secondary" (click)="resetNewDocument()">
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        }

        @if (activeTab() === 'route') {
          <div class="form-section">
            <div class="info-box info-orange">
              <span class="info-icon">ℹ️</span>
              <div class="info-content">
                <strong>Transférer un document existant</strong>
                <p>Le document changera de détenteur et le statut sera mis à ENVOYÉ. L'historique sera tracé automatiquement.</p>
              </div>
            </div>

            <form class="document-form" (ngSubmit)="submitRouteDocument()">
              <div class="form-group">
                <label class="form-label">Rechercher un document <span class="required">*</span></label>
                <div class="search-input-group">
                  <span class="search-icon">🔍</span>
                  <input
                    type="text"
                    class="form-input search-input"
                    placeholder="Tapez le numéro ou un mot de l'objet..."
                    [(ngModel)]="routeDocument.searchQuery"
                    name="searchQuery"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Transférer à <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="routeDocument.assignTo" name="routeAssignTo" required>
                  <option value="">Sélectionner un destinataire</option>
                  @for (user of availableUsers; track user.id) {
                    <option [value]="user.id">{{ user.name }} ({{ user.role }})</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Commentaire / Raison du transfert</label>
                <textarea
                  class="form-textarea"
                  placeholder="Ex: À traiter en urgence, voir note du SG"
                  [(ngModel)]="routeDocument.comment"
                  name="routeComment"
                  rows="5"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-orange" [disabled]="isSubmitting()">
                  <span class="btn-icon">✈</span> Router le document
                </button>
                <button type="button" class="btn btn-secondary" (click)="resetRouteDocument()">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1000px;
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
      color: #0b2f5c;
    }

    .page-subtitle {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    .content-wrapper {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .tabs-section {
      border-bottom: 1px solid #e5e7eb;
    }

    .tabs {
      display: flex;
    }

    .tab {
      flex: 1;
      padding: 16px 24px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: color 0.2s;
      border-bottom: 3px solid transparent;
    }

    .tab:hover {
      color: #0f172a;
    }

    .tab.active {
      color: #0b3a78;
      border-bottom-color: #0b3a78;
    }

    .tab-icon {
      font-size: 16px;
    }

    .form-section {
      padding: 24px;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 10px;
      margin-bottom: 24px;
    }

    .info-blue {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }

    .info-blue .info-content strong { color: #1d4ed8; }
    .info-blue .info-content p { color: #1e40af; }

    .info-orange {
      background: #fff7ed;
      border: 1px solid #fed7aa;
    }

    .info-orange .info-content strong { color: #c2410c; }
    .info-orange .info-content p { color: #9a3412; }

    .info-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
    }

    .info-content strong {
      display: block;
      font-size: 13px;
      margin-bottom: 2px;
    }

    .info-content p {
      margin: 0;
      font-size: 12px;
    }

    .document-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
    }

    .required {
      color: #ef4444;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      background: white;
      color: #0f172a;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #0b3a78;
      box-shadow: 0 0 0 3px rgba(11, 58, 120, 0.12);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .delay-input-group {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .delay-number {
      max-width: 120px;
    }

    .delay-unit {
      font-size: 13px;
      color: #64748b;
      white-space: nowrap;
    }

    .search-input-group {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #94a3b8;
    }

    .search-input {
      padding-left: 36px !important;
    }

    .file-drop-zone {
      border: 2px dashed #e2e8f0;
      border-radius: 10px;
      padding: 28px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafbfc;
    }

    .file-drop-zone:hover,
    .file-drop-zone-active {
      border-color: #93c5fd;
      background: #eff6ff;
    }

    .file-drop-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .file-drop-icon {
      font-size: 24px;
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .file-drop-link {
      color: #2563eb;
      font-size: 13px;
      font-weight: 500;
    }

    .file-drop-hint {
      color: #94a3b8;
      font-size: 11px;
    }

    .file-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .file-name {
      font-size: 13px;
      color: #0b2f5c;
      font-weight: 600;
    }

    .file-remove {
      border: none;
      background: #fee2e2;
      color: #dc2626;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 10px 24px;
      border-radius: 8px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 14px;
    }

    .btn-primary {
      background: #0b3a78;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #082456;
    }

    .btn-orange {
      background: #c2860b;
    }

    .btn-orange:hover:not(:disabled) {
      background: #a06e08;
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #1f2937;
      border: 1px solid #e2e8f0;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .tabs {
        flex-direction: column;
      }

      .tab {
        padding: 12px 16px;
      }
    }
  `]
})
export class EnvoiComponent {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  activeTab = signal<'new' | 'route'>('new');
  isSubmitting = signal(false);
  isDraggingNew = false;
  newDocumentFile: File | null = null;

  availableUsers: Array<{ id: number; name: string; role: string }> = [];

  newDocument = {
    subject: '',
    type: "Courrier d'arrivée",
    priority: '',
    sender: '',
    receptionDate: '',
    assignTo: '',
    processingDelay: null as number | null,
    comment: ''
  };

  routeDocument = {
    searchQuery: '',
    assignTo: '',
    comment: ''
  };

  constructor() {
    this.loadUsers();
  }

  setActiveTab(tab: 'new' | 'route'): void {
    this.activeTab.set(tab);
  }

  // ── New document ──

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingNew = true;
  }

  onDropNew(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingNew = false;
    const file = event.dataTransfer?.files[0];
    if (file && this.isValidFile(file)) {
      this.newDocumentFile = file;
    }
  }

  onFileSelectedNew(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && this.isValidFile(file)) {
      this.newDocumentFile = file;
    }
    input.value = '';
  }

  removeNewFile(event: Event): void {
    event.stopPropagation();
    this.newDocumentFile = null;
  }

  resetNewDocument(): void {
    this.newDocument = {
      subject: '',
      type: "Courrier d'arrivée",
      priority: '',
      sender: '',
      receptionDate: '',
      assignTo: '',
      processingDelay: null,
      comment: ''
    };
    this.newDocumentFile = null;
  }

  submitNewDocument(): void {
    if (!this.newDocument.subject.trim() || !this.newDocument.assignTo) return;
    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('subject', this.newDocument.subject.trim());
    formData.append('type', this.newDocument.type);
    if (this.newDocument.priority) formData.append('priority', this.newDocument.priority);
    if (this.newDocument.sender) formData.append('sender', this.newDocument.sender.trim());
    if (this.newDocument.receptionDate) formData.append('receptionDate', this.newDocument.receptionDate);
    formData.append('assignTo', this.newDocument.assignTo);
    if (this.newDocument.processingDelay) formData.append('processingDelay', String(this.newDocument.processingDelay));
    if (this.newDocument.comment) formData.append('comment', this.newDocument.comment.trim());
    if (this.newDocumentFile) formData.append('file', this.newDocumentFile);

    this.http.post(`${API_BASE_URL}/secretariat/send-document`, formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.resetNewDocument();
        this.toast.success('Document envoye avec succes.');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.error("Impossible d'envoyer le document.");
      }
    });
  }

  // ── Route existing document ──

  resetRouteDocument(): void {
    this.routeDocument = { searchQuery: '', assignTo: '', comment: '' };
  }

  submitRouteDocument(): void {
    if (!this.routeDocument.searchQuery.trim() || !this.routeDocument.assignTo) return;
    this.isSubmitting.set(true);

    this.http.post(`${API_BASE_URL}/secretariat/route-document`, {
      searchQuery: this.routeDocument.searchQuery.trim(),
      assignTo: this.routeDocument.assignTo,
      comment: this.routeDocument.comment.trim()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.resetRouteDocument();
        this.toast.success('Document route avec succes.');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.error('Impossible de router le document.');
      }
    });
  }

  private loadUsers(): void {
    this.http.get<any>(`${API_BASE_URL}/secretariat/users`).subscribe({
      next: (response) => {
        this.availableUsers = (response.users || response || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role
        }));
      },
      error: () => {}
    });
  }

  private isValidFile(file: File): boolean {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    return allowed.includes(file.type) && file.size <= maxSize;
  }
}
