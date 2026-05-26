import { useMemo } from 'react';
import * as THREE from 'three';
import { BENCH_Z, PITCH_HEIGHT, PITCH_WIDTH } from '../types';
import { PitchLines } from './PitchLines';

/** PRNG determinista (mulberry32) — el ruido del césped es estético, no
 *  necesita ser criptográficamente aleatorio. Determinista nos hace ser
 *  puros en render (no usamos `Math.random`) y permite snapshot tests. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const GRASS_NOISE_SEED = 0x5eed5;

/** Genera una textura procedural de césped con bandas alternadas. */
function useGrassTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d')!;
    const stripes = 16;
    const stripeH = c.height / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#1f7a3a' : '#19612e';
      ctx.fillRect(0, i * stripeH, c.width, stripeH);
    }
    // Ruido sutil con PRNG sembrado: mismo seed → mismo resultado siempre.
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const rand = mulberry32(GRASS_NOISE_SEED);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (rand() - 0.5) * 14;
      img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
      img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
      img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);
}

export function Pitch() {
  const grass = useGrassTexture();

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[PITCH_WIDTH, PITCH_HEIGHT]} />
        <meshStandardMaterial map={grass} roughness={1} metalness={0} />
      </mesh>

      {/* Borde exterior oscuro: extiende la zona "fuera de cancha" hasta la
          banca (Z positivo) para que las fichas suplentes tengan suelo visible. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, (BENCH_Z + 6 - PITCH_HEIGHT / 2) / 2]}
      >
        <planeGeometry args={[PITCH_WIDTH + 16, PITCH_HEIGHT + (BENCH_Z + 8 - PITCH_HEIGHT / 2)]} />
        <meshStandardMaterial color="#0a1f12" roughness={1} metalness={0} />
      </mesh>

      {/* Banco visual: pequeña franja oscura debajo de la cancha que indica
          dónde viven los suplentes. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, BENCH_Z]}>
        <planeGeometry args={[PITCH_WIDTH - 8, 6.5]} />
        <meshStandardMaterial
          color="#16242c"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.92}
        />
      </mesh>

      <PitchLines />
    </group>
  );
}
