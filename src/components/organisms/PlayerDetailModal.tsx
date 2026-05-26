import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { MediaUploader } from './MediaUploader';
import { MediaThumb } from '@/components/molecules/MediaThumb';
import { useMedia } from '@/contexts/MediaContext';
import type { MediaAsset, Player, Team } from '@/types/domain';

type Props = {
  player: Player | null;
  team: Team | null;
  onClose: () => void;
};

const MotionBox = motion.create(Box);

export function PlayerDetailModal({ player, team, onClose }: Props) {
  const { t } = useTranslation();
  const media = useMedia();
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  const refresh = useCallback(async () => {
    if (!player) return;
    const list = await media.listByPlayer(player.id);
    setAssets(list.sort((a, b) => b.createdAt - a.createdAt));
  }, [player, media]);

  // Carga inicial de assets cuando se abre el modal o cambia el jugador.
  // Pattern canónico de fetch-on-mount/dep-change.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <AnimatePresence>
      {player && team && (
        <MotionBox
          position="fixed"
          inset={0}
          zIndex={1000}
          bg="rgba(0,0,0,0.7)"
          backdropFilter="blur(8px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MotionBox
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22 }}
            maxW="1100px"
            w="100%"
            maxH="90vh"
            overflow="auto"
          >
            <GlassPanel p={8} strong>
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Heading size="xl">{player.name}</Heading>
                  <Text color="var(--text-muted)" mt={1}>
                    {team.name} · {player.position}
                    {player.number !== null ? ` · #${player.number}` : ''}
                  </Text>
                  {(player.club || player.age !== undefined) && (
                    <Text
                      mt={1}
                      fontFamily="mono"
                      fontSize="0.78rem"
                      color="rgba(255,255,255,0.55)"
                      letterSpacing="0.02em"
                    >
                      {player.club ?? '—'}
                      {player.age !== undefined && ` · ${player.age} ${t('team.ageSuffix')}`}
                    </Text>
                  )}
                </Box>
                <Box
                  as="button"
                  onClick={onClose}
                  fontSize="2xl"
                  bg="transparent"
                  border="none"
                  color="white"
                  cursor="pointer"
                  aria-label={t('common.close')}
                >
                  ✕
                </Box>
              </Flex>

              <MediaUploader playerId={player.id} onUploaded={refresh} />

              <Box mt={6}>
                <Heading size="md" mb={3}>
                  {t('team.collection', { count: assets.length })}
                </Heading>
                {assets.length === 0 ? (
                  <Text color="var(--text-muted)" fontSize="sm">
                    {t('team.noContentYet')}
                  </Text>
                ) : (
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
                    {assets.map((a) => (
                      <MediaThumb
                        key={a.id}
                        asset={a}
                        onDelete={async (asset) => {
                          await media.remove(asset);
                          refresh();
                        }}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </GlassPanel>
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
