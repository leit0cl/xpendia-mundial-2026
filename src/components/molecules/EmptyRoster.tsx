import { Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GlassPanel } from '@/components/atoms/GlassPanel';

export function EmptyRoster() {
  const { t } = useTranslation();
  return (
    <GlassPanel p={10} textAlign="center">
      <VStack gap={3}>
        <Text fontSize="lg" fontWeight={600}>
          {t('team.emptyRosterTitle')}
        </Text>
        <Text fontSize="sm" color="var(--text-muted)" maxW="400px">
          {t('team.emptyRosterSubtitle')}
        </Text>
      </VStack>
    </GlassPanel>
  );
}
