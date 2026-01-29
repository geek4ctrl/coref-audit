import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatusCard {
  title: string;
  count: number;
  description: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-status-card',
  imports: [CommonModule],
  template: `
    <div class="status-card" [style.border-top-color]="card.color">
      <div class="card-icon" [style.background-color]="card.color">
        {{ card.icon }}
      </div>
      <div class="card-content">
        <div class="card-count">{{ card.count }}</div>
        <div class="card-title">{{ card.title }}</div>
        <div class="card-description">{{ card.description }}</div>
      </div>
    </div>
  `,
  styles: [`
    .status-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-top: 4px solid;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .status-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .card-icon {
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

    .card-content {
      flex: 1;
    }

    .card-count {
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .card-description {
      font-size: 13px;
      color: #666;
    }
  `]
})
export class StatusCardComponent {
  @Input({ required: true }) card!: StatusCard;
}
