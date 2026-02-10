import { Component } from '@angular/core';

@Component({
  selector: 'app-nouveau-document',
  imports: [],
  template: `
    <div class="page-container">
      <h2>Nouveau Document</h2>
      <p>Créez un nouveau document dans le système.</p>
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
export class NouveauDocumentComponent {}
