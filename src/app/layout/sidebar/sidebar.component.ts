import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">COREF</div>
        <div class="ministry">Ministère des Finances RDC</div>
        <div class="app-title">Système de Traçabilité</div>
      </div>

      @for (section of navSections; track section.title) {
        <div class="nav-section">
          <div class="section-title">{{ section.title }}</div>
          <nav class="nav-menu">
            @for (item of section.items; track item.route) {
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
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 230px;
      height: 100vh;
      background: linear-gradient(180deg, #0a2d57 0%, #062244 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 24px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .ministry, .app-title {
      font-size: 10px;
      opacity: 0.9;
      line-height: 1.4;
    }

    .app-title {
      color: #f5c542;
      margin-top: 4px;
    }

    .nav-section {
      padding: 14px 0 6px;
    }

    .section-title {
      padding: 0 18px 8px;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
    }

    .nav-menu {
      flex: 1;
      padding: 0 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      color: white;
      text-decoration: none;
      font-size: 13px;
      transition: all 0.2s;
      position: relative;
      gap: 12px;
      border-radius: 12px;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }

    .nav-item.active {
      background-color: #f5c542;
      color: #0b2f5c;
      font-weight: 700;
    }

    .nav-icon {
      font-size: 16px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-label {
      flex: 1;
    }

    .badge {
      background-color: #ef4444;
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
        width: 180px;
      }

      .nav-item {
        font-size: 12px;
        padding: 10px 12px;
      }
    }
  `]
})
export class SidebarComponent {
  navSections: NavSection[] = [
    {
      title: 'CHEF / SG',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: '📊' },
        { label: 'Documents', route: '/reception', icon: '📄', badge: 3 },
        { label: 'Recherche', route: '/recherche', icon: '🔍' },
        { label: 'Envoyer / Router', route: '/envoi', icon: '📤' },
        { label: 'Relances', route: '/espace-reception', icon: '🔔' },
        { label: 'Retards', route: '/nouveau', icon: '⏱️' }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Utilisateurs', route: '/utilisateurs', icon: '👥' },
        { label: 'Rôles & Permissions', route: '/categories', icon: '🛡️' },
        { label: 'Services & Piliers', route: '/espace-reception', icon: '🏛️' }
      ]
    }
  ];
}
