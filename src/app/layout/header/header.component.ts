import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-title">
        <h1>Système de Traçabilité des Documents — COREF</h1>
        <p class="subtitle">Ministère des Finances RDC</p>
      </div>

      <div class="header-actions">
        <button class="notification-btn">
          🔔
          @if (notificationCount > 0) {
            <span class="notification-badge">{{ notificationCount }}</span>
          }
        </button>

        <div class="user-profile">
          <div class="user-avatar">SR</div>
          <div class="user-info">
            <div class="user-name">Service Réception</div>
            <div class="user-role">Réception</div>
          </div>
          <span class="dropdown-icon">▼</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: white;
      padding: 12px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      border-bottom: 1px solid #e0e0e0;
      min-height: 64px;
      flex-shrink: 0;
    }

    .header-title h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .subtitle {
      margin: 2px 0 0;
      font-size: 12px;
      color: #666;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .notification-btn {
      position: relative;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .notification-btn:hover {
      background-color: #f5f5f5;
    }

    .notification-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: #dc3545;
      color: white;
      border-radius: 10px;
      padding: 2px 5px;
      font-size: 10px;
      font-weight: bold;
      min-width: 16px;
      text-align: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .user-profile:hover {
      background-color: #f5f5f5;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #ffc107;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #003d82;
      font-size: 14px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .user-role {
      font-size: 12px;
      color: #666;
    }

    .dropdown-icon {
      font-size: 10px;
      color: #666;
    }
  `]
})
export class HeaderComponent {
  notificationCount = 1;
}
