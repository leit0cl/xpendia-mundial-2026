import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { FlagBadge } from '@/components/atoms/FlagBadge';
import { JerseyChip } from '@/components/atoms/JerseyChip';
import type { Team } from '@/types/domain';

type Props = {
  title: string;
  subtitle?: string;
  teams: Team[];
};

export function TeamCarousel({ title, subtitle, teams }: Props) {
  const navigate = useNavigate();

  if (teams.length === 0) return null;

  return (
    <Box mb={10}>
      <Box mb={3}>
        <Heading size="lg">{title}</Heading>
        {subtitle && (
          <Text color="var(--text-muted)" fontSize="sm" mt={1}>
            {subtitle}
          </Text>
        )}
      </Box>
      <Box className="netflix-row">
        {teams.map((team) => (
          <GlassPanel
            key={team.code}
            className="team-card"
            p={5}
            onClick={() => navigate(`/teams/${team.code}`)}
            role="button"
            tabIndex={0}
            aria-label={team.name}
          >
            <Flex direction="column" align="center" gap={3}>
              <FlagBadge iso={team.isoCountry} size="xl" />
              <Heading size="md" textAlign="center">
                {team.name}
              </Heading>
              <Flex gap={3} align="center">
                <Text fontSize="xs" color="var(--text-muted)">
                  {team.code}
                </Text>
                <JerseyChip home={team.kitHome} away={team.kitAway} />
              </Flex>
              {team.host && (
                <Box
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  fontWeight={600}
                  color="var(--accent-warm)"
                  border="1px solid var(--accent-warm)"
                  borderRadius="full"
                >
                  ANFITRIÓN
                </Box>
              )}
            </Flex>
          </GlassPanel>
        ))}
      </Box>
    </Box>
  );
}
