import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Document {
  id: string;
  title: string;
  date: string;
  category: string;
  categoryColor: string;
  imageUrl?: string;
}

interface DocumentSection {
  title: string;
  description: string;
  count: number;
  color: string;
  icon: string;
  emptyMessage: string;
  emptyIcon: string;
  documents: Document[];
}

@Component({
  selector: 'app-reception',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Réception / Envoi / Statut</h1>
        <p class="page-subtitle">Gérer la circulation de vos documents</p>
      </div>

      <div class="sections-container">
        <div
          *ngFor="let section of sections"
          class="section-card"
          [style.background-color]="section.color + '15'"
        >
          <div class="section-header">
            <div class="section-icon" [style.background-color]="section.color">
              {{ section.icon }}
            </div>
            <div class="section-info">
              <h2 class="section-title">{{ section.title }}</h2>
              <p class="section-description">{{ section.description }}</p>
            </div>
            <div class="section-badge" [style.background-color]="section.color">
              {{ section.count }}
            </div>
          </div>

          <div class="section-content">
            <div class="empty-state" *ngIf="section.count === 0">
              <div class="placeholder-image">
                <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                  <!-- Background -->
                  <rect width="600" height="300" fill="#e8e8e8"/>

                  <!-- Image icon -->
                  <g transform="translate(300, 150)">
                    <!-- Mountain/landscape icon -->
                    <path d="M-60,20 L-40,-10 L-20,10 L0,-20 L20,0 L40,-15 L60,20 Z" fill="#c0c0c0"/>
                    <circle cx="-35" cy="-25" r="12" fill="#d0d0d0"/>
                  </g>

                  <!-- Text -->
                  <text x="50%" y="75%" text-anchor="middle" fill="#999" font-size="16" font-family="Arial, sans-serif" font-weight="500">
                    {{ section.emptyMessage }}
                  </text>
                </svg>
              </div>
            </div>
            <div class="documents-grid" *ngIf="section.count > 0">
              <div class="document-card" *ngFor="let doc of section.documents">
                <div class="document-image">
                  <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="240" fill="#e0e0e0"/>
                    <g transform="translate(200, 120)">
                      <path d="M-50,20 L-30,-15 L-10,5 L10,-25 L30,-5 L50,15 Z" fill="#c0c0c0"/>
                      <circle cx="-25" cy="-30" r="15" fill="#d0d0d0"/>
                    </g>
                  </svg>
                </div>
                <div class="document-content">
                  <div class="document-meta">
                    <span class="document-date">{{ doc.date }}</span>
                    <span class="document-category" [style.color]="doc.categoryColor">{{ doc.category }}</span>
                  </div>
                  <h3 class="document-title">{{ doc.title }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-summary">
        <div class="stat-box" style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);">
          <div class="stat-count">{{ sections[0].count }}</div>
          <div class="stat-label">Reçus</div>
        </div>
        <div class="stat-box" style="background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);">
          <div class="stat-count">{{ sections[1].count }}</div>
          <div class="stat-label">À traiter</div>
        </div>
        <div class="stat-box" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
          <div class="stat-count">{{ sections[2].count }}</div>
          <div class="stat-label">Envoyés</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      font-size: 15px;
      color: #666;
      margin: 0;
    }

    .sections-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .section-card {
      border-radius: 16px;
      padding: 24px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .section-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .section-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
      color: white;
    }

    .section-info {
      flex: 1;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 4px 0;
    }

    .section-description {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .section-badge {
      min-width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 700;
      color: white;
      padding: 0 8px;
    }

    .section-content {
      padding-top: 24px;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      padding: 32px 24px;
      width: 100%;
    }

    .placeholder-image {
      max-width: 700px;
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      background: #e8e8e8;
      border: 1px solid #ddd;
    }

    .placeholder-image svg {
      width: 100%;
      height: auto;
      display: block;
    }

    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      width: 100%;
      padding: 4px;
    }

    .document-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .document-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }

    .document-image {
      width: 100%;
      height: 180px;
      background: #e0e0e0;
      overflow: hidden;
    }

    .document-image svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .document-content {
      padding: 16px 20px 20px;
    }

    .document-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }

    .document-date {
      font-size: 13px;
      color: #666;
    }

    .document-category {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .document-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.4;
    }

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 32px;
    }

    .stat-box {
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-box:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .stat-count {
      font-size: 42px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.95;
      text-transform: capitalize;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .section-header {
        flex-wrap: wrap;
      }

      .section-badge {
        min-width: 36px;
        height: 36px;
        font-size: 16px;
      }

      .stats-summary {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .stat-box {
        padding: 20px;
      }

      .stat-count {
        font-size: 36px;
      }

      .documents-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReceptionComponent {
  sections: DocumentSection[] = [
    {
      title: 'Documents reçus',
      description: 'Nouveaux documents assignés à vous',
      count: 3,
      color: '#3B82F6',
      icon: '📥',
      emptyMessage: 'Aucun nouveau document',
      emptyIcon: '📭',
      documents: [
        {
          id: '1',
          title: 'Rapport Financier Annuel 2025',
          date: '28 Jan 2026',
          category: 'Rapport Financier',
          categoryColor: '#3B82F6'
        },
        {
          id: '2',
          title: 'Procès-verbal de la Réunion du Conseil',
          date: '25 Jan 2026',
          category: 'Compte Rendu',
          categoryColor: '#8B5CF6'
        },
        {
          id: '3',
          title: 'Note de Service: Nouvelles Procédures',
          date: '22 Jan 2026',
          category: 'Note de Service',
          categoryColor: '#06B6D4'
        }
      ]
    },
    {
      title: 'À traiter',
      description: 'Documents nécessitant votre action',
      count: 2,
      color: '#F97316',
      icon: '⚡',
      emptyMessage: 'Tous les documents ont été traités',
      emptyIcon: '✓',
      documents: [
        {
          id: '4',
          title: 'Demande d\'Approbation Budgétaire',
          date: '20 Jan 2026',
          category: 'Demande',
          categoryColor: '#F97316'
        },
        {
          id: '5',
          title: 'Contrat de Partenariat à Réviser',
          date: '18 Jan 2026',
          category: 'Contrat',
          categoryColor: '#EF4444'
        }
      ]
    },
    {
      title: 'Documents envoyés',
      description: 'Documents que vous avez transmis',
      count: 4,
      color: '#10B981',
      icon: '✈️',
      emptyMessage: 'Aucun document envoyé',
      emptyIcon: '📤',
      documents: [
        {
          id: '6',
          title: 'Évaluation de Performance Q4 2025',
          date: '30 Jan 2026',
          category: 'Rapport',
          categoryColor: '#10B981'
        },
        {
          id: '7',
          title: 'Recommandations Stratégiques',
          date: '28 Jan 2026',
          category: 'Stratégie',
          categoryColor: '#14B8A6'
        },
        {
          id: '8',
          title: 'Directive Administrative',
          date: '26 Jan 2026',
          category: 'Directive',
          categoryColor: '#059669'
        },
        {
          id: '9',
          title: 'Plan d\'Action Trimestriel',
          date: '24 Jan 2026',
          category: 'Planification',
          categoryColor: '#0D9488'
        }
      ]
    }
  ];
}
