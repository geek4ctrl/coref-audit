import { Component } from '@angular/core';

@Component({
  selector: 'app-utilisateurs',
  imports: [],
  template: `
    <div class="page-container">
      <h2>Utilisateurs</h2>
      <p>Gérez les utilisateurs du système.</p>
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
export class UtilisateursComponent {}
