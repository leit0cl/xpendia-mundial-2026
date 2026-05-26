import { Box } from '@chakra-ui/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Pitch } from './Pitch';
import { TokensLayer } from './TokensLayer';

type Props = {
  perspective?: boolean;
  rotationY?: number;
  onCameraDistanceChange?: (distance: number) => void;
  /** Cualquier cambio de este valor dispara un reset de la cámara a su pose default. */
  cameraResetKey?: number;
};

/** Vive dentro del Canvas y reporta la distancia de la cámara al origen.
 *  Solo notifica al cambiar > 0.4 unidades para evitar floods. */
function CameraDistanceTracker({ onChange }: { onChange?: (d: number) => void }) {
  const last = useRef(-1);
  useFrame(({ camera }) => {
    if (!onChange) return;
    const d = camera.position.length();
    if (Math.abs(d - last.current) > 0.4) {
      last.current = d;
      onChange(d);
    }
  });
  return null;
}

/** Re-encuadra automáticamente la cámara top-down en función de la rotación
 *  y del aspect ratio del canvas. Se asegura de que el pitch llene el viewport
 *  óptimamente en cualquier orientación (0°, 90°, 180°, 270°).
 *  Solo aplica en top-down; en perspective deja al OrbitControls decidir. */
function CameraAutoFit({
  rotationY,
  perspective,
  orbitRef,
}: {
  rotationY: number;
  perspective: boolean;
  orbitRef: React.RefObject<{
    update?: () => void;
    reset?: () => void;
    minDistance?: number;
    maxDistance?: number;
  } | null>;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (perspective) return;
    const FOV = 42;
    const MARGIN = 1.08;
    const PITCH_W = 105;
    const PITCH_H = 68;
    const cos = Math.abs(Math.cos(rotationY));
    const sin = Math.abs(Math.sin(rotationY));
    const effW = cos * PITCH_W + sin * PITCH_H;
    const effH = sin * PITCH_W + cos * PITCH_H;
    const tanHalf = Math.tan((FOV * Math.PI) / 180 / 2);
    const aspect = size.width / size.height;
    const dForH = (effH * MARGIN) / (2 * tanHalf);
    const dForW = (effW * MARGIN) / (2 * tanHalf * aspect);
    const dOpt = Math.max(dForH, dForW);

    // Pattern seguro: amplía rango primero, luego setea, luego update().
    const ctrl = orbitRef.current;
    if (ctrl) {
      ctrl.minDistance = 50;
      ctrl.maxDistance = 220;
    }
    camera.position.set(0, dOpt, 0.01);
    camera.lookAt(0, 0, 0);
    ctrl?.update?.();
  }, [rotationY, perspective, size.width, size.height, camera, orbitRef]);
  return null;
}

/** Resetea la posición de la cámara y los controles cada vez que cambia `resetKey`.
 *  Ignora la primera invocación (mount) para preservar la pose inicial. */
function CameraResetter({
  resetKey,
  perspective,
  orbitRef,
}: {
  resetKey: number;
  perspective: boolean;
  orbitRef: React.RefObject<{ update?: () => void; reset?: () => void } | null>;
}) {
  const camera = useThree((s) => s.camera);
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    const target = perspective ? CAM_PERSPECTIVE : CAM_TOPDOWN;
    camera.position.set(target.position[0], target.position[1], target.position[2]);
    camera.lookAt(0, 0, 0);
    orbitRef.current?.update?.();
  }, [resetKey, perspective, camera, orbitRef]);
  return null;
}

function RotatedScene({ rotationY, children }: { rotationY: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotationY, 8, delta);
  });
  return <group ref={ref}>{children}</group>;
}

/** Posiciones de cámara:
 *  - top-down: muy arriba, FOV bajo (ficha plana, vista plan)
 *  - perspective: ángulo de 35° aprox, da relieve a las fichas
 */
const CAM_TOPDOWN = { position: [0, 95, 0.01] as [number, number, number], fov: 42 };
const CAM_PERSPECTIVE = { position: [0, 60, 70] as [number, number, number], fov: 40 };

export function TacticsCanvas({
  perspective = false,
  rotationY = 0,
  onCameraDistanceChange,
  cameraResetKey = 0,
}: Props) {
  const cam = perspective ? CAM_PERSPECTIVE : CAM_TOPDOWN;
  const orbitRef = useRef<{ update?: () => void; reset?: () => void } | null>(null);

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      bg="#062513"
      borderRadius="20px"
      overflow="hidden"
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ ...cam, near: 0.5, far: 500 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#062513']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[40, 90, 30]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <directionalLight position={[-30, 60, -20]} intensity={0.35} />

        <Suspense fallback={null}>
          <RotatedScene rotationY={rotationY}>
            <Pitch />
            <TokensLayer />
          </RotatedScene>
        </Suspense>

        <CameraDistanceTracker onChange={onCameraDistanceChange} />
        <CameraAutoFit rotationY={rotationY} perspective={perspective} orbitRef={orbitRef} />
        <CameraResetter resetKey={cameraResetKey} perspective={perspective} orbitRef={orbitRef} />

        {perspective ? (
          <OrbitControls
            ref={orbitRef as never}
            enablePan={false}
            minDistance={50}
            maxDistance={180}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0, 0]}
          />
        ) : (
          <OrbitControls
            ref={orbitRef as never}
            enableRotate={false}
            enablePan={false}
            enableZoom
            minDistance={50}
            maxDistance={220}
            target={[0, 0, 0]}
          />
        )}
      </Canvas>
    </Box>
  );
}
