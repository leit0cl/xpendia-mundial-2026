import { Box, Container, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BentoTile } from '@/components/molecules/BentoTile';

export function UseCaseTrio() {
  const { t } = useTranslation();
  return (
    <Box as="section" py={{ base: 16, md: 24 }}>
      <Container maxW="1400px">
        <VStack align="flex-start" gap={3} mb={10}>
          <Text className="kicker kicker-line">{t('useCase.kicker')}</Text>
          <Heading
            fontFamily="display"
            fontWeight={600}
            fontSize={{ base: '2.4rem', md: '3.6rem' }}
            letterSpacing="-0.03em"
            lineHeight={1.02}
            maxW="820px"
          >
            {t('useCase.title1')}{' '}
            <Box as="span" fontStyle="italic" color="accent" className="display-italic">
              {t('useCase.title2')}
            </Box>
          </Heading>
          <Text color="fg.muted" maxW="640px" fontSize="md" lineHeight={1.55}>
            {t('useCase.subtitle')}
          </Text>
        </VStack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 5, md: 6 }}>
          <BentoTile
            accent="gold"
            kicker={t('useCase.fanKicker')}
            title={t('useCase.fanTitle')}
            description={t('useCase.fanDescription')}
            cta={{ label: t('useCase.fanCta'), to: '/#selecciones' }}
            icon={<Box as="span">♛</Box>}
          />
          <BentoTile
            accent="accent"
            kicker={t('useCase.techKicker')}
            title={t('useCase.techTitle')}
            description={t('useCase.techDescription')}
            cta={{ label: t('useCase.techCta'), to: '/tactics' }}
            icon={<Box as="span">⌖</Box>}
          />
        </Grid>
      </Container>
    </Box>
  );
}
