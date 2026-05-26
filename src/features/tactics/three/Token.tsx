import { Html } from '@react-three/drei';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTacticsStore } from '../store/useTacticsStore';
import { BENCH_Z, PITCH_HALF_H, PITCH_HALF_W, type Token as TokenT } from '../types';

// Mismo tamaño para fichas en cancha y banca; la diferencia se marca con
// opacidad y emissive, no con escala.
const TOKEN_RADIUS = 1.9;
const TOKEN_HEIGHT = 0.7;

const TEAM_COLORS: Record<TokenT['team'], string> = {
  home: '#46E3FF',
  away: '#E63946',
};

type Props = { token: TokenT };

export function Token({ token }: Props) {
  const isBench = token.status === 'bench';
  const radius = TOKEN_RADIUS;
  const height = TOKEN_HEIGHT;

  const meshRef = useRef<THREE.Mesh>(null);
  const targetRef = useRef(new THREE.Vector3(token.x, height / 2, token.z));
  const [dragging, setDragging] = useState(false);
  const { camera, gl, raycaster } = useThree();
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)).current;
  const intersection = useRef(new THREE.Vector3()).current;

  const moveToken = useTacticsStore((s) => s.moveToken);
  const selectToken = useTacticsStore((s) => s.selectToken);
  const selected = useTacticsStore((s) => s.selectedId === token.id);
  const swapMode = useTacticsStore((s) => s.swapMode);
  const swapFromId = useTacticsStore((s) => s.swapFromId);
  const handleSwapClick = useTacticsStore((s) => s.handleSwapClick);
  const isSwapSource = swapFromId === token.id;

  // Sincronizamos el target con la posición de la store cuando NO se está
  // arrastrando. Vive en effect (no en render) para no leer el ref durante
  // el render — sigue regla react-hooks/refs.
  useEffect(() => {
    if (!dragging) {
      targetRef.current.set(token.x, height / 2, token.z);
    }
  }, [dragging, token.x, token.z, height]);

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    m.position.x = THREE.MathUtils.damp(m.position.x, targetRef.current.x, 12, delta);
    m.position.z = THREE.MathUtils.damp(m.position.z, targetRef.current.z, 12, delta);
    m.position.y = height / 2 + (dragging ? 0.4 : 0);
  });

  const updateFromPointer = (e: ThreeEvent<PointerEvent>) => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    raycaster.ray.intersectPlane(dragPlane, intersection);
    // `intersection` está en WORLD coords. La store y `mesh.position` viven
    // en el frame del grupo rotado (canónico, θ=0). Convertimos in-place via
    // el parent del mesh para que el drag siga al cursor aun con rotación.
    const mesh = meshRef.current;
    if (mesh?.parent) {
      mesh.parent.updateMatrixWorld(true);
      mesh.parent.worldToLocal(intersection);
    }
    // Límites en coords canónicas.
    const x = THREE.MathUtils.clamp(intersection.x, -PITCH_HALF_W + radius, PITCH_HALF_W - radius);
    const minZ = -PITCH_HALF_H + radius;
    const maxZ = BENCH_Z + 3; // permite arrastrar hasta la banca y un poco más
    const z = THREE.MathUtils.clamp(intersection.z, minZ, maxZ);
    targetRef.current.set(x, height / 2, z);
  };

  const baseColor = TEAM_COLORS[token.team];
  const emissive = isSwapSource ? '#F2D98A' : dragging || selected ? baseColor : '#000000';
  const emissiveIntensity = isSwapSource
    ? 0.7
    : dragging
      ? 0.75
      : selected
        ? 0.35
        : isBench
          ? 0.05
          : 0;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[token.x, height / 2, token.z]}
        castShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          if (swapMode) {
            handleSwapClick(token.id);
            return;
          }
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setDragging(true);
          selectToken(token.id);
          updateFromPointer(e);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          e.stopPropagation();
          updateFromPointer(e);
        }}
        onPointerUp={(e) => {
          if (!dragging) return;
          e.stopPropagation();
          (e.target as Element).releasePointerCapture?.(e.pointerId);
          setDragging(false);
          moveToken(token.id, targetRef.current.x, targetRef.current.z);
        }}
      >
        <cylinderGeometry args={[radius, radius, height, 48]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={isBench ? 0.5 : 0.35}
          metalness={0.15}
          transparent={isBench}
          opacity={isBench ? 0.78 : 1}
        />
      </mesh>

      {(selected || isSwapSource || dragging) && (
        <mesh position={[token.x, 0.04, token.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[radius + (dragging ? 0.8 : 0.4), radius + (dragging ? 1.6 : 0.7), 48]}
          />
          <meshBasicMaterial
            color={isSwapSource ? '#F2D98A' : dragging ? baseColor : '#F2D98A'}
            transparent
            opacity={dragging ? 0.65 : 0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* distanceFactor ≈ distancia de cámara (~95) → scale ~ 1, así el fontSize
          se mantiene fiel a su valor CSS en pantalla. */}
      <Html
        position={[token.x, height + 0.05, token.z]}
        center
        distanceFactor={95}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        zIndexRange={[10, 0]}
      >
        <div
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: '42px',
            fontWeight: 600,
            fontStyle: 'italic',
            fontVariationSettings: '"opsz" 144',
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            textShadow: dragging
              ? `0 0 22px ${baseColor}ee, 0 0 48px ${baseColor}aa, 0 3px 6px rgba(0,0,0,0.95)`
              : '0 3px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,1)',
            opacity: isBench ? 0.95 : 1,
            transition: 'text-shadow 0.2s ease, color 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {token.number}
        </div>
      </Html>
    </group>
  );
}
