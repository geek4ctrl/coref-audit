import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

type DocumentForm = {
  documentNumber: string;
  subject: string;
  sender: string;
  category: string;
  confidentiality: string;
  priority: string;
  slaDays: number;
  description: string;
};

@Component({
  selector: 'app-nouveau-document',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <button class="back-link" (click)="goBack()">← Retour</button>

      <h2 class="page-title">Rédiger un nouveau document</h2>
      <p class="page-subtitle">Créez un document et ajoutez les pièces jointes nécessaires</p>
      <div class="required-note">Champs obligatoires <span class="required">*</span></div>
      <div class="autosave-note">Sauvegarde auto: {{ lastSavedLabel }}</div>

      <!-- Step indicator -->
      <div class="stepper">
        <div class="step" [class.step-active]="currentStep === 1" [class.step-done]="currentStep > 1">
          <span class="step-number">1</span>
          <span class="step-label">Informations</span>
        </div>
        <div class="step-line" [class.step-line-done]="currentStep > 1"></div>
        <div class="step" [class.step-active]="currentStep === 2">
          <span class="step-number">2</span>
          <span class="step-label">Pièces jointes</span>
        </div>
      </div>

      <!-- Step 1: Informations -->
      @if (currentStep === 1) {
        <div class="form-card">
          <div class="form-section">
            <div class="section-title">Identification</div>

            <div class="form-group">
              <label class="form-label">Numéro du document <span class="required">*</span></label>
              <input
                class="form-input"
                type="text"
                placeholder="Ex: DOC-2025-001"
                [(ngModel)]="form.documentNumber"
                (ngModelChange)="onFieldChange()"
                (blur)="markTouched('documentNumber')"
                [class.invalid]="isFieldInvalid('documentNumber')"
              />
              @if (isFieldInvalid('documentNumber')) {
                <div class="error-text">Le numéro du document est requis.</div>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Objet du document <span class="required">*</span></label>
              <input
                class="form-input"
                type="text"
                placeholder="Ex: Demande de financement pour le projet..."
                [(ngModel)]="form.subject"
                (ngModelChange)="onFieldChange()"
                (blur)="markTouched('subject')"
                [class.invalid]="isFieldInvalid('subject')"
              />
              @if (isFieldInvalid('subject')) {
                <div class="error-text">L'objet du document est requis.</div>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Expéditeur <span class="required">*</span></label>
              <input
                class="form-input"
                type="text"
                placeholder="Ex: Direction des Finances"
                [(ngModel)]="form.sender"
                (ngModelChange)="onFieldChange()"
                (blur)="markTouched('sender')"
                [class.invalid]="isFieldInvalid('sender')"
              />
              @if (isFieldInvalid('sender')) {
                <div class="error-text">L'expéditeur est requis.</div>
              }
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Classification</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Catégorie</label>
                <select class="form-select" [(ngModel)]="form.category" (ngModelChange)="onFieldChange()">
                  <option value="COURRIER_ARRIVEE">COURRIER_ARRIVEE</option>
                  <option value="COURRIER_DEPART">COURRIER_DEPART</option>
                  <option value="NOTE_INTERNE">NOTE_INTERNE</option>
                  <option value="RAPPORT">RAPPORT</option>
                  <option value="DEMANDE">DEMANDE</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Confidentialité</label>
                <select class="form-select" [(ngModel)]="form.confidentiality" (ngModelChange)="onFieldChange()">
                  <option value="Interne">Interne</option>
                  <option value="Confidentiel">Confidentiel</option>
                  <option value="Public">Public</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Priorité et délai</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Priorité</label>
                <select class="form-select" [(ngModel)]="form.priority" (ngModelChange)="onFieldChange()">
                  <option value="Normal">Normal</option>
                  <option value="Basse">Basse</option>
                  <option value="Haute">Haute</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Délai de traitement (jours)</label>
                <input
                  class="form-input"
                  type="number"
                  [(ngModel)]="form.slaDays"
                  min="1"
                  (ngModelChange)="onFieldChange()"
                  (blur)="markTouched('slaDays')"
                  [class.invalid]="isFieldInvalid('slaDays')"
                />
                @if (isFieldInvalid('slaDays')) {
                  <div class="error-text">Le délai doit être supérieur ou égal à 1.</div>
                }
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Notes</div>
            <div class="form-group">
              <label class="form-label">Description / Notes</label>
              <textarea
                class="form-textarea"
                rows="4"
                placeholder="Ajoutez des notes ou une description détaillée (optionnel)..."
                [(ngModel)]="form.description"
                (ngModelChange)="onFieldChange()"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-cancel" (click)="goBack()">Annuler</button>
            <button class="btn-next" (click)="goToStep2()" [disabled]="!isStep1Valid">Suivant: Pièces jointes</button>
          </div>
        </div>
      }

      <!-- Step 2: Pièces jointes -->
      @if (currentStep === 2) {
        <div class="form-card">
          <div class="upload-zone" (dragover)="onDragOver($event)" (drop)="onDrop($event)" (click)="fileInput.click()">
            <input #fileInput type="file" multiple hidden (change)="onFilesSelected($event)" />
            <div class="upload-icon">📎</div>
            <p class="upload-text">Glissez vos fichiers ici ou <span class="upload-link">parcourir</span></p>
            <p class="upload-hint">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG — Max 10 MB par fichier</p>
          </div>

          @if (files.length > 0) {
            <div class="files-list">
              @for (file of files; track file.name; let i = $index) {
                <div class="file-row">
                  <div class="file-info">
                    <span class="file-icon">📄</span>
                    <div>
                      <div class="file-name">{{ file.name }}</div>
                      <div class="file-size">{{ formatFileSize(file.size) }}</div>
                    </div>
                  </div>
                  <button class="file-remove" (click)="removeFile(i)">✕</button>
                </div>
              }
            </div>
          }

          <div class="form-actions">
            <button class="btn-cancel" (click)="currentStep = 1">Précédent</button>
            <button class="btn-next" (click)="submitDocument()" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Envoi en cours...' : 'Soumettre le document' }}
            </button>
          </div>
        </div>
      }

      <!-- Info box -->
      <div class="info-box">
        <div class="info-icon">ℹ</div>
        <div>
          <strong>À savoir</strong>
          <ul class="info-list">
            <li>Les documents créés ici seront automatiquement ajoutés au système de traçabilité</li>
            <li>Les pièces jointes sont obligatoires pour valider le document</li>
            <li>Le délai de traitement commence dès la création du document</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 780px;
      margin: 0 auto;
    }

    .back-link {
      border: none;
      background: none;
      color: #475569;
      font-size: 13px;
      cursor: pointer;
      padding: 0;
      margin-bottom: 18px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .back-link:hover { color: #0b2f5c; }

    .page-title {
      font-size: 24px;
      font-weight: 800;
      color: #0b2f5c;
      margin: 0 0 6px;
    }

    .page-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 28px;
    }

    .required-note {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .autosave-note {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 18px;
    }

    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 28px;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }

    .step-active .step-number {
      background: #0b2f5c;
      color: #fff;
    }

    .step-done .step-number {
      background: #16a34a;
      color: #fff;
    }

    .step-label {
      font-size: 14px;
      color: #94a3b8;
      font-weight: 500;
    }

    .step-active .step-label { color: #0f172a; font-weight: 600; }
    .step-done .step-label { color: #16a34a; }

    .step-line {
      width: 100px;
      height: 2px;
      background: #e2e8f0;
      margin: 0 12px;
    }

    .step-line-done { background: #16a34a; }

    .form-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 28px 32px;
      margin-bottom: 20px;
    }

    .form-section {
      padding: 0 0 18px;
      border-bottom: 1px solid #eef2f7;
      margin-bottom: 18px;
    }

    .form-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 6px;
    }

    .required { color: #dc2626; }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      font-size: 14px;
      color: #0f172a;
      background: #fff;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input.invalid,
    .form-select.invalid,
    .form-textarea.invalid {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
    }

    .error-text {
      font-size: 12px;
      color: #dc2626;
      margin-top: 6px;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: #9ca3af;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 8px;
    }

    .btn-cancel {
      padding: 12px 24px;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      background: #fff;
      color: #374151;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-next {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      background: #0b2f5c;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-next:hover:not(:disabled) {
      background: #0e3d75;
    }

    .btn-next:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 14px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      margin-bottom: 20px;
    }

    .upload-zone:hover {
      border-color: #2563eb;
      background: #f8fafc;
    }

    .upload-icon { font-size: 32px; margin-bottom: 10px; }

    .upload-text {
      font-size: 14px;
      color: #374151;
      margin: 0 0 6px;
    }

    .upload-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: underline;
    }

    .upload-hint {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }

    .files-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }

    .file-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .file-icon { font-size: 20px; }
    .file-name { font-size: 13px; font-weight: 600; color: #1e293b; }
    .file-size { font-size: 12px; color: #94a3b8; }

    .file-remove {
      border: none;
      background: none;
      color: #94a3b8;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
    }

    .file-remove:hover { color: #dc2626; }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      background: #eff6ff;
      border-radius: 12px;
      border: 1px solid #dbeafe;
    }

    .info-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #2563eb;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-box strong {
      font-size: 13px;
      color: #1e40af;
      display: block;
      margin-bottom: 6px;
    }

    .info-list {
      margin: 0;
      padding: 0 0 0 16px;
      font-size: 13px;
      color: #1e40af;
      line-height: 1.7;
    }

    @media (max-width: 640px) {
      .form-row,
      .form-actions {
        grid-template-columns: 1fr;
      }

      .stepper { flex-wrap: wrap; justify-content: center; }
      .step-line { width: 40px; }
    }
  `]
})
export class NouveauDocumentComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  currentStep = 1;
  private readonly autosaveKey = 'coref-nouveau-document-draft';
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  isSubmitting = false;
  files: File[] = [];
  submitAttempted = false;
  fieldTouched: Record<string, boolean> = {
    documentNumber: false,
    subject: false,
    sender: false,
    slaDays: false
  };
  lastSavedAt: Date | null = null;

  form: DocumentForm = {
    documentNumber: '',
    subject: '',
    sender: '',
    category: 'COURRIER_ARRIVEE',
    confidentiality: 'Interne',
    priority: 'Normal',
    slaDays: 7,
    description: ''
  };

  get isStep1Valid(): boolean {
    return !!(
      this.form.documentNumber.trim() &&
      this.form.subject.trim() &&
      this.form.sender.trim() &&
      this.isSlaValid()
    );
  }

  get lastSavedLabel(): string {
    if (!this.lastSavedAt) {
      return 'brouillon non enregistre';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(this.lastSavedAt);
  }

  ngOnInit(): void {
    this.restoreDraft();
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  goToStep2(): void {
    this.submitAttempted = true;
    if (this.isStep1Valid) {
      this.currentStep = 2;
    }
  }

  onFieldChange(): void {
    this.scheduleAutosave();
  }

  markTouched(field: keyof NouveauDocumentComponent['fieldTouched']): void {
    this.fieldTouched[field] = true;
  }

  isFieldInvalid(field: keyof NouveauDocumentComponent['fieldTouched']): boolean {
    if (!this.submitAttempted && !this.fieldTouched[field]) {
      return false;
    }

    if (field === 'documentNumber') {
      return !this.form.documentNumber.trim();
    }
    if (field === 'subject') {
      return !this.form.subject.trim();
    }
    if (field === 'sender') {
      return !this.form.sender.trim();
    }
    if (field === 'slaDays') {
      return !this.isSlaValid();
    }
    return false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropped = event.dataTransfer?.files;
    if (dropped) {
      this.addFiles(dropped);
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  submitDocument(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const payload = {
      documentType: this.form.category,
      sender: this.form.sender,
      subject: this.form.subject,
      category: this.form.category,
      confidentiality: this.form.confidentiality,
      priority: this.form.priority === 'Normal' ? 'Normale' : this.form.priority,
      observations: this.form.description || undefined,
      slaDays: this.form.slaDays
    };

    this.http.post(`${API_BASE_URL}/documents`, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.clearDraft();
        this.toast.success('Document enregistre.');
        this.router.navigate(['/documents']);
      },
      error: () => {
        this.isSubmitting = false;
        this.toast.error("Impossible d'enregistrer le document.");
      }
    });
  }

  private addFiles(fileList: FileList): void {
    const maxSize = 10 * 1024 * 1024;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size <= maxSize) {
        this.files.push(file);
      }
    }
  }

  private isSlaValid(): boolean {
    return Number.isFinite(this.form.slaDays) && this.form.slaDays >= 1;
  }

  private scheduleAutosave(): void {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }
    this.autosaveTimer = setTimeout(() => {
      this.persistDraft();
    }, 600);
  }

  private persistDraft(): void {
    const payload = {
      form: this.form,
      currentStep: this.currentStep
    };
    localStorage.setItem(this.autosaveKey, JSON.stringify(payload));
    this.lastSavedAt = new Date();
  }

  private restoreDraft(): void {
    const raw = localStorage.getItem(this.autosaveKey);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as { form?: DocumentForm; currentStep?: number };
      if (parsed.form) {
        this.form = { ...this.form, ...parsed.form };
      }
      if (parsed.currentStep) {
        this.currentStep = parsed.currentStep;
      }
      this.lastSavedAt = new Date();
    } catch {
      localStorage.removeItem(this.autosaveKey);
    }
  }

  private clearDraft(): void {
    localStorage.removeItem(this.autosaveKey);
    this.lastSavedAt = null;
  }
}
