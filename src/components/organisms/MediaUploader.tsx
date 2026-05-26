import { Box, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadButton } from '@/components/atoms/UploadButton';
import { useMedia } from '@/contexts/MediaContext';

type Props = { playerId: string; onUploaded?: () => void };

export function MediaUploader({ playerId, onUploaded }: Props) {
  const { t } = useTranslation();
  const { upload } = useMedia();
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      setBusy(true);
      setError(null);
      try {
        for (const file of files) await upload(playerId, file);
        onUploaded?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : t('media.unknownError'));
      } finally {
        setBusy(false);
      }
    },
    [upload, playerId, onUploaded, t],
  );

  return (
    <Box
      className="glass"
      p={6}
      borderRadius={16}
      border={dragOver ? '2px dashed var(--accent)' : '2px dashed rgba(255,255,255,0.18)'}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) handleFiles(files);
      }}
    >
      <VStack gap={3}>
        <Text fontWeight={600} fontSize="lg">
          {t('media.dropPrompt')}
        </Text>
        <Text fontSize="sm" color="var(--text-muted)">
          {t('media.storeHint')}
        </Text>
        <UploadButton onFiles={handleFiles} loading={busy} disabled={busy}>
          {busy ? t('media.uploading') : t('media.choose')}
        </UploadButton>
        {error && (
          <Text color="red.300" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
