import { Component } from '@angular/core';

@Component({
  selector: 'app-reception',
  imports: [],
  template: `
    <div class="page-container">
      <h2>Réception / Statut</h2>
      <p>Gérez les documents en réception et consultez leur statut.</p>
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
export class ReceptionComponent {}
