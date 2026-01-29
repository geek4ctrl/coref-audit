import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SummaryCard {
  title: string;
  description: string;
  total: number;
  percentage: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-summary-card',
  imports: [CommonModule],
  template: `
    <div class="summary-card">
      <div class="summary-header">
        <div class="summary-icon" [style.background-color]="card.color">
          {{ card.icon }}
        </div>
        <div class="summary-info">
          <div class="summary-title">{{ card.title }}</div>
          <div class="summary-description">{{ card.description }}</div>
        </div>
      </div>

      <div class="summary-stats">
        <div class="stat-row">
          <span class="stat-label">Total numérisé</span>
          <span class="stat-value">{{ card.total }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Taux</span>
          <span class="stat-value percentage" [style.color]="card.color">
            {{ card.percentage }}%
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .summary-header {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }

    .summary-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
      opacity: 0.9;
    }

    .summary-info {
      flex: 1;
    }

    .summary-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .summary-description {
      font-size: 13px;
      color: #666;
    }

    .summary-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .stat-label {
      font-size: 13px;
      color: #666;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .stat-value.percentage {
      font-size: 20px;
      font-weight: 700;
    }
  `]
})
export class SummaryCardComponent {
  @Input({ required: true }) card!: SummaryCard;
}
