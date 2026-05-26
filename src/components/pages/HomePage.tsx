import { Box } from '@chakra-ui/react';
import { HeroStadium } from '@/components/organisms/HeroStadium';
import { UseCaseTrio } from '@/components/organisms/UseCaseTrio';
import { TacticsShowcase } from '@/components/organisms/TacticsShowcase';
import { ConfederationGallery } from '@/components/organisms/ConfederationGallery';
import { GroupsBoard } from '@/components/organisms/GroupsBoard';
import { FixtureCalendar } from '@/components/organisms/FixtureCalendar';

export function HomePage() {
  return (
    <Box>
      <HeroStadium />
      <UseCaseTrio />
      <TacticsShowcase />
      <ConfederationGallery />
      <GroupsBoard />
      <FixtureCalendar />
    </Box>
  );
}
