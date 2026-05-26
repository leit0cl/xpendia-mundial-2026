import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  // Ignore build artifacts and deps.
  {
    ignores: [
      'dist',
      'dev-dist',
      'node_modules',
      'coverage',
      'public',
      'playwright-report',
      'test-results',
      'e2e',
      '*.config.js',
    ],
  },

  // Base JS/TS rules.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // App files (browser).
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // React Hooks — los clásicos como ERROR. Las nuevas reglas v6
      // (purity / refs / set-state-in-render) ayudan a cazar bugs reales,
      // las dejamos como warning. `set-state-in-effect` queda DESACTIVADA:
      // el plugin marca como peligroso un patrón canónico de React
      // (fetch-on-mount, reset de estado derivado, version-bump cache
      // invalidation) que sí evaluamos caso por caso y son correctos.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-render': 'warn',
      // jsx-a11y recommended con relax para Chakra Box-as-button.
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/media-has-caption': 'warn',
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },

  // Test files: relax some rules.
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
