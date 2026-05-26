import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FlagBadge } from '@/components/atoms/FlagBadge';
import { JerseyChip } from '@/components/atoms/JerseyChip';
import type { Team } from '@/types/domain';

const MotionBox = motion.create(Box);

type Props = { team: Team };

export function HoloTeamCard({ team }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotX = useTransform(rx, (v) => `${v}deg`);
  const rotY = useTransform(ry, (v) => `${v}deg`);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 8);
    rx.set(-(py - 0.5) * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <MotionBox
      className="holo-card"
      width={{ base: '240px', md: '260px' }}
      flex="0 0 auto"
      scrollSnapAlign="start"
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => navigate(`/teams/${team.code}`)}
      role="button"
      tabIndex={0}
      aria-label={team.name}
    >
      <Box
        position="absolute"
        inset={0}
        className={`fi-bleed fi fi-${team.isoCountry.toLowerCase()}`}
        style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
        filter="blur(28px) brightness(0.42) saturate(160%)"
        transform="scale(1.25)"
        zIndex={0}
      />
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(7,9,15,0.15) 0%, rgba(7,9,15,0.88) 100%)"
        zIndex={1}
      />

      <VStack position="relative" zIndex={2} gap={3} align="flex-start" p={5} minH="280px">
        <HStack width="100%" justify="space-between" align="flex-start">
          <Text
            fontFamily="mono"
            fontSize="0.7rem"
            color="rgba(255,255,255,0.55)"
            letterSpacing="0.06em"
          >
            {team.code}
            {team.group && (
              <Text as="span" color="gold" ml={2}>
                · G{team.group}
              </Text>
            )}
          </Text>
          {team.host && (
            <Box className="host-badge">
              <Text as="span">★ {t('team.host')}</Text>
            </Box>
          )}
        </HStack>

        <FlagBadge iso={team.isoCountry} size="xl" />

        <Text
          fontFamily="display"
          fontSize="1.55rem"
          fontWeight={600}
          letterSpacing="-0.02em"
          lineHeight={1.05}
          color="white"
          mt={1}
        >
          {team.name}
        </Text>

        <HStack gap={3} mt="auto">
          <JerseyChip home={team.kitHome} away={team.kitAway} />
          <Text
            fontFamily="kicker"
            fontSize="0.62rem"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="fg.subtle"
          >
            {team.confederation}
          </Text>
        </HStack>
      </VStack>
    </MotionBox>
  );
}
