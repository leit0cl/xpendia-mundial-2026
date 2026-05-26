export type TokenTeam = 'home' | 'away';
export type TokenRole = 'gk' | 'def' | 'mid' | 'fwd';
export type TokenStatus = 'pitch' | 'bench';

export type Token = {
  id: string;
  team: TokenTeam;
  role: TokenRole;
  number: number;
  status: TokenStatus;
  label?: string;
  photoUrl?: string;
  /** Posición de la ficha en coords mundo. Para 'bench' vive fuera del campo. */
  x: number;
  z: number;
};

/** Dimensiones reglamentarias FIFA en metros, escaladas a unidades de Three. */
export const PITCH_WIDTH = 105;
export const PITCH_HEIGHT = 68;
export const PITCH_HALF_W = PITCH_WIDTH / 2;
export const PITCH_HALF_H = PITCH_HEIGHT / 2;

/** Zona de banca: tira horizontal fuera del campo (Z positivo, "abajo"). */
export const BENCH_Z = PITCH_HALF_H + 6.5;
export const BENCH_GAP = 4.2;
export const BENCH_CAPACITY = 12;

/** Herramientas de dibujo libre sobre la pizarra. `none` = sin overlay activo. */
export type DrawTool = 'none' | 'pen' | 'arrow' | 'eraser';

export type StrokeColor = '#F2D98A' | '#46E3FF' | '#E63946' | '#FFFFFF';

export const STROKE_PALETTE: StrokeColor[] = ['#F2D98A', '#46E3FF', '#E63946', '#FFFFFF'];

/** Curvatura del cuerpo de una flecha. Se cicla con tap en el punto de origen. */
export type ArrowCurvature = 'flat' | 'convex' | 'concave';
export const ARROW_CURVATURES: ArrowCurvature[] = ['convex', 'flat', 'concave'];

/** Trazo del overlay 2D. Coordenadas normalizadas (0–1) sobre el bounding box del canvas
 *  para que el overlay se mantenga coherente al cambiar tamaño/orientación. */
export type Stroke = {
  id: string;
  kind: 'pen' | 'arrow';
  color: StrokeColor;
  width: number;
  /** Lista de puntos normalizados [0..1]. Para `arrow`: solo start y end. */
  points: Array<{ x: number; y: number }>;
  /** Solo aplica a `arrow`. Default: 'convex'. */
  curvature?: ArrowCurvature;
};
