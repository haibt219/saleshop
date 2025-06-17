import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface ComponentTranslation {
  [key: string]: string | ComponentTranslation;
}

export interface Translation {
  [componentName: string]: ComponentTranslation;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('vi');
  private translations: { [lang: string]: Translation } = {};
  private loadingPromises: Map<string, Promise<void>> = new Map();

  // Supported languages
  private supportedLanguages = ['vi', 'en', 'zh', 'ja', 'ko'];

  currentLang$ = this.currentLang.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const detectedLang = this.detectSystemLanguage();
    this.setLanguage(detectedLang);
  }

  private detectSystemLanguage(): string {
    const browserLang = this.getBrowserLanguage();

    if (this.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    const baseLang = browserLang.split('-')[0];
    if (this.supportedLanguages.includes(baseLang)) {
      return baseLang;
    }

    return 'vi';
  }

  private getBrowserLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.languages && navigator.languages.length > 0) {
        return navigator.languages[0].toLowerCase();
      } else if (navigator.language) {
        return navigator.language.toLowerCase();
      } else {
        return (navigator as any).userLanguage?.toLowerCase() || 'vi';
      }
    }

    return 'vi';
  }

  setLanguage(lang: string) {
    if (
      lang !== this.currentLang.value &&
      this.supportedLanguages.includes(lang)
    ) {
      this.currentLang.next(lang);

      if (isPlatformBrowser(this.platformId)) {
        // localStorage.setItem('selectedLanguage', lang);
        document.documentElement.lang = lang;
      }

      this.loadingPromises.clear();
      console.log(`Language changed to: ${lang}`);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLang.value;
  }

  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  getSystemLanguageInfo(): {
    detected: string;
    current: string;
    supported: string[];
  } {
    return {
      detected: this.getBrowserLanguage(),
      current: this.getCurrentLanguage(),
      supported: this.supportedLanguages,
    };
  }

  async loadComponentTranslations(componentName: string): Promise<void> {
    const lang = this.getCurrentLanguage();
    const componentKey = `${componentName}_${lang}`;

    if (this.translations[lang]?.[componentName]) {
      return;
    }

    if (this.loadingPromises.has(componentKey)) {
      return this.loadingPromises.get(componentKey)!;
    }

    const loadingPromise = this.loadTranslationFiles(componentName, lang);
    this.loadingPromises.set(componentKey, loadingPromise);

    try {
      await loadingPromise;
    } finally {
      this.loadingPromises.delete(componentKey);
    }
  }

  private async loadTranslationFiles(
    componentName: string,
    lang: string
  ): Promise<void> {
    try {
      let url: string;

      // Check if running in browser vs SSR
      if (isPlatformBrowser(this.platformId)) {
        // Browser: relative path works
        url = `assets/i18n/components/${componentName}/${lang}.json`;
      } else {
        return; // Skip loading in SSR, will load in browser
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const translation = await response.json();

      if (!this.translations[lang]) {
        this.translations[lang] = {};
      }

      this.translations[lang][componentName] = translation;
    } catch (error) {
      // Fallback to Vietnamese
      if (lang !== 'vi') {
        try {
          let fallbackUrl: string;

          if (isPlatformBrowser(this.platformId)) {
            fallbackUrl = `assets/i18n/components/${componentName}/vi.json`;

            const fallbackResponse = await fetch(fallbackUrl);
            if (fallbackResponse.ok) {
              const fallbackTranslation = await fallbackResponse.json();
              if (!this.translations[lang]) {
                this.translations[lang] = {};
              }
              this.translations[lang][componentName] = fallbackTranslation;
            }
          }
        } catch (fallbackError) {
          console.error(
            `Fallback translation also failed for ${componentName}:`,
            fallbackError
          );
        }
      }
    }
  }

  translate(componentName: string, key: string): string {
    const lang = this.getCurrentLanguage();
    const componentTranslations = this.translations[lang]?.[componentName];

    if (!componentTranslations) {
      return key;
    }

    const translation = this.getNestedTranslation(componentTranslations, key);
    return translation || key;
  }

  getComponentTranslations(componentName: string): ComponentTranslation | null {
    const lang = this.getCurrentLanguage();
    return this.translations[lang]?.[componentName] || null;
  }

  private getNestedTranslation(obj: any, key: string): string {
    return key.split('.').reduce((o, k) => o?.[k], obj);
  }
}
