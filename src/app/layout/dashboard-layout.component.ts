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
      background: radial-gradient(circle at top, #f8fafc 0%, #eef2f7 45%, #e9eef5 100%);
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
      padding: 22px 26px;
      overflow-y: auto;
      background: transparent;
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
