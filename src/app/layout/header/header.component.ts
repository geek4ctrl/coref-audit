import { Component, signal } from '@angular/core';
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
        <button class="notification-btn" aria-label="Notifications">
          🔔
          @if (notificationCount > 0) {
            <span class="notification-badge">{{ notificationCount }}</span>
          }
        </button>

        <div class="user-profile-container">
          <div class="user-profile" (click)="toggleDropdown()">
            <div class="user-avatar">JN</div>
            <div class="user-info">
              <div class="user-name">Joseph Papy Nkulani</div>
              <div class="user-role">Admin</div>
            </div>
            <span class="dropdown-icon" [class.rotated]="isDropdownOpen()">▼</span>
          </div>

          @if (isDropdownOpen()) {
            <div class="dropdown-menu">
              <div class="dropdown-header">
                <div class="dropdown-user-avatar">JN</div>
                <div class="dropdown-user-info">
                  <div class="dropdown-user-name">Joseph Papy Nkulani</div>
                  <div class="dropdown-user-email">jp.nkulani@finances.gouv.cd</div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item">
                <span class="dropdown-item-icon">👤</span>
                <span>Mon profil</span>
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger">
                <span class="dropdown-item-icon">🚪</span>
                <span>Déconnexion</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #ffffff;
      padding: 12px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 0 rgba(15, 23, 42, 0.06);
      border-bottom: 1px solid #e5e7eb;
      min-height: 64px;
      flex-shrink: 0;
    }

    .header-title h1 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .subtitle {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
    }

    .user-profile-container {
      position: relative;
    }

    .notification-btn {
      position: relative;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      font-size: 16px;
      cursor: pointer;
      padding: 8px 10px;
      border-radius: 12px;
      transition: background-color 0.2s;
    }

    .notification-btn:hover {
      background-color: #e2e8f0;
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background-color: #e11d48;
      color: white;
      border-radius: 999px;
      padding: 2px 5px;
      font-size: 9px;
      font-weight: bold;
      min-width: 16px;
      text-align: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      transition: background-color 0.2s;
    }

    .user-profile:hover {
      background-color: #e2e8f0;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #f5c542;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #0b3a78;
      font-size: 12px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }

    .user-role {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      transition: transform 0.2s;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
      min-width: 260px;
      z-index: 1000;
      padding: 8px 0;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
    }

    .dropdown-user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #f5c542;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #0b3a78;
      font-size: 14px;
      flex-shrink: 0;
    }

    .dropdown-user-info {
      flex: 1;
      min-width: 0;
    }

    .dropdown-user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-user-email {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 8px 0;
    }

    .dropdown-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border: none;
      background: none;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 13px;
      color: #0f172a;
      text-align: left;
    }

    .dropdown-item:hover {
      background-color: #f1f5f9;
    }

    .dropdown-item.danger {
      color: #dc3545;
    }

    .dropdown-item.danger:hover {
      background-color: #fff5f5;
    }

    .dropdown-item-icon {
      font-size: 16px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dropdown-icon {
      font-size: 10px;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .header {
        padding: 12px 16px;
      }

      .header-title h1 {
        font-size: 12px;
      }

      .subtitle {
        font-size: 9px;
      }

      .user-info {
        display: none;
      }

      .header-actions {
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .header-title h1 {
        font-size: 12px;
      }

      .subtitle {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  notificationCount = 1;
  isDropdownOpen = signal(false);

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }
}
