import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <VStack gap={4} py={20}>
      <Heading size="3xl">404</Heading>
      <Text color="var(--text-muted)">{t('notFound.subtitle')}</Text>
      <Button as={Link} {...({ to: '/' } as object)} colorPalette="cyan">
        {t('notFound.back')}
      </Button>
    </VStack>
  );
}
