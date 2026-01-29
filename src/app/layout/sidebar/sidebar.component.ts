import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">COREF</div>
        <div class="ministry">Ministère des Finances RDC</div>
        <div class="app-title">Traçabilité des Documents</div>
      </div>

      <nav class="nav-menu">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
            @if (item.badge) {
              <span class="badge">{{ item.badge }}</span>
            }
          </a>
        }
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 180px;
      height: 100vh;
      background: linear-gradient(180deg, #003d82 0%, #002d5e 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 24px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .ministry, .app-title {
      font-size: 11px;
      opacity: 0.9;
      line-height: 1.4;
    }

    .app-title {
      color: #ffc107;
      margin-top: 4px;
    }

    .nav-menu {
      flex: 1;
      padding: 8px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: white;
      text-decoration: none;
      font-size: 13px;
      transition: all 0.2s;
      position: relative;
      gap: 12px;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-item.active {
      background-color: #ffc107;
      color: #003d82;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 18px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-label {
      flex: 1;
    }

    .badge {
      background-color: #dc3545;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -180px;
        z-index: 1000;
        transition: left 0.3s ease;
      }

      .sidebar.open {
        left: 0;
      }
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 160px;
      }

      .nav-item {
        font-size: 12px;
        padding: 10px 12px;
      }
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Tableau de bord', route: '/dashboard', icon: '📊' },
    { label: 'Réception / Statut', route: '/reception', icon: '📥', badge: 3 },
    { label: 'Envoi de Documents', route: '/envoi', icon: '📤' },
    { label: 'Catégories', route: '/categories', icon: '📁' },
    { label: 'Nouveau Document', route: '/nouveau', icon: '📄' },
    { label: 'Espace Réception', route: '/espace-reception', icon: '📮' },
    { label: 'Utilisateurs', route: '/utilisateurs', icon: '👥' }
  ];
}
