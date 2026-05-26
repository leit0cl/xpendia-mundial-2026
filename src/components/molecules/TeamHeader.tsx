import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FlagBadge } from '@/components/atoms/FlagBadge';
import { JerseyChip } from '@/components/atoms/JerseyChip';
import type { Team } from '@/types/domain';

export function TeamHeader({ team, actions }: { team: Team; actions?: ReactNode }) {
  const { t } = useTranslation();
  const flagBg = `/node_modules/flag-icons/flags/4x3/${team.isoCountry.toLowerCase()}.svg`;
  return (
    <Box position="relative" overflow="hidden" borderRadius={20} p={8} mb={6}>
      <Box className="flag-fullbleed" style={{ backgroundImage: `url(${flagBg})` }} />
      <Flex align="center" gap={6} position="relative" zIndex={1}>
        <FlagBadge iso={team.isoCountry} size="xl" rounded={false} />
        <Box flex={1}>
          <Heading size="2xl">{team.name}</Heading>
          <Flex align="center" gap={4} mt={2} color="var(--text-muted)">
            <Text fontSize="sm">{team.confederation}</Text>
            {team.group && team.group !== 'TBD' && (
              <Text fontSize="sm">{t('team.group', { letter: team.group })}</Text>
            )}
            {team.host && (
              <Text fontSize="sm" color="var(--accent-warm)">
                {t('team.host')}
              </Text>
            )}
            <JerseyChip home={team.kitHome} away={team.kitAway} />
          </Flex>
        </Box>
        {actions && (
          <Box flexShrink={0} alignSelf="center">
            {actions}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
