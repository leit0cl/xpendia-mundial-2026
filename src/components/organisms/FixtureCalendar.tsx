import { Box, Container, Grid, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type Phase = {
  key: 'groups' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';
  dates: string;
  matches: number;
  highlight?: boolean;
};

/** Fechas son universales (formato ISO-ish, no se traducen). Las etiquetas
 *  del kicker/título/nota viven en i18n bajo `fixture.phases`. */
const PHASES: Phase[] = [
  { key: 'groups', dates: '11 jun → 27 jun', matches: 72 },
  { key: 'r32', dates: '28 jun → 3 jul', matches: 16 },
  { key: 'r16', dates: '4 jul → 7 jul', matches: 8 },
  { key: 'qf', dates: '9 jul → 11 jul', matches: 4 },
  { key: 'sf', dates: '14 jul → 15 jul', matches: 2 },
  { key: 'third', dates: '18 jul', matches: 1 },
  { key: 'final', dates: '19 jul', matches: 1, highlight: true },
];

const PHASE_KEYS = {
  groups: { kicker: 'groupsKicker', title: 'groupsTitle' },
  r32: { kicker: 'r32Kicker', title: 'r32Title', note: 'r32Note' },
  r16: { kicker: 'r16Kicker', title: 'r16Title' },
  qf: { kicker: 'qfKicker', title: 'qfTitle' },
  sf: { kicker: 'sfKicker', title: 'sfTitle' },
  third: { kicker: 'thirdKicker', title: 'thirdTitle' },
  final: { kicker: 'finalKicker', title: 'finalTitle', note: 'finalNote' },
} as const;

export function FixtureCalendar() {
  const { t } = useTranslation();
  return (
    <Box as="section" id="calendario" py={{ base: 16, md: 24 }} scrollMarginTop="120px">
      <Container maxW="1400px">
        <VStack align="flex-start" gap={3} mb={10}>
          <Text className="kicker kicker-line">{t('fixture.kicker')}</Text>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize={{ base: '2.4rem', md: '3.4rem' }}
            letterSpacing="-0.03em"
            lineHeight={1.02}
          >
            {t('fixture.title1')}{' '}
            <Box as="span" fontStyle="italic" color="gold" className="display-italic">
              {t('fixture.title2')}
            </Box>
          </Heading>
          <Text color="fg.muted" fontSize="md" lineHeight={1.6} maxW="60ch">
            {t('fixture.subtitle')}
          </Text>
        </VStack>

        <Box position="relative">
          <Box
            position="absolute"
            top={{ base: 'auto', md: '64px' }}
            left={0}
            right={0}
            height="1px"
            bg="linear-gradient(90deg, transparent, rgba(230,196,106,0.4) 30%, rgba(230,196,106,0.4) 70%, transparent)"
            display={{ base: 'none', md: 'block' }}
            aria-hidden
          />

          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              xl: 'repeat(7, 1fr)',
            }}
            gap={4}
            position="relative"
          >
            {PHASES.map((p) => {
              const keys = PHASE_KEYS[p.key];
              const noteKey = 'note' in keys ? keys.note : undefined;
              return (
                <Box
                  key={p.key}
                  position="relative"
                  p={4}
                  borderRadius="16px"
                  bg={
                    p.highlight
                      ? 'linear-gradient(180deg, rgba(230,196,106,0.18), rgba(230,196,106,0.04))'
                      : 'rgba(255,255,255,0.03)'
                  }
                  border="1px solid"
                  borderColor={p.highlight ? 'rgba(230,196,106,0.5)' : 'rgba(255,255,255,0.07)'}
                  boxShadow={p.highlight ? '0 12px 40px rgba(230,196,106,0.18)' : 'none'}
                  transition="border-color 0.3s ease, transform 0.3s ease"
                  _hover={{
                    borderColor: p.highlight ? 'rgba(230,196,106,0.7)' : 'rgba(255,255,255,0.18)',
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Box
                    position="absolute"
                    top={{ base: 'auto', md: '-4px' }}
                    left="50%"
                    transform="translateX(-50%)"
                    width="9px"
                    height="9px"
                    borderRadius="full"
                    bg={p.highlight ? 'gold' : 'rgba(230,196,106,0.55)'}
                    boxShadow={p.highlight ? '0 0 14px rgba(230,196,106,0.9)' : 'none'}
                    display={{ base: 'none', md: 'block' }}
                    aria-hidden
                  />
                  <VStack align="flex-start" gap={2} pt={{ base: 0, md: 3 }}>
                    <Text
                      fontFamily="kicker"
                      fontSize="0.62rem"
                      fontWeight={700}
                      letterSpacing="0.14em"
                      textTransform="uppercase"
                      color={p.highlight ? 'gold' : 'fg.subtle'}
                    >
                      {t(`fixture.phases.${keys.kicker}`)}
                    </Text>
                    <Heading
                      fontFamily="display"
                      fontWeight={600}
                      fontSize="1.2rem"
                      letterSpacing="-0.02em"
                      lineHeight={1.1}
                    >
                      {t(`fixture.phases.${keys.title}`)}
                    </Heading>
                    <Text
                      fontFamily="mono"
                      fontSize="0.7rem"
                      color="fg.muted"
                      letterSpacing="0.02em"
                    >
                      {p.dates}
                    </Text>
                    <HStack gap={1.5} mt={1}>
                      <Text fontFamily="mono" fontSize="0.85rem" fontWeight={700} color="white">
                        {p.matches}
                      </Text>
                      <Text
                        fontFamily="kicker"
                        fontSize="0.58rem"
                        letterSpacing="0.12em"
                        textTransform="uppercase"
                        color="fg.subtle"
                      >
                        {t('fixture.match', { count: p.matches })}
                      </Text>
                    </HStack>
                    {noteKey && (
                      <Text
                        mt={1}
                        fontFamily="kicker"
                        fontSize="0.58rem"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        color={p.highlight ? 'rgba(230,196,106,0.85)' : 'fg.muted'}
                      >
                        {t(`fixture.phases.${noteKey}`)}
                      </Text>
                    )}
                  </VStack>
                </Box>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
