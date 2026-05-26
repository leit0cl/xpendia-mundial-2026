import { Suspense, lazy, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/templates/AppShell';
import { ErrorBoundary } from '@/components/molecules/ErrorBoundary';
import { RouteSpinner } from '@/components/atoms/RouteSpinner';

// Páginas cargadas bajo demanda para evitar arrastrar Three.js / AWS SDK al
// home. Cada chunk se descarga al navegar a su ruta.
const HomePage = lazy(() =>
  import('@/components/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const TeamPage = lazy(() =>
  import('@/components/pages/TeamPage').then((m) => ({ default: m.TeamPage })),
);
const TacticsPage = lazy(() =>
  import('@/components/pages/TacticsPage').then((m) => ({ default: m.TacticsPage })),
);
const SettingsPage = lazy(() =>
  import('@/components/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/components/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

/** Envuelve cada página en su propio ErrorBoundary + Suspense para que un
 *  error o un chunk pesado no tumben las demás rutas. */
function RouteShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ErrorBoundary label={label}>
      <Suspense fallback={<RouteSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/"
          element={
            <RouteShell label="home">
              <HomePage />
            </RouteShell>
          }
        />
        <Route
          path="/teams/:code"
          element={
            <RouteShell label="team">
              <TeamPage />
            </RouteShell>
          }
        />
        <Route
          path="/tactics"
          element={
            <RouteShell label="tactics">
              <TacticsPage />
            </RouteShell>
          }
        />
        <Route
          path="/settings"
          element={
            <RouteShell label="settings">
              <SettingsPage />
            </RouteShell>
          }
        />
        <Route
          path="*"
          element={
            <RouteShell label="404">
              <NotFoundPage />
            </RouteShell>
          }
        />
      </Route>
    </Routes>
  );
}
