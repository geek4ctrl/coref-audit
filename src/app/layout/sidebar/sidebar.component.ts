import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '../../auth/auth.service';

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

      @for (section of navSections(); track section.title) {
        <div class="nav-section">
          @if (section.title) {
            <div class="section-title">{{ section.title }}</div>
          }
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
      width: 240px;
      height: 100vh;
      background: linear-gradient(180deg, #082e5f 0%, #041f43 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 6px 0 22px rgba(2, 12, 31, 0.32);
      flex-shrink: 0;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 20px 18px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
    }

    .logo {
      font-size: 30px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 6px;
      letter-spacing: 0.01em;
    }

    .ministry, .app-title {
      font-size: 12px;
      opacity: 0.9;
      line-height: 1.4;
    }

    .app-title {
      color: rgba(255, 255, 255, 0.75);
      margin-top: 2px;
      font-size: 11px;
      font-weight: 600;
    }

    .nav-section {
      padding: 14px 0 8px;
      position: relative;
    }

    .nav-section + .nav-section {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section-title {
      padding: 0 18px 10px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.72);
    }

    .nav-menu {
      flex: 1;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      color: white;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.2s;
      position: relative;
      gap: 10px;
      border-radius: 12px;
      border: 1px solid transparent;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.14);
    }

    .nav-item.active {
      background-color: #f5c542;
      color: #0b2f5c;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(245, 197, 66, 0.35);
    }

    .nav-icon {
      font-size: 15px;
      width: 24px;
      height: 24px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-item.active .nav-icon {
      background: rgba(11, 47, 92, 0.15);
    }

    .nav-label {
      flex: 1;
      line-height: 1.2;
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
        left: -240px;
        z-index: 1000;
        transition: left 0.3s ease;
      }

      .sidebar.open {
        left: 0;
      }
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 210px;
      }

      .nav-item {
        font-size: 14px;
        padding: 9px 10px;
      }
    }
  `]
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly navSections = computed<NavSection[]>(() => this.buildNavSections(this.authService.getRole()));

  private buildNavSections(role: UserRole | null): NavSection[] {
    if (role === 'ASSISTANT_CHEF') {
      return [
        {
          title: 'BUREAU ASSISTANTE',
          items: [
            { label: 'Dashboard', route: '/dashboard', icon: '⌘' },
            { label: 'À classer / Annoter', route: '/dashboard', icon: '◻' },
            { label: 'Rédiger un document', route: '/nouveau', icon: '▣' },
            { label: 'Envoyés au Chef', route: '/dashboard', icon: '✈' },
            { label: 'À traiter par Chef', route: '/dashboard', icon: '◷' }
          ]
        },
        {
          title: '',
          items: [
            { label: 'Recherche', route: '/recherche', icon: '🔍' },
            { label: 'Messagerie', route: '/messagerie', icon: '✉️' }
          ]
        }
      ];
    }

    if (role === 'RECEPTION') {
      return [
        {
          title: 'GUICHET RÉCEPTION',
          items: [
            { label: 'Dashboard', route: '/reception', icon: '⌘' },
            { label: 'Enregistrer un courrier', route: '/enregistrer-courrier', icon: '📦' },
            { label: 'Distributions', route: '/distributions', icon: '📨' },
            { label: 'Bordereaux', route: '/bordereaux', icon: '🧾' }
          ]
        },
        {
          title: '',
          items: [
            { label: 'Recherche', route: '/recherche', icon: '🔍' },
            { label: 'Messagerie', route: '/messagerie', icon: '✉️' }
          ]
        }
      ];
    }

    return [
      {
        title: 'CHEF / SG',
        items: [
          { label: 'Dashboard', route: '/dashboard', icon: '📊' },
          { label: 'Documents', route: '/documents', icon: '📄', badge: 3 },
          { label: 'Recherche', route: '/recherche', icon: '🔍' },
          { label: 'Envoyer / Router', route: '/envoi', icon: '📤' },
          { label: 'Relances', route: '/relances', icon: '🔔' },
          { label: 'Retards', route: '/retards', icon: '⏱️' }
        ]
      },
      {
        title: 'ADMINISTRATION',
        items: [
          { label: 'Utilisateurs', route: '/utilisateurs', icon: '👥' },
          { label: 'Rôles & Permissions', route: '/categories', icon: '🛡️' },
          { label: 'Services & Piliers', route: '/services', icon: '🏛️' }
        ]
      }
    ];
  }
}
