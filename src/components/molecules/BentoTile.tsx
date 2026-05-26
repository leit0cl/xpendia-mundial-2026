import { Box, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  kicker: string;
  title: string;
  description: string;
  cta: { label: string; to: string };
  accent?: 'gold' | 'accent' | 'mx' | 'us';
  icon?: ReactNode;
};

const accentMap = {
  gold: { color: '#E6C46A', glow: 'rgba(230,196,106,0.18)' },
  accent: { color: '#46E3FF', glow: 'rgba(70,227,255,0.18)' },
  mx: { color: '#B7253C', glow: 'rgba(183,37,60,0.22)' },
  us: { color: '#5C8DE0', glow: 'rgba(92,141,224,0.22)' },
};

export function BentoTile({ kicker, title, description, cta, accent = 'gold', icon }: Props) {
  const { color, glow } = accentMap[accent];

  return (
    <Box
      className="bento-tile"
      minH={{ base: '280px', md: '340px' }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 80px ${glow}` }}
    >
      <VStack align="flex-start" gap={4}>
        {icon && (
          <Box fontSize="2xl" color={color} aria-hidden>
            {icon}
          </Box>
        )}
        <Text className="kicker kicker-line" style={{ color }}>
          {kicker}
        </Text>
        <Heading
          fontFamily="display"
          fontWeight={600}
          fontSize={{ base: '2xl', md: '3xl' }}
          letterSpacing="-0.02em"
          lineHeight={1.05}
        >
          {title}
        </Heading>
        <Text fontSize="sm" color="fg.muted" lineHeight={1.55} maxW="36ch">
          {description}
        </Text>
      </VStack>

      <Link to={cta.to} style={{ textDecoration: 'none' }}>
        <HStack
          gap={2}
          mt={6}
          fontFamily="kicker"
          fontSize="0.72rem"
          fontWeight={700}
          letterSpacing="0.14em"
          textTransform="uppercase"
          color={color}
          _hover={{ gap: 3 }}
          transition="gap 0.2s ease"
        >
          <Text as="span">{cta.label}</Text>
          <Text as="span" fontSize="lg" lineHeight={1}>
            →
          </Text>
        </HStack>
      </Link>
    </Box>
  );
}
