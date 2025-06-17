import {
  Pipe,
  PipeTransform,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'componentTranslate',
  pure: false,
})
export class ComponentTranslatePipe implements PipeTransform, OnDestroy {
  private cache = new Map<string, string>();
  private currentLang = '';
  private subscription?: Subscription;
  private loadedComponents = new Set<string>();

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentLang = this.translationService.getCurrentLanguage();

    // Subscribe to language changes
    this.subscription = this.translationService.currentLang$.subscribe(
      (lang) => {
        if (this.currentLang !== lang) {
          this.currentLang = lang;
          this.cache.clear();
          this.loadedComponents.clear();
          this.cdr.markForCheck();
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.cache.clear();
  }

  transform(key: string, componentName: string): string {
    const cacheKey = `${componentName}.${key}.${this.currentLang}`;

    // Check if we have translations for this component
    const hasTranslations =
      this.translationService.getComponentTranslations(componentName);

    if (!hasTranslations) {
      // Return key for now, don't cache it
      return key;
    }

    // Mark component as loaded
    if (!this.loadedComponents.has(componentName)) {
      // Clear cache for this component when translations become available
      for (const [cachedKey] of this.cache) {
        if (cachedKey.startsWith(componentName + '.')) {
          this.cache.delete(cachedKey);
        }
      }
      this.loadedComponents.add(componentName);
    }

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return cached;
    }

    const translation = this.translationService.translate(componentName, key);
    this.cache.set(cacheKey, translation);

    return translation;
  }
}
