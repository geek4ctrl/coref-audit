import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
        <div class="step active">
          <span class="step-index">1</span>
          <div>
            <p class="step-title">Informations</p>
            <p class="step-subtitle">Détails du courrier</p>
          </div>
        </div>
        <span class="step-sep">›</span>
        <div class="step">
          <span class="step-index">2</span>
          <div>
            <p class="step-title">Scan / Upload</p>
            <p class="step-subtitle">Document numérique</p>
          </div>
        </div>
        <span class="step-sep">›</span>
        <div class="step">
          <span class="step-index">3</span>
          <div>
            <p class="step-title">Distribution</p>
            <p class="step-subtitle">Assigner et envoyer</p>
          </div>
        </div>
      </section>

      <section class="card">
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
      </section>
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

    @media (max-width: 900px) {
      .grid.two {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EnregistrerCourrierComponent {
  typeDocument = "Courrier d'arrivée";
  priorite = 'Normal';
  nomExpediteur = '';
  organisme = '';
  typeExpediteur = 'Externe';
  reference = '';
  objet = '';
  description = '';
  confidentialite = 'Public';
}
