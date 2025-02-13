import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  public availableLanguages = ['pl', 'en'];
  public selectedLanguage = 'pl';

  public languageNames: Record<string, string> = {
    pl: 'Polski',
    en: 'Angielski',
  };

  public constructor(
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.selectedLanguage = this.languageService.getCurrentLanguage();
    this.updateLanguageNames();
  }

  public changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
    this.selectedLanguage = lang;
    this.updateLanguageNames();
  }

  public updateLanguageNames(): void {
    this.translate
      .get(['languages.pl', 'languages.en'])
      .subscribe((translations: Record<string, string>) => {
        this.languageNames = {
          pl: translations['languages.pl'],
          en: translations['languages.en'],
        };
      });
  }

  public getLanguageName(): string {
    return this.languageNames[this.selectedLanguage] || this.selectedLanguage;
  }
}
