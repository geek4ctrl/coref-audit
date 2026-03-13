import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  serviceId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserRow {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  roleTone: string;
  isActive: boolean;
}

const ROLE_MAP: Record<string, { label: string; tone: string }> = {
  ADMIN: { label: 'Administrateur', tone: 'orange' },
  CHEF_SG: { label: 'Chef/SG', tone: 'violet' },
  ASSISTANT_CHEF: { label: 'Assistante du Chef', tone: 'pink' },
  RECEPTION: { label: 'Réception', tone: 'teal' },
  SECRETARIAT: { label: 'Secrétariat', tone: 'amber' },
  PILIER: { label: 'Assistant Technique (Pilier)', tone: 'blue' },
  PILIER_COORD: { label: 'Coordinateur Pilier', tone: 'indigo' },
  SERVICE_INTERNE: { label: 'Service Interne', tone: 'cyan' },
  AUDITEUR: { label: 'Auditeur', tone: 'slate' }
};

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="header-title">
          <h2 class="page-title">Gestion des Utilisateurs</h2>
          <p class="page-subtitle">{{ filteredUsers.length }} utilisateur(s)</p>
        </div>
        <button class="btn-primary" (click)="showCreateForm = !showCreateForm">
          <span class="btn-icon">＋</span>
          Nouvel utilisateur
        </button>
      </div>

      @if (showCreateForm) {
        <div class="create-form-card">
          <h3 class="form-title">Créer un utilisateur</h3>
          <div class="form-grid">
            <input type="text" class="form-input" placeholder="Nom complet" [(ngModel)]="newUser.name" />
            <input type="email" class="form-input" placeholder="Email" [(ngModel)]="newUser.email" />
            <input type="password" class="form-input" placeholder="Mot de passe" [(ngModel)]="newUser.password" />
            <select class="form-input" [(ngModel)]="newUser.role">
              <option value="">— Sélectionner un rôle —</option>
              <option value="ADMIN">Administrateur</option>
              <option value="CHEF_SG">Chef/SG</option>
              <option value="ASSISTANT_CHEF">Assistante du Chef</option>
              <option value="RECEPTION">Réception</option>
              <option value="SECRETARIAT">Secrétariat</option>
              <option value="PILIER">Assistant Technique (Pilier)</option>
              <option value="PILIER_COORD">Coordinateur Pilier</option>
              <option value="SERVICE_INTERNE">Service Interne</option>
              <option value="AUDITEUR">Auditeur</option>
            </select>
          </div>
          @if (createError) {
            <div class="form-error">{{ createError }}</div>
          }
          <div class="form-actions">
            <button class="btn-secondary" (click)="showCreateForm = false">Annuler</button>
            <button class="btn-primary" (click)="createUser()" [disabled]="isCreating">
              {{ isCreating ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </div>
      }

      <div class="filters-card">
        <div class="filters-row">
          <div class="search-input">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Rechercher par nom ou email..." [(ngModel)]="searchQuery" />
          </div>
          <select class="filter-select" [(ngModel)]="roleFilter">
            <option value="">Tous les rôles</option>
            <option value="ADMIN">Administrateur</option>
            <option value="CHEF_SG">Chef/SG</option>
            <option value="ASSISTANT_CHEF">Assistante du Chef</option>
            <option value="RECEPTION">Réception</option>
            <option value="SECRETARIAT">Secrétariat</option>
            <option value="PILIER">Assistant Technique (Pilier)</option>
            <option value="PILIER_COORD">Coordinateur Pilier</option>
            <option value="SERVICE_INTERNE">Service Interne</option>
            <option value="AUDITEUR">Auditeur</option>
          </select>
          <select class="filter-select" [(ngModel)]="statusFilter">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Désactivé</option>
          </select>
        </div>
        <div class="filters-meta">
          <span>{{ activeCount }} actifs</span>
          <span>{{ inactiveCount }} désactivés</span>
        </div>
      </div>

      @if (isLoading) {
        <div class="loading-card">Chargement des utilisateurs...</div>
      } @else {
        <div class="table-card">
          <table class="users-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filteredUsers; track user.id) {
                <tr>
                  <td class="name-cell">
                    <div class="avatar">{{ user.initials }}</div>
                    <div class="name-info">
                      <div class="name-text">{{ user.name }}</div>
                    </div>
                  </td>
                  <td class="email-cell">{{ user.email }}</td>
                  <td>
                    <span class="role-pill" [ngClass]="user.roleTone">{{ user.roleLabel }}</span>
                  </td>
                  <td>
                    <span class="active-pill" [class.active]="user.isActive" [class.inactive]="!user.isActive">
                      {{ user.isActive ? 'Actif' : 'Désactivé' }}
                    </span>
                  </td>
                  <td>
                    <button class="icon-btn" (click)="toggleActive(user)" [disabled]="pendingIds.has(user.id)">
                      {{ user.isActive ? '🚫' : '✅' }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (!filteredUsers.length) {
            <div class="empty-state">Aucun utilisateur trouvé.</div>
          }
        </div>
      }
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

    .role-pill.indigo {
      background: #e0e7ff;
      color: #4338ca;
    }

    .role-pill.cyan {
      background: #cffafe;
      color: #0e7490;
    }

    .role-pill.slate {
      background: #e2e8f0;
      color: #334155;
    }

    .active-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }

    .active-pill.active {
      background: #dcfce7;
      color: #15803d;
    }

    .active-pill.inactive {
      background: #fee2e2;
      color: #b91c1c;
    }

    .icon-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
      cursor: pointer;
    }

    .create-form-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      padding: 20px;
    }

    .form-title {
      margin: 0 0 16px;
      font-size: 15px;
      font-weight: 700;
      color: #0b3a78;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-input {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 12px;
      outline: none;
      background: #ffffff;
      width: 100%;
      box-sizing: border-box;
    }

    .form-error {
      margin-top: 10px;
      padding: 8px 12px;
      background: #fee2e2;
      color: #b91c1c;
      border-radius: 8px;
      font-size: 12px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 14px;
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .loading-card, .empty-state {
      padding: 32px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    }

    @media (max-width: 1024px) {
      .filters-row {
        grid-template-columns: 1fr;
      }
      .form-grid {
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
export class UtilisateursComponent implements OnInit {
  private readonly http = inject(HttpClient);

  users: UserRow[] = [];
  isLoading = true;
  searchQuery = '';
  roleFilter = '';
  statusFilter = '';
  pendingIds = new Set<number>();

  showCreateForm = false;
  isCreating = false;
  createError = '';
  newUser = { name: '', email: '', password: '', role: '' };

  get filteredUsers(): UserRow[] {
    return this.users.filter(u => {
      const q = this.searchQuery.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (this.roleFilter && u.role !== this.roleFilter) return false;
      if (this.statusFilter === 'active' && !u.isActive) return false;
      if (this.statusFilter === 'inactive' && u.isActive) return false;
      return true;
    });
  }

  get activeCount(): number { return this.users.filter(u => u.isActive).length; }
  get inactiveCount(): number { return this.users.filter(u => !u.isActive).length; }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.http.get<{ users: ApiUser[] }>(`${API_BASE_URL}/users`).subscribe({
      next: (data) => {
        this.users = data.users.map(u => this.mapUser(u));
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private mapUser(u: ApiUser): UserRow {
    const mapped = ROLE_MAP[u.role] || { label: u.role, tone: 'slate' };
    const parts = u.name.trim().split(/\s+/);
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : u.name.substring(0, 2).toUpperCase();
    return {
      id: u.id,
      initials,
      name: u.name,
      email: u.email,
      role: u.role,
      roleLabel: mapped.label,
      roleTone: mapped.tone,
      isActive: u.isActive
    };
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
      this.createError = 'Tous les champs sont requis.';
      return;
    }
    this.isCreating = true;
    this.createError = '';
    this.http.post<{ user: ApiUser }>(`${API_BASE_URL}/users`, this.newUser).subscribe({
      next: (data) => {
        this.users = [this.mapUser(data.user), ...this.users];
        this.showCreateForm = false;
        this.newUser = { name: '', email: '', password: '', role: '' };
        this.isCreating = false;
      },
      error: (err) => {
        this.createError = err.error?.error || 'Erreur lors de la création.';
        this.isCreating = false;
      }
    });
  }

  toggleActive(user: UserRow): void {
    if (this.pendingIds.has(user.id)) return;
    this.pendingIds.add(user.id);
    this.http.patch<{ user: ApiUser }>(`${API_BASE_URL}/users/${user.id}`, {
      isActive: !user.isActive
    }).subscribe({
      next: (data) => {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx >= 0) this.users[idx] = this.mapUser(data.user);
        this.pendingIds.delete(user.id);
      },
      error: () => { this.pendingIds.delete(user.id); }
    });
  }
}
