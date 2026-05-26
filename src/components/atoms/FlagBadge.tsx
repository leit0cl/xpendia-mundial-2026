import { Box } from '@chakra-ui/react';

type Props = {
  iso: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
};

const sizeMap = { sm: '20px', md: '28px', lg: '44px', xl: '72px' };

export function FlagBadge({ iso, size = 'md', rounded = true }: Props) {
  const dim = sizeMap[size];
  const isoLower = iso.toLowerCase();
  return (
    <Box
      className={`fi fi-${isoLower}`}
      width={dim}
      height={dim}
      borderRadius={rounded ? '50%' : '4px'}
      backgroundSize="cover"
      backgroundPosition="center"
      border="2px solid rgba(255,255,255,0.18)"
      boxShadow="0 4px 14px rgba(0,0,0,0.4)"
      aria-label={`Bandera ${iso}`}
    />
  );
}
