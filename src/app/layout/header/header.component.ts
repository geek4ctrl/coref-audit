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
        <button class="notification-btn">
          🔔
          @if (notificationCount > 0) {
            <span class="notification-badge">{{ notificationCount }}</span>
          }
        </button>

        <div class="user-profile-container">
          <div class="user-profile" (click)="toggleDropdown()">
            <div class="user-avatar">SG</div>
            <div class="user-info">
              <div class="user-name">Secrétaire Général</div>
              <div class="user-role">Chef/SG</div>
            </div>
            <span class="dropdown-icon" [class.rotated]="isDropdownOpen()">▼</span>
          </div>

          @if (isDropdownOpen()) {
            <div class="dropdown-menu">
              <div class="dropdown-header">
                <div class="dropdown-user-avatar">SG</div>
                <div class="dropdown-user-info">
                  <div class="dropdown-user-name">Secrétaire Général</div>
                  <div class="dropdown-user-email">sg@finances.gouv.cd</div>
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
      position: relative;
    }

    .user-profile-container {
      position: relative;
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
      background-color: #ffc107;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #003d82;
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
      background-color: #e0e0e0;
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
      font-size: 14px;
      color: #1a1a1a;
      text-align: left;
    }

    .dropdown-item:hover {
      background-color: #f5f5f5;
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
      color: #666;
    }

    @media (max-width: 768px) {
      .header {
        padding: 12px 16px;
      }

      .header-title h1 {
        font-size: 14px;
      }

      .subtitle {
        font-size: 10px;
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
