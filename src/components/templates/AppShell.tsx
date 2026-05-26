import { Box, Flex, HStack, Link as ChakraLink } from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStorageState } from '@/contexts/StorageContext';
import { XpendiaLogo } from '@/components/molecules/XpendiaLogo';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { SiteFooter } from '@/components/organisms/SiteFooter';
import { usePwaInstall } from '@/hooks/usePwaInstall';

type NavItem = { to: string; labelKey: 'selecciones' | 'pizarra' | 'ajustes'; soon?: boolean };

const NAV: NavItem[] = [
  { to: '/', labelKey: 'selecciones' },
  { to: '/tactics', labelKey: 'pizarra' },
  { to: '/settings', labelKey: 'ajustes' },
];

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

export function AppShell() {
  const location = useLocation();
  const storage = useStorageState();
  const scrolled = useScrolled(80);
  const pwa = usePwaInstall();
  const { t } = useTranslation();

  return (
    <Box minH="100vh">
      <Box
        as="header"
        position="fixed"
        top={{ base: 3, md: 4 }}
        left={0}
        right={0}
        px={{ base: 3, md: 6, lg: 8 }}
        zIndex={100}
        pointerEvents="none"
      >
        <Box
          maxW="1320px"
          mx="auto"
          pointerEvents="auto"
          borderRadius="full"
          px={{ base: 4, md: 6 }}
          py={{ base: 2.5, md: 3 }}
          bg={scrolled ? 'rgba(7,9,15,0.78)' : 'rgba(7,9,15,0.55)'}
          backdropFilter="blur(28px) saturate(180%)"
          border="1px solid"
          borderColor={scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}
          boxShadow={
            scrolled
              ? '0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
              : '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
          }
          transition="background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
        >
          <Flex justify="space-between" align="center" gap={4}>
            <ChakraLink
              as={Link}
              {...({ to: '/' } as object)}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              <XpendiaLogo product="Mundial · 26" />
            </ChakraLink>

            <HStack gap={2} align="center">
              {NAV.map((item, idx) => {
                const active = location.pathname === item.to;
                const isLast = idx === NAV.length - 1;
                return (
                  <Fragment key={item.to}>
                    {isLast && <Box width="1px" height="20px" bg="rgba(255,255,255,0.12)" mx={2} />}
                    <ChakraLink
                      as={Link}
                      {...({ to: item.to } as object)}
                      fontFamily="kicker"
                      fontSize="0.74rem"
                      fontWeight={500}
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      px={isLast ? 4 : 3}
                      py={2}
                      borderRadius="full"
                      color={active ? 'gold' : 'fg.muted'}
                      bg={active ? 'rgba(230,196,106,0.08)' : 'transparent'}
                      _hover={{ color: 'white', textDecoration: 'none' }}
                      transition="color 0.2s ease, background 0.2s ease"
                      display="inline-flex"
                      alignItems="center"
                      gap={1.5}
                    >
                      {t(`nav.${item.labelKey}`)}
                      {item.soon && (
                        <Box
                          as="span"
                          fontSize="0.55rem"
                          fontWeight={700}
                          letterSpacing="0.08em"
                          color="accent"
                          bg="rgba(70,227,255,0.1)"
                          border="1px solid rgba(70,227,255,0.25)"
                          px={1.5}
                          py={0.5}
                          borderRadius="full"
                          lineHeight={1}
                        >
                          SOON
                        </Box>
                      )}
                    </ChakraLink>
                  </Fragment>
                );
              })}
              <Box
                ml={2}
                px={3}
                py={1.5}
                borderRadius="full"
                fontFamily="mono"
                fontSize="0.62rem"
                bg="rgba(70,227,255,0.08)"
                color="accent"
                border="1px solid rgba(70,227,255,0.2)"
              >
                {storage.status === 'ready'
                  ? storage.storage.backend
                  : storage.status === 'loading'
                    ? '…'
                    : 'error'}
              </Box>
              {pwa.canInstall && (
                <Box
                  as="button"
                  {...({
                    type: 'button',
                    'aria-label': t('nav.installAriaLabel'),
                  } as object)}
                  onClick={() => void pwa.install()}
                  ml={1}
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  fontFamily="kicker"
                  fontWeight={700}
                  fontSize="0.6rem"
                  letterSpacing="0.16em"
                  textTransform="uppercase"
                  bg="rgba(70,227,255,0.18)"
                  color="#46E3FF"
                  border="1px solid rgba(70,227,255,0.45)"
                  cursor="pointer"
                  whiteSpace="nowrap"
                  _hover={{
                    bg: 'rgba(70,227,255,0.28)',
                    borderColor: 'rgba(70,227,255,0.75)',
                  }}
                  transition="background 0.2s ease, border-color 0.2s ease"
                >
                  {t('nav.install')}
                </Box>
              )}
              <LanguageSwitcher />
            </HStack>
          </Flex>
        </Box>
      </Box>

      <Box as="main" pt="0">
        <Outlet />
      </Box>

      <SiteFooter />
    </Box>
  );
}
