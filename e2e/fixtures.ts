import { test as base, expect } from '@playwright/test';

/** Fixture custom: inyecta `xpendia.lang=es` en localStorage ANTES de cualquier
 *  navegación, para que i18next-browser-languagedetector encuentre el idioma
 *  ya cacheado y no caiga a navigator.language (que en CI es en-US).
 *
 *  Toda la suite e2e debe importar `test` y `expect` desde este archivo en
 *  lugar de `@playwright/test`. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('xpendia.lang', 'es');
      } catch {
        // Algunos contextos no permiten escribir storage antes de navegar;
        // i18next caerá a fallbackLng='es' como red.
      }
    });
    await use(page);
  },
});

export { expect };
