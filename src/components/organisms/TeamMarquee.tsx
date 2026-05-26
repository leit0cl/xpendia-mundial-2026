import { Box, Text } from '@chakra-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMedia } from '@/contexts/MediaContext';
import { FlagBadge } from '@/components/atoms/FlagBadge';
import { XpendiaLogo } from '@/components/molecules/XpendiaLogo';
import type { MediaAsset, Player, Team } from '@/types/domain';

const MotionBox = motion.create(Box);

type SlideData = {
  asset: MediaAsset;
  url: string;
  player: Player;
};

/** Duración por slide (imagen). Videos usan su duración intrínseca capada. */
const IMAGE_DURATION_MS = 5800;
const VIDEO_MAX_DURATION_MS = 12000;

/** Catálogo de transiciones "pro de video". Cada slide se le asigna una al
 *  cargarse, en orden cíclico para variedad. */
const TRANSITIONS = [
  'kenburns',
  'crossfade',
  'slideR',
  'slideL',
  'blurpull',
  'whippan',
  'scaledown',
] as const;
type TransitionKind = (typeof TRANSITIONS)[number];

function variantsFor(kind: TransitionKind, reducedMotion = false) {
  // Si el usuario solicitó menos movimiento, colapsamos toda transición a
  // un crossfade corto sin escalas, blurs ni desplazamientos.
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
      exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
    };
  }
  switch (kind) {
    case 'kenburns':
      return {
        initial: { opacity: 0, scale: 1.04 },
        animate: { opacity: 1, scale: 1.14, transition: { duration: 6, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 1.18, transition: { duration: 0.9, ease: 'easeInOut' } },
      };
    case 'crossfade':
      return {
        initial: { opacity: 0, scale: 1.02 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: 'easeOut' } },
        exit: { opacity: 0, transition: { duration: 0.8, ease: 'easeIn' } },
      };
    case 'slideR':
      return {
        initial: { opacity: 0, x: '8%', scale: 1.05 },
        animate: {
          opacity: 1,
          x: '0%',
          scale: 1,
          transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
        },
        exit: { opacity: 0, x: '-6%', transition: { duration: 0.7, ease: 'easeIn' } },
      };
    case 'slideL':
      return {
        initial: { opacity: 0, x: '-8%', scale: 1.05 },
        animate: {
          opacity: 1,
          x: '0%',
          scale: 1,
          transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
        },
        exit: { opacity: 0, x: '6%', transition: { duration: 0.7, ease: 'easeIn' } },
      };
    case 'blurpull':
      return {
        initial: { opacity: 0, filter: 'blur(28px)', scale: 1.1 },
        animate: {
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          transition: { duration: 1.2, ease: 'easeOut' },
        },
        exit: { opacity: 0, filter: 'blur(18px)', transition: { duration: 0.6, ease: 'easeIn' } },
      };
    case 'whippan':
      return {
        initial: { opacity: 0, x: '50%', filter: 'blur(20px)' },
        animate: {
          opacity: 1,
          x: '0%',
          filter: 'blur(0px)',
          transition: { duration: 0.55, ease: [0.7, 0, 0.3, 1] },
        },
        exit: {
          opacity: 0,
          x: '-50%',
          filter: 'blur(20px)',
          transition: { duration: 0.5, ease: 'easeIn' },
        },
      };
    case 'scaledown':
      return {
        initial: { opacity: 0, scale: 1.35 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.92, transition: { duration: 0.7, ease: 'easeIn' } },
      };
  }
}

type Props = {
  team: Team;
  players: Player[];
  open: boolean;
  onClose: () => void;
};

export function TeamMarquee({ team, players, open, onClose }: Props) {
  const { t } = useTranslation();
  const media = useMedia();
  const reducedMotion = useReducedMotion() ?? false;
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const advanceTimerRef = useRef<number | null>(null);

  // Cargar y resolver media de todos los jugadores cuando se abre.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // Al reabrir forzamos el spinner mientras se resuelve la nueva lista de media.
    setReady(false);

    (async () => {
      const lists = await Promise.all(
        players.map(async (player) => {
          const assets = await media.listByPlayer(player.id);
          return assets.map((asset) => ({ asset, player }));
        }),
      );
      const flat = lists.flat();
      // Shuffle para que la presentación no sea predecible.
      const shuffled = [...flat].sort(() => Math.random() - 0.5);
      const resolved = await Promise.all(
        shuffled.map(async ({ asset, player }) => ({
          asset,
          url: await media.resolveUrl(asset),
          player,
        })),
      );
      if (cancelled) return;
      setSlides(resolved);
      setIndex(0);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, players, media]);

  // Mientras la marquesina está abierta, bloqueamos el scroll del body
  // para que se sienta como una "pantalla completa dentro de la app"
  // (NO invocamos la Fullscreen API del browser).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc para cerrar.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const advance = useCallback(() => {
    setIndex((i) => (slides.length === 0 ? 0 : (i + 1) % slides.length));
  }, [slides.length]);

  // Auto-advance timer per slide.
  useEffect(() => {
    if (!open || !ready || slides.length === 0) return;
    const current = slides[index];
    if (!current) return;

    // Limpieza previa
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    if (current.asset.kind === 'video') {
      // El timer del video se controla por el evento 'ended'; aquí solo un cap.
      advanceTimerRef.current = window.setTimeout(advance, VIDEO_MAX_DURATION_MS);
    } else {
      advanceTimerRef.current = window.setTimeout(advance, IMAGE_DURATION_MS);
    }
    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, [open, ready, slides, index, advance]);

  const handleClose = () => {
    onClose();
  };

  const current = slides[index];
  const transitionKind = useMemo<TransitionKind>(
    () => TRANSITIONS[index % TRANSITIONS.length],
    [index],
  );
  const slideVariants = useMemo(
    () => variantsFor(transitionKind, reducedMotion),
    [transitionKind, reducedMotion],
  );

  if (!open) return null;

  return (
    <Box
      ref={wrapperRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('marquee.dialogLabel', { team: team.name })}
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="#05070b"
      overflow="hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Filtro SVG cromo-vector global. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="xp-chrome-vector" colorInterpolationFilters="sRGB">
            {/* Pasamos a luminancia y posterizamos para look vectorizado. */}
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0     0     0     1 0"
            />
            <feComponentTransfer>
              {/* Tabla de luminancia → tono cromo (azul-acero). */}
              <feFuncR type="table" tableValues="0.04 0.18 0.42 0.78 1" />
              <feFuncG type="table" tableValues="0.06 0.24 0.55 0.88 1" />
              <feFuncB type="table" tableValues="0.10 0.36 0.72 0.96 1" />
            </feComponentTransfer>
            {/* Ligera mejora de contraste. */}
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.08" intercept="-0.04" />
              <feFuncG type="linear" slope="1.08" intercept="-0.04" />
              <feFuncB type="linear" slope="1.08" intercept="-0.04" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Fondo: trofeo con efecto cromo-vector. */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="url('/hero-worldcup.png')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        style={{ filter: 'url(#xp-chrome-vector)' }}
        opacity={0.42}
      />
      {/* Sobreposición vignette + tinte frío. */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="radial(circle at 50% 45%, rgba(7,11,20,0.15) 0%, rgba(7,11,20,0.85) 75%, rgba(0,0,0,0.97) 100%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(70,227,255,0.04) 0%, transparent 35%, rgba(7,11,20,0.55) 100%)"
        pointerEvents="none"
      />

      {/* Loading / empty state */}
      {!ready && (
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="rgba(255,255,255,0.55)"
          fontFamily="kicker"
          fontSize="0.78rem"
          letterSpacing="0.24em"
          textTransform="uppercase"
        >
          {t('marquee.preparing')}
        </Box>
      )}

      {ready && slides.length === 0 && <EmptyMediaScreen team={team} />}

      {/* Slide actual */}
      {ready && slides.length > 0 && current && (
        <AnimatePresence mode="popLayout">
          <MotionBox
            key={`${current.asset.id}-${index}`}
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            willChange="transform, opacity, filter"
          >
            <SlideMedia slide={current} onEnded={advance} />
          </MotionBox>
        </AnimatePresence>
      )}

      {/* HUD top: dorsal + nombre del jugador */}
      {ready && current && (
        <Box position="absolute" top={{ base: 6, md: 10 }} left={{ base: 6, md: 12 }} zIndex={5}>
          <Box display="flex" alignItems="center" gap={4}>
            <FlagBadge iso={team.isoCountry} size="sm" rounded={false} />
            <Box>
              <Text
                fontFamily="kicker"
                fontSize="0.62rem"
                fontWeight={700}
                letterSpacing="0.22em"
                textTransform="uppercase"
                color="rgba(255,255,255,0.62)"
              >
                {team.name}
              </Text>
              <Text
                fontFamily="display"
                fontSize={{ base: '1.8rem', md: '2.4rem' }}
                fontWeight={600}
                letterSpacing="-0.02em"
                color="white"
                lineHeight={1.05}
              >
                <Box as="span" fontStyle="italic" mr={2} opacity={0.78}>
                  #{current.player.number}
                </Box>
                {current.player.name}
              </Text>
            </Box>
          </Box>
        </Box>
      )}

      {/* HUD bottom: branding Xpendia */}
      <Box
        position="absolute"
        bottom={{ base: 6, md: 10 }}
        left={0}
        right={0}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 6, md: 12 }}
        zIndex={5}
        pointerEvents="none"
      >
        <Box pointerEvents="auto">
          <XpendiaLogo size="lg" product="Mundial · 26" />
        </Box>

        {/* Progress dots + counter */}
        {slides.length > 0 && (
          <Box display="flex" alignItems="center" gap={3}>
            <Text
              fontFamily="mono"
              fontSize={{ base: '0.62rem', md: '0.72rem' }}
              color="rgba(255,255,255,0.55)"
              letterSpacing="0.08em"
            >
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </Text>
          </Box>
        )}
      </Box>

      {/* Progress bar tipo broadcast */}
      {ready && slides.length > 0 && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="2px"
          bg="rgba(255,255,255,0.06)"
          zIndex={6}
        >
          <MotionBox
            key={`bar-${index}`}
            h="100%"
            bg="linear-gradient(90deg, #46E3FF, #F2D98A)"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration:
                current?.asset.kind === 'video'
                  ? VIDEO_MAX_DURATION_MS / 1000
                  : IMAGE_DURATION_MS / 1000,
              ease: 'linear',
            }}
            style={{ pointerEvents: 'none' }}
          />
        </Box>
      )}

      {/* Botón cerrar (esquina superior derecha) */}
      <Box
        as="button"
        type="button"
        aria-label={t('marquee.exitAriaLabel')}
        title={t('marquee.exitAriaLabel')}
        position="absolute"
        top={{ base: 6, md: 10 }}
        right={{ base: 6, md: 12 }}
        zIndex={10}
        px={4}
        py={2}
        borderRadius="full"
        bg="rgba(7,11,20,0.7)"
        border="1px solid rgba(255,255,255,0.18)"
        color="rgba(255,255,255,0.9)"
        fontFamily="kicker"
        fontSize="0.62rem"
        fontWeight={700}
        letterSpacing="0.22em"
        textTransform="uppercase"
        cursor="pointer"
        _hover={{ bg: 'rgba(7,11,20,0.92)', borderColor: 'rgba(70,227,255,0.55)' }}
        transition="background 0.2s ease, border-color 0.2s ease"
        onClick={handleClose}
      >
        {t('marquee.exit')}
      </Box>
    </Box>
  );
}

function SlideMedia({ slide, onEnded }: { slide: SlideData; onEnded: () => void }) {
  const { asset, url } = slide;

  if (asset.kind === 'video') {
    return (
      <video
        key={url}
        src={url}
        autoPlay
        muted
        playsInline
        aria-label={`Video del jugador: ${asset.filename}`}
        onEnded={onEnded}
        style={{
          maxWidth: '88vw',
          maxHeight: '82vh',
          borderRadius: 18,
          boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          objectFit: 'contain',
        }}
      >
        {/* Contenido user-generated sin pista de subtítulos. */}
        <track kind="captions" />
      </video>
    );
  }

  return (
    <img
      src={url}
      alt={asset.filename}
      style={{
        maxWidth: '88vw',
        maxHeight: '82vh',
        borderRadius: 18,
        boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
        objectFit: 'contain',
      }}
    />
  );
}

/** ID del video de YouTube de respaldo cuando el equipo no tiene media propia.
 *  Crédito a @JuanPabloZaracho — se invita a suscribirse al canal en el HUD. */
const FALLBACK_YOUTUBE_ID = 'afRbo0Mhdfg';
const FALLBACK_YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@JuanPabloZaracho';
const FALLBACK_YOUTUBE_CHANNEL_HANDLE = '@JuanPabloZaracho';
const YT_EMBED_URL =
  `https://www.youtube.com/embed/${FALLBACK_YOUTUBE_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${FALLBACK_YOUTUBE_ID}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&playsinline=1`;

function EmptyMediaScreen({ team }: { team: Team }) {
  const { t } = useTranslation();
  return (
    <Box position="absolute" inset={0}>
      {/* Video de respaldo de YouTube cubriendo toda la pantalla (16:9 cover). */}
      <Box
        position="absolute"
        inset={0}
        overflow="hidden"
        zIndex={1}
        pointerEvents="none"
        aria-hidden="true"
      >
        <iframe
          src={YT_EMBED_URL}
          title="Video ambiente"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // Trick "object-fit: cover" para iframes 16:9 en cualquier viewport.
            width: 'max(100vw, 177.78vh)',
            height: 'max(56.25vw, 100vh)',
            border: 0,
            pointerEvents: 'none',
          }}
        />
        {/* Vignette + tinte oscuro para legibilidad del mensaje encima. */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(circle at 50% 50%, rgba(5,7,11,0.45) 0%, rgba(5,7,11,0.85) 80%)"
        />
      </Box>

      {/* Sin material: tag discreto en la parte inferior, no interrumpe el video. */}
      <Box
        position="absolute"
        left={0}
        right={0}
        bottom={{ base: '92px', md: '120px' }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2.5}
        px={6}
        textAlign="center"
        zIndex={2}
        pointerEvents="none"
      >
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          gap={2}
          px={3}
          py={1.5}
          borderRadius="full"
          bg="rgba(7,11,20,0.55)"
          border="1px solid rgba(255,255,255,0.14)"
          backdropFilter="blur(8px)"
          color="rgba(255,255,255,0.75)"
          fontFamily="kicker"
          fontSize="0.58rem"
          fontWeight={700}
          letterSpacing="0.22em"
          textTransform="uppercase"
        >
          <Box
            as="span"
            width="6px"
            height="6px"
            borderRadius="full"
            bg="#F2D98A"
            boxShadow="0 0 8px #F2D98A"
            aria-hidden
          />
          <Box as="span">{t('marquee.noMediaTag', { team: team.name })}</Box>
        </Box>

        {/* Crédito al autor del video de fondo + invitación a suscribirse. */}
        <Box pointerEvents="auto">
          <Box
            as="a"
            {...({
              href: FALLBACK_YOUTUBE_CHANNEL_URL,
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label': `Video de fondo por ${FALLBACK_YOUTUBE_CHANNEL_HANDLE} — suscríbete en YouTube`,
            } as object)}
            mt={3}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={3.5}
            py={2}
            borderRadius="full"
            bg="rgba(7,11,20,0.55)"
            border="1px solid rgba(255,255,255,0.18)"
            color="rgba(255,255,255,0.85)"
            fontFamily="kicker"
            fontSize="0.6rem"
            fontWeight={700}
            letterSpacing="0.18em"
            textTransform="uppercase"
            textDecoration="none"
            backdropFilter="blur(8px)"
            _hover={{
              bg: 'rgba(255,0,0,0.16)',
              borderColor: 'rgba(255,80,80,0.5)',
              color: 'white',
            }}
            transition="background 0.2s ease, border-color 0.2s ease, color 0.2s ease"
          >
            <Box as="span" aria-hidden width="14px" display="inline-flex" alignItems="center">
              {/* Glifo YouTube mini (sin importar logos de la marca registrada). */}
              <Box
                as="span"
                width="14px"
                height="10px"
                borderRadius="3px"
                bg="linear-gradient(180deg,#FF1F1F,#C40000)"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="0.5rem"
                fontWeight={900}
                fontStyle="normal"
                lineHeight={1}
              >
                ▶
              </Box>
            </Box>
            <Box as="span">
              {t('marquee.creditPrefix')} {FALLBACK_YOUTUBE_CHANNEL_HANDLE}
            </Box>
            <Box as="span" opacity={0.7}>
              ·
            </Box>
            <Box as="span" color="#FF5C5C">
              {t('marquee.subscribe')}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
