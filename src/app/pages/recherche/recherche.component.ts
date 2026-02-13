import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface SearchResult {
  number: string;
  title: string;
  status: string;
  statusTone: 'info' | 'warning' | 'success';
  delay: string;
  delayTone: 'danger' | 'muted';
  owner: string;
  date: string;
  tag: string;
}

@Component({
  selector: 'app-recherche',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Recherche de Documents</h2>
        <p class="page-subtitle">Trouvez n'importe quel document en quelques secondes</p>
      </div>

      <div class="search-card">
        <div class="search-bar">
          <span class="search-icon">🔎</span>
          <input
            type="text"
            class="search-input"
            placeholder="Numéro, mot-clé, expéditeur, service, nom..."
            (input)="onSearchInput($event)"
          />
          <button class="filters-btn">Filtres avancés</button>
        </div>
        <div class="search-hint">
          <span class="hint-icon">💡</span>
          Tapez n'importe quoi : un numéro, un mot de l'objet, un nom de personne...
        </div>
      </div>

      <div class="results-card">
        <div class="results-header">
          <h3 class="results-title">{{ searchQuery() ? 'Résultats de recherche' : 'Commencez votre recherche...' }}</h3>
        </div>
        <div class="results-list">
          @if (results().length === 0 && !searchQuery()) {
            <div class="results-empty">
              <p>Aucun document sélectionné. Commencez par entrer une recherche.</p>
            </div>
          } @else if (results().length === 0) {
            <div class="results-empty">
              <p>Aucun document trouvé pour votre recherche.</p>
            </div>
          } @else {
            @for (item of results(); track item.number) {
              <div class="result-row">
                <div class="result-main">
                  <div class="result-number">{{ item.number }}</div>
                  <div class="result-title">{{ item.title }}</div>
                  <div class="result-meta">
                    <span class="pill" [class]="item.statusTone">{{ item.status }}</span>
                    <span class="pill" [class]="item.delayTone">{{ item.delay }}</span>
                    <span class="meta-text">Chez {{ item.owner }}</span>
                    <span class="meta-divider">•</span>
                    <span class="meta-text">{{ item.date }}</span>
                  </div>
                </div>
                <div class="result-tag">{{ item.tag }}</div>
              </div>
            }
          }
        </div>
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
      margin-top: 6px;
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

    .search-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      flex-wrap: wrap;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      font-size: 16px;
      color: #94a3b8;
    }

    .search-input {
      flex: 1;
      min-width: 240px;
      padding: 12px 16px 12px 40px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 13px;
      background: #ffffff;
      outline: none;
    }

    .search-input:focus {
      border-color: #0b3a78;
      box-shadow: 0 0 0 3px rgba(11, 58, 120, 0.12);
    }

    .filters-btn {
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .search-hint {
      font-size: 12px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hint-icon {
      font-size: 14px;
    }

    .results-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      overflow: hidden;
    }

    .results-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .results-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0b3a78;
    }

    .results-list {
      display: flex;
      flex-direction: column;
    }

    .results-empty {
      padding: 40px 20px;
      text-align: center;
      color: #64748b;
    }

    .results-empty p {
      margin: 0;
      font-size: 13px;
    }

    .result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid #edf2f7;
    }

    .result-row:last-child {
      border-bottom: none;
    }

    .result-number {
      font-size: 11px;
      font-weight: 700;
      color: #0b3a78;
      margin-bottom: 6px;
      letter-spacing: 0.05em;
    }

    .result-title {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .result-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }

    .pill.info {
      color: #1d4ed8;
      background: #e0edff;
    }

    .pill.warning {
      color: #b45309;
      background: #ffedd5;
    }

    .pill.success {
      color: #15803d;
      background: #dcfce7;
    }

    .pill.danger {
      color: #b91c1c;
      background: #fee2e2;
    }

    .pill.muted {
      color: #64748b;
      background: #f1f5f9;
    }

    .meta-text {
      font-size: 12px;
      color: #1f2937;
    }

    .meta-divider {
      color: #cbd5f5;
    }

    .result-tag {
      min-width: 140px;
      text-align: right;
      font-size: 11px;
      font-weight: 600;
      color: #1f2937;
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 8px;
    }

    @media (max-width: 900px) {
      .result-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .result-tag {
        text-align: left;
      }
    }
  `]
})
export class RechercheComponent {
  private allResults: SearchResult[] = [
    {
      number: 'COREF-2026-0015',
      title: "Courrier d'arrivée - Demande d'audience Ministre",
      status: 'Document envoyé',
      statusTone: 'info',
      delay: 'En retard',
      delayTone: 'danger',
      owner: 'Direction des Ressources Humaines',
      date: '02/02/2026',
      tag: "Courrier d'arrivée"
    },
    {
      number: 'COREF-2026-0019',
      title: 'Rapport statistiques - Exécution budgétaire janvier',
      status: 'Document reçu',
      statusTone: 'success',
      delay: 'En retard',
      delayTone: 'danger',
      owner: 'Marie Kabongo',
      date: '02/02/2026',
      tag: 'Rapport'
    },
    {
      number: 'COREF-2026-0013',
      title: 'Décision - Attribution marché public véhicules',
      status: 'Document reçu',
      statusTone: 'success',
      delay: 'En retard',
      delayTone: 'danger',
      owner: 'Jean Mukendi',
      date: '02/02/2026',
      tag: 'Décision'
    },
    {
      number: 'COREF-2026-0017',
      title: "Rapport d'audit interne - Janvier 2026",
      status: 'Document envoyé',
      statusTone: 'info',
      delay: 'En retard',
      delayTone: 'danger',
      owner: 'Marie Kabongo',
      date: '01/02/2026',
      tag: 'Rapport'
    }
  ];

  searchQuery = signal<string>('');
  results = signal<SearchResult[]>([]);

  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery.set(searchTerm);

    if (!searchTerm.trim()) {
      this.results.set([]);
      return;
    }

    const filtered = this.allResults.filter(item =>
      item.number.toLowerCase().includes(searchTerm) ||
      item.title.toLowerCase().includes(searchTerm) ||
      item.owner.toLowerCase().includes(searchTerm) ||
      item.tag.toLowerCase().includes(searchTerm)
    );

    this.results.set(filtered);
  }
}

