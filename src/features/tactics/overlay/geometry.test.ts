import { describe, expect, it } from 'vitest';
import { ARROW_BOW, arrowControlPoint, distPointToSegment, smoothPush } from './geometry';

describe('arrowControlPoint', () => {
  it('curvature=flat colapsa el control al midpoint', () => {
    const c = arrowControlPoint({ x: 0, y: 0 }, { x: 1, y: 0 }, 'flat');
    expect(c).toEqual({ x: 0.5, y: 0 });
  });

  it('curvature=convex desplaza el control perpendicular en una dirección', () => {
    const c = arrowControlPoint({ x: 0, y: 0 }, { x: 1, y: 0 }, 'convex');
    // Para un segmento horizontal, el perpendicular cae en Y.
    expect(c.x).toBeCloseTo(0.5, 6);
    expect(c.y).toBeCloseTo(ARROW_BOW, 6);
  });

  it('curvature=concave es el opuesto exacto de convex', () => {
    const start = { x: 0, y: 0 };
    const end = { x: 1, y: 0 };
    const convex = arrowControlPoint(start, end, 'convex');
    const concave = arrowControlPoint(start, end, 'concave');
    expect(convex.x).toBeCloseTo(concave.x, 6);
    expect(convex.y).toBeCloseTo(-concave.y, 6);
  });

  it('respeta proporción de bow vs longitud del segmento', () => {
    const c = arrowControlPoint({ x: 0, y: 0 }, { x: 2, y: 0 }, 'convex');
    // dy=0, dx=2, factor=0.18 → offset.y = -dx * 0.18 ... ojo: nuestra fórmula
    // usa `my + dx*factor` para el desplazamiento, así que verificamos por
    // construcción.
    expect(c.y).toBeCloseTo(2 * ARROW_BOW, 6);
  });
});

describe('smoothPush', () => {
  it('agrega el primer punto sin suavizar', () => {
    const out = smoothPush([], { x: 0.3, y: 0.7 });
    expect(out).toEqual([{ x: 0.3, y: 0.7 }]);
  });

  it('suaviza el nuevo punto hacia el anterior con factor por defecto 0.45', () => {
    const out = smoothPush([{ x: 0, y: 0 }], { x: 1, y: 1 });
    expect(out).toHaveLength(2);
    expect(out[1].x).toBeCloseTo(0.45, 6);
    expect(out[1].y).toBeCloseTo(0.45, 6);
  });

  it('factor=1 deja el punto tal cual', () => {
    const out = smoothPush([{ x: 0, y: 0 }], { x: 1, y: 1 }, 1);
    expect(out[1]).toEqual({ x: 1, y: 1 });
  });
});

describe('distPointToSegment', () => {
  it('punto sobre el segmento da 0', () => {
    expect(distPointToSegment(0.5, 0, 0, 0, 1, 0)).toBeCloseTo(0, 6);
  });

  it('punto perpendicular al medio del segmento da la altura', () => {
    expect(distPointToSegment(0.5, 0.3, 0, 0, 1, 0)).toBeCloseTo(0.3, 6);
  });

  it('punto fuera del segmento (más allá del extremo) usa distancia al extremo', () => {
    // El punto está a x=2 del segmento [(0,0)-(1,0)]; debe ser distancia al
    // extremo (1,0), no a la línea infinita.
    expect(distPointToSegment(2, 0, 0, 0, 1, 0)).toBeCloseTo(1, 6);
  });

  it('segmento degenerado (a=b) usa distancia al punto', () => {
    expect(distPointToSegment(3, 4, 0, 0, 0, 0)).toBeCloseTo(5, 6);
  });
});
