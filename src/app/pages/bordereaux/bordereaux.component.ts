import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bordereaux',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Bordereaux de remise</h1>
        <p class="page-subtitle">Gérer les bordereaux et les preuves de remise</p>
      </header>

      <section class="kpis">
        <article class="kpi-card">
          <p class="kpi-value">0</p>
          <p class="kpi-label">Bordereaux total</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-value">0</p>
          <p class="kpi-label">Signés</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-value">0</p>
          <p class="kpi-label">Non signés</p>
        </article>
      </section>

      <section class="panel empty">
        <p class="panel-title">Liste des bordereaux (0)</p>
        <p class="empty-text">Aucun bordereau généré</p>
      </section>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .page-title {
      margin: 0;
      color: #0b3a78;
      font-size: 38px;
      font-weight: 800;
    }

    .page-subtitle {
      margin: 4px 0 0;
      color: #475569;
      font-size: 22px;
    }

    .kpis {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .kpi-card {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      padding: 18px;
    }

    .kpi-value {
      margin: 0;
      color: #0b3a78;
      font-size: 44px;
      font-weight: 800;
      line-height: 1;
    }

    .kpi-label {
      margin: 8px 0 0;
      color: #334155;
      font-size: 20px;
    }

    .panel {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      overflow: hidden;
    }

    .panel-title {
      margin: 0;
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      color: #0b3a78;
      font-size: 24px;
      font-weight: 700;
    }

    .empty {
      min-height: 220px;
    }

    .empty-text {
      margin: 0;
      color: #64748b;
      font-size: 20px;
      text-align: center;
      padding-top: 70px;
    }
  `]
})
export class BordereauxComponent {}
