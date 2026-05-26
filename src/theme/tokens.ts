import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        ink: {
          950: { value: '#07090F' },
          900: { value: '#0B0F1A' },
          800: { value: '#131826' },
          700: { value: '#1C2236' },
          600: { value: '#2A314A' },
          500: { value: '#3A4263' },
        },
        mx: { value: '#B7253C' },
        ca: { value: '#D52B1E' },
        us: { value: '#0A3161' },
        field: { value: '#1F7A3A' },
        gold: {
          soft: { value: '#F2D98A' },
          DEFAULT: { value: '#E6C46A' },
          deep: { value: '#C39A3D' },
        },
        accent: { value: '#46E3FF' },
      },
      fonts: {
        body: { value: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif" },
        heading: { value: "'Fraunces', Georgia, 'Times New Roman', serif" },
        display: { value: "'Fraunces', Georgia, 'Times New Roman', serif" },
        kicker: { value: "'Space Grotesk', 'Inter', system-ui, sans-serif" },
        mono: { value: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace" },
      },
      letterSpacings: {
        kicker: { value: '0.12em' },
        display: { value: '-0.025em' },
      },
    },
    semanticTokens: {
      colors: {
        'bg.canvas': { value: '{colors.ink.950}' },
        'bg.elevated': { value: '{colors.ink.800}' },
        'fg.default': { value: 'rgba(255,255,255,0.96)' },
        'fg.muted': { value: 'rgba(255,255,255,0.62)' },
        'fg.subtle': { value: 'rgba(255,255,255,0.42)' },
      },
    },
  },
  globalCss: {
    'html, body, #root': {
      fontFamily: 'body',
      color: 'fg.default',
    },
  },
});

export const system = createSystem(defaultConfig, config);
