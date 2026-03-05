import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../auth/auth.service';

interface RecipientUser {
  id: number;
  name: string;
  email: string;
}

interface MessageItem {
  id: number;
  subject: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  recipient: {
    id: number;
    name: string;
    email: string;
  };
}

interface MessageListResponse {
  unreadCount?: number;
  messages: MessageItem[];
}

interface RecipientsResponse {
  users: RecipientUser[];
}

type MailTab = 'compose' | 'inbox' | 'sent';

@Component({
  selector: 'app-messagerie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Messagerie</h1>
      </header>

      <section class="mail-layout" aria-label="Messagerie">
        <aside class="mail-sidebar">
          <button type="button" class="new-btn" (click)="activeTab.set('compose')">
            <span class="menu-icon">✉️</span>
            <span>Nouveau message</span>
          </button>
          <button type="button" class="folder-btn" [class.active]="activeTab() === 'inbox'" (click)="activeTab.set('inbox')">
            <span class="menu-left">
              <span class="menu-icon">✉️</span>
              <span>Boîte de réception</span>
            </span>
            @if (unreadCount() > 0) {
              <span class="folder-badge">{{ unreadCount() }}</span>
            }
          </button>
          <button type="button" class="folder-btn" [class.active]="activeTab() === 'sent'" (click)="activeTab.set('sent')">
            <span class="menu-left">
              <span class="menu-icon">✉️</span>
              <span>Messages envoyés</span>
            </span>
          </button>
        </aside>

        <div class="mail-content">
          @if (activeTab() === 'compose') {
            <div class="compose-area">
              <h2 class="panel-title">Nouveau message</h2>

              <label class="field-label" for="recipient">Destinataire</label>
              <select id="recipient" class="field-input" [(ngModel)]="composeRecipientId">
                <option value="0">Sélectionner un destinataire</option>
                @for (user of recipients(); track user.id) {
                  <option [value]="user.id">{{ user.name }} ({{ user.email }})</option>
                }
              </select>

              <label class="field-label" for="subject">Objet</label>
              <input id="subject" class="field-input" type="text" [(ngModel)]="composeSubject" />

              <label class="field-label" for="content">Message</label>
              <textarea id="content" class="field-input field-textarea" rows="6" [(ngModel)]="composeContent"></textarea>

              @if (composeError()) {
                <p class="error">{{ composeError() }}</p>
              }

              <button type="button" class="send-btn" [disabled]="isSending()" (click)="sendMessage()">
                {{ isSending() ? 'Envoi...' : 'Envoyer' }}
              </button>
            </div>
          } @else {
            <div class="list-area">
              <h2 class="panel-title">{{ activeTab() === 'inbox' ? 'Boîte de réception' : 'Messages envoyés' }}</h2>

              @if (activeMessages().length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">✉</div>
                  <p class="empty-text">Aucun message</p>
                </div>
              } @else {
                <div class="message-list">
                  @for (message of activeMessages(); track message.id) {
                    <article class="message-row" [class.unread]="activeTab() === 'inbox' && !message.readAt">
                      <div class="message-head">
                        <p class="message-subject">{{ message.subject }}</p>
                        <p class="message-date">{{ formatDateTime(message.createdAt) }}</p>
                      </div>
                      <p class="message-meta">
                        {{ activeTab() === 'inbox' ? ('De: ' + message.sender.name) : ('À: ' + message.recipient.name) }}
                      </p>
                      <p class="message-body">{{ message.content }}</p>

                      @if (activeTab() === 'inbox' && !message.readAt) {
                        <button type="button" class="mark-read-btn" (click)="markAsRead(message.id)">Marquer lu</button>
                      }
                    </article>
                  }
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .page-header {
      padding-top: 2px;
    }

    .page-title {
      margin: 0;
      font-size: 40px;
      font-weight: 800;
      color: #0b3a78;
      line-height: 1;
    }

    .mail-layout {
      background: #ffffff;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      min-height: 570px;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      overflow: hidden;
    }

    .mail-sidebar {
      border-right: 1px solid #dbe3ef;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .new-btn {
      border: 0;
      border-radius: 10px;
      background: #0b3a78;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      padding: 12px 16px;
      cursor: default;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .folder-btn {
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #0f172a;
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      padding: 11px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .menu-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .menu-icon {
      width: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 14px;
      line-height: 1;
    }

    .folder-badge {
      background: #ef4444;
      color: #ffffff;
      border-radius: 999px;
      min-width: 18px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
      line-height: 1.2;
    }

    .folder-btn.active {
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
    }

    .mail-content {
      position: relative;
      padding: 18px;
    }

    .panel-title {
      margin: 0 0 14px;
      color: #0b3a78;
      font-size: 24px;
      font-weight: 700;
    }

    .compose-area,
    .list-area {
      max-width: 860px;
    }

    .field-label {
      display: block;
      margin: 10px 0 6px;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
    }

    .field-input {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      color: #0f172a;
      padding: 10px 12px;
      font-size: 14px;
    }

    .field-textarea {
      resize: vertical;
      min-height: 140px;
    }

    .send-btn {
      margin-top: 12px;
      border: 0;
      border-radius: 10px;
      background: #0b3a78;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      padding: 10px 18px;
      cursor: pointer;
    }

    .send-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error {
      margin: 10px 0 0;
      color: #b91c1c;
      font-size: 13px;
      font-weight: 600;
    }

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .message-row {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      padding: 12px;
    }

    .message-row.unread {
      border-color: #93c5fd;
      background: #f8fbff;
    }

    .message-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .message-subject {
      margin: 0;
      color: #0f172a;
      font-size: 15px;
      font-weight: 700;
    }

    .message-date {
      margin: 0;
      color: #64748b;
      font-size: 12px;
    }

    .message-meta {
      margin: 6px 0 0;
      color: #334155;
      font-size: 12px;
      font-weight: 600;
    }

    .message-body {
      margin: 8px 0 0;
      color: #0f172a;
      font-size: 13px;
      white-space: pre-wrap;
    }

    .mark-read-btn {
      margin-top: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      color: #0f172a;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 10px;
      cursor: pointer;
    }

    .empty-state {
      height: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #64748b;
    }

    .empty-icon {
      font-size: 58px;
      line-height: 1;
      opacity: 0.45;
    }

    .empty-text {
      margin: 0;
      font-size: 30px;
      color: #64748b;
    }

    @media (max-width: 900px) {
      .mail-layout {
        grid-template-columns: 1fr;
      }

      .mail-sidebar {
        border-right: 0;
        border-bottom: 1px solid #dbe3ef;
      }

      .empty-text {
        font-size: 22px;
      }
    }
  `]
})
export class MessagerieComponent implements OnInit {
  private readonly http = inject(HttpClient);

  activeTab = signal<MailTab>('sent');
  recipients = signal<RecipientUser[]>([]);
  inboxMessages = signal<MessageItem[]>([]);
  sentMessages = signal<MessageItem[]>([]);
  unreadCount = signal(0);
  isSending = signal(false);
  composeError = signal('');

  composeRecipientId = 0;
  composeSubject = '';
  composeContent = '';

  readonly activeMessages = computed(() =>
    this.activeTab() === 'inbox' ? this.inboxMessages() : this.sentMessages()
  );

  ngOnInit(): void {
    this.loadRecipients();
    this.loadInbox();
    this.loadSent();
  }

  sendMessage() {
    if (!this.composeRecipientId || !this.composeSubject.trim() || !this.composeContent.trim()) {
      this.composeError.set('Veuillez renseigner le destinataire, l’objet et le message.');
      return;
    }

    this.composeError.set('');
    this.isSending.set(true);

    this.http
      .post(`${API_BASE_URL}/messagerie/messages`, {
        recipientUserId: Number(this.composeRecipientId),
        subject: this.composeSubject,
        content: this.composeContent
      })
      .subscribe({
        next: () => {
          this.isSending.set(false);
          this.composeRecipientId = 0;
          this.composeSubject = '';
          this.composeContent = '';
          this.activeTab.set('sent');
          this.loadSent();
          this.loadInbox();
        },
        error: (error) => {
          this.isSending.set(false);
          this.composeError.set(error?.error?.error || 'Échec de l’envoi du message.');
        }
      });
  }

  formatDateTime(value: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  }

  markAsRead(messageId: number) {
    this.http.post(`${API_BASE_URL}/messagerie/messages/${messageId}/mark-read`, {}).subscribe({
      next: () => this.loadInbox(),
      error: () => undefined
    });
  }

  private loadRecipients() {
    this.http.get<RecipientsResponse>(`${API_BASE_URL}/messagerie/users`).subscribe({
      next: (response) => this.recipients.set(response.users),
      error: () => this.recipients.set([])
    });
  }

  private loadInbox() {
    this.http.get<MessageListResponse>(`${API_BASE_URL}/messagerie/inbox`).subscribe({
      next: (response) => {
        this.inboxMessages.set(response.messages);
        this.unreadCount.set(response.unreadCount ?? 0);
      },
      error: () => {
        this.inboxMessages.set([]);
        this.unreadCount.set(0);
      }
    });
  }

  private loadSent() {
    this.http.get<MessageListResponse>(`${API_BASE_URL}/messagerie/sent`).subscribe({
      next: (response) => this.sentMessages.set(response.messages),
      error: () => this.sentMessages.set([])
    });
  }
}
