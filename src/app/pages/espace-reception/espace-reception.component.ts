import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface ServiceCard {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-espace-reception',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Gestion des Services & Piliers</h2>
        <p class="page-subtitle">Vue d'ensemble des services internes et des piliers de réforme</p>
      </div>

      <div class="section">
        <div class="section-title">
          <span class="section-icon">🏢</span>
          <span>Services Internes</span>
          <span class="count-badge">{{ services().length }} services</span>
        </div>
        @if (loadingServices()) {
          <div class="loading">Chargement des services...</div>
        } @else {
          <div class="cards-grid">
            @for (service of services(); track service.id) {
              <div class="service-card" [class.inactive]="!service.isActive">
                <div class="service-icon">🏛</div>
                <div class="service-content">
                  <div class="service-title">
                    <span>{{ service.name }}</span>
                    <span class="code-badge">{{ service.code }}</span>
                    @if (!service.isActive) {
                      <span class="inactive-badge">Inactif</span>
                    }
                  </div>
                  <div class="service-description">{{ service.description }}</div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <div class="section">
        <div class="section-title">
          <span class="section-icon">👥</span>
          <span>Piliers de Réforme</span>
          <span class="count-badge blue">{{ piliers().length }} piliers</span>
        </div>
        @if (loadingPiliers()) {
          <div class="loading">Chargement des piliers...</div>
        } @else {
          <div class="cards-grid">
            @for (pilier of piliers(); track pilier.id) {
              <div class="service-card" [class.inactive]="!pilier.isActive">
                <div class="service-icon">🏛</div>
                <div class="service-content">
                  <div class="service-title">
                    <span>{{ pilier.name }}</span>
                    <span class="code-badge">{{ pilier.code }}</span>
                    @if (!pilier.isActive) {
                      <span class="inactive-badge">Inactif</span>
                    }
                  </div>
                  <div class="service-description">{{ pilier.description }}</div>
                </div>
              </div>
            }
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

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    .section-icon {
      font-size: 14px;
    }

    .count-badge {
      margin-left: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #dcfce7;
      color: #15803d;
    }

    .count-badge.blue {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .service-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .service-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #dcfce7;
      color: #15803d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .service-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      flex-wrap: wrap;
    }

    .code-badge {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .service-description {
      margin-top: 4px;
      font-size: 12px;
      color: #64748b;
    }

    .inactive {
      opacity: 0.5;
    }

    .inactive-badge {
      font-size: 9px;
      font-weight: 700;
      color: #b91c1c;
      background: #fee2e2;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .loading {
      text-align: center;
      padding: 30px;
      color: #64748b;
      font-size: 13px;
    }

    @media (max-width: 1024px) {
      .cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EspaceReceptionComponent implements OnInit {
  private readonly http = inject(HttpClient);

  services = signal<ServiceCard[]>([]);
  piliers = signal<ServiceCard[]>([]);
  loadingServices = signal(true);
  loadingPiliers = signal(true);

  ngOnInit(): void {
    this.http.get<{ services: any[] }>(`${API_BASE_URL}/services`).subscribe({
      next: (res) => {
        this.services.set(res.services.map(s => ({
          id: s.id, name: s.name, code: s.code,
          description: s.description, isActive: s.isActive
        })));
        this.loadingServices.set(false);
      },
      error: () => this.loadingServices.set(false)
    });

    this.http.get<{ piliers: any[] }>(`${API_BASE_URL}/piliers`).subscribe({
      next: (res) => {
        this.piliers.set(res.piliers.map(p => ({
          id: p.id, name: p.name, code: p.code,
          description: p.description, isActive: p.isActive
        })));
        this.loadingPiliers.set(false);
      },
      error: () => this.loadingPiliers.set(false)
    });
  }
}
