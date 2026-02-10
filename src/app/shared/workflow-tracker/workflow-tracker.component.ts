import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WorkflowStage {
  title: string;
  subtitle: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-workflow-tracker',
  imports: [CommonModule],
  template: `
    <div class="workflow-tracker">
      <div class="workflow-header">
        <div class="workflow-title-section">
          <h3 class="workflow-title">Tableau de suivi — Workflow COREF</h3>
          <p class="workflow-subtitle">Suivi en temps réel du flux de documents</p>
        </div>
        <div class="workflow-legend">
          <span class="legend-item"><span class="dot soft"></span>Soft</span>
          <span class="legend-item"><span class="dot dur"></span>Dur</span>
          <span class="legend-item"><span class="dot accuse"></span>Accusé</span>
        </div>
      </div>

      <div class="workflow-stages">
        @for (stage of stages; track stage.title) {
          <div class="workflow-stage" [style.border-top-color]="stage.color">
            <div class="stage-header">
              <h4 class="stage-title">{{ stage.title }}</h4>
              <span class="stage-count" [style.background-color]="stage.color">
                {{ stage.count }}
              </span>
            </div>
            <p class="stage-subtitle">{{ stage.subtitle }}</p>

            <div class="stage-content">
              @if (stage.count === 0) {
                <div class="empty-state">
                  <div class="empty-icon">🗑️</div>
                  <p class="empty-text">Aucun document</p>
                </div>
              } @else {
                <div class="documents-list">
                  <!-- Documents will be listed here -->
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .workflow-tracker {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .workflow-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .workflow-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 4px 0;
    }

    .workflow-subtitle {
      font-size: 13px;
      color: #666;
      margin: 0;
    }

    .workflow-legend {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #666;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot.soft {
      background-color: #4a90e2;
    }

    .dot.dur {
      background-color: #27ae60;
    }

    .dot.accuse {
      background-color: #9b59b6;
    }

    .workflow-stages {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    .workflow-stage {
      background: #fafafa;
      border-radius: 8px;
      padding: 16px;
      border-top: 3px solid;
      min-height: 200px;
      display: flex;
      flex-direction: column;
    }

    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .stage-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .stage-count {
      min-width: 24px;
      height: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: 600;
      padding: 0 8px;
    }

    .stage-subtitle {
      font-size: 12px;
      color: #666;
      margin: 0 0 16px 0;
    }

    .stage-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      padding: 20px;
    }

    .empty-icon {
      font-size: 48px;
      opacity: 0.3;
      margin-bottom: 8px;
    }

    .empty-text {
      font-size: 13px;
      color: #999;
      margin: 0;
    }

    .documents-list {
      width: 100%;
    }

    @media (max-width: 1366px) {
      .workflow-stages {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .workflow-stages {
        grid-template-columns: repeat(2, 1fr);
      }

      .workflow-header {
        flex-direction: column;
        gap: 12px;
      }
    }

    @media (max-width: 768px) {
      .workflow-tracker {
        padding: 16px;
      }

      .workflow-stages {
        grid-template-columns: 1fr;
      }

      .workflow-title {
        font-size: 16px;
      }

      .workflow-subtitle {
        font-size: 12px;
      }
    }
  `]
})
export class WorkflowTrackerComponent {
  @Input() stages: WorkflowStage[] = [];
}
