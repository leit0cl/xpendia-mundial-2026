import { Box, HStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const KICKOFF = new Date('2026-06-11T20:00:00Z').getTime();

function diff(now: number) {
  const ms = Math.max(0, KICKOFF - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  return { days, hours, mins };
}

export function CountdownChip() {
  const [t, setT] = useState(() => diff(Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setT(diff(Date.now())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <HStack
      gap={3}
      px={4}
      py={2}
      borderRadius="full"
      bg="rgba(7,9,15,0.55)"
      backdropFilter="blur(14px)"
      border="1px solid rgba(230,196,106,0.45)"
      fontFamily="mono"
      fontSize="0.82rem"
      color="white"
      width="fit-content"
      boxShadow="0 8px 24px rgba(0,0,0,0.4)"
    >
      <Box
        as="span"
        width="7px"
        height="7px"
        borderRadius="full"
        bg="#F2D98A"
        boxShadow="0 0 16px rgba(242,217,138,0.9)"
      />
      <Text
        fontFamily="kicker"
        fontSize="0.68rem"
        letterSpacing="0.18em"
        textTransform="uppercase"
        color="#F2D98A"
        fontWeight={700}
      >
        Kickoff
      </Text>
      <HStack gap={1.5} color="white">
        <Text>
          <b>{t.days}</b>
          <Text as="span" color="rgba(255,255,255,0.85)">
            d
          </Text>
        </Text>
        <Text>
          <b>{t.hours}</b>
          <Text as="span" color="rgba(255,255,255,0.85)">
            h
          </Text>
        </Text>
        <Text>
          <b>{t.mins.toString().padStart(2, '0')}</b>
          <Text as="span" color="rgba(255,255,255,0.85)">
            m
          </Text>
        </Text>
      </HStack>
    </HStack>
  );
}
