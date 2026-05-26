import { Box, Container, Grid, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRosters } from '@/contexts/RostersContext';
import { HoloTeamCard } from '@/components/molecules/HoloTeamCard';
import { FlagBadge } from '@/components/atoms/FlagBadge';
import type { Confederation, Team } from '@/types/domain';

/** Lista canónica de confederaciones; los subtítulos viven en i18n. */
const CONF_KEYS: Confederation[] = ['CONCACAF', 'CONMEBOL', 'UEFA', 'CAF', 'AFC', 'OFC'];

function HostHeroBlock({ team }: { team: Team }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate(`/teams/${team.code}`)}
      cursor="pointer"
      position="relative"
      borderRadius="22px"
      overflow="hidden"
      isolation="isolate"
      minH={{ base: '180px', md: '220px' }}
      role="button"
      aria-label={t('confederations.hostAria', { name: team.name })}
      transition="transform 0.4s ease, box-shadow 0.4s ease"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '0 24px 60px rgba(0,0,0,0.55)' }}
    >
      <Box
        position="absolute"
        inset={0}
        className={`fi-bleed fi fi-${team.isoCountry.toLowerCase()}`}
        style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
        filter="brightness(0.55) saturate(160%)"
        zIndex={0}
      />
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(7,9,15,0.2) 0%, rgba(7,9,15,0.85) 100%)"
        zIndex={1}
      />
      <VStack
        position="relative"
        zIndex={2}
        align="flex-start"
        justify="space-between"
        h="100%"
        p={{ base: 5, md: 7 }}
        gap={3}
      >
        <Box className="host-badge">★ {t('team.host')}</Box>
        <VStack align="flex-start" gap={1} mt="auto">
          <Text
            fontFamily="mono"
            fontSize="0.65rem"
            color="rgba(255,255,255,0.65)"
            letterSpacing="0.06em"
          >
            {team.code}
          </Text>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize={{ base: '1.7rem', md: '2.2rem' }}
            letterSpacing="-0.02em"
            color="white"
          >
            {team.name}
          </Heading>
        </VStack>
      </VStack>
    </Box>
  );
}

export function ConfederationGallery() {
  const { t } = useTranslation();
  const rosters = useRosters();

  if (rosters.status === 'loading') {
    return (
      <Container maxW="1400px" py={20}>
        <Text color="fg.muted" fontFamily="kicker" letterSpacing="0.1em" textTransform="uppercase">
          {t('confederations.loading')}
        </Text>
      </Container>
    );
  }
  if (rosters.status === 'error') {
    return (
      <Container maxW="1400px" py={20}>
        <Text color="red.300">Error: {rosters.error.message}</Text>
      </Container>
    );
  }

  const grouped = rosters.byConfederation();
  const hosts = (grouped.CONCACAF ?? []).filter((t) => t.host);

  return (
    <Box as="section" id="selecciones" py={{ base: 16, md: 24 }} scrollMarginTop="120px">
      <Container maxW="1400px">
        <VStack align="flex-start" gap={3} mb={10}>
          <Text className="kicker kicker-line">{t('confederations.headerKicker')}</Text>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize={{ base: '2.4rem', md: '3.4rem' }}
            letterSpacing="-0.03em"
            lineHeight={1.02}
          >
            {t('confederations.title1')}{' '}
            <Box as="span" fontStyle="italic" color="gold" className="display-italic">
              {t('confederations.title2')}
            </Box>
            .
          </Heading>
        </VStack>

        {hosts.length > 0 && (
          <Box mb={14}>
            <HStack gap={3} mb={4}>
              <Text className="kicker" style={{ color: '#E6C46A' }}>
                {t('confederations.hostKicker')}
              </Text>
              <Box flex={1} height="1px" bg="rgba(230,196,106,0.18)" />
            </HStack>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5}>
              {hosts.map((team) => (
                <HostHeroBlock key={team.code} team={team} />
              ))}
            </Grid>
          </Box>
        )}

        <Box py={3} mb={6}>
          <HStack gap={2} overflowX="auto" css={{ scrollbarWidth: 'none' }}>
            {CONF_KEYS.map((key) => {
              const count = grouped[key]?.length ?? 0;
              return (
                <Box
                  as="a"
                  key={key}
                  href={`#conf-${key}`}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.04)"
                  border="1px solid rgba(255,255,255,0.08)"
                  fontFamily="kicker"
                  fontSize="0.7rem"
                  fontWeight={700}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  color="fg.muted"
                  textDecoration="none"
                  whiteSpace="nowrap"
                  _hover={{ color: 'white', borderColor: 'rgba(230,196,106,0.4)' }}
                  transition="color 0.2s ease, border-color 0.2s ease"
                >
                  {key}
                  <Box as="span" fontFamily="mono" fontSize="0.66rem" color="gold">
                    {count}
                  </Box>
                </Box>
              );
            })}
          </HStack>
        </Box>

        {CONF_KEYS.map((key) => {
          const teams = grouped[key] ?? [];
          if (teams.length === 0) return null;
          return (
            <Box key={key} id={`conf-${key}`} mb={14} scrollMarginTop="160px">
              <HStack justify="space-between" mb={5} flexWrap="wrap" gap={2}>
                <Box>
                  <Heading
                    fontFamily="display"
                    fontWeight={600}
                    fontSize={{ base: '1.8rem', md: '2.4rem' }}
                    letterSpacing="-0.02em"
                  >
                    {key}
                  </Heading>
                  <Text
                    fontFamily="kicker"
                    fontSize="0.7rem"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    color="fg.muted"
                    mt={1}
                  >
                    {t(`confederations.sub.${key}`)}
                  </Text>
                </Box>
                <HStack gap={-1}>
                  {teams.slice(0, 6).map((t) => (
                    <Box key={t.code} ml="-8px">
                      <FlagBadge iso={t.isoCountry} size="md" />
                    </Box>
                  ))}
                  <Text fontFamily="mono" fontSize="0.7rem" color="fg.muted" ml={3}>
                    {teams.length} equipos
                  </Text>
                </HStack>
              </HStack>
              <Box className="netflix-row" pb={2}>
                {teams.map((t) => (
                  <HoloTeamCard key={t.code} team={t} />
                ))}
              </Box>
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}
