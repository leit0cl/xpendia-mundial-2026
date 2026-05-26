import { Box, Button, Container, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TeamHeader } from '@/components/molecules/TeamHeader';
import { PlayerGrid } from '@/components/organisms/PlayerGrid';
import { PlayerDetailModal } from '@/components/organisms/PlayerDetailModal';
import { TeamMarquee } from '@/components/organisms/TeamMarquee';
import { EmptyRoster } from '@/components/molecules/EmptyRoster';
import { useRosters } from '@/contexts/RostersContext';
import type { Player } from '@/types/domain';

export function TeamPage() {
  const { code } = useParams<{ code: string }>();
  const rosters = useRosters();
  const { t } = useTranslation();
  const [openPlayer, setOpenPlayer] = useState<Player | null>(null);
  const [marqueeOpen, setMarqueeOpen] = useState(false);

  if (rosters.status !== 'ready') {
    return (
      <Container maxW="1400px" pt={{ base: 28, md: 36 }} pb={20} px={{ base: 6, md: 8 }}>
        <Text color="fg.muted" fontFamily="kicker" letterSpacing="0.1em" textTransform="uppercase">
          {t('common.loading')}
        </Text>
      </Container>
    );
  }

  const team = rosters.getTeam(code ?? '');
  if (!team) {
    return (
      <Container maxW="1400px" pt={{ base: 28, md: 36 }} pb={20} px={{ base: 6, md: 8 }}>
        <Text mb={4}>{t('team.notFoundText')}</Text>
        <Button as={Link} {...({ to: '/' } as object)}>
          {t('team.back')}
        </Button>
      </Container>
    );
  }

  const players = rosters.getRoster(team.code);

  return (
    <Container
      maxW="1400px"
      pt={{ base: 28, md: 36 }}
      pb={{ base: 16, md: 24 }}
      px={{ base: 6, md: 8 }}
    >
      <Box>
        <TeamHeader
          team={team}
          actions={
            <HStack gap={2}>
              <MarqueeButton onClick={() => setMarqueeOpen(true)} />
            </HStack>
          }
        />
        {players.length === 0 ? (
          <EmptyRoster />
        ) : (
          <PlayerGrid team={team} players={players} onOpenPlayer={setOpenPlayer} />
        )}
        <PlayerDetailModal player={openPlayer} team={team} onClose={() => setOpenPlayer(null)} />
        <TeamMarquee
          team={team}
          players={players}
          open={marqueeOpen}
          onClose={() => setMarqueeOpen(false)}
        />
      </Box>
    </Container>
  );
}

function MarqueeButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Box
      as="button"
      {...({
        type: 'button',
        'aria-label': t('team.marqueeButtonAriaLabel'),
        title: t('team.marqueeButtonTitle'),
      } as object)}
      onClick={onClick}
      display="inline-flex"
      alignItems="center"
      gap={2.5}
      px={4}
      py={2.5}
      borderRadius="full"
      bg="linear-gradient(135deg, rgba(70,227,255,0.18), rgba(242,217,138,0.16))"
      border="1px solid rgba(70,227,255,0.45)"
      color="white"
      fontFamily="kicker"
      fontSize="0.66rem"
      fontWeight={800}
      letterSpacing="0.18em"
      textTransform="uppercase"
      cursor="pointer"
      boxShadow="0 0 0 1px rgba(70,227,255,0.08) inset, 0 12px 28px rgba(70,227,255,0.22)"
      transition="transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: '0 0 0 1px rgba(70,227,255,0.14) inset, 0 18px 44px rgba(70,227,255,0.36)',
        borderColor: 'rgba(70,227,255,0.75)',
      }}
    >
      <Box
        as="span"
        width="8px"
        height="8px"
        borderRadius="full"
        bg="#46E3FF"
        boxShadow="0 0 12px #46E3FF, 0 0 4px white"
      />
      <Box as="span">{t('team.marqueeButton')}</Box>
      <Box as="span" opacity={0.7} fontSize="0.7rem">
        ▶
      </Box>
    </Box>
  );
}
