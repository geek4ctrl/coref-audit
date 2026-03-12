import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StatusCardComponent, StatusCard } from '../../shared/status-card/status-card.component';
import { API_BASE_URL, AuthService } from '../../auth/auth.service';

interface AssistantDashboardResponse {
  cards: {
    toReceive: number;
    toProcess: number;
    inProgress: number;
    done: number;
  };
  quickFilters: {
    all: number;
    toProcess: number;
    assignedToMe: number;
    sentByMe: number;
    noAck: number;
    delayed: number;
    blocked: number;
    treatedThisWeek: number;
  };
  documents: AssistantDashboardDocument[];
}

interface AssistantDashboardDocument {
  id: number;
  number: string;
  object: string;
  type: string;
  owner: string;
  ownerRole: string;
  status: string;
  statusTone: 'info' | 'warning' | 'success';
  lastActionAt: string;
  lastActionNote: string;
  delay: string;
  delayTone: 'danger' | 'muted';
}

interface DashboardDocument {
  id: number;
  number: string;
  object: string;
  type: string;
  owner: string;
  ownerRole: string;
  status: string;
  statusTone: 'info' | 'warning' | 'success';
  lastAction: string;
  lastActionNote: string;
  delay: string;
  delayTone: 'danger' | 'muted';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatusCardComponent],
  template: `
    <div class="dashboard">
      @if (isPilierMode) {
        <div class="page-heading">
          <div>
            <h2 class="page-title pilier-title">Mes Documents - Service</h2>
            <p class="page-subtitle">{{ pilierServiceName }}</p>
          </div>
        </div>

        <div class="pilier-status-cards">
          @for (card of pilierCards; track card.label) {
            <div
              class="pilier-card"
              [class.pilier-card-active]="pilierActiveTab === card.tabKey"
              (click)="setPilierTab(card.tabKey)"
            >
              <div class="pilier-card-content">
                <span class="pilier-card-label">{{ card.label }}</span>
                <span class="pilier-card-count" [style.color]="card.countColor">{{ card.count }}</span>
              </div>
              <div class="pilier-card-icon" [style.background]="card.iconBg">
                <span [style.color]="card.iconColor">{{ card.icon }}</span>
              </div>
            </div>
          }
        </div>

        <div class="pilier-table-card">
          <div class="pilier-tabs">
            @for (tab of pilierTabs; track tab.key) {
              <button
                class="pilier-tab"
                [class.pilier-tab-active]="pilierActiveTab === tab.key"
                (click)="setPilierTab(tab.key)"
              >
                <span class="pilier-tab-icon">{{ tab.icon }}</span>
                {{ tab.label }}
              </button>
            }
          </div>

          <div class="table-wrapper">
            <table class="documents-table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Objet</th>
                  <th>Statut</th>
                  <th>Dernière action</th>
                  <th>Échéance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (doc of filteredPilierDocuments; track doc.id) {
                  <tr>
                    <td><div class="doc-number">{{ doc.number }}</div></td>
                    <td>
                      <div class="doc-title">{{ doc.object }}</div>
                      @if (doc.chiefInstruction) {
                        <div class="doc-meta">{{ doc.chiefInstruction }}</div>
                      }
                    </td>
                    <td><span [class]="'status-pill ' + doc.statusTone">{{ doc.status }}</span></td>
                    <td>{{ doc.lastAction }}</td>
                    <td>{{ doc.deadline || '—' }}</td>
                    <td>
                      <div class="action-buttons">
                        @if (doc.status === 'ENVOYE' || !doc.status) {
                          <button class="pilier-action-btn blue" (click)="pilierAction(doc.id, 'acknowledge')" [disabled]="isBusy(doc.id)">Accuser réception</button>
                        }
                        @if (doc.status === 'RECU') {
                          <button class="pilier-action-btn orange" (click)="pilierAction(doc.id, 'start-processing')" [disabled]="isBusy(doc.id)">Démarrer</button>
                        }
                        @if (doc.status === 'EN_TRAITEMENT') {
                          <button class="pilier-action-btn green" (click)="pilierAction(doc.id, 'finalize')" [disabled]="isBusy(doc.id)">Finaliser</button>
                        }
                        @if (doc.status === 'FINALISE') {
                          <button class="pilier-action-btn purple" (click)="pilierAction(doc.id, 'send-to-coordinator')" [disabled]="isBusy(doc.id)">Envoyer au Coord.</button>
                        }
                        @if (doc.status === 'ENVOYE_COORDINATEUR') {
                          <span class="doc-meta">En attente validation</span>
                        }
                        <button class="icon-btn" aria-label="Voir" (click)="viewPilierDocument(doc.id)">👁️</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            @if (filteredPilierDocuments.length === 0) {
              <div class="pilier-empty-state">
                <div class="pilier-empty-icon">☑</div>
                <p>Aucun document dans cette catégorie</p>
              </div>
            }
          </div>
        </div>
      } @else if (isAssistantMode) {
        <div class="assistant-page-heading">
          <div>
            <h2 class="assistant-page-title">Dashboard Assistante</h2>
            <p class="assistant-page-subtitle">Bonjour {{ assistantDisplayName }}, voici un aperçu de votre activité</p>
          </div>
          <div class="assistant-date">{{ todayLabel }}</div>
        </div>

        <div class="assistant-kpi-grid">
          @for (card of assistantCards; track card.title) {
            <div
              class="assistant-kpi-card"
              [class.assistant-kpi-card-clickable]="!!card.route"
              (click)="card.route ? navigateTo(card.route) : null"
            >
              <div class="assistant-kpi-top">
                <div class="assistant-kpi-title">{{ card.title }}</div>
                <div [class]="'assistant-kpi-icon ' + card.iconTone">{{ card.icon }}</div>
              </div>
              <div class="assistant-kpi-count">{{ card.count }}</div>
              <div class="assistant-kpi-note">{{ card.note }}</div>
            </div>
          }
        </div>

        <div class="assistant-panel">
          <div class="assistant-panel-title">Actions rapides</div>
          <div class="assistant-actions-grid">
            <button class="assistant-action" (click)="openFirstDocumentForClassification()">
              <span class="assistant-action-icon">◻</span>
              <span>
                <strong>Classer un document</strong>
                <small>Annoter et catégoriser</small>
              </span>
            </button>
            <button class="assistant-action" (click)="goToSentView()">
              <span class="assistant-action-icon">✈</span>
              <span>
                <strong>Voir envois au Chef</strong>
                <small>Documents transférés</small>
              </span>
            </button>
            <button class="assistant-action" (click)="goToSearch()">
              <span class="assistant-action-icon">▣</span>
              <span>
                <strong>Rechercher</strong>
                <small>Trouver un document</small>
              </span>
            </button>
          </div>
        </div>

        <div class="assistant-panel assistant-list-panel">
          <div class="assistant-list-header">
            <div class="assistant-panel-title">Derniers documents reçus</div>
            <button class="assistant-see-all" (click)="goToSearch()">Voir tout →</button>
          </div>
          @for (doc of recentAssistantDocuments; track doc.id) {
            <div class="assistant-doc-row">
              <div>
                <div class="assistant-doc-meta">{{ doc.number }} <span class="assistant-priority-pill">{{ doc.delay === 'En retard' ? 'Urgent' : 'Normal' }}</span></div>
                <div class="assistant-doc-subject">{{ doc.object }}</div>
                <div class="assistant-doc-footer">Expéditeur: {{ doc.owner }} • {{ doc.lastAction }}</div>
              </div>
              <button class="assistant-open-btn" (click)="classifyDocument(doc.id)" [disabled]="isBusy(doc.id)">Ouvrir</button>
            </div>
          }
          @if (!recentAssistantDocuments.length && !isLoading) {
            <div class="assistant-empty">Aucun document reçu.</div>
          }
        </div>
      } @else {
        <div class="page-heading">
          <div>
            <h2 class="page-title">{{ pageTitle }}</h2>
            <p class="page-subtitle">{{ pageSubtitle }}</p>
          </div>
        </div>

        <div class="status-cards-grid">
          @for (card of statusCards; track card.title) {
            <app-status-card [card]="card" />
          }
        </div>

        <div class="filters-card">
          <div class="filters-title">Filtres rapides:</div>
          <div class="filters-row">
            <div class="filter-chips">
              @for (filter of quickFilters; track filter.label) {
                <button class="filter-chip" [class.active]="filter.active">
                  <span class="chip-label">{{ filter.label }}</span>
                  <span class="chip-count">{{ filter.count }}</span>
                </button>
              }
            </div>
            <button class="pill-action">Par pilier</button>
          </div>
        </div>

        <div class="table-card">
          <div class="table-header">
            <div>
              <h3 class="table-title">Documents en cours</h3>
              <p class="table-subtitle">{{ documents.length }} documents</p>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="documents-table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Objet</th>
                  <th>Chez qui</th>
                  <th>Statut</th>
                  <th>Dernière action</th>
                  <th>Retard</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (doc of documents; track doc.number) {
                  <tr>
                    <td>
                      <div class="doc-number">{{ doc.number }}</div>
                    </td>
                    <td>
                      <div class="doc-title">{{ doc.object }}</div>
                      <div class="doc-meta">{{ doc.type }}</div>
                    </td>
                    <td>
                      <div class="doc-owner">{{ doc.owner }}</div>
                      <div class="doc-meta">{{ doc.ownerRole }}</div>
                    </td>
                    <td>
                      <span [class]="'status-pill ' + doc.statusTone">{{ doc.status }}</span>
                    </td>
                    <td>
                      <div class="doc-owner">{{ doc.lastAction }}</div>
                      <div class="doc-meta">{{ doc.lastActionNote }}</div>
                    </td>
                    <td>
                      <span [class]="'delay-pill ' + doc.delayTone">{{ doc.delay }}</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="icon-btn" aria-label="Classer" (click)="classifyDocument(doc.id)" [disabled]="isBusy(doc.id)">👁️</button>
                        <button class="icon-btn" aria-label="Traiter" (click)="isAssistantMode ? markTreated(doc.id) : quickCloseAsChief(doc.id)" [disabled]="isBusy(doc.id)">⏱️</button>
                        <button class="icon-btn" aria-label="Envoyer" (click)="isAssistantMode ? sendToChief(doc.id) : quickSendToSecretariat(doc.id)" [disabled]="isBusy(doc.id)">📨</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .page-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .page-title {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 11px;
      color: #6b7280;
      margin: 0;
    }

    .assistant-page-heading {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .assistant-page-title {
      margin: 0;
      font-size: 12px;
      font-weight: 800;
      color: #0b2f5c;
      letter-spacing: -0.01em;
    }

    .assistant-page-subtitle {
      margin: 6px 0 0;
      color: #475569;
      font-size: 11px;
    }

    .assistant-date {
      color: #334155;
      font-size: 11px;
      margin-top: 8px;
      text-transform: capitalize;
    }

    .assistant-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }

    .assistant-kpi-card {
      background: #fff;
      border: 1px solid #e2e8f0;

    .assistant-kpi-card-clickable {
      cursor: pointer;
    }

    .assistant-kpi-card-clickable:hover {
      border-color: #bfdbfe;
      box-shadow: 0 10px 22px rgba(37, 99, 235, 0.12);
    }
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.07);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .assistant-kpi-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
    }

    .assistant-kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      gap: 10px;
    }

    .assistant-kpi-title {
      color: #0f172a;
      font-size: 11px;
      font-weight: 600;
    }

    .assistant-kpi-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #fff;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .assistant-kpi-icon.blue { background: #2563eb; }
    .assistant-kpi-icon.green { background: #16a34a; }
    .assistant-kpi-icon.orange { background: #f97316; }
    .assistant-kpi-icon.red { background: #dc2626; }

    .assistant-kpi-count {
      color: #0b2f5c;
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      margin: 10px 0 6px;
    }

    .assistant-kpi-note {
      color: #64748b;
      font-size: 11px;
    }

    .assistant-panel {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.07);
    }

    .assistant-panel-title {
      margin: 0 0 14px;
      color: #0b2f5c;
      font-size: 12px;
      font-weight: 700;
    }

    .assistant-actions-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .assistant-action {
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: left;
      color: #0b2f5c;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .assistant-action:hover {
      border-color: #93c5fd;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
      transform: translateY(-1px);
    }

    .assistant-action-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #e2e8f0;
      color: #0b2f5c;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 12px;
      flex-shrink: 0;
    }

    .assistant-action strong {
      display: block;
      font-size: 12px;
      line-height: 1.25;
    }

    .assistant-action small {
      display: block;
      color: #64748b;
      margin-top: 2px;
      font-size: 11px;
    }

    .assistant-list-panel {
      padding-bottom: 10px;
    }

    .assistant-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .assistant-see-all {
      border: none;
      background: transparent;
      color: #0b2f5c;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .assistant-doc-row {
      border-top: 1px solid #e2e8f0;
      padding: 16px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .assistant-doc-meta {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .assistant-priority-pill {
      margin-left: 8px;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 999px;
      padding: 1px 8px;
      font-size: 11px;
      text-transform: none;
      letter-spacing: 0;
    }

    .assistant-doc-subject {
      color: #0f172a;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .assistant-doc-footer {
      color: #334155;
      font-size: 11px;
    }

    .assistant-open-btn {
      border: none;
      background: #0b2f5c;
      color: #fff;
      border-radius: 10px;
      padding: 10px 18px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .assistant-open-btn:hover:not(:disabled) {
      background: #0e3d75;
      transform: translateY(-1px);
    }

    .assistant-open-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .assistant-empty {
      color: #64748b;
      font-size: 11px;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
    }

    .page-title.pilier-title {
      font-size: 22px;
      font-weight: 800;
      color: #0b2f5c;
    }

    .pilier-status-cards {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 16px;
      background: #fff;
    }

    .pilier-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
      border-radius: 14px;
      padding: 18px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .pilier-card:hover {
      border-color: #e2e8f0;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    }

    .pilier-card-active {
      border-color: #2563eb;
      background: #eff6ff;
    }

    .pilier-card-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .pilier-card-label {
      font-size: 13px;
      color: #475569;
      font-weight: 500;
    }

    .pilier-card-count {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
    }

    .pilier-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .pilier-table-card {
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }

    .pilier-tabs {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 8px;
    }

    .pilier-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 16px;
      border: none;
      background: transparent;
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .pilier-tab:hover {
      color: #0b2f5c;
      background: #f8fafc;
    }

    .pilier-tab-active {
      color: #0b2f5c;
      font-weight: 700;
      border-bottom-color: #0b2f5c;
    }

    .pilier-tab-icon {
      font-size: 15px;
    }

    .pilier-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #94a3b8;
    }

    .pilier-empty-icon {
      width: 64px;
      height: 64px;
      background: #f1f5f9;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #94a3b8;
      margin-bottom: 16px;
    }

    .pilier-empty-state p {
      font-size: 14px;
      color: #94a3b8;
      margin: 0;
    }

    .pilier-action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.2s;
    }

    .pilier-action-btn:hover:not(:disabled) { opacity: 0.85; }
    .pilier-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .pilier-action-btn.blue { background: #2563eb; }
    .pilier-action-btn.orange { background: #f97316; }
    .pilier-action-btn.green { background: #16a34a; }
    .pilier-action-btn.purple { background: #7c3aed; }

    .status-cards-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .filters-card {
      background: white;
      border-radius: 14px;
      padding: 14px 18px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .filters-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
    }

    .filters-row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      font-size: 12px;
      color: #1f2937;
      transition: all 0.2s ease;
    }

    .filter-chip.active {
      background: #0b3a78;
      color: white;
      border-color: #0b3a78;
      box-shadow: 0 8px 16px rgba(15, 42, 94, 0.2);
    }

    .chip-count {
      background: rgba(15, 23, 42, 0.08);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
    }

    .filter-chip.active .chip-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .pill-action {
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #f1f5f9;
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .table-card {
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      padding: 16px 18px 4px;
    }

    .table-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .table-title {
      margin: 0 0 4px 0;
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }

    .table-subtitle {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .documents-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .documents-table th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
      padding: 12px 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    .documents-table td {
      padding: 14px 10px;
      border-bottom: 1px solid #eef2f7;
      vertical-align: top;
      font-size: 11px;
      color: #0f172a;
    }

    .doc-number {
      font-weight: 600;
      color: #0b3a78;
      font-size: 12px;
    }

    .doc-title {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .doc-owner {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .doc-meta {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .status-pill,
    .delay-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid transparent;
    }

    .status-pill.info {
      color: #1d4ed8;
      background: #e0edff;
    }

    .status-pill.warning {
      color: #b45309;
      background: #ffedd5;
    }

    .status-pill.success {
      color: #15803d;
      background: #dcfce7;
    }

    .delay-pill.danger {
      color: #b91c1c;
      background: #fee2e2;
    }

    .delay-pill.muted {
      color: #64748b;
      background: #f1f5f9;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .icon-btn:hover {
      background: #e2e8f0;
    }

    @media (max-width: 1024px) {
      .pilier-status-cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pilier-tabs {
        flex-wrap: wrap;
      }

      .assistant-kpi-grid,
      .assistant-actions-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .assistant-page-title {
        font-size: 12px;
      }

      .assistant-page-subtitle,
      .assistant-date {
        font-size: 11px;
      }

      .assistant-panel-title {
        font-size: 12px;
      }

      .assistant-action strong {
        font-size: 12px;
      }

      .assistant-action small,
      .assistant-see-all,
      .assistant-doc-meta,
      .assistant-doc-footer,
      .assistant-open-btn {
        font-size: 12px;
      }

      .assistant-doc-subject {
        font-size: 12px;
      }

      .status-cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .filters-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .pill-action {
        align-self: flex-start;
      }
    }

    @media (max-width: 768px) {
      .assistant-page-heading,
      .assistant-list-header,
      .assistant-doc-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .assistant-kpi-grid,
      .assistant-actions-grid {
        grid-template-columns: 1fr;
      }

      .status-cards-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  pageTitle = 'Dashboard Chef';
  pageSubtitle = "Centre de contrôle — Vue d'ensemble en 5 secondes";
  isAssistantMode = false;
  isChefMode = false;
  isPilierMode = false;
  isLoading = false;
  pendingDocumentIds = new Set<number>();
  assistantDisplayName = 'Assistante';
  todayLabel = '';

  // Pilier mode properties
  pilierServiceName = '';
  pilierActiveTab = 'a-receptionner';

  pilierCards: Array<{
    label: string;
    count: number;
    countColor: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    tabKey: string;
  }> = [];

  pilierTabs = [
    { key: 'a-receptionner', label: 'À réceptionner', icon: '☑' },
    { key: 'en-traitement', label: 'En traitement', icon: '▶' },
    { key: 'chez-coordinateur', label: 'Chez Coordinateur', icon: '◐' },
    { key: 'termines', label: 'Terminés', icon: '✓' }
  ];

  pilierDocuments: Array<DashboardDocument & { category: string; deadline?: string; chiefInstruction?: string }> = [];

  statusCards: StatusCard[] = [
    {
      title: 'À traiter',
      count: 0,
      description: 'Documents non traités',
      color: '#1d4ed8',
      icon: '📄'
    },
    {
      title: 'Destinés à moi',
      count: 0,
      description: 'En attente de ma décision',
      color: '#0b3a78',
      emphasis: true,
      icon: '👜'
    },
    {
      title: 'En retard',
      count: 0,
      description: 'Délai dépassé',
      color: '#ef4444',
      icon: '⏰'
    },
    {
      title: 'Bloqués',
      count: 0,
      description: 'Nécessitent attention',
      color: '#f97316',
      icon: '⚠️'
    }
  ];

  quickFilters = [
    { label: 'Tous', count: 0, active: true },
    { label: 'Destinés à moi', count: 0 },
    { label: 'En retard', count: 0 }
  ];

  documents: DashboardDocument[] = [
    {
      id: 1,
      number: 'COREF-2026-0001',
      object: 'Réforme de la TVA - Analyse d\'impact budgétaire',
      type: 'Rapport',
      owner: 'Marie Kabongo',
      ownerRole: 'Pilier',
      status: 'Document envoyé',
      statusTone: 'info',
      lastAction: '01/02/2026',
      lastActionNote: 'Il y a 9 jours',
      delay: 'En retard',
      delayTone: 'danger'
    },
    {
      id: 2,
      number: 'COREF-2026-0002',
      object: 'Demande de congé - Personnel DRH',
      type: 'Demande_conge',
      owner: 'Direction des Ressources Humaines',
      ownerRole: 'Service',
      status: 'Traitement commencé',
      statusTone: 'warning',
      lastAction: '30/01/2026',
      lastActionNote: 'Il y a 11 jours',
      delay: 'En retard',
      delayTone: 'danger'
    },
    {
      id: 3,
      number: 'COREF-2026-0003',
      object: 'Note de service - Budget 2026',
      type: 'Note',
      owner: 'Cabinet du Ministre',
      ownerRole: 'Service',
      status: 'En validation',
      statusTone: 'success',
      lastAction: '05/02/2026',
      lastActionNote: 'Il y a 5 jours',
      delay: '—',
      delayTone: 'muted'
    }
  ];

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAssistantMode = role === 'ASSISTANT_CHEF';
    this.isChefMode = role === 'CHEF_SG';
    this.isPilierMode = role === 'PILIER';
    const isChefSgMode = role === 'CHEF_SG';
    this.assistantDisplayName = this.authService.user()?.name || 'Assistante';
    this.todayLabel = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    if (this.isPilierMode) {
      this.initPilierDashboard();
      return;
    }

    if (!this.isAssistantMode && !isChefSgMode) {
      return;
    }

    if (this.isAssistantMode) {
      this.pageTitle = 'Dashboard Assistant';
      this.pageSubtitle = 'Suivi opérationnel des courriers à classer et transmettre';
    }

    this.loadAssistantDashboard();
  }

  classifyDocument(documentId: number): void {
    if ((!this.isAssistantMode && !this.isChefMode) || this.pendingDocumentIds.has(documentId)) {
      return;
    }

    if (this.isChefMode && !this.isAssistantMode) {
      this.openChiefDecisionFlow(documentId);
      return;
    }

    this.pendingDocumentIds.add(documentId);
    this.http
      .patch(`${API_BASE_URL}/assistant/documents/${documentId}/classify`, {
        status: 'En cours'
      })
      .subscribe({
        next: () => {
          this.pendingDocumentIds.delete(documentId);
          this.loadAssistantDashboard();
        },
        error: () => {
          this.pendingDocumentIds.delete(documentId);
        }
      });
  }

  sendToChief(documentId: number): void {
    if (!this.isAssistantMode || this.pendingDocumentIds.has(documentId)) {
      return;
    }

    this.pendingDocumentIds.add(documentId);
    this.http
      .patch(`${API_BASE_URL}/assistant/documents/${documentId}/send-to-chief`, {})
      .subscribe({
        next: () => {
          this.pendingDocumentIds.delete(documentId);
          this.loadAssistantDashboard();
        },
        error: () => {
          this.pendingDocumentIds.delete(documentId);
        }
      });
  }

  markTreated(documentId: number): void {
    if (!this.isAssistantMode || this.pendingDocumentIds.has(documentId)) {
      return;
    }

    this.pendingDocumentIds.add(documentId);
    this.http
      .patch(`${API_BASE_URL}/assistant/documents/${documentId}/mark-treated`, {})
      .subscribe({
        next: () => {
          this.pendingDocumentIds.delete(documentId);
          this.loadAssistantDashboard();
        },
        error: () => {
          this.pendingDocumentIds.delete(documentId);
        }
      });
  }

  isBusy(documentId: number): boolean {
    return this.pendingDocumentIds.has(documentId);
  }

  get assistantCards(): Array<{ title: string; count: number; note: string; icon: string; iconTone: string; route?: string }> {
    return [
      {
        title: 'À classer / Annoter',
        count: this.quickFilters.find((item) => item.label === 'À traiter')?.count ?? 0,
        note: 'Documents reçus en attente',
        icon: '◻',
        iconTone: 'blue',
        route: '/a-classer-annoter'
      },
      {
        title: 'Envoyés au Chef',
        count: this.quickFilters.find((item) => item.label === 'Envoyés par moi')?.count ?? 0,
        note: 'Documents transférés',
        icon: '✈',
        iconTone: 'green',
        route: '/envoyes-au-chef'
      },
      {
        title: 'À traiter par Chef',
        count: this.quickFilters.find((item) => item.label === 'Sans accusé réception')?.count ?? 0,
        note: 'Documents non traités',
        icon: '◷',
        iconTone: 'orange',
        route: '/a-traiter-par-chef'
      },
      {
        title: 'Documents urgents',
        count: this.quickFilters.find((item) => item.label === 'En retard')?.count ?? 0,
        note: 'Nécessitent une action rapide',
        icon: '!',
        iconTone: 'red',
        route: '/a-traiter-par-chef'
      }
    ];
  }

  get recentAssistantDocuments(): DashboardDocument[] {
    return this.documents.slice(0, 5);
  }

  openFirstDocumentForClassification(): void {
    this.router.navigate(['/a-classer-annoter']);
  }

  goToSentView(): void {
    this.router.navigate(['/envoyes-au-chef']);
  }

  goToSearch(): void {
    this.router.navigate(['/recherche']);
  }

  onStatusCardClick(title: string): void {
    if (this.isAssistantMode) {
      return;
    }

    const scopeByTitle: Record<string, string> = {
      'À traiter': 'to-process',
      'Destinés à moi': 'assigned-to-me',
      'En retard': 'delayed',
      'Bloqués': 'blocked'
    };

    this.openChefDocuments(scopeByTitle[title] || 'all');
  }

  onQuickFilterClick(label: string): void {
    if (this.isAssistantMode) {
      return;
    }

    this.quickFilters = this.quickFilters.map((item) => ({
      ...item,
      active: item.label === label
    }));

    const scopeByLabel: Record<string, string> = {
      'Tous': 'all',
      'À traiter': 'to-process',
      'Destinés à moi': 'assigned-to-me',
      'Envoyés par moi': 'sent-by-me',
      'Sans accusé réception': 'no-ack',
      'En retard': 'delayed',
      'Bloqués': 'blocked',
      'Traités cette semaine': 'treated-this-week'
    };

    this.openChefDocuments(scopeByLabel[label] || 'all', true);
  }

  openChefDocuments(scope: string = 'all', showFilters: boolean = false): void {
    if (this.isAssistantMode) {
      return;
    }

    this.router.navigate(['/documents'], {
      queryParams: {
        scope,
        showFilters: showFilters ? '1' : '0'
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // ── Pilier mode ──

  get filteredPilierDocuments(): Array<DashboardDocument & { category: string; deadline?: string; chiefInstruction?: string }> {
    return this.pilierDocuments.filter((d) => d.category === this.pilierActiveTab);
  }

  setPilierTab(key: string): void {
    this.pilierActiveTab = key;
  }

  viewPilierDocument(documentId: number): void {
    this.router.navigate(['/documents'], { queryParams: { docId: documentId } });
  }

  pilierAction(documentId: number, action: string): void {
    if (this.pendingDocumentIds.has(documentId)) return;
    this.pendingDocumentIds.add(documentId);

    const body: Record<string, unknown> = {};
    if (action === 'finalize') {
      const note = window.prompt('Ajoutez une note (optionnel):') || '';
      if (note.trim()) body['note'] = note.trim();
    }

    this.http.patch(`${API_BASE_URL}/pilier/documents/${documentId}/${action}`, body).subscribe({
      next: () => {
        this.pendingDocumentIds.delete(documentId);
        this.loadPilierDashboard();
      },
      error: () => {
        this.pendingDocumentIds.delete(documentId);
      }
    });
  }

  private initPilierDashboard(): void {
    const user = this.authService.user();
    this.pilierServiceName = (user as any)?.service || (user as any)?.pilier || '';

    this.pilierCards = [
      {
        label: 'À réceptionner',
        count: 0,
        countColor: '#2563eb',
        icon: '☑',
        iconBg: '#eff6ff',
        iconColor: '#2563eb',
        tabKey: 'a-receptionner'
      },
      {
        label: 'En traitement',
        count: 0,
        countColor: '#f97316',
        icon: '▶',
        iconBg: '#fff7ed',
        iconColor: '#f97316',
        tabKey: 'en-traitement'
      },
      {
        label: 'Chez Coordinateur',
        count: 0,
        countColor: '#7c3aed',
        icon: '◐',
        iconBg: '#f5f3ff',
        iconColor: '#7c3aed',
        tabKey: 'chez-coordinateur'
      },
      {
        label: 'En retard',
        count: 0,
        countColor: '#dc2626',
        icon: '⏱',
        iconBg: '#fef2f2',
        iconColor: '#dc2626',
        tabKey: 'en-retard'
      }
    ];

    this.loadPilierDashboard();
  }

  private loadPilierDashboard(): void {
    this.isLoading = true;
    this.http.get<any>(`${API_BASE_URL}/pilier/dashboard`).subscribe({
      next: (response) => {
        if (response?.cards) {
          this.pilierCards[0].count = response.cards.toReceive ?? 0;
          this.pilierCards[1].count = response.cards.inProgress ?? 0;
          this.pilierCards[2].count = response.cards.atCoordinator ?? 0;
          this.pilierCards[3].count = response.cards.late ?? 0;
        }

        if (response?.serviceName) {
          this.pilierServiceName = response.serviceName;
        }

        if (response?.documents) {
          this.pilierDocuments = response.documents.map((doc: any) => ({
            id: doc.id,
            number: doc.number,
            object: doc.object,
            type: doc.type || '',
            owner: doc.owner || '',
            ownerRole: doc.ownerRole || '',
            status: doc.status,
            statusTone: doc.statusTone || 'info',
            lastAction: this.formatDate(doc.lastActionAt || doc.lastAction || ''),
            lastActionNote: doc.lastActionNote || '',
            delay: doc.delay || '',
            delayTone: doc.delayTone || 'muted',
            category: doc.category || 'a-receptionner',
            deadline: doc.deadline ? this.formatDate(doc.deadline) : undefined,
            chiefInstruction: doc.chiefInstruction || ''
          }));
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private loadAssistantDashboard(): void {
    this.isLoading = true;
    this.http.get<AssistantDashboardResponse>(`${API_BASE_URL}/assistant/dashboard`).subscribe({
      next: (response) => {
        if (this.isAssistantMode) {
          this.statusCards = [
            {
              title: 'À recevoir',
              count: response.cards.toReceive,
              description: 'Documents en réception',
              color: '#1d4ed8',
              icon: '📄'
            },
            {
              title: 'À traiter',
              count: response.cards.toProcess,
              description: 'Nécessitent votre action',
              color: '#0b3a78',
              emphasis: true,
              icon: '📝'
            },
            {
              title: 'En cours',
              count: response.cards.inProgress,
              description: 'Documents en traitement',
              color: '#d97706',
              icon: '🔄'
            },
            {
              title: 'Terminés',
              count: response.cards.done,
              description: 'Documents archivés',
              color: '#dc2626',
              icon: '🗂️'
            }
          ];

          this.quickFilters = [
            { label: 'Tous', count: response.quickFilters.all, active: true },
            { label: 'À traiter', count: response.quickFilters.toProcess },
            { label: 'Destinés à moi', count: response.quickFilters.assignedToMe },
            { label: 'Envoyés par moi', count: response.quickFilters.sentByMe },
            { label: 'Sans accusé réception', count: response.quickFilters.noAck },
            { label: 'En retard', count: response.quickFilters.delayed },
            { label: 'Bloqués', count: response.quickFilters.blocked },
            { label: 'Traités cette semaine', count: response.quickFilters.treatedThisWeek }
          ];
        } else {
          this.statusCards = [
            {
              title: 'À traiter',
              count: response.quickFilters.toProcess,
              description: 'Documents non traités',
              color: '#1d4ed8',
              icon: '📄'
            },
            {
              title: 'Destinés à moi',
              count: response.quickFilters.assignedToMe,
              description: 'En attente de ma décision',
              color: '#0b3a78',
              emphasis: true,
              icon: '👜'
            },
            {
              title: 'En retard',
              count: response.quickFilters.delayed,
              description: 'Délai dépassé',
              color: '#ef4444',
              icon: '⏰'
            },
            {
              title: 'Bloqués',
              count: response.quickFilters.blocked,
              description: 'Nécessitent attention',
              color: '#f97316',
              icon: '⚠️'
            }
          ];

          this.quickFilters = [
            { label: 'Tous', count: response.quickFilters.all, active: true },
            { label: 'Destinés à moi', count: response.quickFilters.assignedToMe },
            { label: 'En retard', count: response.quickFilters.delayed }
          ];
        }

        this.documents = response.documents.map((document) => ({
          ...document,
          lastAction: this.formatDate(document.lastActionAt),
          lastActionNote: document.lastActionNote
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  quickCloseAsChief(documentId: number): void {
    if (!this.isChefMode || this.pendingDocumentIds.has(documentId)) {
      return;
    }
    this.submitChiefDecision(documentId, { decision: 'CLOSE' });
  }

  quickSendToSecretariat(documentId: number): void {
    if (!this.isChefMode || this.pendingDocumentIds.has(documentId)) {
      return;
    }
    this.submitChiefDecision(documentId, { decision: 'SEND_SECRETARIAT' });
  }

  private openChiefDecisionFlow(documentId: number): void {
    const decisionRaw = window.prompt(
      [
        'CHEF / SG — Décision:',
        'A = Assignation au CHEF DE PILIER',
        'B = Assignation à un SERVICE',
        'C = Envoyer au SECRÉTARIAT',
        'D = Clôturer directement',
        'E = Bloquer (infos complémentaires)'
      ].join('\n'),
      'A'
    );

    if (!decisionRaw) {
      return;
    }

    const choice = decisionRaw.trim().toUpperCase();
    if (!['A', 'B', 'C', 'D', 'E'].includes(choice)) {
      return;
    }

    if (choice === 'C') {
      this.submitChiefDecision(documentId, { decision: 'SEND_SECRETARIAT' });
      return;
    }

    if (choice === 'D') {
      this.submitChiefDecision(documentId, { decision: 'CLOSE' });
      return;
    }

    if (choice === 'E') {
      const instruction = window.prompt('Informations complémentaires requises (optionnel):', '') || '';
      this.submitChiefDecision(documentId, { decision: 'BLOQUER', instruction });
      return;
    }

    const decision = choice === 'A' ? 'ASSIGN_PILIER' : 'ASSIGN_SERVICE';
    const assignedToValue = window.prompt(
      choice === 'A' ? 'Sélectionner Chef de Pilier (nom ou code):' : 'Sélectionner Service (nom ou code):',
      ''
    );

    if (!assignedToValue || !assignedToValue.trim()) {
      return;
    }

    const priority = (window.prompt('Définir priorité (Basse, Normale, Haute, Urgente):', 'Normale') || '').trim();
    const slaInput = (window.prompt('Fixer délai (SLA) en jours:', '7') || '').trim();
    const instruction = (window.prompt('Ajouter instructions (optionnel):', '') || '').trim();

    const slaDays = Number.parseInt(slaInput, 10);
    this.submitChiefDecision(documentId, {
      decision,
      assignedToValue: assignedToValue.trim(),
      priority: priority || undefined,
      slaDays: Number.isFinite(slaDays) ? slaDays : undefined,
      instruction: instruction || undefined
    });
  }

  private submitChiefDecision(
    documentId: number,
    payload: {
      decision: 'ASSIGN_PILIER' | 'ASSIGN_SERVICE' | 'SEND_SECRETARIAT' | 'CLOSE' | 'BLOQUER';
      assignedToValue?: string;
      priority?: string;
      slaDays?: number;
      instruction?: string;
    }
  ): void {
    this.pendingDocumentIds.add(documentId);
    this.http.patch(`${API_BASE_URL}/chief/documents/${documentId}/decision`, payload).subscribe({
      next: () => {
        this.pendingDocumentIds.delete(documentId);
        this.loadAssistantDashboard();

        if (payload.decision === 'ASSIGN_PILIER') {
          window.alert(
            [
              'CHEF / SG',
              '',
              'Action: Assignation au CHEF DE PILIER',
              '- Définit priorité et délai',
              '- Ajoute instructions détaillées',
              '- Notification envoyée'
            ].join('\n')
          );
        }
      },
      error: () => {
        this.pendingDocumentIds.delete(documentId);
      }
    });
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat('fr-FR').format(date);
  }
}
