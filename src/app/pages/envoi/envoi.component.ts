import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
              <span class="tab-icon">🔀</span>
              Router un document existant
            </button>
          </div>
          <div class="tab-underline"></div>
        </div>

        @if (activeTab() === 'new') {
          <div class="form-section">
            <div class="info-box">
              <span class="info-icon">ℹ️</span>
              <div class="info-content">
                <strong>Création et envoi direct</strong>
                <p>Le document sera automatiquement créé avec le statut ENVOYÉ et remis au destinataire choisi.</p>
              </div>
            </div>

            <form class="document-form">
              <div class="form-group">
                <label class="form-label">Objet du document <span class="required">*</span></label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Ex: Rapport mensuel budget janvier 2025"
                  [(ngModel)]="newDocument.subject"
                  name="subject"
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
                    <option>Normale</option>
                    <option>Haute</option>
                    <option>Basse</option>
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
                    placeholder="yyyy/mm/dd"
                    [(ngModel)]="newDocument.receptionDate"
                    name="receptionDate"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Assigner à <span class="required">*</span></label>
                <select class="form-select" [(ngModel)]="newDocument.assignTo" name="assignTo">
                  <option value="">Sélectionner un destinataire</option>
                  <option>Direction des Ressources Humaines</option>
                  <option>Marie Kabongo</option>
                  <option>Jean Mukendi</option>
                  <option>Service Financier</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Délai de traitement (optionnel)</label>
                  <div class="delay-input-group">
                    <input
                      type="number"
                      class="form-input"
                      placeholder="Ex: 7"
                      [(ngModel)]="newDocument.processingDelay"
                      name="processingDelay"
                      min="0"
                    />
                    <span class="delay-unit">jours</span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-primary">Créer et Envoyer</button>
                <button type="button" class="btn btn-secondary">Annuler</button>
              </div>
            </form>
          </div>
        }

        @if (activeTab() === 'route') {
          <div class="form-section">
            <div class="info-box">
              <span class="info-icon">ℹ️</span>
              <div class="info-content">
                <strong>Router un document existant</strong>
                <p>Sélectionnez un document existant et transférez-le à un autre destinataire avec traçabilité complète.</p>
              </div>
            </div>

            <form class="document-form">
              <div class="form-group">
                <label class="form-label">Sélectionner le document <span class="required">*</span></label>
                <select class="form-select">
                  <option value="">Choisir un document</option>
                  <option>COREF-2026-0015 - Courrier d'arrivée - Demande d'audience Ministre</option>
                  <option>COREF-2026-0019 - Rapport statistiques - Exécution budgétaire janvier</option>
                  <option>COREF-2026-0013 - Décision - Attribution marché public véhicules</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Assigner à <span class="required">*</span></label>
                <select class="form-select">
                  <option value="">Sélectionner un destinataire</option>
                  <option>Direction des Ressources Humaines</option>
                  <option>Marie Kabongo</option>
                  <option>Jean Mukendi</option>
                  <option>Service Financier</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Note de transfert (optionnel)</label>
                <textarea
                  class="form-textarea"
                  placeholder="Ajouter une note pour le destinataire..."
                  rows="4"
                ></textarea>
              </div>

              <div class="form-actions">
                <button class="btn btn-primary">Router le document</button>
                <button type="button" class="btn btn-secondary">Annuler</button>
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
      color: #0f172a;
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
      position: relative;
    }

    .tabs {
      display: flex;
      gap: 0;
      padding: 0;
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
      position: relative;
    }

    .tab:hover {
      color: #0f172a;
    }

    .tab.active {
      color: #0b3a78;
    }

    .tab-icon {
      font-size: 16px;
    }

    .tab-underline {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: #0b3a78;
      width: 0;
      transition: width 0.3s ease;
    }

    .tab.active ~ .tab-underline,
    .tabs:has(.tab.active:nth-child(1)) .tab-underline {
      width: 50%;
    }

    .tabs:has(.tab.active:nth-child(2)) .tab-underline {
      width: 50%;
      left: 50%;
    }

    .form-section {
      padding: 24px;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      background: #eff6ff;
      border: 1px solid #e0edff;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .info-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
    }

    .info-content strong {
      display: block;
      color: #1d4ed8;
      font-size: 13px;
      margin-bottom: 2px;
    }

    .info-content p {
      margin: 0;
      font-size: 12px;
      color: #1e40af;
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

    .delay-input-group .form-input {
      flex: 1;
    }

    .delay-unit {
      font-size: 13px;
      color: #64748b;
      white-space: nowrap;
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
    }

    .btn-primary {
      background: #0b3a78;
      color: white;
    }

    .btn-primary:hover {
      background: #082456;
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
  activeTab = signal<'new' | 'route'>('new');

  newDocument = {
    subject: '',
    type: "Courrier d'arrivée",
    priority: 'Normale',
    sender: '',
    receptionDate: '',
    assignTo: '',
    processingDelay: null
  };

  setActiveTab(tab: 'new' | 'route'): void {
    this.activeTab.set(tab);
  }
}
