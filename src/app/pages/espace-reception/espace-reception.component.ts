import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceCard {
  name: string;
  code: string;
  description: string;
}

@Component({
  selector: 'app-espace-reception',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Gestion des Services & Piliers</h2>
        <p class="page-subtitle">Vue d'ensemble des services internes et des 16 piliers de réforme</p>
      </div>

      <div class="section">
        <div class="section-title">
          <span class="section-icon">🏢</span>
          <span>Services Internes</span>
          <span class="count-badge">{{ services.length }} services</span>
        </div>
        <div class="cards-grid">
          @for (service of services; track service.code) {
            <div class="service-card">
              <div class="service-icon">🏛</div>
              <div class="service-content">
                <div class="service-title">
                  <span>{{ service.name }}</span>
                  <span class="code-badge">{{ service.code }}</span>
                </div>
                <div class="service-description">{{ service.description }}</div>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          <span class="section-icon">👥</span>
          <span>Piliers de Réforme</span>
          <span class="count-badge blue">{{ piliers.length }} piliers</span>
        </div>
        <div class="cards-grid">
          @for (pilier of piliers; track pilier.code) {
            <div class="service-card">
              <div class="service-icon">🏛</div>
              <div class="service-content">
                <div class="service-title">
                  <span>{{ pilier.name }}</span>
                  <span class="code-badge">{{ pilier.code }}</span>
                </div>
                <div class="service-description">{{ pilier.description }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .page-header {
      margin-top: 4px;
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

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    .section-icon {
      font-size: 14px;
    }

    .count-badge {
      margin-left: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #dcfce7;
      color: #15803d;
    }

    .count-badge.blue {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .service-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .service-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #dcfce7;
      color: #15803d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .service-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      flex-wrap: wrap;
    }

    .code-badge {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .service-description {
      margin-top: 4px;
      font-size: 12px;
      color: #64748b;
    }

    @media (max-width: 1024px) {
      .cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EspaceReceptionComponent {
  services: ServiceCard[] = [
    {
      name: 'Direction des Ressources Humaines',
      code: 'DRH',
      description: 'Gestion du personnel et des ressources humaines'
    },
    {
      name: 'Direction du Budget',
      code: 'BUDGET',
      description: 'Préparation et suivi du budget'
    },
    {
      name: 'Direction de la Comptabilité',
      code: 'COMPTA',
      description: 'Comptabilité générale et analytique'
    },
    {
      name: 'Service du Protocole',
      code: 'PROTO',
      description: 'Protocole et relations publiques'
    },
    {
      name: 'Service Logistique',
      code: 'LOG',
      description: 'Gestion de la logistique et des approvisionnements'
    },
    {
      name: 'Service Juridique',
      code: 'JUR',
      description: 'Conseil juridique et contentieux'
    },
    {
      name: 'Direction Informatique',
      code: 'INFO',
      description: 'Support technique et systèmes d information'
    },
    {
      name: 'Service Financier',
      code: 'FIN',
      description: 'Gestion financière et comptabilité'
    },
    {
      name: 'Service Communication',
      code: 'COM',
      description: 'Communication interne et externe'
    },
    {
      name: 'Service Maintenance',
      code: 'MAINT',
      description: 'Maintenance des bâtiments et équipements'
    },
    {
      name: 'Service Courrier',
      code: 'COUR',
      description: 'Gestion du courrier et des envois'
    },
    {
      name: 'Service Réception',
      code: 'RECEP',
      description: 'Réception et enregistrement des courriers entrants'
    },
    {
      name: 'Service Nettoyage',
      code: 'NETT',
      description: 'Entretien et nettoyage des locaux'
    },
    {
      name: 'Service Archive',
      code: 'ARCH',
      description: 'Archivage et conservation des documents'
    },
    {
      name: 'Service Administratif',
      code: 'ADMIN',
      description: 'Administration générale et appui administratif'
    },
    {
      name: 'Secrétariat',
      code: 'SEC',
      description: 'Secrétariat général et appui administratif'
    }
  ];

  piliers: ServiceCard[] = [
    {
      name: 'Comptabilité Publique',
      code: 'P01',
      description: 'Normalisation et fiabilisation des comptes publics'
    },
    {
      name: 'Gestion de la Trésorerie',
      code: 'P02',
      description: 'Prévision et optimisation de la trésorerie'
    },
    {
      name: 'Réformes Budgétaires',
      code: 'P03',
      description: 'Modernisation du cycle budgétaire'
    },
    {
      name: 'Contrôle Interne',
      code: 'P04',
      description: 'Renforcement des dispositifs de contrôle'
    },
    {
      name: 'Digitalisation',
      code: 'P05',
      description: 'Transformation numérique des processus'
    },
    {
      name: 'Achat Public',
      code: 'P06',
      description: 'Amélioration des procédures de passation'
    },
    {
      name: 'Performance',
      code: 'P07',
      description: 'Pilotage par résultats et indicateurs'
    },
    {
      name: 'Gouvernance',
      code: 'P08',
      description: 'Transparence et redevabilité'
    },
    {
      name: 'Audit Interne',
      code: 'P09',
      description: 'Renforcement des audits et conformité'
    },
    {
      name: 'Partenariats',
      code: 'P10',
      description: 'Coordination avec les partenaires techniques'
    },
    {
      name: 'Communication',
      code: 'P11',
      description: 'Diffusion des réformes et gestion du changement'
    }
  ];
}
