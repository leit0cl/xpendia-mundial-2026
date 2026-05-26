import { Box, Container, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { TacticsCanvas } from '@/features/tactics/three/TacticsCanvas';
import { DrawingOverlay } from '@/features/tactics/overlay/DrawingOverlay';
import { TacticsToolbar } from '@/components/organisms/TacticsToolbar';
import { useTacticsStore } from '@/features/tactics/store/useTacticsStore';

/** Distancia de la cámara en la vista top-down de referencia (sin zoom). */
const CAMERA_REF_DISTANCE = 95;

export function TacticsPage() {
  const [perspective, setPerspective] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(CAMERA_REF_DISTANCE);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const tokenCount = useTacticsStore((s) => s.tokenOrder.length);
  const seed442 = useTacticsStore((s) => s.seed442);
  const clearTokens = useTacticsStore((s) => s.clearTokens);
  const clearStrokes = useTacticsStore((s) => s.clearStrokes);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClearAll = () => {
    clearTokens();
    clearStrokes();
    setRotationY(0);
    setCameraResetKey((k) => k + 1);
  };

  useEffect(() => {
    if (tokenCount === 0) seed442();
  }, [tokenCount, seed442]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const rotateField = () => setRotationY((r) => r + Math.PI / 2);

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await el.requestFullscreen();
    }
  };

  return (
    <Box pt={{ base: 24, md: 28 }} pb={6} px={{ base: 3, md: 5 }} minH="100dvh">
      <Container maxW="1500px" px={0}>
        <VStack
          ref={wrapperRef}
          gap={4}
          align="stretch"
          h={fullscreen ? '100dvh' : { base: 'calc(100dvh - 130px)', md: 'calc(100dvh - 150px)' }}
          bg={fullscreen ? 'bg' : 'transparent'}
          p={fullscreen ? 4 : 0}
        >
          <Box position="relative" zIndex={50}>
            <TacticsToolbar
              perspective={perspective}
              fullscreen={fullscreen}
              onTogglePerspective={() => setPerspective(!perspective)}
              onRotateField={rotateField}
              onToggleFullscreen={toggleFullscreen}
              onClearAll={handleClearAll}
            />
          </Box>
          <Box flex={1} minH="400px" position="relative" zIndex={1}>
            <TacticsCanvas
              perspective={perspective}
              rotationY={rotationY}
              onCameraDistanceChange={setCameraDistance}
              cameraResetKey={cameraResetKey}
            />
            {!perspective && (
              <DrawingOverlay
                rotationY={rotationY}
                zoomScale={CAMERA_REF_DISTANCE / cameraDistance}
              />
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
