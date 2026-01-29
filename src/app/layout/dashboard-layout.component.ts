import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar />
      <div class="main-content">
        <app-header />
        <div class="content-area">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: #f5f5f5;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content-area {
      flex: 1;
      padding: 20px 24px;
      overflow-y: auto;
      background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
      .dashboard-layout {
        flex-direction: column;
      }

      .content-area {
        padding: 16px;
      }
    }

    @media (max-width: 1024px) {
      .content-area {
        padding: 16px 20px;
      }
    }
  `]
})
export class DashboardLayoutComponent {}
