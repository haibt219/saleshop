import { OnInit, OnDestroy, Directive, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';

@Directive()
export abstract class BaseTranslatedComponent implements OnInit, OnDestroy {
  protected translationService = inject(TranslationService);
  protected abstract componentName: string;
  protected currentLanguage: string = '';
  private langSubscription?: Subscription;
  private isInitialized = false;

  async ngOnInit() {
    // Get initial language
    this.currentLanguage = this.translationService.getCurrentLanguage();

    // Load initial translations
    await this.loadTranslations();
    this.isInitialized = true;

    // Subscribe to language changes (skip initial value since we already loaded)
    this.langSubscription = this.translationService.currentLang$
      .pipe(
        skip(1), // Skip initial emission
        distinctUntilChanged() // Only emit when language actually changes
      )
      .subscribe({
        next: async (lang) => {
          if (this.isInitialized && lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            await this.loadTranslations();
            this.onLanguageChange(lang);
          }
        },
        error: (error) => {
          console.error('Language subscription error:', error);
        },
      });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
    this.isInitialized = false;
  }

  protected async loadTranslations() {
    try {
      await this.translationService.loadComponentTranslations(
        this.componentName
      );
    } catch (error) {
      console.error(
        `Failed to load translations for ${this.componentName}:`,
        error
      );
    }
  }

  protected translate(key: string): string {
    return this.translationService.translate(this.componentName, key);
  }

  protected getTranslations(): any {
    return this.translationService.getComponentTranslations(this.componentName);
  }

  protected onLanguageChange(lang: string): void {
    // Override in child components if needed
  }
}
