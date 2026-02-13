import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RoleCard {
  title: string;
  description: string;
  tag: string;
  tagTone: 'violet' | 'green' | 'blue' | 'amber' | 'indigo' | 'orange';
}

@Component({
  selector: 'app-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Gestion des Rôles & Permissions</h2>
        <p class="page-subtitle">Vue d'ensemble des rôles et permissions du système</p>
      </div>

      <div class="info-banner">
        <div class="info-icon">ℹ</div>
        <div class="info-content">
          <div class="info-title">Système de permissions figé</div>
          <p class="info-text">
            Les permissions sont définies au niveau du code pour garantir la sécurité et la
            traçabilité. Cette page est en lecture seule et permet de consulter les rôles existants.
          </p>
        </div>
      </div>

      <div class="roles-grid">
        @for (role of roles; track role.title) {
          <div class="role-card">
            <div class="role-header">
              <div class="role-icon">🛡</div>
              <div class="role-title">{{ role.title }}</div>
            </div>
            <div class="role-description">{{ role.description }}</div>
            <span class="role-tag" [ngClass]="role.tagTone">{{ role.tag }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .page-header {
      margin-top: 4px;
    }

    .page-title {
      margin: 0 0 4px 0;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }

    .page-subtitle {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    .info-banner {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 14px 16px;
      color: #1e3a8a;
    }

    .info-icon {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      background: #dbeafe;
      color: #1d4ed8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-title {
      font-weight: 700;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .info-text {
      margin: 0;
      font-size: 12px;
      color: #1e40af;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .role-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .role-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .role-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #0b2f5c;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .role-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    .role-description {
      font-size: 12px;
      color: #64748b;
    }

    .role-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #e2e8f0;
      color: #475569;
      width: fit-content;
    }

    .role-tag.violet {
      background: #ede9fe;
      color: #6d28d9;
    }

    .role-tag.green {
      background: #dcfce7;
      color: #15803d;
    }

    .role-tag.blue {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .role-tag.amber {
      background: #fef3c7;
      color: #b45309;
    }

    .role-tag.indigo {
      background: #e0e7ff;
      color: #4338ca;
    }

    .role-tag.orange {
      background: #ffedd5;
      color: #c2410c;
    }

    @media (max-width: 1024px) {
      .roles-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CategoriesComponent {
  roles: RoleCard[] = [
    {
      title: 'Chef/SG',
      description: 'Peut voir tous les documents, router, transférer, relancer et clôturer',
      tag: 'Accès complet',
      tagTone: 'violet'
    },
    {
      title: 'Assistante du Chef',
      description: 'Classe, annote et transfère les documents au Chef/SG',
      tag: 'Accès opérationnel',
      tagTone: 'green'
    },
    {
      title: 'Assistant technique (Pilier)',
      description: 'Voit uniquement ses documents assignés, doit accuser réception et traiter',
      tag: 'Accès limité',
      tagTone: 'blue'
    },
    {
      title: 'Assistant technique coordinateur',
      description: 'Classe, annote et transfère les documents au Chef/SG',
      tag: 'Dual-mode',
      tagTone: 'indigo'
    },
    {
      title: 'Secrétariat',
      description: 'Mise en forme administrative des documents avant transmission hiérarchique',
      tag: 'Accès opérationnel',
      tagTone: 'green'
    },
    {
      title: 'Service interne',
      description: 'Voit uniquement les documents assignés à son service',
      tag: 'Accès limité',
      tagTone: 'blue'
    },
    {
      title: 'Reception',
      description: 'Enregistre et distribue les documents entrants',
      tag: 'Accès opérationnel',
      tagTone: 'green'
    },
    {
      title: 'Administrateur',
      description: 'Gère les paramètres, utilisateurs, services et catégories',
      tag: 'Administration',
      tagTone: 'orange'
    }
  ];
}
