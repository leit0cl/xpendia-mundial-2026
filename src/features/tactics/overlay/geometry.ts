import type { ArrowCurvature, Stroke } from '../types';

/** Curvatura perpendicular del cuerpo de la flecha (fracción de la longitud). */
export const ARROW_BOW = 0.18;

/** Calcula el punto de control de una flecha como Bézier cuadrática.
 *  `convex` bowea hacia un lado, `concave` al opuesto, `flat` colapsa el
 *  punto al midpoint (resultando en una línea recta al renderizar). */
export function arrowControlPoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  curvature: ArrowCurvature,
) {
  const factor = curvature === 'convex' ? ARROW_BOW : curvature === 'concave' ? -ARROW_BOW : 0;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  return { x: mx - dy * factor, y: my + dx * factor };
}

/** Acumula puntos en un trazo libre con suavizado exponencial.
 *  Cada punto nuevo se interpola hacia el último con `factor` para evitar
 *  zig-zag por jitter del pointer. */
export function smoothPush(
  points: Stroke['points'],
  next: { x: number; y: number },
  factor = 0.45,
): Stroke['points'] {
  const last = points[points.length - 1];
  if (!last) return [...points, next];
  const x = last.x + (next.x - last.x) * factor;
  const y = last.y + (next.y - last.y) * factor;
  return [...points, { x, y }];
}

/** Distancia mínima entre un punto (px, py) y el segmento (a, b).
 *  Útil para hit-test de trazos contra una posición de borrado. */
export function distPointToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
