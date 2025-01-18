import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import localePl from '@angular/common/locales/pl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      // timeOut: 20000,
      // extendedTimeOut: 20000,
      preventDuplicates: true,
    }),
    {
      provide: LOCALE_ID,
      useValue: 'pl-PL',
    },
  ],
};
