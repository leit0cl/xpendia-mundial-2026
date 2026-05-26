import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
// Inicializa i18next en español para los tests; los componentes que usan
// `useTranslation` reciben las traducciones reales (no claves).
import i18n from '@/i18n';

beforeAll(async () => {
  // Forzar español: en jsdom el languageDetector cae a en-US por defecto.
  await i18n.changeLanguage('es');
});

afterEach(() => {
  cleanup();
});
