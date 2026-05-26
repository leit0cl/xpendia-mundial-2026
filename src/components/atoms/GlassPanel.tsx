import { Box, type BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

type Props = BoxProps & { strong?: boolean };

export const GlassPanel = forwardRef<HTMLDivElement, Props>(function GlassPanel(
  { strong, className, children, ...rest },
  ref,
) {
  const cls = ['glass', strong ? 'glass-strong' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <Box ref={ref} className={cls} {...rest}>
      {children}
    </Box>
  );
});
