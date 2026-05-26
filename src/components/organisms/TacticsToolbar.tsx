import { Box, HStack, Text } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useTacticsStore, type FormationKey } from '@/features/tactics/store/useTacticsStore';
import { TeamMenu } from '@/components/molecules/TeamMenu';
import { STROKE_PALETTE, type DrawTool, type StrokeColor } from '@/features/tactics/types';

type Props = {
  perspective: boolean;
  fullscreen: boolean;
  onTogglePerspective: () => void;
  onRotateField: () => void;
  onToggleFullscreen: () => void;
  onClearAll: () => void;
};

export function TacticsToolbar({
  perspective,
  fullscreen,
  onTogglePerspective,
  onRotateField,
  onToggleFullscreen,
  onClearAll,
}: Props) {
  const { t } = useTranslation();
  const seedTeamFormation = useTacticsStore((s) => s.seedTeamFormation);
  const swapMode = useTacticsStore((s) => s.swapMode);
  const swapFromId = useTacticsStore((s) => s.swapFromId);
  const tokens = useTacticsStore((s) => s.tokens);
  const drawTool = useTacticsStore((s) => s.drawTool);
  const drawColor = useTacticsStore((s) => s.drawColor);
  const setDrawTool = useTacticsStore((s) => s.setDrawTool);
  const setDrawColor = useTacticsStore((s) => s.setDrawColor);
  const clearStrokes = useTacticsStore((s) => s.clearStrokes);
  const strokesCount = useTacticsStore((s) => s.strokes.length);
  const [homeFormation, setHomeFormation] = useState<FormationKey>('4-4-2');
  const [awayFormation, setAwayFormation] = useState<FormationKey>('4-4-2');

  const toggleTool = (tool: Exclude<DrawTool, 'none'>) => {
    setDrawTool(drawTool === tool ? 'none' : tool);
  };

  const applyHomeFormation = (key: FormationKey) => {
    setHomeFormation(key);
    seedTeamFormation('home', key);
  };
  const applyAwayFormation = (key: FormationKey) => {
    setAwayFormation(key);
    seedTeamFormation('away', key);
  };

  const pitchCount = Object.values(tokens).filter((t) => t.status === 'pitch').length;
  const benchCount = Object.values(tokens).filter((t) => t.status === 'bench').length;

  const swapHint = swapMode
    ? swapFromId
      ? t('tactics.elegirDestino')
      : t('tactics.elegirOrigen')
    : null;

  return (
    <HStack
      role="toolbar"
      aria-label={t('tactics.toolbarLabel')}
      gap={2}
      px={4}
      py={3}
      borderRadius="full"
      bg="rgba(7,9,15,0.78)"
      backdropFilter="blur(20px) saturate(180%)"
      border="1px solid rgba(255,255,255,0.08)"
      boxShadow="0 12px 32px rgba(0,0,0,0.45)"
      flexWrap="wrap"
    >
      <TeamMenu
        team="home"
        label={t('tactics.local')}
        accent="#46E3FF"
        formation={homeFormation}
        onFormationChange={applyHomeFormation}
      />
      <TeamMenu
        team="away"
        label={t('tactics.visita')}
        accent="#E63946"
        formation={awayFormation}
        onFormationChange={applyAwayFormation}
      />
      <ToolbarBtn onClick={onClearAll} ghost title={t('tactics.limpiarTitle')}>
        {t('tactics.limpiar')}
      </ToolbarBtn>

      <Sep />

      {!perspective && (
        <>
          <ToolbarBtn
            onClick={() => toggleTool('pen')}
            active={drawTool === 'pen'}
            accent={drawColor}
            title={t('tactics.lapizTitle')}
          >
            ✎ {t('tactics.lapiz')}
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => toggleTool('arrow')}
            active={drawTool === 'arrow'}
            accent={drawColor}
            title={t('tactics.flechaTitle')}
          >
            ➜ {t('tactics.flecha')}
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => toggleTool('eraser')}
            active={drawTool === 'eraser'}
            accent="#E63946"
            title={t('tactics.gomaTitle')}
          >
            ⌫ {t('tactics.goma')}
          </ToolbarBtn>
          <HStack gap={1.5} px={1.5}>
            {STROKE_PALETTE.map((c) => (
              <ColorSwatch
                key={c}
                color={c}
                active={drawColor === c}
                onClick={() => setDrawColor(c)}
              />
            ))}
          </HStack>
          <ToolbarBtn onClick={clearStrokes} ghost title={t('tactics.trazosTitle')}>
            ✕ {t('tactics.trazos')}
          </ToolbarBtn>
          <Sep />
          <ToolbarBtn onClick={onRotateField} title={t('tactics.rotarTitle')}>
            ⟳ {t('tactics.rotar')}
          </ToolbarBtn>
        </>
      )}
      <ToolbarBtn
        onClick={onTogglePerspective}
        title={
          perspective
            ? t('tactics.toggleViewTopdownTitle')
            : t('tactics.toggleViewPerspectiveTitle')
        }
      >
        {perspective ? t('tactics.topdown') : t('tactics.perspectiva')}
      </ToolbarBtn>
      <ToolbarBtn
        onClick={onToggleFullscreen}
        active={fullscreen}
        title={fullscreen ? t('tactics.fullTitleOff') : t('tactics.fullTitleOn')}
      >
        {fullscreen ? `⤡ ${t('tactics.salir')}` : `⛶ ${t('tactics.full')}`}
      </ToolbarBtn>

      <Box flex={1} />
      {swapHint ? (
        <Text
          fontFamily="kicker"
          fontSize="0.66rem"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color="gold"
        >
          {swapHint}
        </Text>
      ) : (
        <Text fontFamily="mono" fontSize="0.7rem" color="fg.muted" px={2}>
          {t('tactics.enCancha', { count: pitchCount })} ·{' '}
          {t('tactics.enBanca', { count: benchCount })}
          {strokesCount > 0 ? ` · ${t('tactics.trazosCount', { count: strokesCount })}` : ''}
        </Text>
      )}
    </HStack>
  );
}

function Sep() {
  return <Box width="1px" height="20px" bg="rgba(255,255,255,0.1)" mx={1} />;
}

function ColorSwatch({
  color,
  active,
  onClick,
}: {
  color: StrokeColor;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      width="20px"
      height="20px"
      borderRadius="full"
      bg={color}
      border="2px solid"
      borderColor={active ? 'white' : 'rgba(255,255,255,0.25)'}
      boxShadow={active ? `0 0 0 2px ${color}55, 0 0 12px ${color}88` : 'none'}
      cursor="pointer"
      transition="transform 0.15s ease, box-shadow 0.15s ease"
      _hover={{ transform: 'scale(1.12)' }}
      aria-label={`Color ${color}`}
    />
  );
}

function ToolbarBtn({
  onClick,
  children,
  ghost,
  subtle,
  active,
  accent,
  title,
  ariaLabel,
}: {
  onClick: () => void;
  children: ReactNode;
  ghost?: boolean;
  subtle?: boolean;
  active?: boolean;
  accent?: string;
  title?: string;
  ariaLabel?: string;
}) {
  const accentColor = accent ?? '#F2D98A';
  // Estado activo: chip sólido y con glow, contraste fuerte para que NO haya duda.
  const bg = active
    ? accentColor
    : ghost
      ? 'transparent'
      : subtle
        ? 'rgba(255,255,255,0.025)'
        : accent
          ? `${accent}1f`
          : 'rgba(255,255,255,0.05)';
  const color = active ? '#07090f' : subtle ? (accent ?? 'white') : (accent ?? 'white');
  const borderColor = active
    ? accentColor
    : subtle
      ? 'rgba(255,255,255,0.08)'
      : accent
        ? `${accent}55`
        : 'rgba(255,255,255,0.1)';
  const fontWeight = active ? 800 : 600;
  const boxShadow = active ? `0 0 0 2px ${accentColor}55, 0 6px 18px ${accentColor}66` : undefined;

  return (
    <Box
      as="button"
      {...({
        type: 'button',
        title,
        'aria-label': ariaLabel ?? title,
        'aria-pressed': active,
      } as object)}
      onClick={onClick}
      px={3}
      py={1.5}
      bg={bg}
      color={color}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="full"
      fontFamily="kicker"
      fontSize="0.68rem"
      fontWeight={fontWeight}
      letterSpacing="0.08em"
      textTransform="uppercase"
      cursor="pointer"
      whiteSpace="nowrap"
      boxShadow={boxShadow}
      _hover={{
        bg: active ? accentColor : accent ? `${accent}33` : 'rgba(255,255,255,0.09)',
      }}
      transition="background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease"
    >
      {children}
    </Box>
  );
}
