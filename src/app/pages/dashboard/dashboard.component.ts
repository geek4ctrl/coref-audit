import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent, StatusCard } from '../../shared/status-card/status-card.component';
import { SummaryCardComponent, SummaryCard } from '../../shared/summary-card/summary-card.component';
import { WorkflowTrackerComponent, WorkflowStage } from '../../shared/workflow-tracker/workflow-tracker.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatusCardComponent, SummaryCardComponent, WorkflowTrackerComponent],
  template: `
    <div class="dashboard">
      <div class="greeting-section">
        <h2 class="greeting">Bonjour, Service 👋</h2>
        <p class="greeting-subtitle">Gérez les documents entrants et leur traçabilité</p>
      </div>

      <div class="search-filter-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par titre, numéro, catégorie ou service émetteur..."
            class="search-input"
          />
        </div>
        <div class="filters">
          <select class="filter-select">
            <option>Toutes les catégories</option>
          </select>
          <select class="filter-select">
            <option>Toutes urgences</option>
          </select>
        </div>
        <button class="new-doc-btn">
          ➕ Nouveau Document
        </button>
      </div>

      <div class="status-cards-grid">
        @for (card of statusCards; track card.title) {
          <app-status-card [card]="card" />
        }
      </div>

      <div class="summary-cards-grid">
        @for (card of summaryCards; track card.title) {
          <app-summary-card [card]="card" />
        }
      </div>

      <div class="workflow-section">
        <app-workflow-tracker [stages]="workflowStages" />
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 100%;
      width: 100%;
    }

    .greeting-section {
      margin-bottom: 24px;
    }

    .greeting {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 6px 0;
    }

    .greeting-subtitle {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .search-filter-section {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-bar {
      flex: 1;
      min-width: 300px;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      opacity: 0.5;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: #003d82;
    }

    .filters {
      display: flex;
      gap: 12px;
    }

    .filter-select {
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s;
    }

    .filter-select:focus {
      border-color: #003d82;
    }

    .new-doc-btn {
      padding: 12px 24px;
      background-color: #003d82;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .new-doc-btn:hover {
      background-color: #002d5e;
    }

    .status-cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-cards-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .workflow-section {
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .greeting {
        font-size: 20px;
      }

      .greeting-subtitle {
        font-size: 13px;
      }

      .search-filter-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-bar {
        min-width: 100%;
      }

      .filters {
        flex-direction: column;
        width: 100%;
      }

      .filter-select {
        width: 100%;
      }

      .new-doc-btn {
        width: 100%;
      }

      .status-cards-grid {
        grid-template-columns: 1fr;
      }

      .summary-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .status-cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .search-bar {
        min-width: 250px;
      }
    }

    @media (min-width: 1025px) and (max-width: 1366px) {
      .status-cards-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `]
})
export class DashboardComponent {
  statusCards: StatusCard[] = [
    {
      title: 'À recevoir',
      count: 0,
      description: 'Documents en réception',
      color: '#4a90e2',
      icon: '📄'
    },
    {
      title: 'À traiter',
      count: 0,
      description: 'Nécessitent votre action',
      color: '#f5a623',
      icon: '📝'
    },
    {
      title: 'En cours',
      count: 0,
      description: 'Documents en traitement',
      color: '#9b59b6',
      icon: '🔄'
    },
    {
      title: 'Terminés',
      count: 0,
      description: 'Documents archivés',
      color: '#27ae60',
      icon: '🗂️'
    }
  ];

  summaryCards: SummaryCard[] = [
    {
      title: 'Copies Numériques',
      description: 'Documents scannés et stockés',
      total: 2,
      percentage: 100,
      icon: '📄',
      color: '#4a90e2'
    },
    {
      title: 'Copies Physiques',
      description: 'Documents en circulation',
      total: 1,
      percentage: 50,
      icon: '📦',
      color: '#27ae60'
    }
  ];

  workflowStages: WorkflowStage[] = [
    {
      title: 'Réception',
      subtitle: 'Documents entrants',
      count: 0,
      color: '#4a90e2'
    },
    {
      title: 'À classifier',
      subtitle: 'Assistante du Chef',
      count: 0,
      color: '#f5a623'
    },
    {
      title: 'À approuver',
      subtitle: 'En attente Chef/SG',
      count: 0,
      color: '#ff6b6b'
    },
    {
      title: 'En traitement',
      subtitle: 'Piliers / Services',
      count: 0,
      color: '#9b59b6'
    },
    {
      title: 'Terminé',
      subtitle: 'Archivé',
      count: 0,
      color: '#27ae60'
    }
  ];
}
