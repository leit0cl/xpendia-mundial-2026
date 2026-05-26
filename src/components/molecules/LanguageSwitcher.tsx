import { Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, type SupportedLang } from '@/i18n';

/** Pill compacto ES/EN para alternar idioma. Persiste en localStorage vía
 *  i18next-browser-languagedetector con la key `xpendia.lang`. */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? 'es').slice(0, 2) as SupportedLang;

  return (
    <HStack
      gap={0}
      borderRadius="full"
      border="1px solid rgba(255,255,255,0.12)"
      bg="rgba(7,9,15,0.4)"
      backdropFilter="blur(10px)"
      overflow="hidden"
      aria-label={t('common.languageSwitch')}
      role="group"
    >
      {SUPPORTED_LANGS.map((lang) => {
        const active = current === lang;
        return (
          <Box
            key={lang}
            as="button"
            type="button"
            onClick={() => {
              if (!active) void i18n.changeLanguage(lang);
            }}
            aria-pressed={active}
            aria-label={lang === 'es' ? 'Español' : 'English'}
            px={2.5}
            py={1}
            fontFamily="mono"
            fontSize="0.62rem"
            fontWeight={700}
            letterSpacing="0.14em"
            textTransform="uppercase"
            color={active ? '#07090f' : 'rgba(255,255,255,0.7)'}
            bg={active ? '#46E3FF' : 'transparent'}
            cursor={active ? 'default' : 'pointer'}
            _hover={active ? undefined : { bg: 'rgba(70,227,255,0.12)', color: 'white' }}
            transition="background 0.18s ease, color 0.18s ease"
          >
            {lang.toUpperCase()}
          </Box>
        );
      })}
    </HStack>
  );
}
