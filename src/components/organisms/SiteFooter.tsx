import {
  Box,
  Container,
  Grid,
  HStack,
  Heading,
  Link as ChakraLink,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { XpendiaLogo } from '@/components/molecules/XpendiaLogo';

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <Box
      as="footer"
      mt={{ base: 12, md: 16 }}
      borderTop="1px solid rgba(255,255,255,0.06)"
      bg="rgba(7,9,15,0.5)"
    >
      <Container maxW="1400px" py={{ base: 12, md: 16 }}>
        {/* Pitch principal — bloque editorial con CTA */}
        <Box
          position="relative"
          borderRadius="24px"
          overflow="hidden"
          mb={{ base: 10, md: 14 }}
          p={{ base: 7, md: 10 }}
          bg="linear-gradient(135deg, rgba(0,191,255,0.06) 0%, rgba(17,250,143,0.04) 50%, rgba(255,115,87,0.06) 100%)"
          border="1px solid rgba(255,255,255,0.08)"
        >
          <Box
            position="absolute"
            inset={0}
            backgroundImage="radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)"
            backgroundSize="22px 22px"
            opacity={0.4}
            pointerEvents="none"
          />
          <Grid
            templateColumns={{ base: '1fr', md: '1.3fr 1fr' }}
            gap={{ base: 6, md: 10 }}
            alignItems="center"
            position="relative"
          >
            <VStack align="flex-start" gap={4}>
              <Text className="kicker kicker-line">{t('footer.behindKicker')}</Text>
              <Heading
                fontFamily="display"
                fontWeight={600}
                fontSize={{ base: '1.9rem', md: '2.6rem' }}
                letterSpacing="-0.025em"
                lineHeight={1.05}
              >
                {t('footer.behindTitle1')}{' '}
                <Box as="span" fontStyle="italic" color="gold" className="display-italic">
                  {t('footer.behindTitle2')}
                </Box>
              </Heading>
              <Text color="fg.muted" fontSize="md" lineHeight={1.6} maxW="56ch">
                {t('footer.behindDescription')}
              </Text>
            </VStack>

            <VStack align={{ base: 'flex-start', md: 'flex-end' }} gap={4}>
              <ChakraLink
                href="https://xpendia.cl"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: 'none' }}
              >
                <HStack
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
                  boxShadow="0 12px 36px rgba(230,196,106,0.25)"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 18px 48px rgba(230,196,106,0.4)',
                  }}
                >
                  <Text as="span">{t('footer.talk')}</Text>
                  <Text as="span" fontSize="lg" lineHeight={1}>
                    →
                  </Text>
                </HStack>
              </ChakraLink>
              <Text fontFamily="mono" fontSize="0.72rem" color="fg.muted">
                contacto@xpendia.cl
              </Text>
            </VStack>
          </Grid>
        </Box>

        {/* Bottom row — créditos y meta */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          gap={{ base: 8, md: 6 }}
          alignItems="flex-start"
        >
          <VStack align="flex-start" gap={3}>
            <ChakraLink
              href="https://xpendia.cl"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: 'none' }}
            >
              <XpendiaLogo size="lg" product="Mundial · 26" />
            </ChakraLink>
            <Text fontSize="sm" color="fg.muted" lineHeight={1.5} maxW="32ch">
              {t('footer.developedBy')}{' '}
              <ChakraLink
                href="https://xpendia.cl"
                target="_blank"
                rel="noopener noreferrer"
                color="white"
                fontWeight={500}
                _hover={{ color: 'gold' }}
              >
                xpendia.cl
              </ChakraLink>{' '}
              — {t('footer.codeMit')}{' '}
              <ChakraLink
                href="https://github.com/leit0cl/xpendia-mundial-2026"
                target="_blank"
                rel="noopener noreferrer"
                color="white"
                fontWeight={500}
                _hover={{ color: 'gold' }}
              >
                GitHub
              </ChakraLink>
              .
            </Text>

            {/* Autor + X handle con avatar en efecto cromo vector. */}
            <AuthorCard />
          </VStack>

          <VStack align={{ base: 'flex-start', md: 'flex-start' }} gap={2}>
            <Text className="kicker">{t('footer.productHeader')}</Text>
            <FooterLink href="/#selecciones">{t('footer.linkSelecciones')}</FooterLink>
            <FooterLink href="/#grupos">{t('footer.linkGrupos')}</FooterLink>
            <FooterLink href="/#calendario">{t('footer.linkCalendario')}</FooterLink>
            <FooterLink href="/tactics">{t('footer.linkPizarra')}</FooterLink>
            <FooterLink href="/settings">{t('footer.linkAjustes')}</FooterLink>
          </VStack>

          <VStack align={{ base: 'flex-start', md: 'flex-start' }} gap={2}>
            <Text className="kicker">{t('footer.legalHeader')}</Text>
            <Text fontSize="sm" color="fg.muted">
              {t('footer.noAffiliation')}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {t('footer.flagsCredit')}
            </Text>
            <Text fontFamily="mono" fontSize="0.72rem" color="fg.subtle" mt={2}>
              © {YEAR} · MIT License
            </Text>
          </VStack>
        </Grid>

        <HStack
          mt={{ base: 8, md: 10 }}
          pt={6}
          borderTop="1px solid rgba(255,255,255,0.05)"
          justify="space-between"
          flexWrap="wrap"
          gap={3}
        >
          <Text
            fontFamily="kicker"
            fontSize="0.62rem"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="fg.subtle"
          >
            {t('footer.statsLine')}
          </Text>
          <Text fontFamily="mono" fontSize="0.66rem" color="fg.subtle">
            {t('footer.builtIn')}
          </Text>
        </HStack>
      </Container>
    </Box>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ChakraLink
      href={href}
      fontSize="sm"
      color="fg.muted"
      _hover={{ color: 'white', textDecoration: 'none' }}
      transition="color 0.2s ease"
    >
      {children}
    </ChakraLink>
  );
}

/** Avatar del autor con efecto cromo-vector + link al perfil de X. */
function AuthorCard() {
  return (
    <Box mt={2}>
      {/* Filtro SVG cromo-vector dedicado al footer (id propio para no
          colisionar con el del modo marquesina). */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="xp-chrome-footer" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0     0     0     1 0"
            />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.04 0.18 0.42 0.78 1" />
              <feFuncG type="table" tableValues="0.06 0.24 0.55 0.88 1" />
              <feFuncB type="table" tableValues="0.10 0.36 0.72 0.96 1" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.1" intercept="-0.05" />
              <feFuncG type="linear" slope="1.1" intercept="-0.05" />
              <feFuncB type="linear" slope="1.1" intercept="-0.05" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <ChakraLink
        href="https://x.com/WeonTuPodis"
        target="_blank"
        rel="noopener noreferrer"
        display="inline-flex"
        alignItems="center"
        gap={3}
        px={3}
        py={2}
        borderRadius="full"
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.1)"
        textDecoration="none"
        transition="background 0.2s ease, border-color 0.2s ease, transform 0.2s ease"
        _hover={{
          bg: 'rgba(70,227,255,0.1)',
          borderColor: 'rgba(70,227,255,0.45)',
          transform: 'translateY(-1px)',
          textDecoration: 'none',
        }}
      >
        <Box
          width="36px"
          height="36px"
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
          border="1px solid rgba(70,227,255,0.35)"
          boxShadow="0 0 0 1px rgba(70,227,255,0.12) inset"
        >
          <Box
            as="img"
            {...({ src: '/leo-cortes-avatar.png', alt: 'Leo Cortés' } as object)}
            width="100%"
            height="100%"
            objectFit="cover"
            style={{ filter: 'url(#xp-chrome-footer)' }}
          />
        </Box>
        <VStack align="flex-start" gap={0}>
          <Text
            fontFamily="kicker"
            fontSize="0.58rem"
            fontWeight={700}
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="rgba(255,255,255,0.55)"
            lineHeight={1}
          >
            Built by
          </Text>
          <HStack gap={1.5} align="baseline">
            <Text
              fontFamily="display"
              fontSize="0.95rem"
              fontWeight={600}
              color="white"
              lineHeight={1.1}
            >
              @WeonTuPodis
            </Text>
            <Box
              as="span"
              aria-hidden
              fontFamily="mono"
              fontSize="0.7rem"
              fontWeight={700}
              color="rgba(70,227,255,0.85)"
              lineHeight={1}
            >
              𝕏
            </Box>
          </HStack>
        </VStack>
      </ChakraLink>
    </Box>
  );
}
