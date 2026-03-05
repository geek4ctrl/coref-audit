import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messagerie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Messagerie</h1>
      </header>

      <section class="mail-layout" aria-label="Messagerie">
        <aside class="mail-sidebar">
          <button type="button" class="new-btn">↗ Nouveau message</button>
          <button type="button" class="folder-btn">⌂ Boîte de réception</button>
          <button type="button" class="folder-btn active">↗ Messages envoyés</button>
        </aside>

        <div class="mail-content">
          <div class="empty-state">
            <div class="empty-icon">✉</div>
            <p class="empty-text">Aucun message</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .page-header {
      padding-top: 2px;
    }

    .page-title {
      margin: 0;
      font-size: 40px;
      font-weight: 800;
      color: #0b3a78;
      line-height: 1;
    }

    .mail-layout {
      background: #ffffff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      min-height: 570px;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      overflow: hidden;
    }

    .mail-sidebar {
      border-right: 1px solid #dbe3ef;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .new-btn {
      border: 0;
      border-radius: 10px;
      background: #0b3a78;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      padding: 12px 16px;
      cursor: default;
    }

    .folder-btn {
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #0f172a;
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      padding: 11px 12px;
      cursor: default;
    }

    .folder-btn.active {
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
    }

    .mail-content {
      position: relative;
    }

    .empty-state {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #64748b;
    }

    .empty-icon {
      font-size: 58px;
      line-height: 1;
      opacity: 0.45;
    }

    .empty-text {
      margin: 0;
      font-size: 30px;
      color: #64748b;
    }

    @media (max-width: 900px) {
      .mail-layout {
        grid-template-columns: 1fr;
      }

      .mail-sidebar {
        border-right: 0;
        border-bottom: 1px solid #dbe3ef;
      }

      .empty-text {
        font-size: 22px;
      }
    }
  `]
})
export class MessagerieComponent {}
