import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatusCard {
  title: string;
  count: number;
  description: string;
  color: string;
  icon: string;
  emphasis?: boolean;
}

@Component({
  selector: 'app-status-card',
  imports: [CommonModule],
  template: `
    <div
      class="status-card"
      [class.emphasis]="card.emphasis"
      [style.border-color]="card.color"
      [style.background-color]="card.emphasis ? card.color : 'white'"
    >
      <div class="card-content">
        <div class="card-title">{{ card.title }}</div>
        <div class="card-count">{{ card.count }}</div>
        <div class="card-description">{{ card.description }}</div>
      </div>
      <div
        class="card-icon"
        [class.emphasis-icon]="card.emphasis"
        [style.background-color]="card.emphasis ? 'rgba(255, 255, 255, 0.16)' : card.color"
      >
        {{ card.icon }}
      </div>
    </div>
  `,
  styles: [`
    .status-card {
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
      border: 1px solid;
      display: flex;
      gap: 18px;
      align-items: center;
      justify-content: space-between;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .status-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .status-card.emphasis {
      border-color: #f0c95c;
      box-shadow: 0 10px 20px rgba(10, 37, 84, 0.18);
    }

    .card-icon {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      color: white;
    }

    .card-icon.emphasis-icon {
      color: #f7f4e8;
    }

    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .card-count {
      font-size: 30px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 6px;
      color: #0f172a;
    }

    .card-description {
      font-size: 12px;
      color: #6b7280;
    }

    .status-card.emphasis .card-title,
    .status-card.emphasis .card-description {
      color: rgba(255, 255, 255, 0.75);
    }

    .status-card.emphasis .card-count {
      color: white;
    }
  `]
})
export class StatusCardComponent {
  @Input({ required: true }) card!: StatusCard;
}
