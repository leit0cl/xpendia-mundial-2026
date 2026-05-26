import { Box } from '@chakra-ui/react';

type Props = {
  product?: string;
  size?: 'sm' | 'lg';
  ariaLabel?: string;
};

/** Marca compartida con xpendia-web. Las llaves `{` y `}` reaccionan al
 *  hover (se abren con glow del color de cada una). El "product" opcional
 *  cuelga del lado derecho como tagline editorial.
 */
export function XpendiaLogo({ product, size = 'sm', ariaLabel }: Props) {
  return (
    <Box
      as="span"
      className={`xpendia-logo${size === 'lg' ? ' xpendia-logo--lg' : ''}`}
      aria-label={ariaLabel ?? `Xpendia${product ? ` · ${product}` : ''}`}
    >
      <Box as="span" className="brace-open">
        {'{'}
      </Box>
      <Box as="span" className="brand">
        Xpendia
      </Box>
      <Box as="span" className="brace-close">
        {'}'}
      </Box>
      {product && (
        <Box as="span" className="product">
          {product}
        </Box>
      )}
    </Box>
  );
}
