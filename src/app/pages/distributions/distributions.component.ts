import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-distributions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Distributions</h1>
        <p class="page-subtitle">Gérer les courriers à distribuer et les bordereaux</p>
      </header>

      <section class="kpis">
        <article class="kpi-card">
          <p class="kpi-value">1</p>
          <p class="kpi-label">À distribuer</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-value">0</p>
          <p class="kpi-label">Distribués aujourd'hui</p>
        </article>
      </section>

      <section class="panel">
        <div class="tabs">
          <span class="tab active">À distribuer</span>
          <span class="tab">Distribués aujourd'hui</span>
        </div>

        <article class="row">
          <div>
            <p class="doc-number">COREF-2026-0002</p>
            <p class="doc-title">Document créé</p>
          </div>
          <button type="button" class="send-btn">Envoyer</button>
        </article>
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
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      font-size: 22px;
    }

    .panel {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      overflow: hidden;
    }

    .tabs {
      display: flex;
      gap: 20px;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 16px 0;
    }

    .tab {
      color: #475569;
      font-size: 20px;
      padding: 0 0 10px;
      border-bottom: 2px solid transparent;
    }

    .tab.active {
      color: #0b3a78;
      border-bottom-color: #0b3a78;
      font-weight: 700;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
    }

    .doc-number {
      margin: 0;
      color: #0b3a78;
      font-size: 18px;
      font-weight: 700;
    }

    .doc-title {
      margin: 4px 0 0;
      color: #0f172a;
      font-size: 16px;
    }

    .send-btn {
      border: 0;
      border-radius: 8px;
      background: #0b3a78;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 9px 14px;
      cursor: pointer;
    }
  `]
})
export class DistributionsComponent {}
