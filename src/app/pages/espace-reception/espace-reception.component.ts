import { Component } from '@angular/core';

@Component({
  selector: 'app-espace-reception',
  imports: [],
  template: `
    <div class="page-container">
      <h2>Espace Réception</h2>
      <p>Accédez à l'espace dédié à la réception des documents.</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
    }

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
    }
  `]
})
export class EspaceReceptionComponent {}
