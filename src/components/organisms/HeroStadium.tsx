import { Box, Container, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CountdownChip } from '@/components/molecules/CountdownChip';

const MotionBox = motion.create(Box);

export function HeroStadium() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);
  const titleY = useTransform(scrollY, [0, 600], [0, -40]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.7, 0.95]);

  return (
    <Box
      ref={ref}
      as="section"
      position="relative"
      minH={{ base: '92vh', md: '100vh' }}
      overflow="hidden"
      pt={{ base: 28, md: 32 }}
      pb={{ base: 16, md: 24 }}
    >
      {/* Capa 0 — imagen de la copa, parallax sutil. Filtro broadcast:
          bajada de brillo, desaturación leve, contraste alto para que destaque
          el modelado 3D de la copa sin parecer estridente. */}
      <MotionBox
        position="absolute"
        inset={0}
        zIndex={0}
        style={{
          y: bgY,
          backgroundImage: "url('/hero-worldcup.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 32%',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.58) saturate(85%) contrast(1.08)',
        }}
        aria-hidden
      />

      {/* Capa 1 — base black-alpha que asegura legibilidad del texto editorial
          y une la imagen con la paleta ink del producto. */}
      <Box
        position="absolute"
        inset={0}
        zIndex={1}
        bg="rgba(7,9,15,0.42)"
        pointerEvents="none"
        aria-hidden
      />

      {/* Capa 2 — glow gold radial centrado en el lado izquierdo (donde vive el
          título). Da calidez sin tocar la copa. */}
      <Box
        position="absolute"
        inset={0}
        zIndex={1}
        bg="radial-gradient(ellipse 50% 50% at 25% 50%, rgba(230,196,106,0.16), transparent 65%)"
        pointerEvents="none"
        aria-hidden
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Capa 3 — vignette desde los bordes: oscurece esquinas, deja el centro
          (la copa) con más presencia. Más opacidad al hacer scroll para que
          la transición a la siguiente sección sea suave. */}
      <MotionBox
        position="absolute"
        inset={0}
        zIndex={1}
        style={{ opacity: overlayOpacity }}
        bg="
          radial-gradient(ellipse 75% 80% at 50% 45%, transparent 0%, rgba(7,9,15,0.35) 55%, rgba(7,9,15,0.85) 100%),
          linear-gradient(180deg, rgba(7,9,15,0.18) 0%, transparent 30%, rgba(7,9,15,0.55) 78%, var(--ink-950) 100%)
        "
        pointerEvents="none"
        aria-hidden
      />

      {/* Capa 4 — noise/grain editorial (puntos finos). */}
      <Box
        position="absolute"
        inset={0}
        zIndex={1}
        backgroundImage="radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)"
        backgroundSize="22px 22px"
        opacity={0.45}
        pointerEvents="none"
        style={{ mixBlendMode: 'overlay' }}
        aria-hidden
      />

      {/* Capa 5 — línea de scanline editorial sutilísima (broadcast feel). */}
      <Box
        position="absolute"
        inset={0}
        zIndex={1}
        backgroundImage="repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)"
        pointerEvents="none"
        aria-hidden
      />

      <Container maxW="1400px" position="relative" zIndex={2} h="100%">
        <MotionBox style={{ y: titleY }}>
          <VStack align="flex-start" gap={6} maxW="980px">
            <CountdownChip />

            <HStack gap={2} flexWrap="wrap">
              <Text className="kicker kicker-line">{t('hero.kicker')}</Text>
              <Text
                fontFamily="kicker"
                fontSize="0.72rem"
                letterSpacing="0.14em"
                textTransform="uppercase"
                color="rgba(255,255,255,0.85)"
                textShadow="0 1px 8px rgba(0,0,0,0.6)"
              >
                {t('hero.venues')}
              </Text>
            </HStack>

            <Heading
              as="h1"
              fontFamily="display"
              fontWeight={600}
              fontSize={{ base: '3.4rem', md: '6.2rem' }}
              lineHeight={0.98}
              letterSpacing="-0.035em"
              className="display-gradient"
            >
              {t('hero.title1')}{' '}
              <Box
                as="span"
                fontStyle="italic"
                className="display-italic"
                style={{
                  background: 'linear-gradient(135deg, #F2D98A 0%, #FCEDB6 50%, #E6C46A 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 28px rgba(242, 217, 138, 0.32))',
                }}
              >
                {t('hero.title2')}
              </Box>
            </Heading>

            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              color="rgba(255,255,255,0.92)"
              maxW="640px"
              lineHeight={1.55}
              fontWeight={400}
              textShadow="0 2px 16px rgba(0,0,0,0.55)"
            >
              {t('hero.intro')}
            </Text>

            <HStack gap={4} flexWrap="wrap" mt={2}>
              <Box
                as="a"
                href="#selecciones"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  document
                    .getElementById('selecciones')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                display="inline-flex"
                alignItems="center"
                gap={2}
                px={6}
                py={3.5}
                borderRadius="full"
                bg="linear-gradient(135deg, #F2D98A, #C39A3D)"
                color="ink.950"
                fontFamily="kicker"
                fontSize="0.78rem"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                cursor="pointer"
                textDecoration="none"
                boxShadow="0 12px 36px rgba(230,196,106,0.25)"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 18px 48px rgba(230,196,106,0.4)',
                }}
              >
                {t('hero.ctaStart')}
                <Box as="span" fontSize="lg" lineHeight={1}>
                  ↓
                </Box>
              </Box>
              <Link to="/tactics" style={{ textDecoration: 'none' }}>
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={6}
                  py={3.5}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.04)"
                  color="white"
                  fontFamily="kicker"
                  fontSize="0.78rem"
                  fontWeight={700}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  cursor="pointer"
                  border="1px solid rgba(255,255,255,0.18)"
                  transition="background 0.2s ease, border-color 0.2s ease"
                  _hover={{ bg: 'rgba(255,255,255,0.08)', borderColor: 'rgba(230,196,106,0.4)' }}
                >
                  {t('hero.ctaTactics')}
                  <Box as="span" fontSize="lg" lineHeight={1}>
                    →
                  </Box>
                </Box>
              </Link>
            </HStack>

            <HStack
              gap={6}
              mt={8}
              fontFamily="kicker"
              fontSize="0.68rem"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color="rgba(255,255,255,0.75)"
              textShadow="0 1px 6px rgba(0,0,0,0.55)"
            >
              <Text>{t('hero.statLocal')}</Text>
              <Text>·</Text>
              <Text>{t('hero.statTrackers')}</Text>
              <Text>·</Text>
              <Text>{t('hero.statOffline')}</Text>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
