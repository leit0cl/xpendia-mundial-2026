import { beforeEach, describe, expect, it } from 'vitest';
import { useTacticsStore } from './useTacticsStore';

const reset = () =>
  useTacticsStore.setState({
    tokens: {},
    tokenOrder: [],
    selectedId: null,
    swapMode: false,
    swapFromId: null,
    drawTool: 'none',
    drawColor: '#F2D98A',
    strokes: [],
  });

const get = () => useTacticsStore.getState();

describe('useTacticsStore — formaciones', () => {
  beforeEach(reset);

  it('seedFormation 4-4-2 crea 11 en cancha + 3 en banca por cada equipo (28 total)', () => {
    get().seedFormation('4-4-2');
    const tokens = Object.values(get().tokens);
    const home = tokens.filter((t) => t.team === 'home');
    const away = tokens.filter((t) => t.team === 'away');
    expect(home).toHaveLength(14);
    expect(away).toHaveLength(14);
    expect(home.filter((t) => t.status === 'pitch')).toHaveLength(11);
    expect(home.filter((t) => t.status === 'bench')).toHaveLength(3);
  });

  it('seedTeamFormation reemplaza solo al equipo indicado sin tocar al otro', () => {
    get().seedFormation('4-4-2');
    const awayBefore = Object.values(get().tokens).filter((t) => t.team === 'away');

    get().seedTeamFormation('home', '4-3-3');

    const home = Object.values(get().tokens).filter((t) => t.team === 'home');
    const away = Object.values(get().tokens).filter((t) => t.team === 'away');
    expect(home.filter((t) => t.status === 'pitch')).toHaveLength(11);
    // El away mantiene exactamente los mismos ids y posiciones que tenía.
    const awayIdsAfter = new Set(away.map((t) => t.id));
    expect(away).toHaveLength(awayBefore.length);
    for (const t of awayBefore) {
      expect(awayIdsAfter.has(t.id)).toBe(true);
    }
  });

  it('clearTokens deja el store vacío', () => {
    get().seedFormation('4-4-2');
    expect(Object.keys(get().tokens).length).toBeGreaterThan(0);
    get().clearTokens();
    expect(Object.keys(get().tokens)).toHaveLength(0);
    expect(get().tokenOrder).toHaveLength(0);
    expect(get().selectedId).toBeNull();
  });
});

describe('useTacticsStore — swap mode', () => {
  beforeEach(reset);

  it('toggleSwapMode activa y desactiva el modo swap', () => {
    expect(get().swapMode).toBe(false);
    get().toggleSwapMode();
    expect(get().swapMode).toBe(true);
    get().toggleSwapMode();
    expect(get().swapMode).toBe(false);
  });

  it('handleSwapClick intercambia status/posición pero mantiene equipo/dorsal/rol', () => {
    const a = get().addToken({
      team: 'home',
      role: 'mid',
      number: 8,
      status: 'pitch',
      x: 10,
      z: 5,
    });
    const b = get().addToken({
      team: 'home',
      role: 'fwd',
      number: 9,
      status: 'bench',
      x: 0,
      z: 40,
    });

    get().toggleSwapMode();
    get().handleSwapClick(a);
    get().handleSwapClick(b);

    const ta = get().tokens[a];
    const tb = get().tokens[b];
    expect(ta.status).toBe('bench');
    expect(tb.status).toBe('pitch');
    expect(ta.x).toBe(0);
    expect(ta.z).toBe(40);
    expect(tb.x).toBe(10);
    expect(tb.z).toBe(5);
    // Identidad preservada
    expect(ta.team).toBe('home');
    expect(ta.number).toBe(8);
    expect(ta.role).toBe('mid');
    expect(tb.role).toBe('fwd');
    // El modo se apaga automáticamente tras un intercambio exitoso.
    expect(get().swapMode).toBe(false);
  });
});

describe('useTacticsStore — mutual exclusion swap ↔ draw', () => {
  beforeEach(reset);

  it('activar un drawTool apaga el swapMode', () => {
    get().toggleSwapMode();
    expect(get().swapMode).toBe(true);
    get().setDrawTool('pen');
    expect(get().swapMode).toBe(false);
    expect(get().drawTool).toBe('pen');
  });

  it('activar swap apaga cualquier drawTool', () => {
    get().setDrawTool('arrow');
    expect(get().drawTool).toBe('arrow');
    get().toggleSwapMode();
    expect(get().drawTool).toBe('none');
    expect(get().swapMode).toBe(true);
  });
});

describe('useTacticsStore — strokes', () => {
  beforeEach(reset);

  it('addStroke + clearStrokes', () => {
    get().addStroke({
      id: 's1',
      kind: 'pen',
      color: '#46E3FF',
      width: 3,
      points: [
        { x: 0.1, y: 0.1 },
        { x: 0.2, y: 0.2 },
      ],
    });
    expect(get().strokes).toHaveLength(1);
    get().clearStrokes();
    expect(get().strokes).toHaveLength(0);
  });

  it('cycleArrowCurvature cicla convex → flat → concave → convex', () => {
    get().addStroke({
      id: 'a1',
      kind: 'arrow',
      color: '#46E3FF',
      width: 4,
      points: [
        { x: 0.2, y: 0.5 },
        { x: 0.8, y: 0.5 },
      ],
      curvature: 'convex',
    });
    get().cycleArrowCurvature('a1');
    expect(get().strokes[0].curvature).toBe('flat');
    get().cycleArrowCurvature('a1');
    expect(get().strokes[0].curvature).toBe('concave');
    get().cycleArrowCurvature('a1');
    expect(get().strokes[0].curvature).toBe('convex');
  });

  it('eraseStrokeAt elimina trazos dentro del radio', () => {
    get().addStroke({
      id: 's1',
      kind: 'pen',
      color: '#46E3FF',
      width: 3,
      points: [
        { x: 0.5, y: 0.5 },
        { x: 0.6, y: 0.5 },
      ],
    });
    get().eraseStrokeAt(0.55, 0.5, 0.05);
    expect(get().strokes).toHaveLength(0);
  });

  it('updateArrowEndpoint mueve solo el destino', () => {
    get().addStroke({
      id: 'a1',
      kind: 'arrow',
      color: '#46E3FF',
      width: 4,
      points: [
        { x: 0.1, y: 0.1 },
        { x: 0.9, y: 0.9 },
      ],
    });
    get().updateArrowEndpoint('a1', 0.5, 0.5);
    const pts = get().strokes[0].points;
    expect(pts[0]).toEqual({ x: 0.1, y: 0.1 });
    expect(pts[1]).toEqual({ x: 0.5, y: 0.5 });
  });

  it('updateArrowStartpoint mueve solo el origen', () => {
    get().addStroke({
      id: 'a1',
      kind: 'arrow',
      color: '#46E3FF',
      width: 4,
      points: [
        { x: 0.1, y: 0.1 },
        { x: 0.9, y: 0.9 },
      ],
    });
    get().updateArrowStartpoint('a1', 0.3, 0.3);
    const pts = get().strokes[0].points;
    expect(pts[0]).toEqual({ x: 0.3, y: 0.3 });
    expect(pts[1]).toEqual({ x: 0.9, y: 0.9 });
  });
});
