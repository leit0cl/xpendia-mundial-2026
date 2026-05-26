import { Button, type ButtonProps } from '@chakra-ui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Props = Omit<ButtonProps, 'onChange'> & {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
};

export function UploadButton({
  accept = 'image/*,video/*',
  multiple = true,
  onFiles,
  children,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        onClick={() => ref.current?.click()}
        bg="rgba(70, 227, 255, 0.18)"
        color="#46e3ff"
        border="1px solid rgba(70,227,255,0.4)"
        _hover={{ bg: 'rgba(70,227,255,0.28)' }}
        backdropFilter="blur(12px)"
        {...rest}
      >
        {children ?? t('media.uploadDefault')}
      </Button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFiles(files);
          e.target.value = '';
        }}
      />
    </>
  );
}
