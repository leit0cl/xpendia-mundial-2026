import { Box, Code, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { useStorageState } from '@/contexts/StorageContext';

export function SettingsPage() {
  const { t } = useTranslation();
  const storage = useStorageState();

  return (
    <Container
      maxW="1400px"
      pt={{ base: 28, md: 36 }}
      pb={{ base: 16, md: 24 }}
      px={{ base: 6, md: 8 }}
    >
      <VStack gap={3} align="flex-start" mb={10}>
        <Text className="kicker kicker-line">{t('settings.kicker')}</Text>
        <Heading
          fontFamily="display"
          fontWeight={600}
          fontSize={{ base: '2.6rem', md: '3.6rem' }}
          letterSpacing="-0.03em"
          lineHeight={1.02}
        >
          {t('settings.title')}
        </Heading>
        <Text color="fg.muted" maxW="60ch" lineHeight={1.6}>
          {t('settings.subtitle')}
        </Text>
      </VStack>

      <VStack gap={5} align="stretch" maxW="920px">
        <GlassPanel p={8}>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize="1.5rem"
            letterSpacing="-0.02em"
            mb={4}
          >
            {t('settings.backendTitle')}
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={4} lineHeight={1.6}>
            {t('settings.backendDescriptionPre')}{' '}
            <Code colorPalette="cyan">VITE_STORAGE_BACKEND</Code>
            {t('settings.backendValuesPre')} <Code>localforage</Code>{' '}
            {t('settings.backendValuesDefault')} <Code>minio</Code>.
          </Text>
          <Box>
            <Text
              fontFamily="kicker"
              fontSize="0.7rem"
              letterSpacing="0.12em"
              textTransform="uppercase"
              color="fg.subtle"
              mb={1.5}
            >
              {t('settings.statusLabel')}
            </Text>
            {storage.status === 'ready' && (
              <Text fontFamily="mono" fontSize="lg" color="accent">
                {storage.storage.backend}
              </Text>
            )}
            {storage.status === 'loading' && (
              <Text fontFamily="mono">{t('settings.initializing')}</Text>
            )}
            {storage.status === 'error' && (
              <Text color="red.300">
                {t('common.errorPrefix')} {storage.error.message}
              </Text>
            )}
          </Box>
        </GlassPanel>

        <GlassPanel p={8}>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize="1.5rem"
            letterSpacing="-0.02em"
            mb={4}
          >
            {t('settings.minioTitle')}
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={3} lineHeight={1.6}>
            {t('settings.minioPrompt')}
          </Text>
          <Box
            as="pre"
            p={4}
            fontSize="xs"
            overflow="auto"
            borderRadius="12px"
            bg="rgba(0,0,0,0.4)"
            border="1px solid rgba(255,255,255,0.08)"
            fontFamily="mono"
            color="fg.muted"
          >
            {`docker compose up -d
# Console: http://localhost:9001  (user: minioadmin / pass: minioadmin)
# API:     http://localhost:9000`}
          </Box>
          <Text fontSize="sm" mt={4} color="fg.muted" lineHeight={1.6}>
            {t('settings.minioInstructionsPre')} <Code>.env.example</Code>{' '}
            {t('settings.minioInstructionsTo')} <Code>.env.local</Code>{' '}
            {t('settings.minioInstructionsAndSet')} <Code>VITE_STORAGE_BACKEND=minio</Code>
            {t('settings.minioInstructionsRestart')} <Code>pnpm dev</Code>
            {t('settings.minioInstructionsDot')}
          </Text>
        </GlassPanel>

        <GlassPanel p={8}>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize="1.5rem"
            letterSpacing="-0.02em"
            mb={4}
          >
            {t('settings.dataTitle')}
          </Heading>
          <Text fontSize="sm" color="fg.muted" lineHeight={1.6}>
            {t('settings.dataDescription', { path: '/public/data', lib: 'flag-icons' })}
          </Text>
        </GlassPanel>
      </VStack>
    </Container>
  );
}
