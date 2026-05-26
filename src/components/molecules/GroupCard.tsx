import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FlagBadge } from '@/components/atoms/FlagBadge';
import type { Team } from '@/types/domain';

type Props = {
  letter: string;
  color: string;
  teams: Team[];
};

export function GroupCard({ letter, color, teams }: Props) {
  const navigate = useNavigate();

  return (
    <Box
      position="relative"
      borderRadius="20px"
      overflow="hidden"
      bg="rgba(255,255,255,0.03)"
      border="1px solid rgba(255,255,255,0.07)"
      transition="border-color 0.3s ease, transform 0.3s ease"
      _hover={{ borderColor: color, transform: 'translateY(-3px)' }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        width="6px"
        bg={color}
        boxShadow={`0 0 24px ${color}`}
      />

      <HStack align="stretch" gap={0} pl={4}>
        <Box
          {...({ 'data-group-letter': letter } as object)}
          minW="64px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontFamily="display"
          fontWeight={600}
          fontSize="3.6rem"
          letterSpacing="-0.04em"
          lineHeight={1}
          style={{ color, textShadow: `0 0 32px ${color}66` }}
          py={4}
        >
          {letter}
        </Box>

        <VStack flex={1} align="stretch" gap={0} py={3} pr={3}>
          {teams.map((t) => (
            <HStack
              key={t.code}
              gap={2.5}
              py={1.5}
              px={2}
              borderRadius="8px"
              cursor="pointer"
              transition="background 0.2s ease"
              _hover={{ bg: 'rgba(255,255,255,0.04)' }}
              onClick={() => navigate(`/teams/${t.code}`)}
              role="button"
              aria-label={`Equipo ${t.name}`}
            >
              <FlagBadge iso={t.isoCountry} size="md" />
              <Text fontSize="0.88rem" fontWeight={500} color="white" flex={1} truncate>
                {t.name}
              </Text>
              {t.host && (
                <Text
                  fontFamily="kicker"
                  fontSize="0.55rem"
                  fontWeight={700}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  color="gold"
                  bg="rgba(230,196,106,0.12)"
                  border="1px solid rgba(230,196,106,0.35)"
                  px={1.5}
                  py={0.5}
                  borderRadius="full"
                >
                  ★
                </Text>
              )}
              <Text fontFamily="mono" fontSize="0.62rem" color="fg.subtle">
                {t.code}
              </Text>
            </HStack>
          ))}
        </VStack>
      </HStack>
    </Box>
  );
}
