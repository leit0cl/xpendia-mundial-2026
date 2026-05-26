import { SimpleGrid } from '@chakra-ui/react';
import { PlayerCard } from '@/components/molecules/PlayerCard';
import type { Player, Team } from '@/types/domain';

type Props = {
  team: Team;
  players: Player[];
  onOpenPlayer: (p: Player) => void;
};

export function PlayerGrid({ team, players, onOpenPlayer }: Props) {
  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 6 }} gap={4}>
      {players.map((p) => (
        <PlayerCard key={p.id} player={p} team={team} onOpen={onOpenPlayer} />
      ))}
    </SimpleGrid>
  );
}
