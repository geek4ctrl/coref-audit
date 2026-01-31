import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocumentSection {
  title: string;
  description: string;
  count: number;
  color: string;
  icon: string;
  emptyMessage: string;
  emptyIcon: string;
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
              <div class="empty-icon">{{ section.emptyIcon }}</div>
              <p class="empty-message">{{ section.emptyMessage }}</p>
            </div>
            <div class="documents-list" *ngIf="section.count > 0">
              <!-- Documents will be displayed here -->
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

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.3;
      filter: grayscale(100%);
    }

    .empty-message {
      font-size: 15px;
      color: #999;
      margin: 0;
    }

    .documents-list {
      width: 100%;
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
    }
  `]
})
export class ReceptionComponent {
  sections: DocumentSection[] = [
    {
      title: 'Documents reçus',
      description: 'Nouveaux documents assignés à vous',
      count: 0,
      color: '#3B82F6',
      icon: '📥',
      emptyMessage: 'Aucun nouveau document',
      emptyIcon: '📭'
    },
    {
      title: 'À traiter',
      description: 'Documents nécessitant votre action',
      count: 0,
      color: '#F97316',
      icon: '⚡',
      emptyMessage: 'Tous les documents ont été traités',
      emptyIcon: '✓'
    },
    {
      title: 'Documents envoyés',
      description: 'Documents que vous avez transmis',
      count: 0,
      color: '#10B981',
      icon: '✈️',
      emptyMessage: 'Aucun document envoyé',
      emptyIcon: '📤'
    }
  ];
}
