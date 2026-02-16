import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-hero">
        <div class="hero-icon">↪</div>
        <h1 class="hero-title">COREF</h1>
        <p class="hero-subtitle">Système de Traçabilité des Documents</p>
        <p class="hero-subtitle">Ministère des Finances RDC</p>
      </div>

      <div class="login-card">
        <h2 class="card-title">Connexion</h2>

        <label class="field">
          <span class="field-label">Adresse email</span>
          <div class="field-input">
            <span class="field-icon">✉</span>
            <input
              type="email"
              placeholder="votre.email@finances.gouv.cd"
              [(ngModel)]="email"
              name="email"
            />
          </div>
        </label>

        <label class="field">
          <span class="field-label">Mot de passe</span>
          <div class="field-input">
            <span class="field-icon">🔒</span>
            <input
              type="password"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
            />
          </div>
        </label>

        <div class="field-row">
          <label class="checkbox">
            <input type="checkbox" [(ngModel)]="remember" name="remember" />
            <span>Se souvenir de moi</span>
          </label>
          <button class="link-btn" type="button">Mot de passe oublié?</button>
        </div>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <button class="primary-btn" type="button" (click)="onSubmit()" [disabled]="isSubmitting()">
          <span class="btn-icon">↪</span>
          {{ isSubmitting() ? 'Connexion...' : 'Se connecter' }}
        </button>

        <div class="register">
          Pas encore de compte? <button class="link-btn" type="button">Créer un compte</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
      background: radial-gradient(circle at top, #0b4a8c 0%, #07396f 45%, #022549 100%);
      padding: 28px 16px 40px;
      color: #ffffff;
    }

    .login-hero {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .hero-icon {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      background: #f5c542;
      color: #0b3a78;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .hero-title {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.08em;
      font-weight: 800;
    }

    .hero-subtitle {
      margin: 0;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }

    .login-card {
      width: min(420px, 100%);
      background: #ffffff;
      color: #0f172a;
      border-radius: 14px;
      padding: 22px 26px 24px;
      box-shadow: 0 22px 40px rgba(2, 16, 34, 0.3);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card-title {
      margin: 0;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #0b3a78;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-label {
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .field-input {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      padding: 10px 12px;
    }

    .field-icon {
      font-size: 14px;
      color: #94a3b8;
    }

    .field-input input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 12px;
      width: 100%;
      color: #0f172a;
    }

    .field-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .link-btn {
      background: none;
      border: none;
      color: #0b3a78;
      font-size: 11px;
      font-weight: 600;
      padding: 0;
    }

    .error-message {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 11px;
    }

    .primary-btn {
      background: #0b3a78;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .primary-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 14px;
    }

    .register {
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 20px 18px;
      }

      .field-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  email = '';
  password = '';
  remember = true;
  errorMessage = signal('');
  isSubmitting = signal(false);

  onSubmit() {
    this.errorMessage.set('');

    if (!this.email || !this.password) {
      this.errorMessage.set('Email and password are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(this.email, this.password, this.remember).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Invalid credentials.');
      }
    });
  }
}
