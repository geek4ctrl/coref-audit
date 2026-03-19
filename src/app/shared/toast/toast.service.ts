import { Injectable, signal } from '@angular/core';

type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  actionLabel?: string;
  onAction?: () => void;
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(
    message: string,
    type: ToastType = 'info',
    durationMs: number = 3000,
    action?: { label: string; onAction: () => void }
  ): void {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.toasts.update((items) => [
      ...items,
      {
        id,
        message,
        type,
        actionLabel: action?.label,
        onAction: action?.onAction
      }
    ]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  success(message: string, durationMs: number = 2500, action?: { label: string; onAction: () => void }): void {
    this.show(message, 'success', durationMs, action);
  }

  error(message: string, durationMs: number = 3500, action?: { label: string; onAction: () => void }): void {
    this.show(message, 'error', durationMs, action);
  }

  info(message: string, durationMs: number = 3000, action?: { label: string; onAction: () => void }): void {
    this.show(message, 'info', durationMs, action);
  }

  dismiss(id: string): void {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }
}
