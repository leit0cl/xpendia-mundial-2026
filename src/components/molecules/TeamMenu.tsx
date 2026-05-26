import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTacticsStore, type FormationKey } from '@/features/tactics/store/useTacticsStore';
import type { TokenTeam } from '@/features/tactics/types';

/** Formaciones soportadas y la clave i18n de su nota descriptiva. */
const FORMATIONS: Array<{ key: FormationKey; noteKey: string }> = [
  { key: '4-4-2', noteKey: 'teamMenu.formationNote.442' },
  { key: '4-3-3', noteKey: 'teamMenu.formationNote.433' },
  { key: '4-2-3-1', noteKey: 'teamMenu.formationNote.4231' },
  { key: '3-5-2', noteKey: 'teamMenu.formationNote.352' },
  { key: '5-3-2', noteKey: 'teamMenu.formationNote.532' },
  { key: '3-4-3', noteKey: 'teamMenu.formationNote.343' },
];

function hexAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

type Props = {
  team: TokenTeam;
  label: string;
  accent: string;
  formation: FormationKey;
  onFormationChange: (key: FormationKey) => void;
};

export function TeamMenu({ team, label, accent, formation, onFormationChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const addPlayer = useTacticsStore((s) => s.addPlayer);
  const toggleSwapMode = useTacticsStore((s) => s.toggleSwapMode);
  const swapMode = useTacticsStore((s) => s.swapMode);
  const tokens = useTacticsStore((s) => s.tokens);

  const pitchCount = Object.values(tokens).filter(
    (t) => t.team === team && t.status === 'pitch',
  ).length;
  const benchCount = Object.values(tokens).filter(
    (t) => t.team === team && t.status === 'bench',
  ).length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <Box position="relative" ref={ref}>
      <Box
        as="button"
        onClick={() => setOpen((v) => !v)}
        display="inline-flex"
        alignItems="center"
        gap={2}
        px={3.5}
        py={1.5}
        borderRadius="full"
        bg={open ? hexAlpha(accent, 0.28) : hexAlpha(accent, 0.14)}
        border={`1px solid ${hexAlpha(accent, open ? 0.7 : 0.4)}`}
        color={accent}
        fontFamily="kicker"
        fontSize="0.68rem"
        fontWeight={700}
        letterSpacing="0.12em"
        textTransform="uppercase"
        cursor="pointer"
        _hover={{ bg: hexAlpha(accent, 0.24) }}
        transition="background 0.2s ease, border-color 0.2s ease"
      >
        <Box
          width="6px"
          height="6px"
          borderRadius="full"
          bg={accent}
          boxShadow={`0 0 10px ${accent}`}
        />
        <Text as="span">{label}</Text>
        <Text as="span" fontWeight={400} opacity={0.7}>
          ·
        </Text>
        <Text as="span" fontFamily="mono" fontWeight={500}>
          {formation}
        </Text>
        <Text as="span" fontSize="0.6rem" opacity={0.7}>
          ▾
        </Text>
      </Box>

      {open && (
        <VStack
          position="absolute"
          top="calc(100% + 10px)"
          left={0}
          align="stretch"
          gap={3}
          minW="320px"
          p={4}
          borderRadius="18px"
          bg="#0a0d14"
          border={`1px solid ${hexAlpha(accent, 0.4)}`}
          boxShadow={`0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px ${hexAlpha(accent, 0.2)} inset, 0 0 24px ${hexAlpha(accent, 0.18)}`}
          zIndex={1000}
        >
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Text
              fontFamily="kicker"
              fontSize="0.62rem"
              fontWeight={700}
              letterSpacing="0.18em"
              textTransform="uppercase"
              color={accent}
            >
              {label}
            </Text>
            <Text fontFamily="mono" fontSize="0.66rem" color="fg.muted">
              {t('teamMenu.pitchBenchCount', { pitch: pitchCount, bench: benchCount })}
            </Text>
          </HStack>

          {/* Formación */}
          <Box>
            <Text
              fontFamily="kicker"
              fontSize="0.56rem"
              fontWeight={600}
              letterSpacing="0.16em"
              textTransform="uppercase"
              color="fg.muted"
              mb={2}
            >
              {t('teamMenu.formation')}
            </Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={1.5}>
              {FORMATIONS.map((f) => {
                const active = f.key === formation;
                return (
                  <Box
                    key={f.key}
                    as="button"
                    onClick={() => {
                      onFormationChange(f.key);
                    }}
                    px={2.5}
                    py={2}
                    borderRadius="10px"
                    bg={active ? hexAlpha(accent, 0.2) : 'rgba(255,255,255,0.04)'}
                    border={`1px solid ${active ? hexAlpha(accent, 0.55) : 'rgba(255,255,255,0.08)'}`}
                    cursor="pointer"
                    textAlign="center"
                    transition="background 0.15s ease, border-color 0.15s ease"
                    _hover={{
                      bg: active ? hexAlpha(accent, 0.28) : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Text
                      fontFamily="display"
                      fontWeight={600}
                      fontSize="0.95rem"
                      letterSpacing="-0.02em"
                      color={active ? accent : 'white'}
                    >
                      {f.key}
                    </Text>
                    <Text
                      fontFamily="kicker"
                      fontSize="0.5rem"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="fg.muted"
                      mt={0.5}
                    >
                      {t(f.noteKey)}
                    </Text>
                  </Box>
                );
              })}
            </Grid>
          </Box>

          {/* Plantilla */}
          <Box>
            <Text
              fontFamily="kicker"
              fontSize="0.56rem"
              fontWeight={600}
              letterSpacing="0.16em"
              textTransform="uppercase"
              color="fg.muted"
              mb={2}
            >
              {t('teamMenu.squad')}
            </Text>
            <VStack align="stretch" gap={1.5}>
              <MenuAction
                accent={accent}
                disabled={pitchCount >= 11}
                onClick={() => addPlayer(team, 'pitch')}
                title={t('teamMenu.addToPitchTitle')}
              >
                <Text as="span">{t('teamMenu.addToPitch')}</Text>
                <Text as="span" fontFamily="mono" fontSize="0.7rem" opacity={0.7}>
                  {pitchCount}/11
                </Text>
              </MenuAction>
              <MenuAction
                accent={accent}
                onClick={() => addPlayer(team, 'bench')}
                title={t('teamMenu.addToBenchTitle')}
              >
                <Text as="span">{t('teamMenu.addToBench')}</Text>
                <Text as="span" fontFamily="mono" fontSize="0.7rem" opacity={0.7}>
                  {benchCount}
                </Text>
              </MenuAction>
              <MenuAction
                accent={accent}
                onClick={() => {
                  toggleSwapMode();
                }}
                active={swapMode}
                title={t('teamMenu.swapTitle')}
              >
                <Text as="span">
                  ⇄ {swapMode ? t('teamMenu.swapCancel') : t('teamMenu.swapToggle')}
                </Text>
                {swapMode && (
                  <Text as="span" fontFamily="mono" fontSize="0.7rem" color="gold">
                    {t('teamMenu.swapActive')}
                  </Text>
                )}
              </MenuAction>
            </VStack>
          </Box>
        </VStack>
      )}
    </Box>
  );
}

function MenuAction({
  children,
  onClick,
  accent,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  accent: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <Box
      as="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={3}
      px={3}
      py={2.5}
      borderRadius="10px"
      bg={active ? hexAlpha(accent, 0.18) : 'rgba(255,255,255,0.04)'}
      border={`1px solid ${active ? hexAlpha(accent, 0.5) : 'rgba(255,255,255,0.08)'}`}
      color={active ? accent : 'white'}
      fontFamily="kicker"
      fontSize="0.7rem"
      fontWeight={600}
      letterSpacing="0.08em"
      textTransform="uppercase"
      opacity={disabled ? 0.4 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      transition="background 0.15s ease, border-color 0.15s ease"
      _hover={
        disabled ? undefined : { bg: active ? hexAlpha(accent, 0.26) : 'rgba(255,255,255,0.08)' }
      }
    >
      {children}
    </Box>
  );
}
