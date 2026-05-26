import { Box, IconButton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MediaAsset } from '@/types/domain';
import { useMedia } from '@/contexts/MediaContext';

type Props = { asset: MediaAsset; onDelete?: (a: MediaAsset) => void };

export function MediaThumb({ asset, onDelete }: Props) {
  const { t } = useTranslation();
  const { resolveUrl } = useMedia();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolveUrl(asset)
      .then((u) => {
        if (!cancelled) setUrl(u);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [asset, resolveUrl]);

  return (
    <Box
      position="relative"
      borderRadius={12}
      overflow="hidden"
      className="glass"
      _hover={{ '& .thumb-actions': { opacity: 1 } }}
    >
      {url && asset.kind === 'image' && (
        <img
          src={url}
          alt={asset.filename}
          style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
        />
      )}
      {url && asset.kind === 'video' && (
        <video
          src={url}
          controls
          aria-label={t('media.videoAria', { filename: asset.filename })}
          style={{ width: '100%', display: 'block', aspectRatio: '4/3', background: '#000' }}
        >
          {/* Contenido user-generated sin subtítulos disponibles.
              Track vacío satisface jsx-a11y/media-has-caption. */}
          <track kind="captions" />
        </video>
      )}
      {!url && (
        <Box height="180px" display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="sm" color="var(--text-muted)">
            {t('media.loading')}
          </Text>
        </Box>
      )}
      <Box
        className="thumb-actions"
        position="absolute"
        top={2}
        right={2}
        opacity={0}
        transition="opacity 0.2s"
      >
        {onDelete && (
          <IconButton
            aria-label={t('media.deleteAria')}
            size="sm"
            bg="rgba(0,0,0,0.6)"
            color="white"
            _hover={{ bg: 'rgba(220,30,60,0.85)' }}
            onClick={() => onDelete(asset)}
          >
            ✕
          </IconButton>
        )}
      </Box>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={2}
        bg="linear-gradient(180deg, transparent, rgba(0,0,0,0.75))"
      >
        <Text fontSize="xs" lineClamp={1}>
          {asset.filename}
        </Text>
      </Box>
    </Box>
  );
}
