import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

/** Fallback ligero para `<Suspense>` al lazy-load de rutas.
 *  Editorial, sin spinners genéricos. */
export function RouteSpinner() {
  const { t } = useTranslation();
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      minH="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <Box
          width="8px"
          height="8px"
          borderRadius="full"
          bg="#46E3FF"
          boxShadow="0 0 14px #46E3FF"
          style={{ animation: 'xp-pulse 1.2s ease-in-out infinite' }}
        />
        <Text
          fontFamily="kicker"
          fontSize="0.66rem"
          fontWeight={700}
          letterSpacing="0.24em"
          textTransform="uppercase"
          color="rgba(255,255,255,0.55)"
        >
          {t('common.loading')}
        </Text>
      </Box>
      <style>{`@keyframes xp-pulse {
        0%, 100% { opacity: 0.35; transform: scale(0.85); }
        50% { opacity: 1; transform: scale(1.2); }
      }`}</style>
    </Box>
  );
}
