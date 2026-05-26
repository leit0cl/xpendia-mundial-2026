import { Line } from '@react-three/drei';
import { PITCH_HALF_H, PITCH_HALF_W } from '../types';

const LINE_COLOR = '#FFFFFF';
const LINE_OPACITY = 0.92;
const LINE_WIDTH = 1.2;
const Y = 0.02; // levanta líneas sobre el césped para evitar z-fighting

function rect(x: number, z: number, w: number, h: number): [number, number, number][] {
  const hx = w / 2;
  const hz = h / 2;
  return [
    [x - hx, Y, z - hz],
    [x + hx, Y, z - hz],
    [x + hx, Y, z + hz],
    [x - hx, Y, z + hz],
    [x - hx, Y, z - hz],
  ];
}

function circlePoints(
  cx: number,
  cz: number,
  r: number,
  segments = 64,
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, Y, cz + Math.sin(a) * r]);
  }
  return pts;
}

export function PitchLines() {
  return (
    <group>
      {/* Perímetro */}
      <Line
        points={rect(0, 0, PITCH_HALF_W * 2, PITCH_HALF_H * 2)}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />

      {/* Línea de medio campo */}
      <Line
        points={[
          [0, Y, -PITCH_HALF_H],
          [0, Y, PITCH_HALF_H],
        ]}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />

      {/* Círculo central + punto */}
      <Line
        points={circlePoints(0, 0, 9.15)}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />
      <mesh position={[0, Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color={LINE_COLOR} transparent opacity={LINE_OPACITY} />
      </mesh>

      {/* Áreas grandes (16.5 x 40.32m) */}
      <Line
        points={rect(-PITCH_HALF_W + 8.25, 0, 16.5, 40.32)}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />
      <Line
        points={rect(PITCH_HALF_W - 8.25, 0, 16.5, 40.32)}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />

      {/* Áreas chicas (5.5 x 18.32m) */}
      <Line
        points={rect(-PITCH_HALF_W + 2.75, 0, 5.5, 18.32)}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />
      <Line
        points={rect(PITCH_HALF_W - 2.75, 0, 5.5, 18.32)}
        color={LINE_COLOR}
        opacity={LINE_OPACITY}
        transparent
        lineWidth={LINE_WIDTH}
      />

      {/* Puntos de penal (a 11m del arco) */}
      <mesh position={[-PITCH_HALF_W + 11, Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={LINE_COLOR} transparent opacity={LINE_OPACITY} />
      </mesh>
      <mesh position={[PITCH_HALF_W - 11, Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={LINE_COLOR} transparent opacity={LINE_OPACITY} />
      </mesh>
    </group>
  );
}
