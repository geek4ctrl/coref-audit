import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserRow {
  initials: string;
  name: string;
  email: string;
  role: string;
  roleTone: 'violet' | 'orange' | 'teal' | 'pink' | 'amber' | 'blue';
  service: string;
}

@Component({
  selector: 'app-utilisateurs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-title">
          <h2 class="page-title">Gestion des Utilisateurs</h2>
          <p class="page-subtitle">{{ users.length }} utilisateurs</p>
        </div>
        <button class="btn-primary">
          <span class="btn-icon">＋</span>
          Nouvel utilisateur
        </button>
      </div>

      <div class="filters-card">
        <div class="filters-row">
          <div class="search-input">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Rechercher par nom ou email..." />
          </div>
          <select class="filter-select">
            <option>Tous les rôles</option>
            <option>Chef/SG</option>
            <option>Administrateur</option>
            <option>Reception</option>
            <option>Assistante du Chef</option>
            <option>Secrétariat</option>
            <option>Assistant technique (Pilier)</option>
          </select>
          <select class="filter-select">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>Désactivé</option>
          </select>
        </div>
        <div class="filters-meta">
          <span>25 actifs</span>
          <span>0 désactivés</span>
          <span>12 piliers</span>
        </div>
      </div>

      <div class="table-card">
        <table class="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Service / Pilier</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user.email) {
              <tr>
                <td class="name-cell">
                  <div class="avatar">{{ user.initials }}</div>
                  <div class="name-info">
                    <div class="name-text">{{ user.name }}</div>
                  </div>
                </td>
                <td class="email-cell">{{ user.email }}</td>
                <td>
                  <span class="role-pill" [ngClass]="user.roleTone">{{ user.role }}</span>
                </td>
                <td class="service-cell">{{ user.service || '—' }}</td>
              </tr>
            }
          </tbody>
        </table>
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
      gap: 16px;
      flex-wrap: wrap;
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

    .btn-primary {
      background: #0b3a78;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 10px 18px rgba(11, 58, 120, 0.2);
    }

    .btn-icon {
      font-size: 14px;
      line-height: 1;
    }

    .filters-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .filters-row {
      display: grid;
      grid-template-columns: minmax(260px, 1fr) 240px 240px;
      gap: 12px;
      align-items: center;
    }

    .search-input {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 14px;
      color: #94a3b8;
    }

    .search-input input {
      width: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px 10px 36px;
      font-size: 12px;
      outline: none;
      background: #ffffff;
    }

    .filter-select {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 12px;
      background: #ffffff;
      color: #0f172a;
    }

    .filters-meta {
      display: flex;
      gap: 18px;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }

    .table-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      overflow: hidden;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .users-table th,
    .users-table td {
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      color: #1f2937;
      border-bottom: 1px solid #eef2f7;
    }

    .users-table thead th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      background: #f8fafc;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #083b73;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .name-text {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .email-cell,
    .service-cell {
      color: #475569;
    }

    .role-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #e2e8f0;
      color: #475569;
    }

    .role-pill.violet {
      background: #ede9fe;
      color: #6d28d9;
    }

    .role-pill.orange {
      background: #ffedd5;
      color: #c2410c;
    }

    .role-pill.teal {
      background: #ccfbf1;
      color: #0f766e;
    }

    .role-pill.pink {
      background: #fce7f3;
      color: #be185d;
    }

    .role-pill.amber {
      background: #fef3c7;
      color: #b45309;
    }

    .role-pill.blue {
      background: #dbeafe;
      color: #1d4ed8;
    }

    @media (max-width: 1024px) {
      .filters-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .filters-meta {
        flex-direction: column;
        gap: 6px;
      }
    }
  `]
})
export class UtilisateursComponent {
  users: UserRow[] = [
    {
      initials: 'GM',
      name: 'Godefroid Misenga',
      email: 'chef@coref.cd',
      role: 'Chef/SG',
      roleTone: 'violet',
      service: ''
    },
    {
      initials: 'JN',
      name: 'Joseph Papy Nkulani',
      email: 'admin@coref.cd',
      role: 'Administrateur',
      roleTone: 'orange',
      service: ''
    },
    {
      initials: 'EM',
      name: 'Elodie MBUNDU MUTOMB',
      email: 'reception@coref.cd',
      role: 'Reception',
      roleTone: 'teal',
      service: ''
    },
    {
      initials: 'TL',
      name: 'Thanya Litoko',
      email: 'assistante@coref.cd',
      role: 'Assistante du Chef',
      roleTone: 'pink',
      service: ''
    },
    {
      initials: 'GK',
      name: 'Grace Kabamba',
      email: 'secretariat@coref.cd',
      role: 'Secrétariat',
      roleTone: 'amber',
      service: ''
    },
    {
      initials: 'AP',
      name: 'Assistant Technique Pilier (Démo)',
      email: 'pilier@coref.cd',
      role: 'Assistant technique (Pilier)',
      roleTone: 'blue',
      service: 'Comptabilité Publique et Gestion de la Trésorerie'
    }
  ];
}
