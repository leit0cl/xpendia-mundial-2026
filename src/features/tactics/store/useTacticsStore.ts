import { create } from 'zustand';
import {
  ARROW_CURVATURES,
  BENCH_CAPACITY,
  BENCH_GAP,
  BENCH_Z,
  PITCH_HALF_W,
  type DrawTool,
  type Stroke,
  type StrokeColor,
  type Token,
  type TokenRole,
  type TokenStatus,
  type TokenTeam,
} from '../types';

let tokenCounter = 0;
function nextId() {
  tokenCounter += 1;
  return `tok-${Date.now().toString(36)}-${tokenCounter}`;
}

const ROWS = 5;
const COLS = 5;
const SPOT_GAP_X = 7;
const SPOT_GAP_Z = 9;
const MAX_PER_TEAM_ON_PITCH = 11;

function spotsForTeam(team: TokenTeam) {
  const sign = team === 'home' ? -1 : 1;
  const baseX = sign === -1 ? -PITCH_HALF_W + 8 : PITCH_HALF_W - 8;
  const baseZ = -((ROWS - 1) * SPOT_GAP_Z) / 2;
  const out: Array<{ x: number; z: number }> = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      out.push({ x: baseX + col * SPOT_GAP_X * sign, z: baseZ + row * SPOT_GAP_Z });
    }
  }
  return out;
}

function nextFreePitchSpot(team: TokenTeam, tokens: Record<string, Token>) {
  const taken = Object.values(tokens).filter((t) => t.team === team && t.status === 'pitch');
  for (const spot of spotsForTeam(team)) {
    if (!taken.some((t) => Math.hypot(t.x - spot.x, t.z - spot.z) < 3)) return spot;
  }
  return { x: team === 'home' ? -20 : 20, z: 0 };
}

function nextFreeBenchSpot(team: TokenTeam, tokens: Record<string, Token>) {
  const taken = Object.values(tokens).filter((t) => t.team === team && t.status === 'bench');
  const sign = team === 'home' ? -1 : 1;
  // Banca: tira horizontal abajo del campo. Home arranca cerca del medio campo
  // y crece hacia su propia esquina; lo mismo simétrico para visita.
  const startX = sign === -1 ? -3 : 3;
  for (let i = 0; i < BENCH_CAPACITY; i++) {
    const x = startX + sign * i * BENCH_GAP;
    if (!taken.some((t) => Math.abs(t.x - x) < BENCH_GAP * 0.7)) return { x, z: BENCH_Z };
  }
  return { x: sign * (BENCH_CAPACITY * BENCH_GAP), z: BENCH_Z };
}

function nextFreeNumber(team: TokenTeam, tokens: Record<string, Token>) {
  const used = new Set(
    Object.values(tokens)
      .filter((t) => t.team === team)
      .map((t) => t.number),
  );
  for (let n = 1; n <= 99; n++) if (!used.has(n)) return n;
  return 99;
}

type TacticsState = {
  tokens: Record<string, Token>;
  tokenOrder: string[];
  selectedId: string | null;
  /** Modo sustitución: el primer click marca origen, el segundo intercambia. */
  swapMode: boolean;
  swapFromId: string | null;

  /** Overlay de dibujo libre (Phase 4). */
  drawTool: DrawTool;
  drawColor: StrokeColor;
  strokes: Stroke[];

  addToken: (input: {
    team: TokenTeam;
    role: TokenRole;
    number: number;
    status?: TokenStatus;
    x?: number;
    z?: number;
    label?: string;
  }) => string;
  /** Agrega siguiente ficha disponible (dorsal + posición auto) al target indicado. */
  addPlayer: (team: TokenTeam, target: TokenStatus, role?: TokenRole) => string | null;
  removeToken: (id: string) => void;
  moveToken: (id: string, x: number, z: number) => void;
  selectToken: (id: string | null) => void;
  toggleSwapMode: () => void;
  handleSwapClick: (id: string) => void;
  clearTokens: () => void;
  seedFormation: (key: FormationKey) => void;
  /** Aplica una formación solo al equipo indicado, sin tocar al otro. */
  seedTeamFormation: (team: TokenTeam, key: FormationKey) => void;
  /** Atajo compat: equivale a seedFormation('4-4-2'). */
  seed442: () => void;

  setDrawTool: (tool: DrawTool) => void;
  setDrawColor: (color: StrokeColor) => void;
  addStroke: (stroke: Stroke) => void;
  eraseStrokeAt: (x: number, y: number, radius?: number) => void;
  clearStrokes: () => void;
  /** Cicla la flecha entre convex → flat → concave → convex. */
  cycleArrowCurvature: (id: string) => void;
  /** Actualiza el punto final de una flecha (drag del tip). */
  updateArrowEndpoint: (id: string, x: number, y: number) => void;
  /** Actualiza el punto inicial de una flecha (drag de la base). */
  updateArrowStartpoint: (id: string, x: number, y: number) => void;
};

export type FormationKey = '4-4-2' | '4-3-3' | '4-2-3-1' | '3-5-2' | '5-3-2' | '3-4-3';

/** Templates de formación: arrays paralelos para home y away.
 *  home defiende la izquierda (x negativo), away la derecha (x positivo). */
const FORMATIONS: Record<FormationKey, Array<[TokenRole, number, number, number]>> = {
  '4-4-2': [
    ['gk', 1, -48, 0],
    ['def', 2, -34, -20],
    ['def', 4, -34, -7],
    ['def', 5, -34, 7],
    ['def', 3, -34, 20],
    ['mid', 6, -10, -18],
    ['mid', 8, -10, -6],
    ['mid', 10, -10, 6],
    ['mid', 7, -10, 18],
    ['fwd', 9, 12, -8],
    ['fwd', 11, 12, 8],
  ],
  '4-3-3': [
    ['gk', 1, -48, 0],
    ['def', 2, -34, -20],
    ['def', 4, -34, -7],
    ['def', 5, -34, 7],
    ['def', 3, -34, 20],
    ['mid', 6, -16, -10],
    ['mid', 8, -10, 0],
    ['mid', 10, -16, 10],
    ['fwd', 7, 14, -20],
    ['fwd', 9, 16, 0],
    ['fwd', 11, 14, 20],
  ],
  '4-2-3-1': [
    ['gk', 1, -48, 0],
    ['def', 2, -34, -20],
    ['def', 4, -34, -7],
    ['def', 5, -34, 7],
    ['def', 3, -34, 20],
    ['mid', 6, -20, -10],
    ['mid', 8, -20, 10],
    ['mid', 7, -2, -18],
    ['mid', 10, -2, 0],
    ['mid', 11, -2, 18],
    ['fwd', 9, 16, 0],
  ],
  '3-5-2': [
    ['gk', 1, -48, 0],
    ['def', 4, -34, -14],
    ['def', 5, -34, 0],
    ['def', 3, -34, 14],
    ['mid', 2, -16, -24],
    ['mid', 6, -14, -10],
    ['mid', 8, -10, 0],
    ['mid', 10, -14, 10],
    ['mid', 7, -16, 24],
    ['fwd', 9, 14, -7],
    ['fwd', 11, 14, 7],
  ],
  '5-3-2': [
    ['gk', 1, -48, 0],
    ['def', 2, -32, -24],
    ['def', 4, -36, -10],
    ['def', 5, -38, 0],
    ['def', 3, -36, 10],
    ['def', 6, -32, 24],
    ['mid', 8, -12, -10],
    ['mid', 10, -10, 0],
    ['mid', 7, -12, 10],
    ['fwd', 9, 14, -7],
    ['fwd', 11, 14, 7],
  ],
  '3-4-3': [
    ['gk', 1, -48, 0],
    ['def', 4, -34, -14],
    ['def', 5, -34, 0],
    ['def', 3, -34, 14],
    ['mid', 2, -14, -22],
    ['mid', 6, -14, -7],
    ['mid', 8, -14, 7],
    ['mid', 7, -14, 22],
    ['fwd', 11, 14, -16],
    ['fwd', 9, 16, 0],
    ['fwd', 10, 14, 16],
  ],
};

function mirrorForAway(
  items: Array<[TokenRole, number, number, number]>,
): Array<[TokenRole, number, number, number]> {
  return items.map(([role, n, x, z]) => [role, n, -x, z]);
}

/** Distancia mínima punto-segmento, en coords normalizadas. */
function distPointToSegment(
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

function strokeHitTest(stroke: Stroke, x: number, y: number, r: number) {
  const pts = stroke.points;
  if (pts.length === 0) return false;
  if (pts.length === 1) return Math.hypot(pts[0].x - x, pts[0].y - y) < r;
  for (let i = 1; i < pts.length; i++) {
    if (distPointToSegment(x, y, pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y) < r) return true;
  }
  return false;
}

export const useTacticsStore = create<TacticsState>((set, get) => ({
  tokens: {},
  tokenOrder: [],
  selectedId: null,
  swapMode: false,
  swapFromId: null,
  drawTool: 'none',
  drawColor: '#F2D98A',
  strokes: [],

  addToken: ({ team, role, number, status = 'pitch', x = 0, z = 0, label }) => {
    const id = nextId();
    const token: Token = { id, team, role, number, status, x, z, label };
    set((s) => ({
      tokens: { ...s.tokens, [id]: token },
      tokenOrder: [...s.tokenOrder, id],
    }));
    return id;
  },

  addPlayer: (team, target, role = 'mid') => {
    const state = get();
    if (target === 'pitch') {
      const count = Object.values(state.tokens).filter(
        (t) => t.team === team && t.status === 'pitch',
      ).length;
      if (count >= MAX_PER_TEAM_ON_PITCH) return null;
      const spot = nextFreePitchSpot(team, state.tokens);
      return get().addToken({
        team,
        role,
        number: nextFreeNumber(team, state.tokens),
        status: 'pitch',
        ...spot,
      });
    }
    const benchCount = Object.values(state.tokens).filter(
      (t) => t.team === team && t.status === 'bench',
    ).length;
    if (benchCount >= BENCH_CAPACITY) return null;
    const spot = nextFreeBenchSpot(team, state.tokens);
    return get().addToken({
      team,
      role,
      number: nextFreeNumber(team, state.tokens),
      status: 'bench',
      ...spot,
    });
  },

  removeToken: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.tokens;
      return {
        tokens: rest,
        tokenOrder: s.tokenOrder.filter((x) => x !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
        swapFromId: s.swapFromId === id ? null : s.swapFromId,
      };
    }),

  moveToken: (id, x, z) =>
    set((s) => {
      const t = s.tokens[id];
      if (!t) return s;
      return { tokens: { ...s.tokens, [id]: { ...t, x, z } } };
    }),

  selectToken: (id) => set({ selectedId: id }),

  toggleSwapMode: () =>
    set((s) => {
      const next = !s.swapMode;
      // Activar swap apaga cualquier herramienta de dibujo (mutuamente excluyentes).
      return { swapMode: next, swapFromId: null, drawTool: next ? 'none' : s.drawTool };
    }),

  handleSwapClick: (id) =>
    set((s) => {
      if (!s.swapMode) return s;
      if (!s.swapFromId) return { swapFromId: id };
      if (s.swapFromId === id) return { swapFromId: null };
      const a = s.tokens[s.swapFromId];
      const b = s.tokens[id];
      if (!a || !b) return { swapFromId: null };
      // Intercambia status + posición. Mantiene equipo, dorsal y rol.
      const swappedA: Token = { ...a, status: b.status, x: b.x, z: b.z };
      const swappedB: Token = { ...b, status: a.status, x: a.x, z: a.z };
      return {
        tokens: { ...s.tokens, [a.id]: swappedA, [b.id]: swappedB },
        swapFromId: null,
        // Salir del modo swap automáticamente luego de un intercambio.
        swapMode: false,
      };
    }),

  clearTokens: () =>
    set({ tokens: {}, tokenOrder: [], selectedId: null, swapFromId: null, swapMode: false }),

  seedFormation: (key) => {
    get().clearTokens();
    const home = FORMATIONS[key];
    const away = mirrorForAway(home);
    for (const [role, n, x, z] of home) {
      get().addToken({ team: 'home', role, number: n, status: 'pitch', x, z });
    }
    for (const [role, n, x, z] of away) {
      get().addToken({ team: 'away', role, number: n, status: 'pitch', x, z });
    }
    for (let i = 0; i < 3; i++) get().addPlayer('home', 'bench', 'mid');
    for (let i = 0; i < 3; i++) get().addPlayer('away', 'bench', 'mid');
  },

  seedTeamFormation: (team, key) => {
    const state = get();
    // Quita tokens existentes del equipo (cancha y banca) preservando el otro equipo.
    const nextTokens: Record<string, Token> = {};
    const nextOrder: string[] = [];
    for (const id of state.tokenOrder) {
      const tk = state.tokens[id];
      if (tk.team !== team) {
        nextTokens[id] = tk;
        nextOrder.push(id);
      }
    }
    set({
      tokens: nextTokens,
      tokenOrder: nextOrder,
      selectedId: null,
      swapFromId: null,
      swapMode: false,
    });

    const template = team === 'home' ? FORMATIONS[key] : mirrorForAway(FORMATIONS[key]);
    for (const [role, n, x, z] of template) {
      get().addToken({ team, role, number: n, status: 'pitch', x, z });
    }
    for (let i = 0; i < 3; i++) get().addPlayer(team, 'bench', 'mid');
  },

  seed442: () => get().seedFormation('4-4-2'),

  setDrawTool: (tool) =>
    set(() => {
      if (tool === 'none') return { drawTool: 'none' };
      // Activar dibujo apaga el modo cambios.
      return { drawTool: tool, swapMode: false, swapFromId: null };
    }),
  setDrawColor: (color) => set({ drawColor: color }),
  addStroke: (stroke) => set((s) => ({ strokes: [...s.strokes, stroke] })),
  eraseStrokeAt: (x, y, radius = 0.02) =>
    set((s) => ({ strokes: s.strokes.filter((st) => !strokeHitTest(st, x, y, radius)) })),
  clearStrokes: () => set({ strokes: [] }),
  cycleArrowCurvature: (id) =>
    set((s) => ({
      strokes: s.strokes.map((st) => {
        if (st.id !== id || st.kind !== 'arrow') return st;
        const current = st.curvature ?? 'convex';
        const i = ARROW_CURVATURES.indexOf(current);
        const next = ARROW_CURVATURES[(i + 1) % ARROW_CURVATURES.length];
        return { ...st, curvature: next };
      }),
    })),
  updateArrowEndpoint: (id, x, y) =>
    set((s) => ({
      strokes: s.strokes.map((st) => {
        if (st.id !== id || st.kind !== 'arrow' || st.points.length < 2) return st;
        return { ...st, points: [st.points[0], { x, y }] };
      }),
    })),
  updateArrowStartpoint: (id, x, y) =>
    set((s) => ({
      strokes: s.strokes.map((st) => {
        if (st.id !== id || st.kind !== 'arrow' || st.points.length < 2) return st;
        return { ...st, points: [{ x, y }, st.points[st.points.length - 1]] };
      }),
    })),
}));
