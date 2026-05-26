import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/molecules/ErrorBoundary';
import './i18n';
import './theme/glass.css';
import './theme/editorial.css';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el div #root en index.html');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary label="root">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
