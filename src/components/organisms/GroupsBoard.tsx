import { Box, Container, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRosters } from '@/contexts/RostersContext';
import { GroupCard } from '@/components/molecules/GroupCard';

const GROUPS: Array<{ letter: string; color: string }> = [
  { letter: 'A', color: '#22C56B' },
  { letter: 'B', color: '#E63946' },
  { letter: 'C', color: '#F4823A' },
  { letter: 'D', color: '#4D8BF0' },
  { letter: 'E', color: '#9B6BFF' },
  { letter: 'F', color: '#C9D86E' },
  { letter: 'G', color: '#FF6B9D' },
  { letter: 'H', color: '#46E3FF' },
  { letter: 'I', color: '#94A0BA' },
  { letter: 'J', color: '#00C9B7' },
  { letter: 'K', color: '#FF7357' },
  { letter: 'L', color: '#11FA8F' },
];

export function GroupsBoard() {
  const { t } = useTranslation();
  const rosters = useRosters();

  if (rosters.status !== 'ready') return null;

  const teamsByGroup = rosters.teams.reduce<Record<string, typeof rosters.teams>>((acc, t) => {
    const g = t.group ?? 'TBD';
    (acc[g] ??= []).push(t);
    return acc;
  }, {});

  return (
    <Box as="section" id="grupos" py={{ base: 16, md: 24 }} scrollMarginTop="120px">
      <Container maxW="1400px">
        <VStack align="flex-start" gap={3} mb={10}>
          <Text className="kicker kicker-line">{t('groupsBoard.kicker')}</Text>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize={{ base: '2.4rem', md: '3.4rem' }}
            letterSpacing="-0.03em"
            lineHeight={1.02}
          >
            {t('groupsBoard.title1')}{' '}
            <Box as="span" fontStyle="italic" color="gold" className="display-italic">
              {t('groupsBoard.title2')}
            </Box>
            .
          </Heading>
          <Text color="fg.muted" fontSize="md" lineHeight={1.6} maxW="60ch">
            {t('groupsBoard.subtitle')}
          </Text>
        </VStack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={{ base: 4, md: 5 }}
        >
          {GROUPS.map((g) => {
            const teams = teamsByGroup[g.letter] ?? [];
            if (teams.length === 0) return null;
            return <GroupCard key={g.letter} letter={g.letter} color={g.color} teams={teams} />;
          })}
        </Grid>
      </Container>
    </Box>
  );
}
