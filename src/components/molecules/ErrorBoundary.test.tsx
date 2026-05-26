import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const Throw = ({ message = 'kaboom' }: { message?: string }) => {
  throw new Error(message);
};

const wrap = (node: ReactNode) => <ChakraProvider value={defaultSystem}>{node}</ChakraProvider>;

describe('ErrorBoundary', () => {
  // React loguea automáticamente al capturar un error; silenciamos para
  // no contaminar la salida del test runner. Restauramos al final.
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
  afterEach(() => {
    (console.error as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renderiza children cuando no hay error', () => {
    render(
      wrap(
        <ErrorBoundary>
          <div>contenido sano</div>
        </ErrorBoundary>,
      ),
    );
    expect(screen.getByText('contenido sano')).toBeInTheDocument();
  });

  it('captura excepción y muestra fallback con el mensaje del error', () => {
    render(
      wrap(
        <ErrorBoundary label="test">
          <Throw message="error de prueba" />
        </ErrorBoundary>,
      ),
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/error de prueba/i)).toBeInTheDocument();
    expect(screen.getByText(/test/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('reset restaura el árbol cuando se hace click en Reintentar', async () => {
    const user = userEvent.setup();
    function Toggle() {
      const [bomb, setBomb] = useState(true);
      return bomb ? (
        <ErrorBoundary
          fallback={(_err, retry) => (
            <button
              type="button"
              onClick={() => {
                setBomb(false);
                retry();
              }}
            >
              reintentar
            </button>
          )}
        >
          <Throw />
        </ErrorBoundary>
      ) : (
        <div>recuperado</div>
      );
    }
    render(wrap(<Toggle />));
    await user.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(screen.getByText('recuperado')).toBeInTheDocument();
  });

  it('invoca onError callback con el error', () => {
    const onError = vi.fn();
    render(
      wrap(
        <ErrorBoundary onError={onError}>
          <Throw message="callback test" />
        </ErrorBoundary>,
      ),
    );
    expect(onError).toHaveBeenCalled();
    const [err] = onError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toBe('callback test');
  });
});
