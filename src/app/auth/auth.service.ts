import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export type UserRole =
  | 'ADMIN'
  | 'CHEF_SG'
  | 'ASSISTANT_CHEF'
  | 'RECEPTION'
  | 'SECRETARIAT'
  | 'PILIER'
  | 'PILIER_COORD'
  | 'SERVICE_INTERNE'
  | 'AUDITEUR';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const API_BASE_URL = 'http://localhost:3000';
export const STORAGE_KEY = 'coref-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<AuthUser | null>(null);
  token = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {
    this.restoreSession();
  }

  login(email: string, password: string, remember: boolean) {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.token.set(response.token);
          this.user.set(response.user);
          this.persistSession(remember);
        })
      );
  }

  logout() {
    this.user.set(null);
    this.token.set(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  isAuthenticated() {
    return !!this.token();
  }

  getRole() {
    return this.user()?.role ?? null;
  }

  getDefaultRoute(role: UserRole | null) {
    switch (role) {
      case 'ADMIN':
        return '/utilisateurs';
      case 'CHEF_SG':
      case 'ASSISTANT_CHEF':
        return '/dashboard';
      case 'RECEPTION':
        return '/reception';
      case 'SECRETARIAT':
      case 'PILIER':
      case 'PILIER_COORD':
      case 'SERVICE_INTERNE':
        return '/documents';
      case 'AUDITEUR':
        return '/dashboard';
      default:
        return '/login';
    }
  }

  private persistSession(remember: boolean) {
    const payload = JSON.stringify({ token: this.token(), user: this.user() });
    if (remember) {
      localStorage.setItem(STORAGE_KEY, payload);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, payload);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private restoreSession() {
    const stored = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as { token?: string; user?: AuthUser };
      if (parsed.token && parsed.user) {
        this.token.set(parsed.token);
        this.user.set(parsed.user);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
}
