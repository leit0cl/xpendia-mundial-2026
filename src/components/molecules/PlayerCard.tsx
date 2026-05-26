import { Box, Flex, Text } from '@chakra-ui/react';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { useMedia } from '@/contexts/MediaContext';
import type { Player, Team } from '@/types/domain';
import { useEffect, useState } from 'react';
import type { MediaAsset } from '@/types/domain';

type Props = {
  player: Player;
  team: Team;
  onOpen: (player: Player) => void;
};

export function PlayerCard({ player, team, onOpen }: Props) {
  const media = useMedia();
  const count = media.getCount(player.id);
  const empty = count === 0;

  const [preview, setPreview] = useState<MediaAsset | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (count > 0) {
      media.listByPlayer(player.id).then((assets) => {
        if (cancelled) return;
        const firstImage = assets.find((a) => a.kind === 'image') ?? null;
        setPreview(firstImage);
      });
    } else {
      // Limpieza del cache local cuando el jugador no tiene media.
      setPreview(null);
    }
    return () => {
      cancelled = true;
    };
  }, [count, player.id, media]);

  return (
    <GlassPanel
      className={`player-card ${empty ? 'grayscale-shadow' : ''}`}
      onClick={() => onOpen(player)}
      role="button"
      tabIndex={0}
      aria-label={`Abrir ${player.name}`}
    >
      <PlayerAvatar
        player={player}
        kitColor={team.kitHome}
        preview={preview}
        resolveUrl={media.resolveUrl}
      />
      <Text fontWeight="600" fontSize="sm" lineClamp={1}>
        {player.name}
      </Text>
      <Flex gap={2} mt={1} fontSize="xs" color="var(--text-muted)">
        {player.number !== null && <Box>#{player.number}</Box>}
        <Box>{player.position}</Box>
      </Flex>
      {empty && (
        <Text mt={2} fontSize="xs" color="var(--accent)" fontWeight={500}>
          + Sube tu primer archivo
        </Text>
      )}
      {!empty && (
        <Text mt={2} fontSize="xs" color="var(--accent-warm)" fontWeight={500}>
          {count} archivo{count === 1 ? '' : 's'}
        </Text>
      )}
    </GlassPanel>
  );
}
