import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import localeEn from '@angular/common/locales/en';
import localePl from '@angular/common/locales/pl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

registerLocaleData(localePl, 'pl');
registerLocaleData(localeEn, 'en');

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, ModalModule.forRoot()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      // timeOut: 20000,
      // extendedTimeOut: 20000,
      preventDuplicates: true,
    }),
    {
      provide: LOCALE_ID,
      useValue: localStorage.getItem('language'),
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
