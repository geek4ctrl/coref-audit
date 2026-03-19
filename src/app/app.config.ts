import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { AppPreloadingStrategy } from './routes/app-preloading.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(AppPreloadingStrategy)),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
