import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../auth/auth.service';

interface CreateReceptionDocumentResponse {
  document: {
    id: number;
  };
}

@Component({
  selector: 'app-enregistrer-courrier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Enregistrer un courrier</h1>
        <p class="page-subtitle">Workflow guidé en 3 étapes</p>
      </header>

      <section class="stepper" aria-label="Progression des étapes">
        <div class="step clickable" [class.active]="currentStep === 1" (click)="goToStep(1)">
          <span class="step-index">{{ currentStep > 1 ? '✓' : '1' }}</span>
          <div>
            <p class="step-title">Informations</p>
            <p class="step-subtitle">Détails du courrier</p>
          </div>
        </div>
        <span class="step-sep">›</span>
        <div class="step clickable" [class.active]="currentStep === 2" (click)="goToStep(2)">
          <span class="step-index">{{ currentStep > 2 ? '✓' : '2' }}</span>
          <div>
            <p class="step-title">Scan / Upload</p>
            <p class="step-subtitle">Document numérique</p>
          </div>
        </div>
        <span class="step-sep">›</span>
        <div class="step clickable" [class.active]="currentStep === 3" (click)="goToStep(3)">
          <span class="step-index">3</span>
          <div>
            <p class="step-title">Distribution</p>
            <p class="step-subtitle">Assigner et envoyer</p>
          </div>
        </div>
      </section>

      <section class="card">
        @if (currentStep === 1) {
        <h2 class="card-title">Étape 1 : Informations du courrier</h2>

        <div class="grid two">
          <label class="field">
            <span>Type de document *</span>
            <select [(ngModel)]="typeDocument" name="typeDocument">
              <option value="Courrier d'arrivée">Courrier d'arrivée</option>
              <option value="Courrier de départ">Courrier de départ</option>
              <option value="Note de service">Note de service</option>
              <option value="Rapport">Rapport</option>
              <option value="Contrat">Contrat</option>
              <option value="Facture">Facture</option>
              <option value="Demande de congé">Demande de congé</option>
              <option value="Ordre de mission">Ordre de mission</option>
              <option value="PV de réunion">PV de réunion</option>
              <option value="Décision">Décision</option>
              <option value="Circulaire">Circulaire</option>
              <option value="Mémorandum">Mémorandum</option>
              <option value="Convention">Convention</option>
              <option value="Autre">Autre</option>
            </select>
          </label>

          <label class="field">
            <span>Priorité</span>
            <select [(ngModel)]="priorite" name="priorite">
              <option>Normal</option>
              <option>Urgent</option>
              <option>Très urgent</option>
            </select>
          </label>
        </div>

        <div class="section-title">Expéditeur</div>

        <div class="grid two">
          <label class="field">
            <span>Nom / Personne *</span>
            <input type="text" placeholder="Ex: Cabinet du Ministre" [(ngModel)]="nomExpediteur" name="nomExpediteur" />
          </label>

          <label class="field">
            <span>Organisme</span>
            <input type="text" placeholder="Ex: Ministère du Budget" [(ngModel)]="organisme" name="organisme" />
          </label>
        </div>

        <div class="grid two">
          <label class="field">
            <span>Type d'expéditeur</span>
            <select [(ngModel)]="typeExpediteur" name="typeExpediteur">
              <option>Externe</option>
              <option>Interne</option>
            </select>
          </label>

          <label class="field">
            <span>Numéro de référence</span>
            <input type="text" placeholder="Ex: REF-2025-001" [(ngModel)]="reference" name="reference" />
          </label>
        </div>

        <label class="field">
          <span>Objet du courrier *</span>
          <input type="text" placeholder="Ex: Demande d'appui technique pour la réforme fiscale" [(ngModel)]="objet" name="objet" />
        </label>

        <label class="field">
          <span>Description / Contenu</span>
          <textarea rows="3" placeholder="Résumé du contenu du document..." [(ngModel)]="description" name="description"></textarea>
        </label>

          <label class="field">
            <span>Niveau de confidentialité</span>
            <select [(ngModel)]="confidentialite" name="confidentialite">
              <option>Public</option>
              <option>Interne</option>
              <option>Confidentiel</option>
            </select>
          </label>
        }

        @if (currentStep === 2) {
          <h2 class="card-title">Étape 2 : Scanner ou uploader le document</h2>

          <div class="upload-zone">
            <div class="upload-icon">⇪</div>
            <p class="upload-title">Glissez-déposez votre fichier ici</p>
            <p class="upload-subtitle">ou cliquez pour sélectionner un fichier</p>

            <input #scanFileInput type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden-input" (change)="onFileSelected($event)" />
            <button type="button" class="upload-btn" (click)="scanFileInput.click()">Sélectionner un fichier</button>

            <p class="upload-help">PDF ou Image (JPG, PNG) • Max 10 MB</p>

            @if (fichierNom) {
              <p class="file-info">Fichier sélectionné : {{ fichierNom }}</p>
            }
          </div>

          <div class="scan-note">
            <p><strong>Note :</strong> Cette étape est optionnelle. Vous pouvez scanner le document plus tard et l'ajouter via la page "Distributions".</p>
          </div>
        }

        @if (currentStep === 3) {
          <h2 class="card-title">Étape 3 : Assigner et distribuer</h2>

          <label class="field">
            <span>Destinataire *</span>
            <select [(ngModel)]="destinataire" name="destinataire">
              <option value="">Sélectionner un destinataire</option>
              <option>Cabinet du Ministre</option>
              <option>Direction du Budget</option>
              <option>Direction des Ressources Humaines</option>
              <option>Secrétariat Général</option>
            </select>
          </label>

          <div class="field">
            <span>Mode de remise</span>
            <div class="delivery-modes">
              <button type="button" class="mode-btn" [class.selected]="modeRemise === 'soft'" (click)="modeRemise = 'soft'">
                <strong>Copie soft</strong>
                <small>Numérique uniquement</small>
              </button>
              <button type="button" class="mode-btn" [class.selected]="modeRemise === 'hard'" (click)="modeRemise = 'hard'">
                <strong>Copie hard</strong>
                <small>Papier uniquement</small>
              </button>
              <button type="button" class="mode-btn" [class.selected]="modeRemise === 'both'" (click)="modeRemise = 'both'">
                <strong>Les deux</strong>
                <small>Numérique + Papier</small>
              </button>
            </div>
          </div>

          <label class="field">
            <span>Commentaire / Note de distribution</span>
            <textarea rows="3" placeholder="Ex: Document urgent à traiter avant le 15/02/2025" [(ngModel)]="instructions" name="instructions"></textarea>
          </label>

          <div class="recap">
            <h3>Récapitulatif</h3>
            <div class="recap-grid">
              <span>Type :</span><strong>{{ typeDocument }}</strong>
              <span>Objet :</span><strong>{{ objet || '-' }}</strong>
              <span>Expéditeur :</span><strong>{{ nomExpediteur || '-' }}</strong>
              <span>Fichier :</span><strong>{{ fichierNom || 'Aucun fichier' }}</strong>
              <span>Destinataire :</span><strong>{{ destinataire || '-' }}</strong>
            </div>
          </div>
        }
      </section>

      <div class="actions">
        @if (submitError) {
          <p class="submit-error">{{ submitError }}</p>
        }
        <button type="button" class="btn-cancel" (click)="onPrevious()">{{ currentStep === 1 ? 'Annuler' : 'Précédent' }}</button>
        <button
          type="button"
          [class]="currentStep === 3 ? 'btn-finish' : 'btn-next'"
          [disabled]="isSubmitting"
          (click)="onNext()"
        >
          {{ currentStep === 3 ? (isSubmitting ? 'Enregistrement...' : '⬡ Enregistrer et distribuer') : 'Suivant' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .page-title {
      margin: 0;
      font-size: 20px;
      color: #0b3a78;
      font-weight: 800;
    }

    .page-subtitle {
      margin: 2px 0 0;
      font-size: 13px;
      color: #64748b;
    }

    .stepper {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 210px;
    }

    .step.clickable {
      cursor: pointer;
      border-radius: 8px;
      padding: 2px 4px;
    }

    .step.clickable:hover {
      background: #f8fafc;
    }

    .step-index {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #475569;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step.active .step-index {
      background: #0b3a78;
      color: #fff;
    }

    .step.clickable:not(.active) .step-index {
      background: #e2e8f0;
      color: #64748b;
    }

    .step-title {
      margin: 0;
      color: #0f172a;
      font-size: 14px;
      font-weight: 700;
    }

    .step-subtitle {
      margin: 1px 0 0;
      color: #64748b;
      font-size: 12px;
    }

    .step-sep {
      color: #94a3b8;
      font-size: 20px;
      line-height: 1;
    }

    .card {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-title {
      margin: 0;
      color: #0b3a78;
      font-size: 18px;
      font-weight: 700;
    }

    .section-title {
      margin-top: 2px;
      color: #334155;
      font-size: 14px;
      font-weight: 700;
      padding-top: 6px;
      border-top: 1px solid #e5e7eb;
    }

    .grid {
      display: grid;
      gap: 10px;
    }

    .grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field span {
      color: #334155;
      font-size: 12px;
      font-weight: 600;
    }

    .field input,
    .field select,
    .field textarea {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 9px 10px;
      font-size: 14px;
      color: #0f172a;
      background: #fff;
      width: 100%;
    }

    .field textarea {
      resize: vertical;
      min-height: 80px;
    }

    .upload-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 28px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      background: #ffffff;
    }

    .upload-icon {
      font-size: 34px;
      color: #94a3b8;
      line-height: 1;
    }

    .upload-title {
      margin: 0;
      color: #0f172a;
      font-size: 20px;
      font-weight: 700;
    }

    .upload-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .hidden-input {
      display: none;
    }

    .upload-btn {
      border: 0;
      border-radius: 10px;
      background: #0b3a78;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      padding: 10px 16px;
      cursor: pointer;
      min-width: 170px;
    }

    .upload-help {
      margin: 0;
      color: #64748b;
      font-size: 13px;
    }

    .file-info {
      margin: 2px 0 0;
      font-size: 12px;
      color: #0b3a78;
      font-weight: 600;
    }

    .delivery-modes {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .mode-btn {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      background: #ffffff;
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      color: #0f172a;
    }

    .mode-btn strong {
      font-size: 14px;
    }

    .mode-btn small {
      font-size: 12px;
      color: #475569;
    }

    .mode-btn.selected {
      border-color: #0b3a78;
      box-shadow: inset 0 0 0 1px #0b3a78;
      background: #f8fbff;
    }

    .recap {
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      padding: 12px;
      background: #ffffff;
    }

    .recap h3 {
      margin: 0 0 10px;
      color: #0f172a;
      font-size: 14px;
      font-weight: 700;
    }

    .recap-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 6px 10px;
      font-size: 14px;
      color: #334155;
    }

    .recap-grid strong {
      color: #0f172a;
      font-weight: 600;
    }

    .scan-note {
      border: 1px solid #93c5fd;
      background: #eff6ff;
      border-radius: 10px;
      padding: 10px 12px;
    }

    .scan-note p {
      margin: 0;
      color: #1d4ed8;
      font-size: 13px;
      line-height: 1.4;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
      padding: 0 2px;
    }

    .btn-cancel,
    .btn-next {
      border: 0;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-cancel {
      background: transparent;
      color: #334155;
    }

    .btn-next {
      background: #0b3a78;
      color: #ffffff;
      min-width: 110px;
    }

    .btn-finish {
      border: 0;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      background: #f5c542;
      color: #0f172a;
      min-width: 220px;
    }

    .btn-next:disabled,
    .btn-finish:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .submit-error {
      margin: 0;
      color: #b91c1c;
      font-size: 13px;
      font-weight: 600;
      flex: 1;
    }

    @media (max-width: 900px) {
      .grid.two {
        grid-template-columns: 1fr;
      }

      .delivery-modes {
        grid-template-columns: 1fr;
      }

      .recap-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        position: sticky;
        bottom: 0;
        background: #f1f5f9;
        padding: 8px 2px;
      }
    }
  `]
})
export class EnregistrerCourrierComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  currentStep = 1;

  typeDocument = "Courrier d'arrivée";
  priorite = 'Normal';
  nomExpediteur = '';
  organisme = '';
  typeExpediteur = 'Externe';
  reference = '';
  objet = '';
  description = '';
  confidentialite = 'Public';
  fichierNom = '';
  commentaireScan = '';
  destinataire = '';
  modeRemise: 'soft' | 'hard' | 'both' = 'both';
  instructions = '';
  isSubmitting = false;
  submitError = '';

  goToStep(step: number) {
    this.currentStep = step;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fichierNom = input.files?.[0]?.name ?? '';
  }

  onCancel() {
    this.router.navigate(['/reception']);
  }

  onPrevious() {
    if (this.currentStep === 1) {
      this.onCancel();
      return;
    }

    this.currentStep -= 1;
  }

  onNext() {
    if (this.currentStep < 3) {
      if (this.currentStep === 1 && (!this.nomExpediteur.trim() || !this.objet.trim())) {
        this.submitError = 'Veuillez renseigner au minimum l’expéditeur et l’objet.';
        return;
      }

      this.submitError = '';
      this.currentStep += 1;
      return;
    }

    if (!this.destinataire.trim()) {
      this.submitError = 'Veuillez sélectionner un destinataire avant de continuer.';
      return;
    }

    this.submitError = '';
    this.isSubmitting = true;

    const payload = {
      documentType: this.typeExpediteur === 'Interne' ? 'PILIER' : 'EXTERNE',
      receivedDate: new Date().toISOString().slice(0, 10),
      sender: this.nomExpediteur.trim(),
      subject: this.objet.trim(),
      category: this.typeDocument,
      confidentiality: this.mapConfidentialite(),
      observations: this.buildObservations()
    };

    this.http.post<CreateReceptionDocumentResponse>(`${API_BASE_URL}/reception/documents`, payload).subscribe({
      next: ({ document }) => {
        if (this.modeRemise === 'hard' || this.modeRemise === 'both') {
          this.http.post(`${API_BASE_URL}/reception/distributions/${document.id}/generate-bordereau`, {}).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.router.navigate(['/distributions']);
            },
            error: () => {
              this.isSubmitting = false;
              this.submitError = 'Courrier créé, mais échec de génération du bordereau.';
            }
          });
          return;
        }

        this.isSubmitting = false;
        this.router.navigate(['/distributions']);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Échec de l’enregistrement du courrier. Réessayez.';
      }
    });

  }

  private mapConfidentialite(): 'PUBLIC' | 'INTERNE' | 'CONFIDENTIEL' {
    if (this.confidentialite === 'Confidentiel') {
      return 'CONFIDENTIEL';
    }

    if (this.confidentialite === 'Interne') {
      return 'INTERNE';
    }

    return 'PUBLIC';
  }

  private buildObservations() {
    const values = [
      this.organisme ? `Organisme: ${this.organisme}` : '',
      this.reference ? `Référence: ${this.reference}` : '',
      this.description ? `Description: ${this.description}` : '',
      this.destinataire ? `Destinataire: ${this.destinataire}` : '',
      this.instructions ? `Instruction: ${this.instructions}` : '',
      this.fichierNom ? `Fichier: ${this.fichierNom}` : ''
    ].filter(Boolean);

    return values.join(' | ');
  }
}
