import { Box, Container, Grid, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const MotionBox = motion.create(Box);

type Token = { x: number; y: number; team: 'home' | 'away' | 'gk-home' | 'gk-away'; n: number };

const FORMATION: Token[] = [
  { x: 8, y: 50, team: 'gk-home', n: 1 },
  { x: 22, y: 18, team: 'home', n: 2 },
  { x: 22, y: 38, team: 'home', n: 4 },
  { x: 22, y: 62, team: 'home', n: 5 },
  { x: 22, y: 82, team: 'home', n: 3 },
  { x: 42, y: 28, team: 'home', n: 6 },
  { x: 42, y: 50, team: 'home', n: 8 },
  { x: 42, y: 72, team: 'home', n: 10 },
  { x: 62, y: 22, team: 'home', n: 7 },
  { x: 62, y: 50, team: 'home', n: 9 },
  { x: 62, y: 78, team: 'home', n: 11 },

  { x: 92, y: 50, team: 'gk-away', n: 1 },
  { x: 78, y: 22, team: 'away', n: 2 },
  { x: 78, y: 50, team: 'away', n: 4 },
  { x: 78, y: 78, team: 'away', n: 3 },
];

const tokenColor: Record<Token['team'], string> = {
  home: 'linear-gradient(135deg, #46E3FF, #1078b0)',
  away: 'linear-gradient(135deg, #B7253C, #6e1426)',
  'gk-home': 'linear-gradient(135deg, #F2D98A, #C39A3D)',
  'gk-away': 'linear-gradient(135deg, #F2D98A, #C39A3D)',
};

export function TacticsShowcase() {
  const { t } = useTranslation();
  const tokens = useMemo(() => FORMATION, []);
  const tags = [
    'Three.js',
    'WebGL',
    t('tacticsShowcase.tagDrag'),
    t('tacticsShowcase.tagRecord'),
    t('tacticsShowcase.tagOffline'),
  ];

  return (
    <Box as="section" py={{ base: 16, md: 24 }}>
      <Container maxW="1400px">
        <Grid
          templateColumns={{ base: '1fr', lg: '0.42fr 0.58fr' }}
          gap={{ base: 10, lg: 16 }}
          alignItems="center"
        >
          <VStack align="flex-start" gap={5}>
            <Text className="kicker kicker-line" style={{ color: '#46E3FF' }}>
              {t('tacticsShowcase.kicker')}
            </Text>
            <Heading
              fontFamily="display"
              fontWeight={600}
              fontSize={{ base: '2.4rem', md: '3.4rem' }}
              letterSpacing="-0.03em"
              lineHeight={1.02}
            >
              {t('tacticsShowcase.title1')}{' '}
              <Box as="span" fontStyle="italic" color="accent" className="display-italic">
                {t('tacticsShowcase.title2')}
              </Box>
            </Heading>
            <Text color="fg.muted" fontSize="md" lineHeight={1.6} maxW="44ch">
              {t('tacticsShowcase.subtitle')}
            </Text>
            <HStack gap={4} flexWrap="wrap" pt={2}>
              {tags.map((tag) => (
                <Box
                  key={tag}
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  fontFamily="mono"
                  fontSize="0.66rem"
                  bg="rgba(255,255,255,0.04)"
                  border="1px solid rgba(255,255,255,0.1)"
                  color="fg.muted"
                >
                  {tag}
                </Box>
              ))}
            </HStack>
            <Link to="/tactics" style={{ textDecoration: 'none' }}>
              <HStack
                gap={2}
                mt={4}
                fontFamily="kicker"
                fontSize="0.78rem"
                fontWeight={700}
                letterSpacing="0.14em"
                textTransform="uppercase"
                color="accent"
                _hover={{ gap: 3 }}
                transition="gap 0.2s ease"
              >
                <Text as="span">{t('tacticsShowcase.cta')}</Text>
                <Text as="span" fontSize="lg" lineHeight={1}>
                  →
                </Text>
              </HStack>
            </Link>
          </VStack>

          <Box
            position="relative"
            aspectRatio="16 / 10"
            borderRadius="24px"
            overflow="hidden"
            bg="linear-gradient(180deg, #0e3520 0%, #062513 100%)"
            border="1px solid rgba(255,255,255,0.08)"
            boxShadow="0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)"
          >
            <Box
              position="absolute"
              inset={0}
              backgroundImage="repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 60px, rgba(0,0,0,0.06) 60px 120px)"
              opacity={0.7}
            />
            <Box
              position="absolute"
              inset="6%"
              border="2px solid rgba(255,255,255,0.5)"
              borderRadius="4px"
            >
              <Box
                position="absolute"
                top={0}
                bottom={0}
                left="50%"
                width="1.5px"
                bg="rgba(255,255,255,0.5)"
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                width="14%"
                aspectRatio="1"
                borderRadius="50%"
                border="2px solid rgba(255,255,255,0.5)"
                transform="translate(-50%, -50%)"
              />
              <Box
                position="absolute"
                top="22%"
                bottom="22%"
                left={0}
                width="14%"
                border="2px solid rgba(255,255,255,0.5)"
                borderLeft="none"
              />
              <Box
                position="absolute"
                top="22%"
                bottom="22%"
                right={0}
                width="14%"
                border="2px solid rgba(255,255,255,0.5)"
                borderRight="none"
              />
              <Box
                position="absolute"
                top="35%"
                bottom="35%"
                left={0}
                width="6%"
                border="2px solid rgba(255,255,255,0.5)"
                borderLeft="none"
              />
              <Box
                position="absolute"
                top="35%"
                bottom="35%"
                right={0}
                width="6%"
                border="2px solid rgba(255,255,255,0.5)"
                borderRight="none"
              />
            </Box>

            {tokens.map((tk, idx) => (
              <MotionBox
                key={idx}
                position="absolute"
                left={`${tk.x}%`}
                top={`${tk.y}%`}
                width={{ base: '26px', md: '34px' }}
                aspectRatio="1"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontFamily="mono"
                fontSize={{ base: '0.55rem', md: '0.68rem' }}
                fontWeight={700}
                color="white"
                textShadow="0 1px 2px rgba(0,0,0,0.6)"
                style={{ background: tokenColor[tk.team], transform: 'translate(-50%, -50%)' }}
                boxShadow="0 4px 12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.3)"
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 3.5 + (idx % 5) * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (idx % 4) * 0.4,
                }}
              >
                {tk.n}
              </MotionBox>
            ))}

            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L10,5 L0,10 L2,5 z" fill="#46E3FF" />
                </marker>
              </defs>

              {/* Salida por banda alta: #2 (22,18) → #7 (62,22).
                  Curva convex hacia arriba — mismo estilo que las flechas de la pizarra. */}
              <motion.path
                d="M 24.35,18.38 Q 42.72,12.84 59.65,21.62"
                stroke="#46E3FF"
                strokeWidth="0.55"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arrow-cyan)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 4,
                  times: [0, 0.35, 0.78, 1],
                  delay: 0.4,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                  ease: 'easeInOut',
                }}
              />

              {/* Salida por banda baja: #3 (22,82) → #11 (62,78).
                  Curva convex hacia abajo — simétrica respecto al eje horizontal. */}
              <motion.path
                d="M 24.35,81.62 Q 42.72,87.16 59.65,78.38"
                stroke="#46E3FF"
                strokeWidth="0.55"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arrow-cyan)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 4,
                  times: [0, 0.35, 0.78, 1],
                  delay: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                  ease: 'easeInOut',
                }}
              />
            </svg>

            <Box
              position="absolute"
              top={3}
              right={3}
              px={2.5}
              py={1}
              borderRadius="full"
              bg="rgba(0,0,0,0.5)"
              border="1px solid rgba(255,255,255,0.12)"
              fontFamily="mono"
              fontSize="0.6rem"
              color="rgba(255,255,255,0.7)"
              display="flex"
              alignItems="center"
              gap={1.5}
            >
              <Box as="span" width="6px" height="6px" borderRadius="full" bg="#ff5a5f" />
              REC · 00:07
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
