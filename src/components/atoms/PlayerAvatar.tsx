import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { MediaAsset, Player } from '@/types/domain';

type Props = {
  player: Player;
  kitColor: string;
  preview?: MediaAsset | null;
  resolveUrl?: (asset: MediaAsset) => Promise<string>;
};

function initials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PlayerAvatar({ player, kitColor, preview, resolveUrl }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (preview && preview.kind === 'image' && resolveUrl) {
      resolveUrl(preview)
        .then((u) => {
          if (!cancelled) setUrl(u);
        })
        .catch(() => {});
    } else {
      // Reset del estado derivado cuando la prop async desaparece.
      setUrl(null);
    }
    return () => {
      cancelled = true;
    };
  }, [preview, resolveUrl]);

  return (
    <Box
      className="player-avatar"
      style={
        url
          ? { backgroundImage: `url(${url})` }
          : { background: `linear-gradient(135deg, ${kitColor} 0%, rgba(0,0,0,0.4) 100%)` }
      }
    >
      {!url && initials(player.name)}
    </Box>
  );
}
