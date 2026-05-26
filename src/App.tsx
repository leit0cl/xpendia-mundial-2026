import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { StorageProvider } from '@/contexts/StorageContext';
import { RostersProvider } from '@/contexts/RostersContext';
import { MediaProvider } from '@/contexts/MediaContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { system } from '@/theme/tokens';

export function App() {
  return (
    <ChakraProvider value={system}>
      <StorageProvider>
        <MediaProvider>
          <RostersProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </RostersProvider>
        </MediaProvider>
      </StorageProvider>
    </ChakraProvider>
  );
}
