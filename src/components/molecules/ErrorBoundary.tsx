import { Box, Text } from '@chakra-ui/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  /** Children que se aíslan del resto de la app. */
  children: ReactNode;
  /** UI custom; si no se provee, se muestra el fallback editorial por defecto. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Tag para distinguir el boundary en logs. */
  label?: string;
  /** Hook para integrar con telemetría externa (Sentry, etc.). */
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = { error: Error | null };

/** Captura excepciones de render/lifecycle en sus children y muestra un
 *  fallback editorial en vez de pantalla blanca. El reset desmonta el árbol
 *  hijo permitiendo recuperarse sin recargar toda la app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const tag = this.props.label ? `[${this.props.label}]` : '[ErrorBoundary]';
    // Mantener visible para debugging local; en prod un hook externo puede
    // enviarlo a telemetría.
    console.error(tag, error, info);
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return <DefaultFallback error={error} reset={this.reset} label={this.props.label} />;
  }
}

function DefaultFallback({
  error,
  reset,
  label,
}: {
  error: Error;
  reset: () => void;
  label?: string;
}) {
  const { t } = useTranslation();
  return (
    <Box
      role="alert"
      m={{ base: 4, md: 8 }}
      p={{ base: 6, md: 10 }}
      borderRadius="20px"
      bg="rgba(230,57,70,0.06)"
      border="1px solid rgba(230,57,70,0.35)"
      boxShadow="0 24px 60px rgba(0,0,0,0.4)"
      maxW="640px"
      mx="auto"
    >
      <Text
        fontFamily="kicker"
        fontSize="0.62rem"
        fontWeight={700}
        letterSpacing="0.22em"
        textTransform="uppercase"
        color="#E63946"
        mb={3}
      >
        {t('errorBoundary.title')} {label ? `· ${label}` : ''}
      </Text>
      <Text
        fontFamily="display"
        fontSize={{ base: '1.6rem', md: '2.2rem' }}
        fontWeight={600}
        letterSpacing="-0.02em"
        color="white"
        lineHeight={1.1}
        mb={4}
      >
        {t('errorBoundary.subtitle')}
      </Text>
      <Text
        fontFamily="mono"
        fontSize="0.72rem"
        color="rgba(255,255,255,0.55)"
        bg="rgba(0,0,0,0.35)"
        p={3}
        borderRadius="10px"
        mb={5}
        overflowX="auto"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        {error.message || String(error)}
      </Text>
      <Box
        as="button"
        onClick={reset}
        px={5}
        py={2.5}
        borderRadius="full"
        bg="#46E3FF"
        color="#05070b"
        fontFamily="kicker"
        fontSize="0.7rem"
        fontWeight={800}
        letterSpacing="0.18em"
        textTransform="uppercase"
        cursor="pointer"
        _hover={{ filter: 'brightness(1.1)' }}
        transition="filter 0.2s ease"
      >
        {t('errorBoundary.retry')}
      </Box>
    </Box>
  );
}
