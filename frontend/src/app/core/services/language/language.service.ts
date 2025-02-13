import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import localeEn from '@angular/common/locales/en';
import localePl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private supportedLanguages = ['pl', 'en'];

  public constructor(private translate: TranslateService) {
    this.translate.addLangs(this.supportedLanguages);
    const savedLang = localStorage.getItem('language') || 'pl';
    this.setLanguage(savedLang);
  }

  public setLanguage(lang: string): void {
    if (!this.supportedLanguages.includes(lang)) return;

    this.translate.use(lang);
    localStorage.setItem('language', lang);

    if (lang === 'pl') {
      registerLocaleData(localePl);
    } else if (lang === 'en') {
      registerLocaleData(localeEn);
    }
  }

  public getCurrentLanguage(): string {
    return this.translate.currentLang || 'pl';
  }
}
