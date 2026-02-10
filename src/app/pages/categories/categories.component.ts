import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  template: `
    <div class="page-container">
      <h2>Catégories</h2>
      <p>Gérez les catégories de documents.</p>
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
export class CategoriesComponent {}
