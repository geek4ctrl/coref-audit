import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (toast of toasts(); track toast.id) {
        <div
          class="toast"
          [class.success]="toast.type === 'success'"
          [class.error]="toast.type === 'error'"
          [class.info]="toast.type === 'info'"
          (click)="dismiss(toast.id)"
          role="button"
          tabindex="0"
        >
          <span class="toast-icon">
            @if (toast.type === 'success') { ✓ }
            @if (toast.type === 'error') { ! }
            @if (toast.type === 'info') { i }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          @if (toast.actionLabel) {
            <button class="toast-action" type="button" (click)="handleAction(toast, $event)">
              {{ toast.actionLabel }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      top: 16px;
      right: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 2000;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 10px;
      min-width: 240px;
      max-width: 340px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--toast-border);
      background: var(--toast-bg);
      color: var(--toast-text);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
      font-size: 12px;
      cursor: pointer;
      animation: toast-in 160ms ease-out;
    }

    .toast.success {
      border-color: var(--toast-success-border);
      background: var(--toast-success-bg);
      color: var(--toast-success-text);
    }

    .toast.error {
      border-color: var(--toast-error-border);
      background: var(--toast-error-bg);
      color: var(--toast-error-text);
    }

    .toast.info {
      border-color: var(--toast-info-border);
      background: var(--toast-info-bg);
      color: var(--toast-info-text);
    }

    .toast-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      background: rgba(15, 23, 42, 0.08);
      color: inherit;
    }

    .toast-message {
      text-align: left;
    }

    .toast-action {
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 700;
      font-size: 11px;
      padding: 4px 6px;
      border-radius: 6px;
      cursor: pointer;
    }

    .toast-action:hover {
      background: rgba(15, 23, 42, 0.08);
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .toast-stack {
        left: 16px;
        right: 16px;
      }

      .toast {
        max-width: none;
        width: 100%;
      }
    }
  `]
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  handleAction(toast: { id: string; onAction?: () => void }, event: Event): void {
    event.stopPropagation();
    if (toast.onAction) {
      toast.onAction();
    }
    this.toastService.dismiss(toast.id);
  }
}
