import { Component } from '@angular/core';

@Component({
  selector: 'app-envoi',
  imports: [],
  template: `
    <div class="page-container">
      <h2>Envoi de Documents</h2>
      <p>Envoyez des documents vers d'autres services.</p>
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
export class EnvoiComponent {}
